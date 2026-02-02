import express from "express";
import submissionRoutes from "./routes/submission.routes.js";
import questionRoutes from "./routes/question.routes.js";

const app = express();

app.use(express.json());

app.use("/api/submissions", submissionRoutes);

app.use("/api/questions", questionRoutes);

export default app;
