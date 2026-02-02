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
      <h2>Questions</h2>
      <ul>
        {questions.map(q => (
          <li key={q._id}>
            <button onClick={() => onSelect(q)}>
              {q.prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
