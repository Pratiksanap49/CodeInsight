import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./api"; // Ensure api.js exports register

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await register(email, password);
            // Auto-login or redirect to login. Let's redirect to login for simplicity
            navigate("/login");
        } catch (err) {
            setError("Registration failed (User may exist or weak password).");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
            <div className="glass-card animate-fade-in" style={{ width: "100%", maxWidth: "400px", background: "rgba(30, 41, 59, 0.8)" }}>
                <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--accent-secondary)" }}>Create Account</h2>

                {error && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--error)", padding: "0.75rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", textAlign: "center" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="student@example.com"
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "1rem", background: "linear-gradient(to right, var(--accent-secondary), #d946ef)" }}>
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "var(--accent-primary)", textDecoration: "underline" }}>
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
}
