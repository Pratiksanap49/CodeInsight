def compute_confidence(misconception_id: str, features: dict) -> float:
    """
    Deterministic placeholder logic.
    Replaced by real ML later.
    """

    if misconception_id == "missing_return":
        return 0.85

    if misconception_id == "trial_and_error":
        attempts = features.get("attemptNumber", 1)
        return min(0.9, 0.4 + attempts * 0.1)

    return 0.5
