import Submission from "../models/Submission.model.js";
import Question from "../models/Question.model.js";
import { extractFeatures } from "../services/featureExtractor.js";
import { detectMisconceptions } from "../services/misconceptionEngine/index.js";
import { getConfidence } from "../services/ml.client.js";

export async function submitCode(req, res, next) {
  try {
    const userId = req.user?.id;
    const { questionId, code, timeSpent } = req.body;

    /* -----------------------------
       1. Auth safety check
    ------------------------------ */
    if (!userId) {
      const err = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }

    /* -----------------------------
       2. Input validation
    ------------------------------ */
    if (
      !questionId ||
      typeof code !== "string" ||
      code.trim().length === 0 ||
      typeof timeSpent !== "number"
    ) {
      const err = new Error("Invalid submission payload");
      err.status = 400;
      throw err;
    }

    /* -----------------------------
       3. Referential integrity
    ------------------------------ */
    const question = await Question.findById(questionId);
    if (!question) {
      const err = new Error("Question does not exist");
      err.status = 404;
      throw err;
    }

    /* -----------------------------
       4. Attempt calculation
    ------------------------------ */
    const previousSubmissions = await Submission.find({
      userId,
      questionId
    }).sort({ createdAt: 1 });

    const attemptNumber = previousSubmissions.length + 1;

    /* -----------------------------
       4.1 Rate-limit protection
    ------------------------------ */
    const lastSubmission = previousSubmissions.at(-1);
    if (lastSubmission) {
      const diff =
        Date.now() - new Date(lastSubmission.createdAt).getTime();

      if (diff < 3000) {
        const err = new Error("Submission too frequent");
        err.status = 429;
        throw err;
      }
    }

    /* -----------------------------
       5. Feature extraction (safe)
    ------------------------------ */
    let features;
    try {
      features = extractFeatures(code);
    } catch {
      features = {};
    }

    /* -----------------------------
       6. Rule-based detection
    ------------------------------ */
    const detectedMisconceptions = detectMisconceptions(features, {
      attemptNumber,
      previousSubmissions
    });

    /* -----------------------------
       6.1 Outcome stability
    ------------------------------ */
    const hasSolvedBefore = previousSubmissions.some(
      s => s.outcome === "solved"
    );

    const outcome =
      hasSolvedBefore
        ? "solved"
        : detectedMisconceptions.length === 0
          ? "solved"
          : "abandoned";

    /* -----------------------------
       7. Optional ML confidence
    ------------------------------ */
    let confidenceData = null;

    confidenceData = await getConfidence(
      { ...features, attemptNumber },
      detectedMisconceptions
    );

    const enrichedMisconceptions = detectedMisconceptions.map(m => {
      const match = confidenceData?.find(c => c.id === m.id);
      return match
        ? { ...m, confidence: match.confidence }
        : m;
    });

    /* -----------------------------
       8. Persist submission
    ------------------------------ */
    const submission = await Submission.create({
      userId,
      questionId,
      attemptNumber,
      code,
      timeSpent,
      executionErrors: {
        syntax: [],
        runtime: [],
        testFailures: []
      },
      features,
      detectedMisconceptions: enrichedMisconceptions,
      outcome
    });

    /* -----------------------------
       9. Stable response
    ------------------------------ */
    return res.status(201).json({
      submissionId: submission._id,
      attemptNumber,
      outcome,
      detectedMisconceptions: enrichedMisconceptions,
      executionErrors: submission.executionErrors
    });
  } catch (err) {
    next(err);
  }
}