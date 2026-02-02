import { useState } from "react";
import { submitCode } from "./api";

export default function QuestionAttempt({ question }) {
  const [code, setCode] = useState(question.starterCode || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);

    const response = await submitCode({
      questionId: question._id,
      code,
      timeSpent: 0
    });

    setResult(response);
    setLoading(false);
  }

  return (
    <div>
      <h2>{question.prompt}</h2>

      <textarea
        rows={10}
        cols={60}
        value={code}
        onChange={e => setCode(e.target.value)}
      />

      <br />
      <button onClick={handleSubmit} disabled={loading}>
        Submit
      </button>

      {result && (
        <div>
          <h3>Diagnostic Result</h3>
          <ul>
            {result.detectedMisconceptions.map(m => (
              <li key={m.id}>
                <strong>{m.id}</strong>: {m.evidence}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
