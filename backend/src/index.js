import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import { init } from "./db.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 3001;
const app = express();

app.use(cors());
app.use(express.json());

const store = await init();
app.locals.store = store;

app.get("/api/health", (_req, res) => {
  const users = store.get("SELECT COUNT(*) AS n FROM users");
  const products = store.get("SELECT COUNT(*) AS n FROM products");
  const categories = store.get("SELECT COUNT(*) AS n FROM categories");
  res.json({
    ok: true,
    name: "Baran Hanter API",
    db: "ready",
    adminSeeded: users.n > 0,
    categories: categories.n,
    products: products.n,
  });
});

app.use("/api", productRoutes);
app.use("/api", authRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminRoutes);

const dist = path.join(__dirname, "public");
app.use(express.static(dist));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "not_found" });
  }
  res.sendFile(path.join(dist, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Baran Hanter API on ${PORT}`);
});
