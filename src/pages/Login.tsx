import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth/auth";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const success = login(username, password);
    if (success) {
      navigate("/stryktipset");
    } else {
      setError("Wrong username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Har du hittat hit?</h2>
        <p>Du är priviligerad om du kan logga in!</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
