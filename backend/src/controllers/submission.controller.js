import Submission from "../models/Submission.model.js";
import Question from "../models/Question.model.js";
import { extractFeatures } from "../services/featureExtractor.js";
import { detectMisconceptions } from "../services/misconceptionEngine/index.js";
import { getConfidence } from "../services/ml.client.js";
import { runTests } from "../utils/testRunner.js";

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
       6. Test Execution (NEW)
    ------------------------------ */
    // Helper to format tests for VM if needed, or pass array directly
    // Assuming Question.tests is array of strings executable in VM
    // We need to fetch tests from Question model (Wait, we already fetched question on line 38)

    // Import runTests at top of file (I will handle import in another block or assume it's available? No, I must add import)
    // Actually, I can use dynamic import or just assume I will add it. I will add import in a separate block.
    // For now, let's write the logic using runTests.

    const testResults = await runTests(code, question.tests || []);

    /* -----------------------------
       7. Rule-based detection
    ------------------------------ */
    const detectionContext = {
      attemptNumber,
      previousSubmissions,
      testResults // Pass test results to rules
    };

    const detectedMisconceptions = detectMisconceptions(features, detectionContext);

    /* -----------------------------
       8. Outcome determination
    ------------------------------ */
    const hasSolvedBefore = previousSubmissions.some(s => s.outcome === "solved");

    // Solved ONLY if tests passed
    const isSolvedNow = testResults.passed;

    const outcome = hasSolvedBefore ? "solved" : (isSolvedNow ? "solved" : "attempted");
    // "abandoned" is usually determined by session timeout, here we just say "attempted" or "failed"?
    // The prompt says "Final outcome (solved / unsolved)".
    // So "attempted" = "unsolved".

    /* -----------------------------
       9. Optional ML confidence
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
       10. Persist submission
    ------------------------------ */
    const submission = await Submission.create({
      userId,
      questionId,
      attemptNumber,
      code,
      timeSpent,
      executionErrors: {
        syntax: testResults.syntax,
        runtime: testResults.runtime,
        testFailures: testResults.testFailures
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