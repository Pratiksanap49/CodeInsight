import express from "express";
import submissionRoutes from "./routes/submission.routes.js";

const app = express();

app.use(express.json());

// 🔴 THIS LINE IS CRITICAL
app.use("/api/submissions", submissionRoutes);

export default app;
