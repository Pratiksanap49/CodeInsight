export default {
  id: "execution_order",

  detect(features) {
    return features.functions.some(fn => {
      // Only flag if defined inside a loop AND the loop uses 'var'
      if (fn.insideLoop && fn.enclosingLoopKind === 'var') {
        return true;
      }
      return false;
    });
  },

  evidence(features) {
    return "Function defined inside a loop, commonly leading to closure/scope execution order issues.";
  }
};
