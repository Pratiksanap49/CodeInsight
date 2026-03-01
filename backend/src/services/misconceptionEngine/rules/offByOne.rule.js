export default {
  id: "off_by_one",
  confidence: 0.80,

  detect(features) {
    return features.loops.some(loop => {
      const rightSide = loop.testRightSideAsString || "";

      // Case 1: <= length
      // Common error: for (i=0; i <= arr.length; i++) -> unexpected undefined at end
      // We want to flag `<= length` but allow `<= length - 1` (which is valid).
      if (loop.testOperator === "<=") {
        if (/length/.test(rightSide) && !/length\s*-\s*1/.test(rightSide)) {
          return true;
        }
      }

      // Case 2: < length - 1
      // Common error: for (i=0; i < arr.length - 1; i++) -> skips last element
      // This is usually an error if the intent is to iterate whole array.
      if (loop.testOperator === "<") {
        if (/length\s*-\s*1/.test(rightSide)) {
          return true;
        }
      }

      return false;
    });
  },

  evidence(features) {
    return "Loop condition suggests an off-by-one error (e.g., <= length or < length - 1).";
  }
};
