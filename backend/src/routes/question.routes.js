import express from "express";
import Question from "../models/Question.model.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET /api/questions
 * Purpose: list all diagnostic questions (summary only)
 */
import Submission from "../models/Submission.model.js";

router.get("/", authenticate, async (req, res) => {
  try {
    const questions = await Question.find().select("-tests").lean();
    const submissions = await Submission.find({ userId: req.user.id }).select("questionId outcome");

    const solvedMap = new Set(
      submissions.filter(s => s.outcome === "solved").map(s => s.questionId.toString())
    );

    const questionsWithStatus = questions.map(q => ({
      ...q,
      isSolved: solvedMap.has(q._id.toString())
    }));

    res.json(questionsWithStatus);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

/**
 * GET /api/questions/:id
 * Purpose: fetch one question for an attempt
 */
router.get("/:id", authenticate, async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  res.json(question);
});

export default router;
