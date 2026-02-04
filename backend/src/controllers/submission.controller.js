import Submission from "../models/Submission.model.js";
import Question from "../models/Question.model.js";
import { extractFeatures } from "../services/featureExtractor.js";
import { detectMisconceptions } from "../services/misconceptionEngine/index.js";

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
       5. Feature extraction
    ------------------------------ */
    const features = extractFeatures(code);

    /* -----------------------------
       6. Misconception detection
    ------------------------------ */
    const detectedMisconceptions = detectMisconceptions(features, {
      attemptNumber,
      previousSubmissions
    });

    const outcome =
      detectedMisconceptions.length === 0 ? "solved" : "abandoned";

    /* -----------------------------
       7. Persist submission
    ------------------------------ */
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

    /* -----------------------------
       8. Stable response shape
    ------------------------------ */
    return res.status(201).json({
      submissionId: submission._id,
      attemptNumber,
      outcome,
      detectedMisconceptions
    });
  } catch (err) {
    next(err); // central error handler
  }
}
