export default {
  id: "missing_return",

  detect(features) {
    // Check if any function has no return but is not void/constructor/async
    return features.functions.some((fn) => {
      // Ignore constructors, async (unless explicit promise return expected), and implicit returns (arrow funcs)
      if (fn.type === 'ClassMethod' && fn.kind === 'constructor') return false;
      if (fn.implicitReturn) return false;

      // If function has NO return statement
      if (!fn.hasReturn) {
        // If we have test failures, it's a strong signal
        // Ensure we don't flag "console.log" wrapper functions if they are valid.
        // But in this context (solving problems), functions usually return values.
        return true;
      }
      return false;
    });
  },

  evidence(features) {
    return "Defined a function but did not include a return statement.";
  }
};
