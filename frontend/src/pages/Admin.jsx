import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api, money } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useI18n } from "../context/I18nContext.jsx";

export default function Admin() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    sku: "",
    title: "",
    brand: "",
    categoryId: 1,
    price: "",
    compareAt: "",
    deal: true,
  });

  const load = async () => {
    try {
      const [s, p, o, u, c] = await Promise.all([
        api("/api/admin/stats"),
        api("/api/products?limit=60&sort=newest"),
        api("/api/admin/orders"),
        api("/api/admin/users"),
        api("/api/categories"),
      ]);
      setStats(s);
      setProducts(p.products || []);
      setOrders(o.orders || []);
      setUsers(u.users || []);
      setCategories(c.categories || []);
      if (c.categories?.[0]) {
        setForm((f) => ({ ...f, categoryId: c.categories[0].id }));
      }
    } catch (err) {
      setError(err.status === 403 ? t("admin_forbidden") : t("error"));
    }
  };

  useEffect(() => {
    if (user?.role === "admin") load();
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") {
    return (
      <section className="page-shell">
        <h1>{t("page_admin")}</h1>
        <p>{t("admin_forbidden")}</p>
      </section>
    );
  }

  const createProduct = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          compareAt: Number(form.compareAt || form.price),
          categoryId: Number(form.categoryId),
        }),
      });
      setForm({
        sku: "",
        title: "",
        brand: "",
        categoryId: form.categoryId,
        price: "",
        compareAt: "",
        deal: true,
      });
      await load();
    } catch {
      setError(t("error"));
    }
  };

  const toggleDeal = async (p) => {
    await api(`/api/admin/products/${p.id}/deal`, {
      method: "PATCH",
      body: JSON.stringify({ deal: !p.deal }),
    });
    await load();
  };

  return (
    <div>
      <h1>{t("page_admin")}</h1>
      <div className="tabs">
        {[
          ["stats", t("admin_stats")],
          ["products", t("admin_products")],
          ["orders", t("admin_orders")],
          ["users", t("admin_users")],
        ].map(([id, label]) => (
          <button
            key={id}
            className={tab === id ? "primary-btn" : "ghost-btn"}
            type="button"
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {error ? <p className="form-error">{error}</p> : null}

      {tab === "stats" && stats ? (
        <div className="stats-grid">
          {["users", "products", "orders", "deals", "pending", "redirected"].map((k) => (
            <article key={k} className="page-shell">
              <p className="muted">{k}</p>
              <h2>{stats[k]}</h2>
            </article>
          ))}
          <article className="page-shell">
            <p className="muted">revenue</p>
            <h2>{money(stats.revenue)}</h2>
          </article>
        </div>
      ) : null}

      {tab === "products" ? (
        <div className="admin-split">
          <form className="page-shell form" onSubmit={createProduct}>
            <h2>{t("admin_add")}</h2>
            <label>
              {t("admin_sku")}
              <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </label>
            <label>
              {t("page_product")}
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label>
              {t("name")}
              <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </label>
            <label>
              {t("page_category")}
              <select
                className="lang-select"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {t(c.nameKey)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("admin_price")}
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </label>
            <label>
              {t("admin_compare")}
              <input
                type="number"
                min="1"
                step="0.01"
                value={form.compareAt}
                onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
              />
            </label>
            <button className="primary-btn" type="submit">
              {t("admin_save")}
            </button>
          </form>
          <div className="admin-table">
            {products.map((p) => (
              <div key={p.id} className="cart-row">
                <div>
                  <strong>{p.title}</strong>
                  <p className="muted">
                    {p.sku} · {money(p.price)}
                  </p>
                </div>
                <button className="ghost-btn" type="button" onClick={() => toggleDeal(p)}>
                  {p.deal ? t("admin_deal_off") : t("admin_deal_on")}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "orders" ? (
        <ul className="order-list">
          {orders.map((o) => (
            <li key={o.id} className="page-shell">
              <p>
                #{o.id} · {o.userName} · {t(`status_${o.status}`)} · {money(o.total)}
              </p>
              <p className="muted">{o.userEmail}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "users" ? (
        <ul className="order-list">
          {users.map((u) => (
            <li key={u.id} className="page-shell">
              <p>
                {u.name} · {u.email} · {u.role}
              </p>
              <p className="muted">
                {u.orderCount} {t("orders")} · {money(u.orderTotal)}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
