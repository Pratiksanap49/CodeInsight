import { detectReturnLogic } from "./returnLogic.rule.js";
import { detectOffByOne } from "./offByOne.rule.js";

export function runRules(features) {
  const results = [];

  const r1 = detectReturnLogic(features);
  if (r1) results.push(r1);

  const r2 = detectOffByOne(features);
  if (r2) results.push(r2);

  return results;
}
