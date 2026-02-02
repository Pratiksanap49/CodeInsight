import Submission from "../../models/Submission.model.js";

export async function getUserAnalytics(userId) {
  const submissions = await Submission.find({ userId }).sort({
    createdAt: 1
  });

  const misconceptionFrequency = {};
  const attemptsPerQuestion = {};
  const misconceptionsOverTime = [];

  for (const sub of submissions) {
    // Attempts per question
    attemptsPerQuestion[sub.questionId] =
      Math.max(attemptsPerQuestion[sub.questionId] || 0, sub.attemptNumber);

    // Misconception frequency
    sub.detectedMisconceptions.forEach(m => {
      misconceptionFrequency[m.id] =
        (misconceptionFrequency[m.id] || 0) + 1;
    });

    // Trend over time
    misconceptionsOverTime.push({
      submissionId: sub._id,
      count: sub.detectedMisconceptions.length,
      createdAt: sub.createdAt
    });
  }

  return {
    misconceptionFrequency,
    attemptsPerQuestion,
    misconceptionsOverTime
  };
}
