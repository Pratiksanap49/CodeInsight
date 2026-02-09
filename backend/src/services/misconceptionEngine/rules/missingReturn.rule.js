export default {
  id: "missing_return",

  detect(features) {
    // Look for functions that have no return statement but aren't void-like (heuristically)
    // We filter out async functions (which return Promies) and constructors.
    return features.functions.some((fn) => {
      // If it's a block-body function and has NO return statement:
      if (!fn.hasReturn && !fn.isAsync && !fn.isConstructor) {
        return true;
      }
      return false;
    });
  },

  evidence(features) {
    return "Defined a function but did not include a return statement.";
  }
};
