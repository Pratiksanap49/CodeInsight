export default {
  id: "array_method_misuse",

  detect(features) {
    return (
      features.arrayMethodCalls.length > 0 &&
      features.hasReturn === false
    );
  },

  evidence(features) {
    return `Array methods used (${features.arrayMethodCalls.join(
      ", "
    )}) without returning values.`;
  }
};
