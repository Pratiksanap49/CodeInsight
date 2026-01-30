import express from "express";
import { submitCode } from "../controllers/submission.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, submitCode);

export default router;
