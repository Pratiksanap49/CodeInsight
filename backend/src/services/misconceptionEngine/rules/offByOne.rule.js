export default {
  id: "off_by_one",

  detect(features) {
    return features.loops.some(loop => {
      // Check for <= length
      if (loop.testOperator === "<=" && /length/.test(loop.testRightSideAsString || "")) {
        return true;
      }
      // Check for < length - 1 (or similar logic error skipping last element? actually < length - 1 skips last)
      // BUT < length is correct.
      // < length - 1 skips the last item. -> Off by one.
      // <= length goes too far. -> Off by one.

      if (loop.testOperator === "<" && /length\s*-\s*1/.test(loop.testRightSideAsString || "")) {
        return true;
      }

      return false;
    });
  },

  evidence(features) {
    return "Loop condition suggests an off-by-one error (e.g., <= length or < length - 1).";
  }
};
