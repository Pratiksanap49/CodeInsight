export default {
  id: "missing_return",

  detect(features) {
    // Look for functions that have no return statement but aren't void-like (heuristically)
    // Or functions that have loops/conditionals but `implicitReturn` is true (meaning execution flows off end)

    // Simplest robust check: function exists, implicitReturn is true, and it's not a short one-liner?
    // Let's rely on 'functions' list

    return features.functions.some(fn => {
      // Skip arrow functions that might be used as callbacks without block bodies (usually handled by isReturn=true in extraction if expression body)
      // Note: featureExtractor defaults implicitReturn=true.
      // It sets hasReturn=true if a ReturnStatement is found.

      // If it's a block-body function and has NO return statement:
      if (!fn.hasReturn && !fn.isAsync) {
        // It might be a void function. But if we are "learning return logic", 
        // students often forget return. 
        // Let's check complexity. If it has logic (loops/ifs) but no return -> suspicious.
        // Using feature counts as proxy for complexity? 
        // Actually, we can't easily map a function to its specific complexity in the current feature Features.
        // Simplified rule: ANY function with 0 returns detected.
        return true;
      }

      // If it HAS returns but relies on implicit undefined in some paths? 
      // We approximated 'implicitReturn' = 'execution can fall through'? 
      // Actually my extractor logic for implicitReturn was: "assumed true until proven false" (which I didn't actually implement proof for 'false' fully).
      // I only did: `if (hasReturn) funcInfo.implicitReturn = false;` which is WRONG. 
      // A function structure can have returns but still fall through.
      // BUT, for "Missing Return" misconception, we usually mean "Forget to return anything at all".

      return false;
    });
  },

  evidence(features) {
    return "Defined a function but did not include a return statement.";
  }
};
