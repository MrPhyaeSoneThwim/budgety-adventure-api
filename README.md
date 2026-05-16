# Budgety Adventure — REST API

A production-ready personal finance REST API built with Node.js, Express, and MongoDB. Handles multi-wallet budget tracking with income/expense categorisation, OTP-based email verification, JWT authentication, and MongoDB aggregation-powered financial analytics.

---

## Features

- **JWT Authentication** — secure signup/login with bcrypt password hashing (cost factor 12) and configurable token expiry
- **OTP Email Verification** — 5-digit OTP generated, SHA-256 hashed before storage, and delivered via Nodemailer (Mailtrap in dev, Gmail SMTP in prod); expires in 10 minutes
- **Multi-wallet Support** — users manage multiple named wallets with icons, colours, and balance tracking; deleting a wallet cascades to all its transactions
- **Transaction Analytics** — MongoDB aggregation pipelines power monthly income/expense summaries (with percentage breakdown and net difference) and full annual stats grouped by month
- **Image Processing Pipeline** — avatar uploads processed in-memory by Sharp before disk write; never touches disk in raw form
- **Dual Email Transport** — single `EmailService` class switches between Mailtrap (development) and Gmail SMTP with app-password auth (production) based on `NODE_ENV`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (`jsonwebtoken`) + bcrypt |
| Email | Nodemailer (Gmail SMTP / Mailtrap) |
| Email Templates | Pug |
| Image Processing | Sharp + Multer |
| Validation | Mongoose validators + validator.js |
| Utilities | Lodash, Moment.js |

---

## Architecture

```
budgety-adventure-api/
├── app.js                        # App bootstrap, middleware, DB connection
└── src/
    ├── controllers/              # Business logic (one file per resource)
    ├── models/                   # Mongoose schemas with hooks & methods
    ├── routes/                   # Express routers (index.js aggregates all)
    ├── middlewares/              # protect (JWT), error handler, upload, resize
    ├── utils/                    # emailService, field whitelisting, file utils
    ├── data/                     # Static seed data (categories, months)
    └── views/                    # Pug email templates
```

**Request lifecycle:** `Route → protect middleware (JWT verify) → Controller → Model → Response`

**Error handling:** All async controllers are wrapped with `express-async-handler`; a single global error middleware catches everything and returns consistent JSON.

**Security patterns:**
- Passwords are never returned (Mongoose `select: false`)
- Request bodies are whitelisted with `_.pick()` before any DB write to prevent mass-assignment
- OTP codes are hashed before storage; only the raw code is sent by email

---

## API Reference

### Authentication — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | — | Register new account |
| POST | `/verify-otp` | — | Verify email with OTP code |
| POST | `/resend-otp/:userId` | — | Resend OTP to email |
| POST | `/login` | — | Login, returns JWT |
| GET | `/get-me` | JWT | Get current user profile |
| PUT | `/update-me` | JWT | Update profile + avatar image |
| PUT | `/update-password` | JWT | Change password |

### Wallets — `/api/wallets`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | JWT | List all wallets |
| POST | `/` | JWT | Create wallet |
| GET | `/:id` | JWT | Get wallet |
| PUT | `/:id` | JWT | Update wallet |
| DELETE | `/:id` | JWT | Delete wallet (cascades transactions) |
| GET | `/get-stats/:walletId/type/:type` | JWT | Wallet income/expense stats |

### Transactions — `/api/transactions` · `/api/wallets/:walletId/transactions`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | JWT | List transactions (filterable by `status`, `createdAt`) |
| POST | `/` | JWT | Create transaction |
| GET | `/:id` | JWT | Get transaction |
| PUT | `/:id` | JWT | Update transaction |
| DELETE | `/:id` | JWT | Delete transaction |
| GET | `/monthly-stats/year/:year/month/:month` | JWT | Monthly income/expense summary with rates |
| GET | `/annual-stats/year/:year` | JWT | Full-year stats grouped by month |

### Categories — `/api/categories`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | JWT | List categories |
| POST | `/` | JWT | Create category |
| GET | `/:id` | JWT | Get category |
| PUT | `/:id` | JWT | Update category |
| DELETE | `/:id` | JWT | Delete category |

---

## Getting Started

### Prerequisites

- Node.js 14+
- MongoDB (local or Atlas)
- A Mailtrap account (for development email testing)

### Installation

```bash
git clone https://github.com/MrPhyaeSoneThwim/budgety-adventure-api.git
cd budgety-adventure-api
npm install
```

Copy the environment template and fill in the values:

```bash
cp example.env .env
```

Create the avatar directory:

```bash
mkdir -p public/avatars
```

### Environment Variables

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `DATABASE_LOCAL` | Local MongoDB URI |
| `DATABASE` | Production MongoDB URI |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | Token lifetime e.g. `90d` |
| `MAILTRAP_HOST` | Mailtrap SMTP host (dev) |
| `MAILTRAP_PORT` | Mailtrap SMTP port (dev) |
| `MAILTRAP_USER` | Mailtrap username (dev) |
| `MAILTRAP_PASS` | Mailtrap password (dev) |
| `MAIL_USERNAME` | Gmail sender address (prod) |
| `MAIL_PASSWORD` | Gmail app password (prod) |

### Running the server

```bash
npm run dev     # development — auto-reload via nodemon
npm start       # production
```

Server starts on port `5000` by default (override with `PORT` env var).

---

## Response Format

All endpoints return a consistent JSON envelope:

```json
{
  "status": "success" | "fail",
  "message": "Optional human-readable message",
  "data": {}
}
```
