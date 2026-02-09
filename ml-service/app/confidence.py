def compute_confidence(misconception_id: str, features: dict) -> float:
    """
    Heuristic-based confidence scoring for misconceptions.
    In a real ML system, this would infer from a model.
    Here we use rule-based heuristics based on attempt count and feature patterns.
    """
    
    attempts = features.get("attemptNumber", 1)
    base_confidence = 0.5

    # 1. Missing Return
    # If the rule detected it, it's pretty binary, but we can increase confidence if they have many lines but no return.
    if misconception_id == "missing_return":
        # If it's a long function (many lines) without return, we are more confident it's an error vs a void utility.
        # But we don't have line count in simpler features easily, assuming the detector already filtered void-likes.
        return 0.85

    # 2. Trial and Error
    # Strongly tailored by attempt pattern
    if misconception_id == "trial_and_error":
        # detector checked rapid submission.
        # If attempts are high, we are very confident.
        if attempts > 3:
            return 0.95
        return 0.70

    # 3. Off By One
    # Usually very specific syntax signatures -> high confidence
    if misconception_id == "off_by_one":
        return 0.90

    # 4. State Mutation
    # Usage of .sort() or .reverse() is definite, but IS it a misconception? 
    # Only if the problem didn't ask for it. 
    # Without problem context, we assume it's risky for beginners.
    if misconception_id == "state_mutation":
        return 0.75

    # 5. Conditional Reasoning
    # Assignment in conditional is almost always a bug.
    if misconception_id == "conditional_reasoning":
        return 0.95

    # 6. Async Misuse
    # Await in loop is structurally definitive.
    if misconception_id == "async_misuse":
        return 0.90

    # 7. Array Method Misuse
    # Map without return is definitive failure of usage.
    if misconception_id == "array_method_misuse":
        return 0.88
        
    # 8. Execution Order
    # Function in loop. Common pattern.
    if misconception_id == "execution_order":
        return 0.80

    return base_confidence
