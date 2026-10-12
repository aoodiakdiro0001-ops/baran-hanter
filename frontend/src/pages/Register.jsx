import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useI18n } from "../context/I18nContext.jsx";

export default function Register() {
  const { t } = useI18n();
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setSession(data.token, data.user);
      navigate("/account");
    } catch (err) {
      setError(err.code === "email_taken" ? t("email_taken") : t("auth_error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page-shell auth-card">
      <h1>{t("page_register")}</h1>
      <form className="form" onSubmit={onSubmit}>
        <label>
          {t("name")}
          <input required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
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
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-btn" disabled={busy} type="submit">
          {t("register_btn")}
        </button>
      </form>
      <p className="muted">
        {t("has_account")} <Link to="/login">{t("nav_login")}</Link>
      </p>
    </section>
  );
}
