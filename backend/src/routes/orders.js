import { Router } from "express";
import { authRequired } from "../auth.js";

const router = Router();

function amazonUrl(query) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=baranhanter-20`;
}

function mapOrder(row, items = []) {
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    total: row.total,
    currency: row.currency,
    createdAt: row.created_at,
    items: items.map((it) => ({
      id: it.id,
      productId: it.product_id,
      title: it.title,
      qty: it.qty,
      unitPrice: it.unit_price,
      amazonUrl: it.amazon_url,
    })),
  };
}

router.get("/orders", authRequired, (req, res) => {
  const { all } = req.app.locals.store;
  const orders = all(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
    [req.user.id]
  );
  const items = all(
    `SELECT oi.* FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     WHERE o.user_id = ?`,
    [req.user.id]
  );
  const byOrder = {};
  items.forEach((it) => {
    (byOrder[it.order_id] ||= []).push(it);
  });
  res.json({ orders: orders.map((o) => mapOrder(o, byOrder[o.id] || [])) });
});

router.post("/orders", authRequired, (req, res) => {
  const { get, run, all } = req.app.locals.store;
  const raw = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!raw.length) return res.status(400).json({ error: "empty_cart" });

  const lines = [];
  for (const line of raw) {
    const productId = Number(line.productId);
    const qty = Math.max(1, Math.min(20, Number(line.qty) || 1));
    const product = get("SELECT * FROM products WHERE id = ?", [productId]);
    if (!product) return res.status(400).json({ error: "invalid_product", productId });
    lines.push({
      product,
      qty,
      unitPrice: product.price,
      amazonUrl: amazonUrl(product.amazon_query),
    });
  }

  const total = Number(
    lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0).toFixed(2)
  );

  const orderId = run(
    "INSERT INTO orders (user_id, status, total, currency) VALUES (?, ?, ?, ?)",
    [req.user.id, "pending", total, "USD"]
  );
  lines.forEach((l) => {
    run(
      "INSERT INTO order_items (order_id, product_id, title, qty, unit_price, amazon_url) VALUES (?, ?, ?, ?, ?, ?)",
      [orderId, l.product.id, l.product.title, l.qty, l.unitPrice, l.amazonUrl]
    );
  });

  const order = get("SELECT * FROM orders WHERE id = ?", [orderId]);
  const items = all("SELECT * FROM order_items WHERE order_id = ?", [orderId]);
  res.status(201).json({ order: mapOrder(order, items) });
});

router.post("/orders/:id/redirect", authRequired, (req, res) => {
  const { get, run, all } = req.app.locals.store;
  const id = Number(req.params.id);
  const order = get("SELECT * FROM orders WHERE id = ? AND user_id = ?", [
    id,
    req.user.id,
  ]);
  if (!order) return res.status(404).json({ error: "not_found" });
  if (order.status === "cancelled") {
    return res.status(400).json({ error: "cancelled" });
  }
  run("UPDATE orders SET status = ? WHERE id = ?", ["redirected", id]);
  const updated = get("SELECT * FROM orders WHERE id = ?", [id]);
  const items = all("SELECT * FROM order_items WHERE order_id = ?", [id]);
  res.json({
    order: mapOrder(updated, items),
    amazonUrls: items.map((it) => it.amazon_url),
  });
});

export default router;
