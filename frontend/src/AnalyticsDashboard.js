import { useState, useEffect } from "react";
import { getAnalytics, getQuestions } from "./api";

const INSIGHT_MAPPING = {
  "missing_return": "You may be treating functions as procedures (sequences of steps) rather than mathematical mappings that produce values. Focus on the concept of 'return values'.",
  "off_by_one": "You are struggling with loop boundary conditions. This often indicates confusion between 0-based indexing and length-based counting.",
  "conditional_reasoning": "There is some confusion between assignment (=) and equality checks (===). This is a fundamental syntax distinction.",
  "array_method_misuse": "You are applying array methods like map/filter but ignoring their return values, suggesting a misunderstanding of functional immutability.",
  "state_mutation": "You tend to modify data in place (mutation) rather than creating new states. Modern React/JS patterns favor immutability.",
  "async_misuse": "You are applying synchronous logic to asynchronous operations, likely blocking execution loops.",
  "execution_order": "You have some misunderstandings about JavaScript scope and closure, particularly with `var` vs `let` in loops.",
  "trial_and_error": "High-frequency submissions suggest you are guessing rather than simulating execution in your head."
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAnalytics(), getQuestions()])
      .then(([analyticsData, questionsData]) => {
        setData(analyticsData);
        setQuestions(questionsData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}><div className="loading-spinner"></div></div>;

  if (!data) return <div style={{ padding: "2rem" }}>No data available.</div>;

  const totalQuestions = questions.length;
  const solvedCount = questions.filter(q => q.isSolved).length;
  const progressPercent = totalQuestions > 0 ? (solvedCount / totalQuestions) * 100 : 0;

  // PRIMARY MISCONCEPTION (Top of the sorted profile)
  // Ensure profile exists, fallback to empty array if old backend
  const profile = data.misconceptionProfile || [];
  const primaryIssue = profile.length > 0 ? profile[0] : null;

  return (
    <div className="animate-fade-in" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* 1. TOP LEVEL DIAGNOSTIC STORY */}
      <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Diagnostic Report</h2>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>

        {/* Main Issue Card */}
        <div className="glass-card" style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: primaryIssue ? (primaryIssue.status === 'Resolved' ? 'var(--success)' : 'var(--warning)') : 'var(--accent-primary)' }}></div>

          <h3 style={{ marginTop: 0, color: "var(--text-secondary)", fontSize: "0.9rem", textTransform: "uppercase" }}>Primary Misconception</h3>

          {primaryIssue ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                <h2 style={{ margin: 0, fontSize: "2rem", color: "var(--text-primary)" }}>
                  {primaryIssue.id.replace(/_/g, " ")}
                </h2>
                <span style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background: primaryIssue.status === 'Resolved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: primaryIssue.status === 'Resolved' ? 'var(--success)' : 'var(--warning)',
                  fontWeight: "bold",
                  fontSize: "0.9rem"
                }}>
                  {primaryIssue.status.toUpperCase()}
                </span>
              </div>

              <div style={{ marginTop: "1.5rem", display: "flex", gap: "2rem" }}>
                <div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Diagnosis Confidence</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--accent-primary)" }}>
                    {(primaryIssue.avgConfidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Frequency</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    {primaryIssue.count} detections
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px", fontStyle: "italic", color: "#e2e8f0" }}>
                "{INSIGHT_MAPPING[primaryIssue.id] || "This pattern appears frequently in your code."}"
              </div>
            </div>
          ) : (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
              <span style={{ fontSize: "2rem" }}>✨</span>
              <p>No major misconceptions detected yet. Great usage of standard patterns!</p>
            </div>
          )}
        </div>

        {/* Strengths & Mastery */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="glass-card" style={{ flex: 1 }}>
            <h3 style={{ marginTop: 0, color: "var(--text-secondary)", fontSize: "0.9rem", textTransform: "uppercase" }}>Mastery</h3>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--success)", margin: "0.5rem 0" }}>
              {solvedCount} <span style={{ fontSize: "1rem", color: "var(--text-secondary)", fontWeight: "normal" }}>/ {totalQuestions} Solved</span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${progressPercent}%`, height: "100%", background: "var(--success)" }}></div>
            </div>
          </div>

          <div className="glass-card" style={{ flex: 1 }}>
            <h3 style={{ marginTop: 0, color: "var(--text-secondary)", fontSize: "0.9rem", textTransform: "uppercase" }}>Observed Strengths</h3>
            <ul style={{ paddingLeft: "1.2rem", margin: "0.5rem 0 0", fontSize: "0.9rem", color: "#e2e8f0", lineHeight: "1.6" }}>
              {profile.length < 3 ? (
                <li><strong>Clean Code:</strong> You rarely trigger multiple fallacy patterns.</li>
              ) : (
                <li><strong>Persistence:</strong> You are actively engaging with difficult concepts.</li>
              )}
              {!profile.find(p => p.id === 'trial_and_error') && (
                <li><strong>Deliberate Strategy:</strong> Low trial-and-error indicates you plan before coding.</li>
              )}
            </ul>
          </div>
        </div>

      </div>

      {/* 2. MISCONCEPTION PROFILE DETAIL */}
      {profile.length > 0 && (
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Misconception Profile</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--text-primary)" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--glass-border)", textAlign: "left" }}>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Pattern</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Status</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Confidence</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Frequency</th>
                  <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {profile.map((p, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "1rem", textTransform: "capitalize", fontWeight: "500" }}>{p.id.replace(/_/g, " ")}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{
                        fontSize: "0.8rem",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background: p.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: p.status === 'Resolved' ? 'var(--success)' : 'var(--warning)'
                      }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "60px", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                          <div style={{ width: `${p.avgConfidence * 100}%`, height: "100%", background: "var(--accent-secondary)" }}></div>
                        </div>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{(p.avgConfidence * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>{p.count}</td>
                    <td style={{ padding: "1rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                      {p.status === 'Resolved' ? 'Improving' : 'Persistent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
