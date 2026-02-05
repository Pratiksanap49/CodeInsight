export default {
  id: "conditional_reasoning",

  detect(features) {
    return features.conditionals.some(cond => {
      // confusing assignment in condition: if (a = b)
      if (cond.isAssignment) return true;

      // redundancy: if (a == true) or if (a == false)
      // strict or loose equality
      if (/==\s*(true|false)/.test(cond.testAsString)) return true;

      return false;
    });
  },

  evidence(features) {
    return "Conditional expression contains assignment (=) or redundant boolean check.";
  }
};
