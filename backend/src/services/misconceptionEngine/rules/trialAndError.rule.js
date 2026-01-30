export default {
  id: "trial_and_error",

  detect(_, context) {
    return context?.attemptNumber >= 3;
  },

  evidence(_, context) {
    return `Multiple attempts detected (${context.attemptNumber}).`;
  }
};
