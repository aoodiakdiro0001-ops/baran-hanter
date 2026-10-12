import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import initSqlJs from "sql.js";
import bcrypt from "bcryptjs";
import { seedCatalog } from "./seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "store.db");

let db;

function persist() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const bytes = db.export();
  fs.writeFileSync(dbPath, Buffer.from(bytes));
}

function exec(sql) {
  db.run(sql);
}

function run(sql, params = [], { save = true } = {}) {
  db.run(sql, params);
  const inserted = get("SELECT last_insert_rowid() AS id");
  if (save) persist();
  return inserted ? inserted.id : null;
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function get(sql, params = []) {
  return all(sql, params)[0] || null;
}

function lastId() {
  const row = get("SELECT last_insert_rowid() AS id");
  return row ? row.id : null;
}

async function init() {
  const SQL = await initSqlJs();
  if (fs.existsSync(dbPath)) {
    db = new SQL.Database(fs.readFileSync(dbPath));
  } else {
    db = new SQL.Database();
  }

  exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name_key TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'grid',
      sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT NOT NULL UNIQUE,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      brand TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      price REAL NOT NULL,
      compare_at REAL NOT NULL,
      rating REAL NOT NULL DEFAULT 4.5,
      reviews INTEGER NOT NULL DEFAULT 0,
      stock_hint TEXT NOT NULL DEFAULT 'in_stock',
      amazon_query TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      deal INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      total REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      qty INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      amazon_url TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  const admin = get("SELECT id FROM users WHERE email = ?", [
    "admin@baranhanter.com",
  ]);
  if (!admin) {
    const password_hash = bcrypt.hashSync("Admin123!", 10);
    run(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      ["Baran Admin", "admin@baranhanter.com", password_hash, "admin"]
    );
  } else {
    persist();
  }

  seedCatalog({ run: (sql, params) => run(sql, params, { save: false }), all, get });
  persist();

  return { db, persist, run, all, get, lastId };
}

export { init };
