# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start       # Production server (node app.js)
npm run dev     # Development server with auto-reload (nodemon app.js)
```

No test suite exists in this project.

## Architecture

**Stack:** Node.js + Express + MongoDB (Mongoose) — plain JavaScript, no TypeScript.

**Entry point:** `app.js` — sets up Express middleware, mounts all routes, connects to MongoDB, and starts the server.

**Pattern:** MVC with a clear three-layer structure:

```
src/
  controllers/   # Business logic — one file per resource
  models/        # Mongoose schemas — validation, hooks, instance methods
  routes/        # Express routers — routes/index.js aggregates all sub-routers
  middlewares/   # Cross-cutting concerns (auth, error handling, file uploads)
  utils/         # Shared helpers (email, field whitelisting, file deletion)
  data/          # Static seed data (default categories, month references)
  views/         # Pug templates for transactional emails
```

**Resources:** User, Wallet, Transaction, Category — all mounted under `/api/<resource>`.

## Key Architectural Decisions

**Authentication:** JWT-based. The `src/middlewares/protect.js` middleware verifies tokens and attaches the user to `req.user`. All protected routes go through this middleware. Email verification via OTP is required on signup before a user can authenticate.

**Field whitelisting:** `src/utils/fields.js` exports allowed field lists per resource. Controllers use `_.pick(req.body, allowedFields)` to prevent mass-assignment attacks.

**Mongoose hooks:**
- Pre-save on User: bcrypt password hashing, OTP generation
- Pre-find on Transaction: auto-populates `category` and `wallet` fields
- Pre-remove on Wallet: cascades deletion to related transactions

**Email:** Dual-mode setup in `src/utils/emailService.js` — Mailtrap SMTP in development (`NODE_ENV !== 'production'`), Gmail via OAuth2 in production. Templates rendered with Pug from `src/views/`.

**File uploads:** Multer stores uploads in memory → Sharp resizes → saved to `public/avatars/`. The `src/middlewares/upload.js` and `src/middlewares/resize.js` middlewares are composed on avatar update routes.

**Error handling:** All async route handlers are wrapped with `express-async-handler`. A global error middleware in `src/middlewares/error.js` catches everything and sends consistent JSON responses.

## Environment Variables

Copy `example.env` to `.env`. Required variables:

| Variable | Purpose |
|---|---|
| `DATABASE_LOCAL` | Local MongoDB URI |
| `DATABASE` | Production MongoDB URI |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `90d`) |
| `MAILTRAP_HOST/PORT/USER/PASS` | Dev email via Mailtrap |
| `MAIL_USERNAME`, `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`, `OAUTH_PLAYGORUND` | Prod Gmail OAuth2 |
| `PORT` | Server port (defaults to 5000) |

## Data Relationships

- User → many Wallets, Transactions, Categories (all scoped by `user` field)
- Wallet → many Transactions (foreign key `wallet` on Transaction)
- Category → many Transactions (foreign key `category` on Transaction)
- Transactions carry `type` enum: `income` | `expense`
