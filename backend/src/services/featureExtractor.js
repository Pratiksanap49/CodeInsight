import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
const { default: babelTraverse } = traverse;


export function extractFeatures(code) {
  const features = {
    functionCount: 0,
    returnCount: 0,
    hasReturn: false,
    returnsInAllBranches: false, // computed later (Phase 5)

    loopCount: 0,
    loopTypes: [],
    usesLessThanEqual: false,
    usesLessThan: false,

    ifCount: 0,
    elseCount: 0,
    ternaryCount: 0,

    arrayMethodCalls: [],
    mutatesArray: false,

    usesAsync: false,
    usesAwait: false,
    awaitOutsideAsync: false,

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
    // Invalid JS → return empty features (never crash)
    return features;
  }

  let currentDepth = 0;

  babelTraverse(ast, {
    enter() {
      currentDepth++;
      features.nestedDepth = Math.max(features.nestedDepth, currentDepth);
    },
    exit() {
      currentDepth--;
    },

    Program(path) {
      features.topLevelStatements = path.node.body.length;
    },

    // Functions + returns
    Function(path) {
      features.functionCount++;
      if (path.node.async) features.usesAsync = true;
    },

    ReturnStatement() {
      features.returnCount++;
      features.hasReturn = true;
    },

    // Conditionals
    IfStatement(path) {
      features.ifCount++;
      if (path.node.alternate) features.elseCount++;
    },

    ConditionalExpression() {
      features.ternaryCount++;
    },

    // Loops
    ForStatement() {
      features.loopCount++;
      features.loopTypes.push("for");
    },

    WhileStatement() {
      features.loopCount++;
      features.loopTypes.push("while");
    },

    BinaryExpression(path) {
      if (path.node.operator === "<=") features.usesLessThanEqual = true;
      if (path.node.operator === "<") features.usesLessThan = true;
    },

    // Arrays / mutation
    CallExpression(path) {
      const callee = path.node.callee;
      if (callee.type === "MemberExpression" && callee.property?.name) {
        const name = callee.property.name;

        if (["map", "filter", "reduce"].includes(name)) {
          features.arrayMethodCalls.push(name);
        }

        if (["push", "pop", "splice"].includes(name)) {
          features.mutatesArray = true;
        }
      }
    },

    // Async misuse
    AwaitExpression(path) {
      features.usesAwait = true;

      const inAsyncFunction = path.findParent(
        p => p.isFunction() && p.node.async
      );

      if (!inAsyncFunction) {
        features.awaitOutsideAsync = true;
      }
    }
  });

  // Normalize
  features.loopTypes = [...new Set(features.loopTypes)];
  features.arrayMethodCalls = [...new Set(features.arrayMethodCalls)];

  return features;
}
