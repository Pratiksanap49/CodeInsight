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
      <header className="glass-panel" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
        padding: "1rem 2rem",
        borderRadius: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🧠</span>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>CodeInsight</h1>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn-secondary" onClick={() => setView("analytics")}>
            📊 Analytics
          </button>
          <button className="btn-secondary" onClick={handleLogout} style={{ borderColor: 'rgba(239, 68, 68, 0.5)', color: '#fca5a5' }}>
            Log Out
          </button>
        </div>
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
