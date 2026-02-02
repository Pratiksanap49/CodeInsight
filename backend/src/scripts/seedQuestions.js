import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/Question.model.js";

dotenv.config();

const questions = [
  {
    prompt: "Write a function that returns the square of a number.",
    starterCode: "function square(n) {\n  \n}",
    tests: ["square(2) === 4", "square(5) === 25"],
    targetMisconceptions: ["missing_return"]
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  await Question.deleteMany({});
  await Question.insertMany(questions);

  console.log("Questions seeded");
  process.exit();
}

seed();
