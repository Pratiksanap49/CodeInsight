import { useState } from "react";
import { submitCode } from "./api";

export default function QuestionAttempt({ question }) {
  const [code, setCode] = useState(question.starterCode || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setResult(null);

    const response = await submitCode({
      questionId: question._id,
      code,
      timeSpent: 0
    });

    setResult(response);
    setLoading(false);
  }

  return (
    <div className="ide-container">
      <div className="editor-section">
        <h2>{question.prompt}</h2>
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck="false"
        />
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Analyzing..." : "Run Diagnostics"}
          </button>
        </div>
      </div>

      <div className="results-section">
        <h3>Diagnostic Report</h3>

        {!result && <p style={{ color: 'var(--text-secondary)' }}>Submit code to see analysis.</p>}

        {result && (
          <div>
            {/* Syntax/Runtime Errors */}
            {result.executionErrors && (
              <>
                {result.executionErrors.syntax.length > 0 && (
                  <div className="syntax-error">
                    <strong>Syntax Error:</strong>
                    {result.executionErrors.syntax.map((err, i) => <div key={i}>{err}</div>)}
                  </div>
                )}
                {/* We could show runtime/testFailures too if relevant, but syntax is main one for 'gibberish' */}
              </>
            )}

            {/* Misconceptions */}
            {result.detectedMisconceptions.length === 0 && !result.executionErrors?.syntax?.length ? (
              <p style={{ color: 'var(--success-color)' }}>No obvious misconceptions detected.</p>
            ) : (
              result.detectedMisconceptions.map(m => (
                <div key={m.id} className="misconception-card">
                  <div className="misconception-title">{m.id.replace(/_/g, " ").toUpperCase()}</div>
                  <div>{m.evidence}</div>
                  {m.confidence && <div style={{ fontSize: '0.8em', marginTop: '5px', opacity: 0.8 }}>Confidence: {(m.confidence * 100).toFixed(0)}%</div>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
