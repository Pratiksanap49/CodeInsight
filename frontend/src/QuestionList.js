import { useEffect, useState } from "react";
import { getQuestions } from "./api";

export default function QuestionList({ onSelect }) {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getQuestions()
      .then(setQuestions)
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem" }}>Select a Diagnostic Module</h2>
      <div className="question-list">
        {questions.map(q => (
          <div key={q._id} className="question-card">
            <h3 style={{ marginTop: 0 }}>{q.title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{q.prompt}</p>
            <button onClick={() => onSelect(q)}>
              Start Diagnostic
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
