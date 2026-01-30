export default {
  id: "execution_order",

  detect(features) {
    return features.usesAsync && features.usesAwait === false;
  },

  evidence() {
    return "Async function declared without await usage.";
  }
};
