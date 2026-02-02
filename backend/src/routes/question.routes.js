import express from "express";
import Question from "../models/Question.model.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// List questions (no tests)
router.get("/", authenticate, async (req, res) => {
  const questions = await Question.find().select("-tests");
  res.json(questions);
});

// Single question
router.get("/:id", authenticate, async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  res.json(question);
});

export default router;
