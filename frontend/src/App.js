import { useState, useEffect } from "react";
import QuestionList from "./QuestionList";
import QuestionAttempt from "./QuestionAttempt";
import AnalyticsDashboard from "./AnalyticsDashboard";
import Login from "./Login";
import Register from "./Register";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [view, setView] = useState("questions"); // questions | attempt | analytics
  const [authView, setAuthView] = useState("login"); // login | register

  useEffect(() => {
    // Check if token exists on mount
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setView("questions");
    setSelectedQuestion(null);
  }

  if (!token) {
    return (
      <div className="App">
        <h1>CodeInsight</h1>
        {authView === "login" ? (
          <Login
            onLogin={() => setToken(localStorage.getItem("token"))}
            onSwitchToRegister={() => setAuthView("register")}
          />
        ) : (
          <Register
            onRegisterSuccess={() => setAuthView("login")}
            onSwitchToLogin={() => setAuthView("login")}
          />
        )}
      </div>
    );
  }

  if (view === "analytics") {
    return (
      <div>
        <header>
          <button onClick={() => setView("questions")}>Back to Questions</button>
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
        </header>
        <AnalyticsDashboard />
      </div>
    );
  }

  if (selectedQuestion) {
    return (
      <div>
        <header>
          <button
            onClick={() => {
              setSelectedQuestion(null);
              setView("questions");
            }}
          >
            Back
          </button>
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
        </header>

        <QuestionAttempt question={selectedQuestion} />
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1>CodeInsight Dashboard</h1>
        <button onClick={() => setView("analytics")}>
          View Analytics
        </button>
        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
      </header>
      <QuestionList
        onSelect={q => {
          setSelectedQuestion(q);
          setView("attempt");
        }}
      />
    </div>
  );
}

export default App;
