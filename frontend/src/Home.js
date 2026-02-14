import { Link } from "react-router-dom";

export default function Home() {
    const token = sessionStorage.getItem("token");

    return (
        <div className="animate-fade-in" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
            textAlign: "center",
            padding: "2rem"
        }}>

            <div className="glass-card" style={{ maxWidth: "800px", padding: "3rem" }}>
                <h1 style={{
                    fontSize: "3.5rem",
                    marginBottom: "1.5rem",
                    background: "linear-gradient(to right, #60a5fa, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>
                    Master Your Code Logic
                </h1>

                <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", marginBottom: "3rem", lineHeight: "1.6" }}>
                    CodeInsight isn't just another coding platform. We use advanced analysis to detect
                    <strong> hidden misconceptions</strong> in your thinking patterns. solving problems is
                    just the beginning — understanding <em>how</em> you solve them is the key to mastery.
                </p>

                <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
                    {token ? (
                        <Link to="/questions" className="btn-primary" style={{ textDecoration: "none", fontSize: "1.1rem" }}>
                            Continue Learning →
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="btn-primary" style={{ textDecoration: "none", fontSize: "1.1rem" }}>
                                Login to Start
                            </Link>
                            <Link to="/signup" className="btn-secondary" style={{ textDecoration: "none", fontSize: "1.1rem" }}>
                                Create Account
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div style={{ marginTop: "4rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", width: "100%", maxWidth: "1000px" }}>

                <div className="glass-card">
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</div>
                    <h3 style={{ color: "var(--accent-primary)" }}>Deep Diagnostics</h3>
                    <p style={{ color: "var(--text-secondary)" }}>Identify 8 specific cognitive traps like "Missing Return" or "State Mutation".</p>
                </div>

                <div className="glass-card">
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📈</div>
                    <h3 style={{ color: "var(--accent-secondary)" }}>Smart Analytics</h3>
                    <p style={{ color: "var(--text-secondary)" }}>Track your improvement over time with our narrative-driven dashboard.</p>
                </div>

                <div className="glass-card">
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚡</div>
                    <h3 style={{ color: "var(--success)" }}>Instant Feedback</h3>
                    <p style={{ color: "var(--text-secondary)" }}>Get real-time explanations and fix suggestions as you code.</p>
                </div>

            </div>

        </div>
    );
}
