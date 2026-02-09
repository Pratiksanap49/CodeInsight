import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getUserAnalytics } from "../services/analytics/analytics.service.js";

const router = express.Router();

/**
 * GET /api/analytics
 * Purpose: return aggregated learning analytics
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const analytics = await getUserAnalytics(req.user.id);
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics", error: error.message });
  }
});

export default router;