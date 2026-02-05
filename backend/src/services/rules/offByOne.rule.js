import { MISCONCEPTIONS } from "./types.js";

export function detectOffByOne(features) {
  const {
    usesLoop,
    loopCondition,
    usesArrayLength,
    failsBoundaryTests
  } = features;

  if (!usesLoop || !failsBoundaryTests) return null;

  const suspicious =
    (usesArrayLength && /<=\s*.*length/.test(loopCondition)) ||
    /<\s*.*length\s*-\s*1/.test(loopCondition);

  if (suspicious) {
    return {
      id: MISCONCEPTIONS.OFF_BY_ONE,
      confidence: 1,
      evidence: {
        loopCondition,
        failsBoundaryTests
      }
    };
  }

  return null;
}

