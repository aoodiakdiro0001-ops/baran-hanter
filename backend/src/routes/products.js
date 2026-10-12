import { Router } from "express";

const router = Router();

function mapProduct(row) {
  if (!row) return null;
  const discount = row.compare_at > 0
    ? Math.round((1 - row.price / row.compare_at) * 100)
    : 0;
  return {
    id: row.id,
    sku: row.sku,
    categoryId: row.category_id,
    categorySlug: row.category_slug || row.slug || null,
    categoryKey: row.name_key || null,
    title: row.title,
    brand: row.brand,
    description: row.description,
    image: row.image,
    price: row.price,
    compareAt: row.compare_at,
    discount,
    rating: row.rating,
    reviews: row.reviews,
    stockHint: row.stock_hint,
    amazonQuery: row.amazon_query,
    amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(row.amazon_query)}&tag=baranhanter-20`,
    featured: Boolean(row.featured),
    deal: Boolean(row.deal),
  };
}

const SELECT = `
  SELECT p.*, c.slug AS category_slug, c.name_key
  FROM products p
  JOIN categories c ON c.id = p.category_id
`;

router.get("/categories", (req, res) => {
  const { all } = req.app.locals.store;
  const rows = all(
    `SELECT c.*, COUNT(p.id) AS product_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id
     GROUP BY c.id
     ORDER BY c.sort_order ASC`
  );
  res.json({
    categories: rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      nameKey: r.name_key,
      icon: r.icon,
      sortOrder: r.sort_order,
      productCount: r.product_count,
    })),
  });
});

router.get("/deals", (req, res) => {
  const { all } = req.app.locals.store;
  const rows = all(`${SELECT} WHERE p.deal = 1 ORDER BY (p.compare_at - p.price) DESC LIMIT 48`);
  res.json({ products: rows.map(mapProduct) });
});

router.get("/products", (req, res) => {
  const { all, get } = req.app.locals.store;
  const q = String(req.query.q || "").trim();
  const category = String(req.query.category || "").trim();
  const deal = req.query.deal === "1" || req.query.deal === "true";
  const featured = req.query.featured === "1" || req.query.featured === "true";
  const sort = String(req.query.sort || "featured");
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(60, Math.max(1, Number(req.query.limit) || 24));
  const offset = (page - 1) * limit;

  const where = [];
  const params = [];

  if (q) {
    where.push("(p.title LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (category) {
    where.push("c.slug = ?");
    params.push(category);
  }
  if (deal) where.push("p.deal = 1");
  if (featured) where.push("p.featured = 1");

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const orderMap = {
    price_asc: "p.price ASC",
    price_desc: "p.price DESC",
    rating: "p.rating DESC, p.reviews DESC",
    newest: "p.id DESC",
    featured: "p.featured DESC, p.deal DESC, p.rating DESC",
  };
  const orderSql = orderMap[sort] || orderMap.featured;

  const totalRow = get(
    `SELECT COUNT(*) AS n FROM products p JOIN categories c ON c.id = p.category_id ${whereSql}`,
    params
  );
  const rows = all(
    `${SELECT} ${whereSql} ORDER BY ${orderSql} LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  res.json({
    page,
    limit,
    total: totalRow ? totalRow.n : 0,
    products: rows.map(mapProduct),
  });
});

router.get("/products/:id", (req, res) => {
  const { get, all } = req.app.locals.store;
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "invalid_id" });
  const row = get(`${SELECT} WHERE p.id = ?`, [id]);
  if (!row) return res.status(404).json({ error: "not_found" });
  const related = all(
    `${SELECT} WHERE p.category_id = ? AND p.id != ? ORDER BY p.rating DESC LIMIT 8`,
    [row.category_id, id]
  );
  res.json({ product: mapProduct(row), related: related.map(mapProduct) });
});

export default router;
