export default {
  id: "async_misuse",

  detect(features) {
    return features.awaitOutsideAsync === true;
  },

  evidence() {
    return "await used outside of an async function.";
  }
};
