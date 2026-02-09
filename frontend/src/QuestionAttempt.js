import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// We need to implement the API call logic. Assuming api.js exists and has submitCode.
// But we need to update it to match the backend endpoint.
const API_URL = "http://localhost:5000/api";

async function submitCodeApi(data) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to submit");
  return res.json();
}

async function fetchQuestion(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/questions/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch question");
  return res.json();
}

const MISCONCEPTION_DETAILS = {
  "missing_return": {
    "title": "Missing Return Statement",
    "desc": "The function calculates a value but doesn't return it to the caller.",
    "fix": "Ensure the function ends with a `return` keyword followed by the result.",
    "example": "function sum(a,b) { \n  return a + b; // Correct \n}"
  },
  "off_by_one": {
    "title": "Off-By-One Error",
    "desc": "The loop iterates one too many or one too few times.",
    "fix": "Check your loop condition. Use `< length` for zero-indexed arrays, not `<= length`.",
    "example": "for (let i=0; i < arr.length; i++) { ... }"
  },
  "conditional_reasoning": {
    "title": "Incorrect Check",
    "desc": "You might be using assignment `=` instead of comparison `===` in an `if` statement.",
    "fix": "Use `===` to compare values.",
    "example": "if (x === 5) { ... }"
  },
  "array_method_misuse": {
    "title": "Array Method Issue",
    "desc": "You are using an array method like `map` or `filter` incorrectly (e.g., ignoring the return value).",
    "fix": "Assign the result of `map/filter` to a variable, or use `forEach` if you don't need a new array.",
    "example": "const doubled = arr.map(x => x * 2);"
  },
  "state_mutation": {
    "title": "Unexpected Mutation",
    "desc": "You are modifying the original array directly (e.g., with `sort` or `splice`), which can cause side effects.",
    "fix": "Create a copy before modifying, e.g., `[...arr].sort(...)`.",
    "example": "const sorted = [...arr].sort();"
  },
  "async_misuse": {
    "title": "Async/Await Issue",
    "desc": "You might be using `await` inside a loop, which runs requests sequentially instead of in parallel.",
    "fix": "Use `Promise.all` to run multiple async tasks concurrently.",
    "example": "await Promise.all(urls.map(fetch));"
  },
  "execution_order": {
    "title": "Scope & Closure Issue",
    "desc": "Defining functions inside loops (especially with `var`) can lead to unexpected behavior.",
    "fix": "Use `let` instead of `var`, or move the function outside the loop.",
    "example": "for (let i=0; i<n; i++) { ... }"
  },
  "trial_and_error": {
    "title": "Trial & Error Pattern",
    "desc": "It seems you are guessing the solution by making rapid changes.",
    "fix": "Take a moment to plan your logic before coding.",
    "example": "Write pseudo-code first!"
  }
};

export default function QuestionAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestion(id)
      .then(data => {
        setQuestion(data);
        setCode(data.starterCode || "");
      })
      .catch(err => setError(err.message));
  }, [id]);

  async function handleSubmit() {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await submitCodeApi({
        questionId: question._id,
        code,
        timeSpent: 120 // Placeholder for now
      });
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (error) return <div style={{ padding: "2rem", color: "var(--error)" }}>Error: {error}</div>;
  if (!question) return <div style={{ padding: "2rem", color: "var(--text-secondary)" }}>Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: "2rem", height: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="btn-secondary" onClick={() => navigate("/questions")}>← Back</button>
        <h2 style={{ margin: 0 }}>{question.title}</h2>
        <div style={{ width: "80px" }}></div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", flex: 1 }}>
        {/* Left Column: Prompt & Editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>
          <div className="glass-card" style={{ maxHeight: "200px", overflowY: "auto", flexShrink: 0 }}>
            <h3 style={{ marginTop: 0, color: "var(--accent-primary)", fontSize: "1.1rem" }}>Problem Description</h3>
            <p style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>{question.prompt}</p>
          </div>

          <div className="glass-card" style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", minHeight: "400px" }}>
            <div style={{ padding: "0.5rem 1rem", borderBottom: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.3)", fontSize: "0.9rem", color: "var(--text-secondary)", display: "flex", justifyContent: "space-between" }}>
              <span>JavaScript Editor</span>
              <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>main.js</span>
            </div>
            <textarea
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: "#e2e8f0",
                fontFamily: "'Fira Code', 'Consolas', monospace",
                fontSize: "1.1rem",
                padding: "1.5rem",
                resize: "none",
                outline: "none",
                lineHeight: 1.6
              }}
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck="false"
            />
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", padding: "1rem" }}>
            {loading ? <div className="loading-spinner"></div> : "▶ Run & Diagnose"}
          </button>
        </div>

        {/* Right Column: Analysis Results */}
        <div className="glass-panel" style={{ padding: "1.5rem", overflowY: "auto" }}>
          <h3 style={{ marginTop: 0, borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem" }}>
            Diagnostic Results
          </h3>

          {error && <div style={{ color: "var(--error)", padding: "1rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius-sm)" }}>{error}</div>}

          {!result && !loading && !error && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60%", opacity: 0.5 }}>
              <p>Ready to analyze your submission.</p>
            </div>
          )}

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60%" }}>
              <div className="loading-spinner" style={{ width: "48px", height: "48px" }}></div>
              <p style={{ marginTop: "1rem" }}>Analyzing structural patterns...</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Overall Outcome */}
              <div className="glass-card" style={{
                borderColor: result.outcome === 'solved' ? 'var(--success)' : 'var(--warning)',
                background: result.outcome === 'solved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "2rem" }}>{result.outcome === 'solved' ? '🎉' : '🤔'}</span>
                  <div>
                    <h4 style={{ margin: 0, color: result.outcome === 'solved' ? 'var(--success)' : 'var(--warning)', fontSize: "1.2rem" }}>
                      {result.outcome === 'solved' ? 'Challenge Solved!' : 'Needs Improvement'}
                    </h4>
                    <p style={{ margin: "0.25rem 0 0", opacity: 0.9 }}>
                      {result.outcome === 'solved' ? "Perfect! Your code passed all tests." : "Tests failed. Review the feedback below."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Execution Errors */}
              {(result.executionErrors.syntax.length > 0 || result.executionErrors.runtime.length > 0 || result.executionErrors.testFailures.length > 0) && (
                <div>
                  <h4 style={{ color: "var(--error)", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>⛔ Execution Issues</h4>

                  {result.executionErrors.syntax.map((err, i) => (
                    <div key={i} style={{ padding: "1rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius-sm)", marginBottom: "0.5rem", borderLeft: "4px solid var(--error)" }}>
                      <strong>Syntax Error:</strong>
                      <div style={{ fontFamily: "monospace", marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>{err}</div>
                    </div>
                  ))}

                  {result.executionErrors.runtime.map((err, i) => (
                    <div key={i} style={{ padding: "1rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius-sm)", marginBottom: "0.5rem", borderLeft: "4px solid var(--error)" }}>
                      <strong>Runtime Error:</strong>
                      <div style={{ fontFamily: "monospace", marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>{err}</div>
                    </div>
                  ))}

                  {result.executionErrors.testFailures.map((fail, i) => (
                    <div key={i} style={{ padding: "1rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius-sm)", marginBottom: "0.5rem", borderLeft: "4px solid var(--error)" }}>
                      <div style={{ fontWeight: "bold", color: "#fca5a5", marginBottom: "0.25rem" }}>Test Failed:</div>
                      <div style={{ fontFamily: "monospace", background: "rgba(0,0,0,0.3)", padding: "0.5rem", borderRadius: "4px" }}>{fail.test}</div>
                      <div style={{ marginTop: "0.5rem", color: "white" }}>{fail.error}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Misconceptions */}
              <div>
                <h4 style={{ color: "var(--accent-secondary)", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem", marginTop: "1rem" }}>💡 Learning Insights</h4>
                {result.detectedMisconceptions.length === 0 ? (
                  <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-secondary)", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)" }}>
                    No specific anti-patterns detected. Focus on fixing the test failures!
                  </div>
                ) : (
                  result.detectedMisconceptions.map((m, i) => {
                    const details = MISCONCEPTION_DETAILS[m.id] || { title: m.id, desc: m.evidence, fix: "Check your logic." };
                    return (
                      <div key={i} className="glass-card" style={{ marginBottom: "1rem", borderLeft: "4px solid var(--accent-secondary)", background: "rgba(139, 92, 246, 0.1)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <h3 style={{ margin: 0, color: "white", fontSize: "1.1rem" }}>
                            {details.title}
                          </h3>
                          {m.confidence && (
                            <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "12px", background: "rgba(0,0,0,0.3)", color: "var(--accent-secondary)" }}>
                              {Math.round(m.confidence * 100)}% Certainty
                            </span>
                          )}
                        </div>

                        <p style={{ margin: "0.75rem 0", color: "#e2e8f0" }}>{details.desc}</p>

                        <div style={{ background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "8px", marginTop: "1rem" }}>
                          <strong style={{ color: "var(--success)", display: "block", marginBottom: "0.5rem" }}>✓ How to fix:</strong>
                          {details.fix}
                          {details.example && (
                            <div style={{ marginTop: "0.5rem", fontFamily: "monospace", color: "#94a3b8", fontSize: "0.9rem" }}>
                              Example: {details.example}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
