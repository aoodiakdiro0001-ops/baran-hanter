import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useI18n } from "../context/I18nContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const CAT_SLUGS = [
  "electronics",
  "computers",
  "home",
  "fashion",
  "beauty",
  "sports",
  "books",
  "toys",
  "automotive",
  "pets",
  "office",
  "baby",
  "garden",
  "tools",
  "health",
];

export default function Layout() {
  const { t, lang, langs, setLang } = useI18n();
  const { user } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    const query = q.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <Link className="logo" to="/">
            <span className="logo-mark">BH</span>
            <span className="full">{t("brand")}</span>
          </Link>
          <form className="search" onSubmit={onSearch} role="search">
            <label className="sr-only" htmlFor="q" style={{ position: "absolute", left: -9999 }}>
              {t("search_placeholder")}
            </label>
            <input
              id="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("search_placeholder")}
            />
            <button type="submit">{t("search_btn")}</button>
          </form>
          <div className="header-actions">
            <label className="sr-only" htmlFor="lang" style={{ position: "absolute", left: -9999 }}>
              {t("lang_label")}
            </label>
            <select
              id="lang"
              className="lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label={t("lang_label")}
            >
              {langs.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <NavLink className="text-btn" to="/deals">
              {t("nav_deals")}
            </NavLink>
            <NavLink className="icon-btn" to="/cart" aria-label={t("nav_cart")}>
              {t("nav_cart")}
              {count > 0 ? <span className="badge">{count}</span> : null}
            </NavLink>
            {user ? (
              <NavLink className="text-btn" to="/account">
                {t("nav_account")}
              </NavLink>
            ) : (
              <NavLink className="primary-btn" to="/login">
                {t("nav_login")}
              </NavLink>
            )}
            {user?.role === "admin" ? (
              <NavLink className="ghost-btn" to="/admin">
                {t("nav_admin")}
              </NavLink>
            ) : null}
          </div>
        </div>
        <nav className="cats" aria-label={t("page_category")}>
          {CAT_SLUGS.map((slug) => (
            <NavLink key={slug} to={`/c/${slug}`}>
              {t(`cat_${slug}`)}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <span>{t("footer_affiliate")}</span>
          <Link to="/about">{t("nav_about")}</Link>
          <span>{t("footer_rights")}</span>
        </div>
      </footer>
    </div>
  );
}
