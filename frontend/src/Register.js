import { useState } from "react";
import { register } from "./api";

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await register(email, password);
            // Auto switch to login or auto-login could be nice, but simple flow first
            onRegisterSuccess();
        } catch (err) {
            setError("Registration failed (User may exist)");
        }
    }

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>
                Already have an account?{" "}
                <button onClick={onSwitchToLogin}>Login here</button>
            </p>
        </div>
    );
}
