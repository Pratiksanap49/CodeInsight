import pytest
from app.confidence import compute_confidence

def test_confidence_missing_return():
    conf = compute_confidence("missing_return", {})
    assert conf == 0.85

def test_confidence_trial_and_error_low_attempts():
    conf = compute_confidence("trial_and_error", {"attemptNumber": 1})
    assert conf == 0.70

def test_confidence_trial_and_error_high_attempts():
    conf = compute_confidence("trial_and_error", {"attemptNumber": 5})
    assert conf == 0.95

def test_confidence_off_by_one():
    conf = compute_confidence("off_by_one", {})
    assert conf == 0.90

def test_confidence_state_mutation():
    conf = compute_confidence("state_mutation", {})
    assert conf == 0.75

def test_confidence_conditional_reasoning():
    conf = compute_confidence("conditional_reasoning", {})
    assert conf == 0.95

def test_confidence_async_misuse():
    conf = compute_confidence("async_misuse", {})
    assert conf == 0.90

def test_confidence_array_method_misuse():
    conf = compute_confidence("array_method_misuse", {})
    assert conf == 0.88

def test_confidence_execution_order():
    conf = compute_confidence("execution_order", {})
    assert conf == 0.80

def test_confidence_unknown():
    conf = compute_confidence("unknown_misconception", {})
    assert conf == 0.5
