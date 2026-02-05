import Submission from "../../models/Submission.model.js";


export async function getUserAnalytics(userId) {
  const submissions = await Submission.find({ userId }).sort({
    createdAt: 1
  });

  /* -----------------------------
     Empty state (guaranteed shape)
  ------------------------------ */
  if (submissions.length === 0) {
    return {
      misconceptionFrequency: [],
      attemptsPerQuestion: [],
      misconceptionsOverTime: []
    };
  }

  /* -----------------------------
     Misconception frequency
  ------------------------------ */
  const misconceptionMap = {};

  submissions.forEach(sub => {
    sub.detectedMisconceptions.forEach(m => {
      misconceptionMap[m.id] =
        (misconceptionMap[m.id] || 0) + 1;
    });
  });

  // Return map directly for frontend compatibility (Object.entries)
  const misconceptionFrequency = misconceptionMap;

  /* -----------------------------
     Attempts per question
  ------------------------------ */
  const attemptsMap = {};

  submissions.forEach(sub => {
    attemptsMap[sub.questionId] = Math.max(
      attemptsMap[sub.questionId] || 0,
      sub.attemptNumber
    );
  });

  const attemptsPerQuestion = attemptsMap;

  /* -----------------------------
     Misconceptions over time
  ------------------------------ */
  const misconceptionsOverTime = submissions.map(sub => {
    const totalConf = sub.detectedMisconceptions.reduce(
      (acc, m) => acc + (m.confidence || 0),
      0
    );
    const avgConf =
      sub.detectedMisconceptions.length > 0
        ? totalConf / sub.detectedMisconceptions.length
        : 0;

    return {
      createdAt: sub.createdAt,
      count: sub.detectedMisconceptions.length,
      avgConfidence: parseFloat(avgConf.toFixed(2))
    };
  });

  return {
    misconceptionFrequency,
    attemptsPerQuestion,
    misconceptionsOverTime
  };
}
