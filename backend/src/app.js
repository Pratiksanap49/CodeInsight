import express from "express";
import cors from "cors";
import dns from "node:dns";
import submissionRoutes from "./routes/submission.routes.js";
import questionRoutes from "./routes/question.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// 1. DNS Fix: Only apply Google DNS servers in local development
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '8.8.4.4']); 
}

// 2. Middleware
app.use(cors({
  // Allows requests from your Vercel URL or local dev server
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// 3. Health Check (Useful for Render to monitor your app)
app.get("/", (req, res) => {
  res.status(200).json({ message: "CodeInsight API is live!" });
});

// 4. Routes: Perfectly matched with your frontend BASE_URL
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/analytics", analyticsRoutes);

// 5. Error Handling Middleware (Keep this last)
app.use(errorHandler);

export default app;