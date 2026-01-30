export default {
  id: "missing_return",

  detect(features) {
    return features.functionCount > 0 && features.hasReturn === false;
  },

  evidence() {
    return "Function defined without any return statement.";
  }
};
