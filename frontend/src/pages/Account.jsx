import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api, money } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useI18n } from "../context/I18nContext.jsx";

export default function Account() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) return;
    let live = true;
    api("/api/orders")
      .then((d) => live && setOrders(d.orders || []))
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div>
      <section className="page-shell">
        <h1>{t("page_account")}</h1>
        <p>
          {user.name} · {user.email}
        </p>
        <button className="ghost-btn" type="button" onClick={logout}>
          {t("logout")}
        </button>
      </section>
      <section className="block">
        <h2>{t("orders")}</h2>
        {error ? <p className="muted">{t("error")}</p> : null}
        {!orders.length ? <p className="muted">{t("empty")}</p> : null}
        <ul className="order-list">
          {orders.map((o) => (
            <li key={o.id} className="page-shell">
              <p>
                #{o.id} · {t(`status_${o.status}`)} · {money(o.total)}
              </p>
              <ul>
                {o.items.map((it) => (
                  <li key={it.id}>
                    {it.qty} × {it.title}{" "}
                    <a href={it.amazonUrl} target="_blank" rel="noreferrer">
                      {t("open_amazon")}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        {user.role === "admin" ? <Link to="/admin">{t("nav_admin")}</Link> : null}
      </section>
    </div>
  );
}
