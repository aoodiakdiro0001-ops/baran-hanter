import { Router } from "express";
import bcrypt from "bcryptjs";
import { signToken, authRequired, publicUser } from "../auth.js";

const router = Router();

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/auth/register", (req, res) => {
  const { run, get } = req.app.locals.store;
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (name.length < 2) return res.status(400).json({ error: "invalid_name" });
  if (!validEmail(email)) return res.status(400).json({ error: "invalid_email" });
  if (password.length < 6) return res.status(400).json({ error: "invalid_password" });

  const existing = get("SELECT id FROM users WHERE email = ?", [email]);
  if (existing) return res.status(409).json({ error: "email_taken" });

  const password_hash = bcrypt.hashSync(password, 10);
  run(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, password_hash, "user"]
  );
  const user = get("SELECT * FROM users WHERE email = ?", [email]);
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post("/auth/login", (req, res) => {
  const { get } = req.app.locals.store;
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const user = get("SELECT * FROM users WHERE email = ?", [email]);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "invalid_credentials" });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get("/auth/me", authRequired, (req, res) => {
  const { get } = req.app.locals.store;
  const user = get("SELECT * FROM users WHERE id = ?", [req.user.id]);
  if (!user) return res.status(401).json({ error: "unauthorized" });
  res.json({ user: publicUser(user) });
});

export default router;
