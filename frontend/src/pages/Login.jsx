import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useI18n } from "../context/I18nContext.jsx";

export default function Login() {
  const { t } = useI18n();
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const next = location.state?.next || "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSession(data.token, data.user);
      navigate(next);
    } catch {
      setError(t("auth_error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page-shell auth-card">
      <h1>{t("page_login")}</h1>
      <form className="form" onSubmit={onSubmit}>
        <label>
          {t("email")}
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          {t("password")}
          <input
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-btn" disabled={busy} type="submit">
          {t("login_btn")}
        </button>
      </form>
      <p className="muted">
        {t("no_account")} <Link to="/register">{t("nav_register")}</Link>
      </p>
    </section>
  );
}
