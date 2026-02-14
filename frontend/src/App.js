import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import QuestionList from "./QuestionList";
import QuestionAttempt from "./QuestionAttempt";
import AnalyticsDashboard from "./AnalyticsDashboard";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import "./App.css";

function AppContent() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stored = sessionStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  function handleLogin() {
    setToken(sessionStorage.getItem("token"));
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }

  // Header Logic
  const hideHeaderRoutes = ["/login", "/signup"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="App">
      {shouldShowHeader && (
        <header className="glass-panel" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          padding: "1rem 2rem",
          borderRadius: "16px"
        }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "white" }}>
            <span style={{ fontSize: "1.5rem" }}>🧠</span>
            <h1 style={{ fontSize: "1.5rem", margin: 0, textDecoration: "none" }}>CodeInsight</h1>
          </Link>

          <div style={{ display: "flex", gap: "1rem" }}>
            {token ? (
              <>
                <button className="btn-secondary" onClick={() => navigate("/questions")}>
                  💻 Problems
                </button>
                <button className="btn-secondary" onClick={() => navigate("/analytics")}>
                  📊 Analytics
                </button>
                <button className="btn-secondary" onClick={handleLogout} style={{ borderColor: 'rgba(239, 68, 68, 0.5)', color: '#fca5a5' }}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button className="btn-secondary" onClick={() => navigate("/login")}>
                  Login
                </button>
                <button className="btn-primary" onClick={() => navigate("/signup")}>
                  Register
                </button>
              </>
            )}
          </div>
        </header>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Register />} />

        {/* Protected Routes - simple check, could be a wrapper */}
        <Route path="/questions" element={token ? <QuestionList /> : <Login onLogin={handleLogin} />} />
        <Route path="/questions/:id" element={token ? <QuestionAttempt /> : <Login onLogin={handleLogin} />} />
        <Route path="/analytics" element={token ? <AnalyticsDashboard /> : <Login onLogin={handleLogin} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
