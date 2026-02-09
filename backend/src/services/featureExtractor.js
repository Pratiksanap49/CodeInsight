import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
const { default: babelTraverse } = traverse;

export function extractFeatures(code) {
  const features = {
    // Structural counts
    functionCount: 0,
    returnCount: 0,
    loopCount: 0,
    ifCount: 0,

    // Detailed analysis lists
    functions: [], // { type, isAsync, hasReturn, returnCount, implicitReturn }
    loops: [],     // { type, testOperator, testRightSideAsString, nestedDepth }
    conditionals: [], // { type, testAsString, isAssignment }

    // Array & State analysis
    arrayMethodCalls: [], // { method, isAssigned, isReturned, hasCallbackReturn }
    variableAssignments: [], // { name, scopeDepth }
    variableDeclarations: [], // { name, scopeDepth }

    // Async specific
    awaitExpressions: [], // { insideLoop, insideAsync }

    // Flags
    usesAsync: false,
    usesAwait: false,

    // Original flat flags (kept for compatibility or easy checks)
    topLevelStatements: 0,
    nestedDepth: 0
  };

  let ast;
  try {
    ast = parse(code, {
      sourceType: "module",
      plugins: ["asyncGenerators"]
    });
  } catch (err) {
    return features;
  }

  let currentDepth = 0;

  // Helper to track scopes
  const scopes = [{ depth: 0, vars: new Set() }];

  babelTraverse(ast, {
    enter(path) {
      currentDepth++;
      features.nestedDepth = Math.max(features.nestedDepth, currentDepth);

      if (path.isScope()) {
        scopes.push({ depth: currentDepth, vars: new Set() });
      }
    },
    exit(path) {
      currentDepth--;
      if (path.isScope()) {
        scopes.pop();
      }
    },

    Program(path) {
      features.topLevelStatements = path.node.body.length;
    },

    // ---------------------------------------------------------
    // 1. Functions & Returns (Missing Return)
    // ---------------------------------------------------------
    Function(path) {
      features.functionCount++;
      if (path.node.async) features.usesAsync = true;

      const funcInfo = {
        type: path.type,
        isAsync: !!path.node.async,
        hasReturn: false,
        returnCount: 0,
        implicitReturn: true,
        insideLoop: !!path.findParent(p => p.isLoop()),
        enclosingLoopKind: (() => {
          const loopPath = path.findParent(p => p.isForStatement());
          if (loopPath && loopPath.node.init && loopPath.node.init.type === 'VariableDeclaration') {
            return loopPath.node.init.kind;
          }
          return null;
        })()
      };

      // Simple traversal within function to check direct returns
      let hasReturn = false;
      path.traverse({
        ReturnStatement(returnPath) {
          // Verify return belongs to THIS function
          if (returnPath.getFunctionParent().node === path.node) {
            hasReturn = true;
            funcInfo.returnCount++;
          }
        }
      });

      funcInfo.hasReturn = hasReturn;
      // If valid return exists, we optimistically say it might not be implicit return undefined
      if (hasReturn) funcInfo.implicitReturn = false;

      features.functions.push(funcInfo);
    },

    ReturnStatement() {
      features.returnCount++;
    },

    // ---------------------------------------------------------
    // 2. Loops (Off-by-one, Async Misuse)
    // ---------------------------------------------------------
    "ForStatement|WhileStatement|DoWhileStatement|ForInStatement|ForOfStatement"(path) {
      features.loopCount++;
      const loopInfo = {
        type: path.type,
        testOperator: null,
        testRightSideAsString: null,
        nestedDepth: currentDepth
      };

      // For Off-by-one detection
      if (path.node.test && path.node.test.type === "BinaryExpression") {
        loopInfo.testOperator = path.node.test.operator;
        // Capture "length", "length - 1" from right side
        try {
          const right = path.get("test.right");
          if (right.isMemberExpression() && right.node.property.name === 'length') {
            loopInfo.testRightSideAsString = "length";
          } else if (right.isBinaryExpression()) {
            const codeSlice = code.slice(right.node.start, right.node.end);
            loopInfo.testRightSideAsString = codeSlice;
          }
        } catch (e) { }
      }

      // Capture loop declaration kind (var vs let/const) for execution order rule
      if (path.isForStatement() && path.node.init && path.node.init.type === 'VariableDeclaration') {
        loopInfo.loopDeclKind = path.node.init.kind;
      }
      features.loops.push(loopInfo);
    },

    // ---------------------------------------------------------
    // 3. Conditionals (Conditional Reasoning)
    // ---------------------------------------------------------
    "IfStatement|ConditionalExpression"(path) {
      features.ifCount++;

      if (path.isIfStatement() && path.node.test) {
        let isAssignment = false;
        if (path.node.test.type === 'AssignmentExpression') {
          isAssignment = true;
        }

        const testSlice = code.slice(path.node.test.start, path.node.test.end);
        features.conditionals.push({
          type: 'if',
          testAsString: testSlice,
          isAssignment
        });
      }
    },

    // ---------------------------------------------------------
    // 4. Variables (State Mutation, Execution Order)
    // ---------------------------------------------------------
    VariableDeclaration(path) {
      path.node.declarations.forEach(decl => {
        if (decl.id.type === 'Identifier') {
          const currentScope = scopes[scopes.length - 1];
          if (currentScope) currentScope.vars.add(decl.id.name);
          features.variableDeclarations.push({
            name: decl.id.name,
            kind: path.node.kind, // 'var', 'let', or 'const'
            scopeDepth: currentDepth
          });
        }
      });
    },

    AssignmentExpression(path) {
      if (path.node.left.type === 'Identifier') {
        const name = path.node.left.name;
        features.variableAssignments.push({
          name: name,
          scopeDepth: currentDepth
        });
      }
    },

    // ---------------------------------------------------------
    // 5. Array Methods (Array Method Misuse)
    // ---------------------------------------------------------
    CallExpression(path) {
      const callee = path.node.callee;
      if (callee.type === "MemberExpression" && callee.property?.name) {
        const methodName = callee.property.name;
        if (["map", "filter", "reduce", "forEach", "push", "pop", "shift", "unshift", "splice", "sort", "reverse"].includes(methodName)) {

          const callInfo = {
            method: methodName,
            isAssigned: false,
            isReturned: false,
            hasCallbackReturn: false
          };

          // Check if result is used
          if (path.parentPath.isAssignmentExpression() || path.parentPath.isVariableDeclarator()) {
            callInfo.isAssigned = true;
          }
          if (path.parentPath.isReturnStatement()) {
            callInfo.isReturned = true;
          }

          // Check callback for return
          const callback = path.node.arguments[0];
          if (callback && (callback.type === 'ArrowFunctionExpression' || callback.type === 'FunctionExpression')) {
            if (callback.body.type !== 'BlockStatement') {
              callInfo.hasCallbackReturn = true;
            } else {
              const body = callback.body;
              if (body.body && body.body.some(stmt => stmt.type === 'ReturnStatement')) {
                callInfo.hasCallbackReturn = true;
              }
            }
          }

          features.arrayMethodCalls.push(callInfo);
        }
      }
    },

    // ---------------------------------------------------------
    // 6. Async (Async Misuse)
    // ---------------------------------------------------------
    AwaitExpression(path) {
      features.usesAwait = true;
      features.awaitExpressions.push({
        insideLoop: !!path.findParent(p => p.isLoop()),
        insideAsync: !!path.findParent(p => p.isFunction() && p.node.async)
      });
    }

  });

  return features;
}
