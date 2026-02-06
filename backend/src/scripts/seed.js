import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/Question.model.js";

dotenv.config();

const questions = [
    {
        title: "Sum of Array",
        prompt: "Write a function `sum(arr)` that returns the sum of all elements in an array. Watch out for off-by-one errors!",
        starterCode: "function sum(arr) {\n  // Your code here\n}",
        tests: [], // Minimal testing, we rely on diagnosis
        misconceptionTargets: ["off_by_one", "missing_return"]
    },
    {
        title: "Filter Evens",
        prompt: "Write a function `filterEvens(arr)` that returns a new array with only even numbers.",
        starterCode: "function filterEvens(arr) {\n  \n}",
        tests: [],
        misconceptionTargets: ["array_method_misuse", "missing_return"]
    },
    {
        title: "Sort Numbers",
        prompt: "Write a function `sortNumbers(arr)` that returns a sorted copy of the array without modifying the original.",
        starterCode: "function sortNumbers(arr) {\n  \n}",
        tests: [],
        misconceptionTargets: ["state_mutation"]
    },
    {
        title: "Async Fetch",
        prompt: "Write an async function `fetchAll(urls)` that fetches data from an array of URLs in parallel.",
        starterCode: "async function fetchAll(urls) {\n  \n}",
        tests: [],
        misconceptionTargets: ["async_misuse"]
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Connected to MongoDB for seeding...");
        await Question.deleteMany({});
        await Question.insertMany(questions);
        console.log("Database seeded with diagnostic questions.");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
