import { MISCONCEPTIONS } from "./types.js";

export function detectReturnLogic(features) {
  const {
    hasFunction,
    hasReturnStatement,
    returnsUndefinedOnSomePaths,
    testsExpectReturn
  } = features;

  if (!hasFunction || !testsExpectReturn) return null;

  if (!hasReturnStatement || returnsUndefinedOnSomePaths) {
    return {
      id: MISCONCEPTIONS.RETURN_LOGIC,
      confidence: 1,
      evidence: {
        hasReturnStatement,
        returnsUndefinedOnSomePaths
      }
    };
  }

  return null;
}

