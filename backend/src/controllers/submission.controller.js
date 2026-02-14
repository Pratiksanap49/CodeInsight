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

    // 1. Auth & Validation (Keep your existing logic)
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!questionId || typeof code !== "string" || code.trim().length === 0) {
      return res.status(400).json({ message: "Invalid submission payload" });
    }

    // 2. Data Retrieval
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question does not exist" });

    const previousSubmissions = await Submission.find({ userId, questionId }).sort({ createdAt: 1 });
    const attemptNumber = previousSubmissions.length + 1;

    // 3. Code Execution
    const testResults = await runTests(code, question.tests || []);

    // 4. Feature Extraction & Local Rule Detection
    let features = {};
    try { features = extractFeatures(code); } catch { features = {}; }

    const detectionContext = { attemptNumber, previousSubmissions, testResults };
    const localMisconceptions = detectMisconceptions(features, detectionContext);

    // 5. ML SERVICE HANDSHAKE (The Fix)
    let enrichedMisconceptions = [...localMisconceptions];
    try {
      // We send the code and features to the ML service
      const mlResponse = await getConfidence(
        { ...features, code, attemptNumber }, 
        localMisconceptions
      );

      // If ML service found NEW misconceptions (like from your new /analyze route), add them
      if (mlResponse && Array.isArray(mlResponse.misconceptions)) {
        mlResponse.misconceptions.forEach(mlItem => {
          const exists = enrichedMisconceptions.find(m => m.id === mlItem.id);
          if (exists) {
            exists.confidence = mlItem.confidence; // Update confidence for local rules
          } else {
            enrichedMisconceptions.push(mlItem); // Add new insights detected by Python
          }
        });
      }
    } catch (mlErr) {
      console.warn("ML Service unreachable, using local rules only:", mlErr.message);
    }

    // 6. Outcome & Persistence
    const isSolvedNow = testResults.passed;
    const outcome = isSolvedNow ? "solved" : "attempted";

    const submission = await Submission.create({
      userId,
      questionId,
      attemptNumber,
      code,
      timeSpent,
      executionErrors: {
        syntax: testResults.syntax || [],
        runtime: testResults.runtime || [],
        testFailures: testResults.testFailures || []
      },
      features,
      detectedMisconceptions: enrichedMisconceptions,
      outcome
    });

    // 7. Final Response
    res.status(201).json({
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