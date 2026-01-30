export default {
  id: "off_by_one",

  detect(features) {
    return (
      features.loopCount > 0 &&
      features.usesLessThanEqual &&
      !features.usesLessThan
    );
  },

  evidence() {
    return "Loop condition uses <= which may cause boundary errors.";
  }
};
