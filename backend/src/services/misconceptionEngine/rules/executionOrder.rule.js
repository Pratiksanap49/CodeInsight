export default {
  id: "execution_order",

  detect(features) {
    // Defining functions inside loops is a common source of execution order / closure issues.
    // e.g. for (var i=0; i<3; i++) { setTimeout(() => console.log(i)) } -> 3, 3, 3
    return features.functions.some(fn => fn.insideLoop);
  },

  evidence(features) {
    return "Function defined inside a loop, commonly leading to closure/scope execution order issues.";
  }
};
