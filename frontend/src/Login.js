import { useState } from "react";
import { login } from "./api";

export default function Login({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data = await login(email, password);
            localStorage.setItem("token", data.token);
            onLogin();
        } catch (err) {
            setError("Invalid credentials");
        }
    }

    return (
        <div className="auth-container">
            <h2>Login</h2>
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
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>
                No account?{" "}
                <button onClick={onSwitchToRegister}>Register here</button>
            </p>
        </div>
    );
}
