import { extractFeatures } from "./services/featureExtractor.js";
import { detectMisconceptions } from "./services/misconceptionEngine/index.js";

const result = detectMisconceptions(
  extractFeatures("function f(){}"),
  { attemptNumber: 1 }
);

console.log(result);
