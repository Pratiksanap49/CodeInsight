export default {
  id: "trial_and_error",
  confidence: 0.75,

  detect(features, context = {}) {
    const { previousSubmissions = [] } = context;
    if (previousSubmissions.length < 2) return false;

    // Sort by time just in case
    const recent = previousSubmissions.slice(-3); // Check last 3
    if (recent.length < 2) return false;

    // Check time diffs
    const times = recent.map(s => new Date(s.createdAt).getTime());
    let rapidCount = 0;

    for (let i = 1; i < times.length; i++) {
      const diff = times[i] - times[i - 1];
      if (diff < 60000) { // Less than 1 minute
        rapidCount++;
      }
    }

    // If we have distinct rapid attempts, flag it
    // Note: The current submission (not in prev yet? OR passed as partial?)
    // Context usually has PREVIOUS submissions.
    // If the USER just clicked submit rapidly 3 times:
    // 1st (ok), 2nd (rapid), 3rd (rapid).
    // If rapidCount >= 2 (meaning 3 fast submissions in a row)
    return rapidCount >= 2;
  },

  evidence(features, context) {
    return "Multiple rapid submissions detected within a short timeframe, suggesting trial-and-error.";
  }
};
