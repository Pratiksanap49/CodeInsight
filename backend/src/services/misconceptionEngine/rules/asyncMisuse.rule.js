export default {
  id: "async_misuse",

  detect(features) {
    // 1. Await inside a loop (serial execution instead of parallel)
    const awaitInLoop = features.awaitExpressions.some(expr => expr.insideLoop);

    // 2. We could also check for async functions used in forEach, but we didn't extract that specifically.
    // However, awaitInLoop is the classic "Async stuck in sync loop" pattern.

    return awaitInLoop;
  },

  evidence(features) {
    return "Usage of 'await' inside a loop, preventing parallel execution.";
  }
};
