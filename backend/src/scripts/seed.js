import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/Question.model.js";

dotenv.config();

const questions = [
    {
        title: "Sum of Array",
        prompt: "Write a function `sum(arr)` that returns the sum of all elements in an array. Watch out for off-by-one errors!",
        starterCode: "function sum(arr) {\n  // Your code here\n}",
        tests: [
            "const res = sum([1, 2, 3]); assert(res === 6, 'sum([1,2,3]) should be 6')",
            "const res2 = sum([10, -2]); assert(res2 === 8, 'sum([10, -2]) should be 8')",
            "assert(sum([]) === 0, 'sum([]) should be 0')"
        ],
        targetMisconceptions: ["off_by_one", "missing_return"]
    },
    {
        title: "Filter Evens",
        prompt: "Write a function `filterEvens(arr)` that returns a new array containing only the even numbers.",
        starterCode: "function filterEvens(arr) {\n  \n}",
        tests: [
            "const res = filterEvens([1, 2, 3, 4]); expect(res).toEqual([2, 4]);",
            "const res2 = filterEvens([1, 3, 5]); expect(res2).toEqual([]);",
            "expect(filterEvens([])).toEqual([]);"
        ],
        targetMisconceptions: ["array_method_misuse", "missing_return"]
    },
    {
        title: "Sort Numbers",
        prompt: "Write a function `sortNumbers(arr)` that returns a sorted copy of the array without modifying the original array.",
        starterCode: "function sortNumbers(arr) {\n  \n}",
        tests: [
            "const input = [3, 1, 2]; const res = sortNumbers(input); expect(res).toEqual([1, 2, 3]);",
            "const input2 = [3, 1, 2]; sortNumbers(input2); expect(input2).toEqual([3, 1, 2]); // Check for mutation"
        ],
        targetMisconceptions: ["state_mutation"]
    },
    {
        title: "Async Fetch",
        prompt: "Write an async function `fetchAll(urls)` that mocks fetching data. It should return an array of results. Ensure requests run in parallel (not sequentially). context.fetch(url) is available.",
        starterCode: "async function fetchAll(urls) {\n  // usage: await fetch(url)\n}",
        tests: [
            "const start = Date.now(); await fetchAll(['a', 'b']); const duration = Date.now() - start; assert(duration < 1500, 'Requests must run in parallel');",
            "const res = await fetchAll(['x']); assert(Array.isArray(res), 'Should return array');"
        ],
        targetMisconceptions: ["async_misuse"]
    },
    {
        title: "Create Function List",
        prompt: "Write a function `createFunctions(n)` that returns an array of `n` functions. The first function should return 0, the second 1, etc.",
        starterCode: "function createFunctions(n) {\n  var funcs = [];\n  for (var i = 0; i < n; i++) {\n    funcs.push(function() { return i; });\n  }\n  return funcs;\n}",
        tests: [
            "const fns = createFunctions(3); assert(fns[0]() === 0, 'First function should return 0');",
            "assert(fns[1]() === 1, 'Second function should return 1');"
        ],
        targetMisconceptions: ["execution_order"]
    },
    {
        title: "Check Password",
        prompt: "Write a function `checkPassword(input)` that returns true if input is 'secret', false otherwise.",
        starterCode: "function checkPassword(input) {\n  if (input = 'secret') {\n    return true;\n  }\n  return false;\n}",
        tests: [
            "assert(checkPassword('secret') === true, 'Correct password check');",
            "assert(checkPassword('wrong') === false, 'Wrong password check');"
        ],
        targetMisconceptions: ["conditional_reasoning"]
    },
    {
        title: "Double Values",
        prompt: "Write a function `doubleValues(arr)` that returns a new array with every value doubled.",
        starterCode: "function doubleValues(arr) {\n  arr.map(x => x * 2);\n}",
        tests: [
            "expect(doubleValues([1, 2])).toEqual([2, 4]);",
            "expect(doubleValues([])).toEqual([]);"
        ],
        targetMisconceptions: ["array_method_misuse", "missing_return"]
    },
    {
        title: "Get Last Element",
        prompt: "Write a function `getLast(arr)` that returns the last element of the array.",
        starterCode: "function getLast(arr) {\n  return arr[arr.length];\n}",
        tests: [
            "assert(getLast([1, 2, 3]) === 3, 'Should return last element');",
            "assert(getLast([1]) === 1, 'Should return single element');"
        ],
        targetMisconceptions: ["off_by_one"]
    },
    {
        title: "Add To List",
        prompt: "Write a function `addToList(list, item)` that adds item to list and returns the list.",
        starterCode: "function addToList(list, item) {\n  return list.push(item);\n}",
        tests: [
            "const l = [1]; const res = addToList(l, 2); expect(res).toEqual([1, 2]); assert(l.length === 2, 'List should grow');"
        ],
        targetMisconceptions: ["array_method_misuse"]
    },
    {
        title: "Delayed Greeter",
        prompt: "Write a function `greet(name)` that returns 'Hello ' + name.",
        starterCode: "function greet(name) {\n  // missing return\n  'Hello ' + name;\n}",
        tests: [
            "assert(greet('Alice') === 'Hello Alice', 'Should return greeting');"
        ],
        targetMisconceptions: ["missing_return"]
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
