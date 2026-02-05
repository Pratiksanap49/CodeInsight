import { extractFeatures } from "../../featureExtractor.js";
import missingReturn from "../rules/missingReturn.rule.js";
import offByOne from "../rules/offByOne.rule.js";
import conditionalReasoning from "../rules/conditionalReasoning.rule.js";
import arrayMethodMisuse from "../rules/arrayMethodMisuse.rule.js";
import stateMutation from "../rules/stateMutation.rule.js";
import asyncMisuse from "../rules/asyncMisuse.rule.js";
import executionOrder from "../rules/executionOrder.rule.js";
import trialAndError from "../rules/trialAndError.rule.js";

describe("Misconception Rules", () => {

    test("Missing Return", () => {
        const code = "function add(a, b) { let c = a + b; }";
        const features = extractFeatures(code);
        expect(missingReturn.detect(features)).toBe(true);

        const codeValid = "function add(a, b) { return a + b; }";
        const featuresValid = extractFeatures(codeValid);
        expect(missingReturn.detect(featuresValid)).toBe(false);
    });

    test("Off By One", () => {
        const code = "for (let i=0; i <= arr.length; i++) {}";
        const features = extractFeatures(code);
        expect(offByOne.detect(features)).toBe(true);

        const codeValid = "for (let i=0; i < arr.length; i++) {}";
        const featuresValid = extractFeatures(codeValid);
        expect(offByOne.detect(featuresValid)).toBe(false);
    });

    test("Conditional Reasoning", () => {
        const code = "if (x = 5) {}";
        const features = extractFeatures(code);
        expect(conditionalReasoning.detect(features)).toBe(true);

        const code2 = "if (x == true) {}";
        const features2 = extractFeatures(code2);
        expect(conditionalReasoning.detect(features2)).toBe(true);
    });

    test("Array Method Misuse", () => {
        const code = "arr.map(x => { console.log(x); })"; // No return, result not accepted
        const features = extractFeatures(code);
        expect(arrayMethodMisuse.detect(features)).toBe(true);

        const codeValid = "const x = arr.map(x => x * 2);";
        const featuresValid = extractFeatures(codeValid);
        expect(arrayMethodMisuse.detect(featuresValid)).toBe(false);
    });

    test("State Mutation", () => {
        const code = "arr.sort();";
        const features = extractFeatures(code);
        expect(stateMutation.detect(features)).toBe(true);

        const code2 = "arr.push(1);"; // push is ignored in my current strict rule? 
        // Wait, my rule was: sort, reverse, splice.
        const features2 = extractFeatures(code2);
        expect(stateMutation.detect(features2)).toBe(false); // push is deemed safe/fundamental

        const code3 = "arr.splice(1, 1);";
        const features3 = extractFeatures(code3);
        expect(stateMutation.detect(features3)).toBe(true);
    });

    test("Async Misuse", () => {
        const code = "for(let item of items) { await process(item); }";
        const features = extractFeatures(code);
        expect(asyncMisuse.detect(features)).toBe(true);
    });

    test("Execution Order", () => {
        const code = "for(let i=0; i<3; i++) { function inner() {} }";
        const features = extractFeatures(code);
        expect(executionOrder.detect(features)).toBe(true);
    });

    test("Trial and Error", () => {
        const context = {
            previousSubmissions: [
                { createdAt: new Date(Date.now() - 1000) }, // 1 sec ago
                { createdAt: new Date(Date.now() - 3000) }, // 3 sec ago
                { createdAt: new Date(Date.now() - 100000) }
            ]
        };
        // 3 recent submissions within 1 sec of each other?
        // My logic: 1 vs 2 (<60s), 2 vs 3 (<60s).
        // 1s diff, 2s diff.
        // rapidCount = 2.
        expect(trialAndError.detect({}, context)).toBe(true);
    });
});
