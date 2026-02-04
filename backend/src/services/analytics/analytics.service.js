import { getUserAnalytics } from "../analytics.service.js";
import Submission from "../../../models/Submission.model.js";

jest.mock("../../../models/Submission.model.js");

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

  const misconceptionFrequency = Object.entries(
    misconceptionMap
  ).map(([id, count]) => ({ id, count }));

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

  const attemptsPerQuestion = Object.entries(
    attemptsMap
  ).map(([questionId, attempts]) => ({
    questionId,
    attempts
  }));

  /* -----------------------------
     Misconceptions over time
  ------------------------------ */
  const misconceptionsOverTime = submissions.map(sub => ({
    timestamp: sub.createdAt,
    count: sub.detectedMisconceptions.length
  }));

  return {
    misconceptionFrequency,
    attemptsPerQuestion,
    misconceptionsOverTime
  };
}
