import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getQuestions } from "./api";

export default function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuestions()
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <div className="loading-spinner" style={{ width: "40px", height: "40px" }}></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h2>Diagnostic Challenges</h2>
          <p style={{ color: "var(--text-secondary)" }}>Select a problem to analyze your coding patterns.</p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem"
        }}>
          {questions.map((q, i) => (
            <Link
              to={`/questions/${q._id}`}
              key={q._id}
              className="glass-card"
              style={{
                cursor: "pointer",
                position: "relative",
                textDecoration: "none",
                color: "inherit",
                display: "block"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <span style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)"
                }}>
                  Problem #{i + 1}
                </span>
                {q.isSolved && (
                  <span style={{
                    background: "rgba(16, 185, 129, 0.2)",
                    color: "var(--success)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: "bold"
                  }}>
                    SOLVED
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{q.title}</h3>
              <p style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginBottom: "1.5rem",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}>
                {q.prompt}
              </p>

              <div
                className="btn-secondary"
                style={{ width: "100%", textAlign: "center", boxSizing: "border-box" }}
              >
                {q.isSolved ? "Review Solution" : "Start Challenge"}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
