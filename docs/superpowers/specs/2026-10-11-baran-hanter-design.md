# Baran Hanter — Design Spec

Date: 2026-10-11
Status: Phase 1 — Structure and plan only. No implementation until approved.

## 1. Product

Baran Hanter is a full affiliate shopping platform.

- Curated catalog covering Amazon-style departments
- Competitive display prices vs compare-at
- User accounts, saved cart, order records
- Purchase completes on Amazon via affiliate search/product links
- Admin dashboard for catalog, users, orders, deals
- 10 languages, RTL for Arabic, language from browser with manual switch

Brand: Baran Hanter  
Tone: Vibrant, modern, professional marketplace

## 2. Stack

| Layer | Choice | Port |
| --- | --- | --- |
| Frontend | Vite + React + React Router | 5173 (preview entry) |
| Backend | Express (ESM) | 3001 |
| Database | SQLite via sql.js | file `backend/data/store.db` |
| Auth | JWT + bcryptjs | Authorization Bearer |
| Proxy | Vite `server.proxy['/api']` → `http://localhost:3001` | |
| i18n | Local JSON dictionaries | ar en fr es de tr pt zh ja ru |

Preview environment exposes one port. Frontend is the public entry. API calls use `/api`.

## 3. Repository layout

```
/workspace
  backend/
    package.json
    src/
      index.js          HTTP server
      db.js             SQLite init + helpers
      auth.js           JWT middleware
      seed.js           Catalog + admin seed
      routes/
        auth.js
        products.js
        orders.js
        admin.js
    data/               created at runtime
  frontend/
    package.json
    vite.config.js      proxy /api, allowedHosts
    index.html
    src/
      main.jsx
      App.jsx
      styles/global.css
      i18n/translations.js
      context/AuthContext.jsx
      context/CartContext.jsx
      context/I18nContext.jsx
      components/       Header, Footer, ProductCard, ...
      pages/            Home, Category, Product, Search, Deals,
                        Cart, Auth, Account, About, Admin
    public/
  docs/superpowers/specs/
  start.sh              starts backend then frontend
```

## 4. Data model

### users
id, name, email unique, password_hash, role (`user` | `admin`), created_at

### categories
id, slug unique, name_key, icon, sort_order

### products
id, sku unique, category_id, title, brand, description, image, price, compare_at, rating, reviews, stock_hint, amazon_query, featured, deal, created_at

### orders
id, user_id, status (`pending` | `redirected` | `cancelled`), total, currency, created_at

### order_items
id, order_id, product_id, title, qty, unit_price, amazon_url

Default admin (seeded):
- email: `admin@baranhanter.com`
- password: `Admin123!`

## 5. API

All JSON. Auth header: `Authorization: Bearer <token>`

### Public
- `GET /api/health`
- `GET /api/categories`
- `GET /api/products?q=&category=&deal=&featured=&sort=&page=&limit=`
- `GET /api/products/:id`
- `GET /api/deals`

### Auth
- `POST /api/auth/register` { name, email, password }
- `POST /api/auth/login` { email, password }
- `GET /api/auth/me` (auth)

### User
- `GET /api/orders` (auth)
- `POST /api/orders` (auth) { items: [{ productId, qty }] }
- `POST /api/orders/:id/redirect` (auth) marks redirected, returns amazon URLs

### Admin (role=admin)
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/orders`
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `PATCH /api/admin/products/:id/deal`

Affiliate URL pattern:
`https://www.amazon.com/s?k={encodedQuery}&tag=baranhanter-20`

Legal note in UI: payment and shipping happen on Amazon. Baran Hanter is an affiliate gateway, not Amazon.

## 6. Frontend pages

Store
- Home: hero search, category grid, featured, daily deals, trust strip
- Category /c/:slug
- Product /p/:id — gallery, price vs compare-at, specs, Buy on Amazon, Add to cart
- Search /search?q=
- Deals /deals
- Cart /cart — qty, totals, checkout requires login
- Auth /login /register
- Account /account — profile + order history
- About /about — affiliate disclosure

Admin (guarded)
- /admin overview stats
- /admin/products CRUD-lite
- /admin/orders
- /admin/users

Checkout flow
1. Browse / search
2. Cart or buy now
3. Login/register if needed
4. Create local order
5. Redirect each item to Amazon affiliate URL
6. Order status becomes `redirected`

## 7. Visual system

Mode: dark vibrant marketplace

| Token | Value |
| --- | --- |
| Background | `#070B14` |
| Surface | `#101827` |
| Primary / cyan | `#00E5C3` |
| Accent / orange | `#FF6B2C` |
| Violet | `#7C5CFF` |
| Text | `#F4F7FB` |
| Muted | `#8B97AB` |
| Heading font | Rubik |
| Body font | Nunito Sans |

Glass cards, dense product grid, neon deal badges, SVG icons only (no emoji icons), 44px touch targets, RTL when `ar`.

Languages: ar, en, fr, es, de, tr, pt, zh, ja, ru. Detect `navigator.language`, persist in localStorage.

## 8. Catalog seed (later phase)

15 departments, 180+ products:
electronics, computers, home, fashion, beauty, sports, books, toys, automotive, pets, office, baby, garden, tools, health

Each product: brand, two prices, rating, image (picsum or similar), amazon_query.

## 9. Out of scope

- Real Amazon Product Advertising API keys
- Real payments on this site
- Inventory sync with Amazon
- Email/SMS
- Native mobile apps

## 10. Build phases (incremental)

Do not start a phase until the previous one is confirmed.

| Phase | Deliverable | Done when |
| --- | --- | --- |
| 1 | This spec + step list | You approve |
| 2 | Backend skeleton: package.json, db.js, tables, seed admin only | `node` boots, `/api/health` works |
| 3 | Catalog seed + public product APIs | categories/products/deals return data |
| 4 | Auth + orders APIs | register/login/me/orders work |
| 5 | Admin APIs | stats/users/orders/product mutate |
| 6 | Frontend shell: Vite, proxy, i18n, layout, router | empty pages render in 10 langs |
| 7 | Store pages: home, category, product, search, deals, cart | browse + cart locally |
| 8 | Auth + account + checkout redirect | full buyer flow |
| 9 | Admin UI | dashboard usable |
| 10 | start.sh, proxy check, preview deploy | one URL serves the app |

After Phase 10: how to run, default accounts, test checklist.
