import { Router } from "express";
import { adminRequired } from "../auth.js";

const router = Router();

router.use(adminRequired);

function mapProduct(row) {
  return {
    id: row.id,
    sku: row.sku,
    categoryId: row.category_id,
    categorySlug: row.category_slug || null,
    title: row.title,
    brand: row.brand,
    description: row.description,
    image: row.image,
    price: row.price,
    compareAt: row.compare_at,
    rating: row.rating,
    reviews: row.reviews,
    stockHint: row.stock_hint,
    amazonQuery: row.amazon_query,
    featured: Boolean(row.featured),
    deal: Boolean(row.deal),
  };
}

router.get("/admin/stats", (req, res) => {
  const { get } = req.app.locals.store;
  const users = get("SELECT COUNT(*) AS n FROM users");
  const products = get("SELECT COUNT(*) AS n FROM products");
  const orders = get("SELECT COUNT(*) AS n FROM orders");
  const revenue = get("SELECT COALESCE(SUM(total), 0) AS n FROM orders WHERE status != 'cancelled'");
  const redirected = get("SELECT COUNT(*) AS n FROM orders WHERE status = 'redirected'");
  const pending = get("SELECT COUNT(*) AS n FROM orders WHERE status = 'pending'");
  const deals = get("SELECT COUNT(*) AS n FROM products WHERE deal = 1");
  res.json({
    users: users.n,
    products: products.n,
    orders: orders.n,
    revenue: revenue.n,
    redirected: redirected.n,
    pending: pending.n,
    deals: deals.n,
  });
});

router.get("/admin/users", (req, res) => {
  const { all } = req.app.locals.store;
  const rows = all(
    `SELECT u.id, u.name, u.email, u.role, u.created_at,
            COUNT(o.id) AS order_count,
            COALESCE(SUM(o.total), 0) AS order_total
     FROM users u
     LEFT JOIN orders o ON o.user_id = u.id
     GROUP BY u.id
     ORDER BY u.id DESC`
  );
  res.json({
    users: rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      createdAt: r.created_at,
      orderCount: r.order_count,
      orderTotal: r.order_total,
    })),
  });
});

router.get("/admin/orders", (req, res) => {
  const { all } = req.app.locals.store;
  const orders = all(
    `SELECT o.*, u.name AS user_name, u.email AS user_email
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ORDER BY o.id DESC`
  );
  const items = all("SELECT * FROM order_items");
  const byOrder = {};
  items.forEach((it) => {
    (byOrder[it.order_id] ||= []).push(it);
  });
  res.json({
    orders: orders.map((o) => ({
      id: o.id,
      userId: o.user_id,
      userName: o.user_name,
      userEmail: o.user_email,
      status: o.status,
      total: o.total,
      currency: o.currency,
      createdAt: o.created_at,
      items: (byOrder[o.id] || []).map((it) => ({
        id: it.id,
        productId: it.product_id,
        title: it.title,
        qty: it.qty,
        unitPrice: it.unit_price,
        amazonUrl: it.amazon_url,
      })),
    })),
  });
});

router.post("/admin/products", (req, res) => {
  const { get, run } = req.app.locals.store;
  const b = req.body || {};
  const title = String(b.title || "").trim();
  const brand = String(b.brand || "").trim();
  const sku = String(b.sku || "").trim();
  const categoryId = Number(b.categoryId);
  const price = Number(b.price);
  const compareAt = Number(b.compareAt || price);
  if (!title || !brand || !sku || !categoryId || !(price > 0)) {
    return res.status(400).json({ error: "invalid_product" });
  }
  const cat = get("SELECT id FROM categories WHERE id = ?", [categoryId]);
  if (!cat) return res.status(400).json({ error: "invalid_category" });
  const dup = get("SELECT id FROM products WHERE sku = ?", [sku]);
  if (dup) return res.status(409).json({ error: "sku_taken" });

  const id = run(
    `INSERT INTO products
      (sku, category_id, title, brand, description, image, price, compare_at, rating, reviews, stock_hint, amazon_query, featured, deal)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sku,
      categoryId,
      title,
      brand,
      String(b.description || `${brand} ${title}`),
      String(b.image || `https://picsum.photos/seed/${encodeURIComponent(sku)}/640/640`),
      price,
      compareAt,
      Number(b.rating || 4.5),
      Number(b.reviews || 0),
      String(b.stockHint || "in_stock"),
      String(b.amazonQuery || `${brand} ${title}`),
      b.featured ? 1 : 0,
      b.deal ? 1 : 0,
    ]
  );
  const row = get(
    `SELECT p.*, c.slug AS category_slug FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?`,
    [id]
  );
  res.status(201).json({ product: mapProduct(row) });
});

router.put("/admin/products/:id", (req, res) => {
  const { get, run } = req.app.locals.store;
  const id = Number(req.params.id);
  const existing = get("SELECT * FROM products WHERE id = ?", [id]);
  if (!existing) return res.status(404).json({ error: "not_found" });
  const b = req.body || {};
  const title = String(b.title ?? existing.title).trim();
  const brand = String(b.brand ?? existing.brand).trim();
  const price = Number(b.price ?? existing.price);
  const compareAt = Number(b.compareAt ?? existing.compare_at);
  const categoryId = Number(b.categoryId ?? existing.category_id);
  if (!title || !brand || !(price > 0)) {
    return res.status(400).json({ error: "invalid_product" });
  }
  run(
    `UPDATE products SET
      title = ?, brand = ?, description = ?, image = ?, price = ?, compare_at = ?,
      category_id = ?, rating = ?, reviews = ?, stock_hint = ?, amazon_query = ?,
      featured = ?, deal = ?
     WHERE id = ?`,
    [
      title,
      brand,
      String(b.description ?? existing.description),
      String(b.image ?? existing.image),
      price,
      compareAt,
      categoryId,
      Number(b.rating ?? existing.rating),
      Number(b.reviews ?? existing.reviews),
      String(b.stockHint ?? existing.stock_hint),
      String(b.amazonQuery ?? existing.amazon_query),
      (b.featured != null ? b.featured : existing.featured) ? 1 : 0,
      (b.deal != null ? b.deal : existing.deal) ? 1 : 0,
      id,
    ]
  );
  const row = get(
    `SELECT p.*, c.slug AS category_slug FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?`,
    [id]
  );
  res.json({ product: mapProduct(row) });
});

router.patch("/admin/products/:id/deal", (req, res) => {
  const { get, run } = req.app.locals.store;
  const id = Number(req.params.id);
  const existing = get("SELECT * FROM products WHERE id = ?", [id]);
  if (!existing) return res.status(404).json({ error: "not_found" });
  const deal = bDeal(req.body?.deal, existing.deal);
  run("UPDATE products SET deal = ? WHERE id = ?", [deal, id]);
  const row = get(
    `SELECT p.*, c.slug AS category_slug FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?`,
    [id]
  );
  res.json({ product: mapProduct(row) });
});

function bDeal(value, fallback) {
  if (value === undefined || value === null) return fallback ? 0 : 1;
  return value ? 1 : 0;
}

export default router;
