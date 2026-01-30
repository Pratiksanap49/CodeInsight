export default {
  id: "conditional_reasoning",

  detect(features) {
    return features.ifCount > 0 && features.elseCount === 0;
  },

  evidence() {
    return "Conditional logic without else branch may miss cases.";
  }
};
