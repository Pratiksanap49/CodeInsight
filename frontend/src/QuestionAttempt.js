import { useState, useEffect } from "react";
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

export default function QuestionAttempt({ question, onBack }) {
  const [code, setCode] = useState(question.starterCode || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="animate-fade-in" style={{ padding: "2rem", height: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="btn-secondary" onClick={onBack}>← Back</button>
        <h2 style={{ margin: 0 }}>{question.title}</h2>
        <div style={{ width: "80px" }}></div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", flex: 1 }}>
        {/* Left Column: Prompt & Editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="glass-card">
            <h3 style={{ marginTop: 0, color: "var(--accent-primary)" }}>Problem Description</h3>
            <p style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>{question.prompt}</p>
          </div>

          <div className="glass-card" style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "0.5rem 1rem", borderBottom: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.3)", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              JavaScript Editor
            </div>
            <textarea
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: "#e2e8f0",
                fontFamily: "monospace",
                fontSize: "1rem",
                padding: "1rem",
                resize: "none",
                outline: "none",
                lineHeight: 1.5
              }}
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck="false"
            />
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
            {loading ? <div className="loading-spinner"></div> : "Run & Diagnose"}
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
                <h4 style={{ margin: 0, color: result.outcome === 'solved' ? 'var(--success)' : 'var(--warning)' }}>
                  {result.outcome === 'solved' ? '✅ SOLVED' : '⚠️ UNRESOLVED'}
                </h4>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem" }}>
                  {result.outcome === 'solved' ? "Great job! Your solution passed all tests validation." : "Tests failed or misconceptions detected."}
                </p>
              </div>

              {/* Execution Errors */}
              {(result.executionErrors.syntax.length > 0 || result.executionErrors.runtime.length > 0 || result.executionErrors.testFailures.length > 0) && (
                <div>
                  <h4 style={{ color: "var(--error)" }}>Execution Issues</h4>

                  {result.executionErrors.syntax.map((err, i) => (
                    <div key={i} style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius-sm)", marginBottom: "0.5rem", borderLeft: "4px solid var(--error)" }}>
                      <strong>Syntax Error:</strong> {err}
                    </div>
                  ))}

                  {result.executionErrors.runtime.map((err, i) => (
                    <div key={i} style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius-sm)", marginBottom: "0.5rem", borderLeft: "4px solid var(--error)" }}>
                      <strong>Runtime Error:</strong> {err}
                    </div>
                  ))}

                  {result.executionErrors.testFailures.map((fail, i) => (
                    <div key={i} style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius-sm)", marginBottom: "0.5rem", borderLeft: "4px solid var(--error)" }}>
                      <div style={{ fontSize: "0.85rem", opacity: 0.8, fontFamily: "monospace" }}>{fail.test}</div>
                      <div style={{ marginTop: "4px", fontWeight: "bold" }}>{fail.error}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Misconceptions */}
              <div>
                <h4 style={{ color: "var(--accent-secondary)" }}>Detected Patterns</h4>
                {result.detectedMisconceptions.length === 0 ? (
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>No specific misconception patterns identified.</p>
                ) : (
                  result.detectedMisconceptions.map((m, i) => (
                    <div key={i} className="glass-card" style={{ marginBottom: "1rem", borderLeft: "4px solid var(--accent-secondary)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h5 style={{ margin: 0, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em", color: "var(--accent-secondary)" }}>
                          {m.id.replace(/_/g, " ")}
                        </h5>
                        {m.confidence && (
                          <span style={{ fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.1)" }}>
                            {(m.confidence * 100).toFixed(0)}% Conf.
                          </span>
                        )}
                      </div>
                      <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem" }}>{m.evidence}</p>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
