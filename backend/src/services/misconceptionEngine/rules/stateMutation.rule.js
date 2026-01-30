export default {
  id: "state_mutation",

  detect(features) {
    return features.mutatesArray === true;
  },

  evidence() {
    return "Array is mutated using push/pop/splice.";
  }
};
