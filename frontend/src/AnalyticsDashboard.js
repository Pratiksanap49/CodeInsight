import { useState, useEffect } from "react";
import { getAnalytics, getQuestions } from "./api";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAnalytics(), getQuestions()])
      .then(([analyticsData, questionsData]) => {
        setData(analyticsData);
        setQuestions(questionsData); // Questions now have isSolved property from backend
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}><div className="loading-spinner"></div></div>;

  if (!data) return <div style={{ padding: "2rem", color: "var(--text-secondary)" }}>No data available. Solve some problems first!</div>;

  // Calculate stats
  const totalQuestions = questions.length;
  // Check isSolved property if available (backend route updated earlier)
  const solvedCount = questions.filter(q => q.isSolved).length;
  const progressPercent = totalQuestions > 0 ? (solvedCount / totalQuestions) * 100 : 0;

  // Prepare chart data
  const misconceptionEntries = Object.entries(data.misconceptionFrequency || {}).sort((a, b) => b[1] - a[1]);
  const maxFreq = Math.max(...misconceptionEntries.map(e => e[1]), 1);

  return (
    <div className="animate-fade-in" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>

        {/* Progress Card */}
        <div className="glass-card">
          <h3 style={{ margin: "0 0 1rem", color: "var(--text-secondary)", fontSize: "0.9rem", textTransform: "uppercase" }}>Mastery Progress</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--success)" }}>{solvedCount}</span>
            <span style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "8px" }}>/ {totalQuestions} Solved</span>
          </div>
          <div style={{ marginTop: "1rem", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "var(--success)", transition: "width 1s ease-out" }}></div>
          </div>
        </div>

        {/* Total Misconceptions Detected */}
        <div className="glass-card">
          <h3 style={{ margin: "0 0 1rem", color: "var(--text-secondary)", fontSize: "0.9rem", textTransform: "uppercase" }}>Issues Detected</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--warning)" }}>
              {Object.values(data.misconceptionFrequency || {}).reduce((a, b) => a + b, 0)}
            </span>
            <span style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "8px" }}>Total Patterns</span>
          </div>
        </div>

      </div>

      {/* Main Analysis Area */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>

        {/* Chart Section */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ marginTop: 0 }}>Misconception Frequency</h3>
          {misconceptionEntries.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>No data yet. Good job!</p>
          ) : (
            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {misconceptionEntries.map(([key, val]) => (
                <div key={key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
                    <span style={{ textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</span>
                    <span style={{ color: "var(--text-secondary)" }}>{val} times</span>
                  </div>
                  <div style={{ height: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", overflow: "hidden" }}>
                    <div style={{
                      width: `${(val / maxFreq) * 100}%`,
                      height: "100%",
                      background: "linear-gradient(to right, var(--accent-primary), var(--accent-secondary))",
                      borderRadius: "6px",
                      transition: "width 0.5s ease-out"
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations / Insights */}
        <div className="glass-card">
          <h3 style={{ marginTop: 0, color: "var(--accent-primary)" }}>AI Insights</h3>
          <p style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>
            Based on your recent activity:
          </p>
          <ul style={{ paddingLeft: "1.2rem", color: "var(--text-primary)", lineHeight: "1.5" }}>
            {misconceptionEntries.length === 0 && <li>You are demonstrating strong fundamentals! Keep solving problems.</li>}
            {misconceptionEntries.slice(0, 2).map(([key]) => (
              <li key={key} style={{ marginBottom: "0.5rem" }}>
                Review <strong>{key.replace(/_/g, " ")}</strong> concepts. This pattern appears frequently in your code.
              </li>
            ))}
            {progressPercent < 50 && <li style={{ marginTop: "1rem" }}>Try solving more easy problems to build momentum.</li>}
          </ul>
        </div>

      </div>
    </div>
  );
}
