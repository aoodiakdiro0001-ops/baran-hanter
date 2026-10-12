import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, money } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useI18n } from "../context/I18nContext.jsx";

export default function Cart() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { items, setQty, count, clear } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const subtotal = items.reduce((s, i) => s + (i.price || 0) * i.qty, 0);

  const checkout = async () => {
    if (!user) {
      navigate("/login", { state: { next: "/cart" } });
      return;
    }
    setBusy(true);
    setError("");
    try {
      const created = await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        }),
      });
      const redirected = await api(`/api/orders/${created.order.id}/redirect`, {
        method: "POST",
      });
      clear();
      const urls = redirected.amazonUrls || [];
      if (urls[0]) window.open(urls[0], "_blank", "noopener");
      navigate("/account");
    } catch {
      setError(t("error"));
    } finally {
      setBusy(false);
    }
  };

  if (!items.length) {
    return (
      <section className="page-shell">
        <h1>{t("page_cart")}</h1>
        <p className="muted">{t("cart_empty")}</p>
        <Link className="primary-btn" to="/">
          {t("cart_continue")}
        </Link>
      </section>
    );
  }

  return (
    <div className="cart-layout">
      <div>
        <h1>{t("page_cart")}</h1>
        <ul className="cart-list">
          {items.map((i) => (
            <li key={i.productId} className="cart-row">
              {i.image ? <img src={i.image} alt="" width="72" height="72" /> : null}
              <div>
                <Link to={`/p/${i.productId}`}>{i.title}</Link>
                <p className="muted">{money(i.price || 0)}</p>
              </div>
              <label>
                {t("qty")}
                <select
                  className="lang-select"
                  value={i.qty}
                  onChange={(e) => setQty(i.productId, Number(e.target.value))}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <aside className="page-shell">
        <p>
          {t("subtotal")} ({count})
        </p>
        <h2>{money(subtotal)}</h2>
        <p className="muted">{user ? t("checkout_hint") : t("need_login")}</p>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-btn full" type="button" disabled={busy} onClick={checkout}>
          {t("checkout")}
        </button>
      </aside>
    </div>
  );
}
