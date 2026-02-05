export default {
  id: "state_mutation",

  detect(features) {
    // Focus on methods that mutate in-place often unexpectedly: sort, reverse, splice.
    // push/pop are usually 'intended' mutation.
    return features.arrayMethodCalls.some(call =>
      ["sort", "reverse", "splice"].includes(call.method)
    );
  },

  evidence(features) {
    return "Usage of in-place mutation methods (sort, reverse, splice) which modify the original array.";
  }
};
