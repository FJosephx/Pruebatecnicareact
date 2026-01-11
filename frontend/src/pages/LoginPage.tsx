import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { useAuth } from "../store/auth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciales invalidas");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h2 className="page__title">Ingresar</h2>
      <form className="auth-card" onSubmit={handleSubmit}>
        <label className="auth-card__field">
          Usuario
          <input
            className="input auth-card__input"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label className="auth-card__field">
          Contrasena
          <input
            className="input auth-card__input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          <FiLogIn /> {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
        {error && <p className="alert alert--error">Error: {error}</p>}
      </form>
    </section>
  );
};

export default LoginPage;
