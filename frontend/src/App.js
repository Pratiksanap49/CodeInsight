import { useState } from "react";
import QuestionList from "./QuestionList";
import QuestionAttempt from "./QuestionAttempt";

function App() {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  if (!selectedQuestion) {
    return <QuestionList onSelect={setSelectedQuestion} />;
  }

  return <QuestionAttempt question={selectedQuestion} />;
}

export default App;
