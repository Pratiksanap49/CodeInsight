import express from "express";
import cors from "cors";
import submissionRoutes from "./routes/submission.routes.js";
import questionRoutes from "./routes/question.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

// ✅ allow frontend origin
app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.json());

app.use("/api/submissions", submissionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;