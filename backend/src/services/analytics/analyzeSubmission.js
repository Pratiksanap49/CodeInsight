import { runRules } from "../rules/index.js";
import { getConfidence } from "../ml.client.js";

export async function analyzeSubmission(features) {
  // 1. Rule-based detection
  const ruleResults = runRules(features);

  if (ruleResults.length === 0) {
    return [];
  }

  // 2. ML confidence refinement (best-effort)
  const mlResults = await getConfidence(features, ruleResults);

  if (!mlResults) {
    return ruleResults;
  }

  // 3. Merge confidence (ML never adds/removes)
  return ruleResults.map(rule => {
    const refined = mlResults.find(m => m.id === rule.id);
    return {
      ...rule,
      confidence: refined?.confidence ?? rule.confidence
    };
  });
}

