export default {
  id: "execution_order",

  detect(features) {
    // DISABLED: This rule detects functions defined inside loops.
    // In ES6+ with `let` block scoping, this is safe and common pattern (e.g. for callbacks).
    // Our feature extractor does not distinguish between var and let.
    // Thus, this rule generates false positives for modern valid code.
    return false;
    // return features.functions.some(fn => fn.insideLoop);
  },

  evidence(features) {
    return "Function defined inside a loop, commonly leading to closure/scope execution order issues.";
  }
};
