# Budgety Adventure — REST API

A personal finance REST API built with Node.js, Express, and MongoDB. Supports multi-wallet budget tracking, income/expense categorisation, OTP email verification, JWT authentication, and MongoDB aggregation-powered financial analytics.

## Features

- **JWT Authentication** — secure signup/login with bcrypt password hashing and configurable token expiry
- **OTP Email Verification** — 5-digit OTP delivered via Nodemailer (Mailtrap in dev, Gmail SMTP in prod); SHA-256 hashed before storage, expires in 10 minutes
- **Multi-wallet Support** — users manage multiple named wallets with icons, colours, and balance tracking; deleting a wallet cascades to all its transactions
- **Transaction Analytics** — MongoDB aggregation pipelines for monthly income/expense summaries and full annual stats grouped by month
- **Image Processing** — avatar uploads processed in-memory by Sharp before disk write
- **OpenAPI 3.0 Docs** — full Swagger UI at `/api-docs` covering all 18 endpoints with request/response schemas, JWT auth, and examples

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcrypt |
| Email | Nodemailer (Gmail SMTP / Mailtrap) |
| Email Templates | Pug |
| Image Processing | Sharp + Multer |
| Validation | Mongoose validators + validator.js |
| Utilities | Lodash, Moment.js |
| API Docs | swagger-jsdoc + swagger-ui-express |

## Project Structure

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
    ├── views/                    # Pug email templates
    ├── swagger/                  # swagger-jsdoc config and spec generation
    └── docs/                     # OpenAPI JSDoc annotations (one file per resource)
```

**Request lifecycle:** `Route → protect middleware → Controller → Model → Response`

**Error handling:** All async controllers are wrapped with `express-async-handler`. A global error middleware catches everything and returns consistent JSON.

**Security notes:**
- Passwords are never returned (Mongoose `select: false`)
- Request bodies are whitelisted with `_.pick()` before any DB write
- OTP codes are hashed before storage; only the raw code is sent by email

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
| GET | `/monthly-stats/year/:year/month/:month` | JWT | Monthly income/expense summary |
| GET | `/annual-stats/year/:year` | JWT | Full-year stats grouped by month |

### Categories — `/api/categories`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | JWT | List categories (filterable by `type`) |
| POST | `/` | JWT | Create category |
| GET | `/:id` | JWT | Get category with total transaction amount |
| PUT | `/:id` | JWT | Update category |
| DELETE | `/:id` | JWT | Delete category (cascades transactions) |
| GET | `/stats/year/:year/month/:month/type/:type` | JWT | Monthly category breakdown with percentages |

## API Documentation

Interactive docs are available via Swagger UI once the server is running at `http://localhost:5000/api-docs`.

To access protected endpoints:
1. Call `POST /api/users/login` and copy the returned `token`
2. Click **Authorize** in Swagger UI and paste the token
3. All JWT-protected endpoints unlock for the session

## Getting Started

**Prerequisites:** Node.js 14+, MongoDB (local or Atlas), a Mailtrap account for dev email testing.

```bash
git clone https://github.com/MrPhyaeSoneThwim/budgety-adventure-api.git
cd budgety-adventure-api
npm install
```

Copy the environment template and fill in your values:

```bash
cp example.env .env
```

Create the avatar upload directory:

```bash
mkdir -p public/avatars
```

Then start the server:

```bash
npm run dev   # development with auto-reload
npm start     # production
```

The server runs on port `5000` by default — override with the `PORT` env var.

## Environment Variables

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `DATABASE_LOCAL` | Local MongoDB URI |
| `DATABASE` | Production MongoDB URI |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `90d` |
| `MAILTRAP_HOST` | Mailtrap SMTP host (dev) |
| `MAILTRAP_PORT` | Mailtrap SMTP port (dev) |
| `MAILTRAP_USER` | Mailtrap username (dev) |
| `MAILTRAP_PASS` | Mailtrap password (dev) |
| `MAIL_USERNAME` | Gmail sender address (prod) |
| `MAIL_PASSWORD` | Gmail app password (prod) |

## Response Format

All endpoints return a consistent JSON envelope:

```json
{
  "status": "success | fail",
  "message": "Optional human-readable message",
  "data": {}
}
```
