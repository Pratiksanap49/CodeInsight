# CodeInsight Demo Guide

Use this script to demonstrate the "Diagnostic" nature of the platform.

## 1. Setup & Login
- Open the dashboard at `http://localhost:3000`.
- Register a demo user (e.g., `demo@example.com` / `password`).
- **Talking Point**: "The platform requires authentication to track student history for longitudinal analysis."

## 2. Scenario A: The "Off-By-One" Diagnosis
- Select the **"Sum of Array"** question.
- Enter the following code (contains an off-by-one error):
  ```javascript
  function sum(arr) {
    let total = 0;
    // ERROR: <= length causes off-by-one
    for (let i = 0; i <= arr.length; i++) {
      total += arr[i];
    }
    return total;
  }
  ```
- Click **"Run Diagnostics"**.
- **Observation**:
  - System flags **OFF_BY_ONE**.
  - **Talking Point**: "Notice the system doesn't say 'Change <= to <'. It identifies the *misconception* that the loop boundary is incorrect."

## 3. Scenario B: The "Missing Return" (Safety Check)
- Select **"Filter Evens"**.
- Enter code that calculates but doesn't return:
  ```javascript
  function filterEvens(arr) {
    const result = arr.filter(x => x % 2 === 0);
    // Missing return statement
  }
  ```
- Click **"Run Diagnostics"**.
- **Observation**:
  - System flags **MISSING_RETURN** (if rule is active/strict) or alerts on specific logic.
  - **Talking Point**: "The system detects structural missing logic."

## 4. Scenario C: Syntax Error Handling
- Enter gibberish logic:
  ```javascript
  function test() {
    print( "hello" 
  }
  ```
- Click **"Run Diagnostics"**.
- **Observation**:
  - The UI displays a **Syntax Error** warning.
  - No misconceptions are flagged.
  - **Talking Point**: "If the code is invalid, we cannot diagnose mental models. The system fails safely."

## 5. Analytics
- Navigate to **"View Analytics"**.
- Show the **Misconception Frequency** chart.
- **Talking Point**: "This view aggregates data across all attempts, allowing instructors to see class-wide patterns (e.g., 40% of students struggle with Off-By-One errors)."
