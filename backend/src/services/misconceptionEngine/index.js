import missingReturn from "./rules/missingReturn.rule.js";
import offByOne from "./rules/offByOne.rule.js";
import conditionalReasoning from "./rules/conditionalReasoning.rule.js";
import arrayMethodMisuse from "./rules/arrayMethodMisuse.rule.js";
import stateMutation from "./rules/stateMutation.rule.js";
import asyncMisuse from "./rules/asyncMisuse.rule.js";
import executionOrder from "./rules/executionOrder.rule.js";
import trialAndError from "./rules/trialAndError.rule.js";

const RULES = [
  missingReturn,
  offByOne,
  conditionalReasoning,
  arrayMethodMisuse,
  stateMutation,
  asyncMisuse,
  executionOrder,
  trialAndError
];

export function detectMisconceptions(features, context = {}) {
  return RULES.filter(rule => rule.detect(features, context)).map(rule => ({
    id: rule.id,
    evidence: rule.evidence(features, context)
  }));
}
