import { extractFeatures } from "../featureExtractor.js";

describe("featureExtractor", () => {
  test("detects missing return", () => {
    const code = "function f() {}";
    const features = extractFeatures(code);

    expect(features.hasReturn).toBe(false);
  });

  test("detects return statement", () => {
    const code = "function f() { return 1; }";
    const features = extractFeatures(code);

    expect(features.hasReturn).toBe(true);
  });
});
