import Submission from "../models/Submission.model.js";
import { extractFeatures } from "../services/featureExtractor.js";
import { detectMisconceptions } from "../services/misconceptionEngine/index.js";

export async function submitCode(req, res) {
  const userId = req.user.id;
  const { questionId, code, timeSpent } = req.body;

  if (!questionId || !code || timeSpent == null) {
    return res.status(400).json({ error: "Invalid submission payload" });
  }

  const previousSubmissions = await Submission.find({
    userId,
    questionId
  }).sort({ createdAt: 1 });

  const attemptNumber = previousSubmissions.length + 1;

  const features = extractFeatures(code);

  const detectedMisconceptions = detectMisconceptions(features, {
    attemptNumber,
    previousSubmissions
  });

  const outcome =
    detectedMisconceptions.length === 0 ? "solved" : "abandoned";

  const submission = await Submission.create({
    userId,
    questionId,
    attemptNumber,
    code,
    timeSpent,
    errors: {
      syntax: [],
      runtime: [],
      testFailures: []
    },
    features,
    detectedMisconceptions,
    outcome
  });

  return res.status(201).json({
    submissionId: submission._id,
    attemptNumber,
    outcome,
    detectedMisconceptions
  });
}
