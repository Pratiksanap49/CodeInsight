export default {
  id: "conditional_reasoning",

  detect(features) {
    return features.conditionals.some(cond => {
      // confusing assignment in condition: if (a = b)
      if (cond.isAssignment) return true;

      // REMOVED: Check for == true / == false. 
      // This is a stylistic issue, not strictly a "misconception" requiring diagnosis in this context.
      // It flags valid, working code.

      return false;
    });
  },

  evidence(features) {
    return "Conditional expression contains assignment (=) or redundant boolean check.";
  }
};
