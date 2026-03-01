export default {
  id: "array_method_misuse",
  confidence: 0.90,

  detect(features) {
    return features.arrayMethodCalls.some(call => {
      // 1. Using map/filter/reduce but ignoring the result (treating it like forEach)
      if (["map", "filter", "reduce"].includes(call.method)) {
        if (!call.isAssigned && !call.isReturned) {
          return true;
        }
      }

      // 2. Using map/filter but not returning anything from the callback
      if (["map", "filter"].includes(call.method)) {
        if (!call.hasCallbackReturn) {
          return true;
        }
      }

      return false;
    });
  },

  evidence(features) {
    return "Array method (map/filter) used without assignment or without returning value in callback.";
  }
};
