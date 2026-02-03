import { useState } from "react";
import QuestionList from "./QuestionList";
import QuestionAttempt from "./QuestionAttempt";
import AnalyticsDashboard from "./AnalyticsDashboard";

function App() {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [view, setView] = useState("questions"); // questions | attempt | analytics

  if (view === "analytics") {
    return (
      <div>
        <button onClick={() => setView("questions")}>Back</button>
        <AnalyticsDashboard />
      </div>
    );
  }

  if (!selectedQuestion) {
    return (
      <div>
        <button onClick={() => setView("analytics")}>
          View Analytics
        </button>
        <QuestionList
          onSelect={q => {
            setSelectedQuestion(q);
            setView("attempt");
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => {
          setSelectedQuestion(null);
          setView("questions");
        }}
      >
        Back
      </button>

      <QuestionAttempt question={selectedQuestion} />
    </div>
  );
}

export default App;
