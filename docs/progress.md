# Progress Tracker — Royal Orchard

This file is the **single source of truth** for delivery progress across frontend fixes, backend creation, payments, testing, and security hardening.

## Status legend
- **[x]** done
- **[~]** in progress
- **[ ]** pending
- **[!]** blocked/risk

## Milestones (high level)

- **[~] M0 — Docs foundation**
  - **[x]** Create `docs/plan.md`
  - **[x]** Create `docs/progress.md`
  - **[x]** Create `docs/api.md`

- **[~] M1 — Backend foundation (production-ready skeleton)**
  - **[~]** Backend app scaffold (`backend/api`, Express + TS)
  - **[x]** Remove NestJS/Prisma scaffold (replaced with Express + MongoDB)
  - **[~]** MongoDB (Mongoose) connection + env validation
  - **[~]** Structured logging + request IDs (pino + pino-http)
  - **[~]** Health checks (`/health`, `/api/v1/health`)

- **[~] M1b — Backend production implementation (`backend/`, Express + Mongo + JWT)**
  - **[x]** Scaffold `backend/` service in required modular structure
  - **[x]** Security baseline: `helmet`, `cors` allowlist, `hpp`, request size limits, rate limiting
  - **[x]** Mongo injection mitigation: strip `$` and `.` operator keys from write surfaces (body/params)
  - **[x]** JWT auth middleware + admin role guard
  - **[x]** Integration tests (Jest + Supertest + mongodb-memory-server)

- **[ ] M2 — Core schemas + migrations**
  - **[ ]** Users + Addresses
  - **[ ]** Products + Variants + Inventory
  - **[ ]** Orders + OrderItems
  - **[ ]** Payments + WebhookEvents
  - **[ ]** AuditLog

- **[ ] M3 — APIs (Client)**
  - **[ ]** Auth (register/login/refresh/logout)
  - **[ ]** Password reset (request + confirm)
  - **[ ]** Products (list/detail)
  - **[ ]** Profile + addresses
  - **[ ]** Orders (my orders)
  - **[ ]** Checkout (create order + totals quote)

- **[ ] M4 — APIs (Admin)**
  - **[ ]** Admin auth + RBAC enforcement
  - **[ ]** Products CRUD + inventory updates
  - **[ ]** Orders list/search/detail + status transitions
  - **[ ]** Customers list/detail
  - **[ ]** Analytics endpoints

- **[ ] M5 — Payments**
  - **[ ]** COD (server-side)
  - **[ ]** EasyPaisa integration (initiate + callback/webhook verify)
  - **[ ]** JazzCash integration (initiate + callback/webhook verify)
  - **[ ]** PayFast integration (initiate + ITN/webhook verify)
  - **[ ]** Idempotency + replay protection

- **[ ] M6 — Frontend integration (replace mocks)**
  - **[ ]** Replace `src/store/auth.ts` mock with API auth store
  - **[ ]** Replace product seed usage with API queries
  - **[ ]** Replace admin store with API-backed admin pages
  - **[ ]** Replace checkout `setTimeout` with API create order + payment session
  - **[ ]** Add success/failure return pages for gateways

- **[ ] M7 — Testing**
  - **[ ]** Backend unit tests (pricing, order transitions, webhook verification)
  - **[ ]** Backend integration tests (auth/products/checkout/webhooks)
  - **[ ]** Frontend tests for critical flows (smoke)
  - **[ ]** Optional E2E (Playwright) happy path

- **[ ] M8 — Security hardening**
  - **[ ]** Rate limiting (login/reset + general API)
  - **[ ]** Strong input validation + request size limits
  - **[ ]** Secure token strategy (refresh rotation; HttpOnly cookies preferred)
  - **[ ]** Webhook signature verification + timestamp tolerance
  - **[ ]** Admin audit logs
  - **[ ]** Final security checklist + threat review

## Frontend fix backlog (to audit and keep updated)

### Critical (must fix before production)
- **[ ]** Remove hard-coded admin credentials and plaintext passwords stored in localStorage (current `src/store/auth.ts` is demo-only).
- **[ ]** Checkout must not set `paid=true` without provider confirmation.
- **[ ]** Replace localStorage-admin data with server RBAC-protected admin APIs.
- **[ ]** Guest checkout must collect/store a real email (or implement phone-only guest flow); current `@guest.local` is placeholder.
- **[ ]** Admin routes must be protected by server RBAC; current `RequireAdmin` is client-only and bypassable.
- **[ ]** Ensure order status transitions are validated server-side (UI currently allows multiple transitions client-side).

### Important
- **[ ]** Add proper order line-items support (current UI uses summary string in orders).
- **[ ]** Add shipping calculation scaffolding (currently “FREE”).
- **[ ]** Add coupon/discount support (currently absent).
- **[ ]** Replace product images hotlinking with managed asset strategy (CDN/storage) and input validation for admin-entered URLs.
- **[ ]** Add admin export/report endpoints (UI has “Export” button placeholder on orders page).
- **[ ]** Add customer “new today” metric to real analytics (currently mocked as constant).

## Risks / open questions
- **[!] Payment gateway specifics**: exact EasyPaisa/JazzCash/PayFast products being used (merchant accounts, credentials, callback URLs, signature scheme) will dictate implementation details.
- **[!] Shipping**: whether you want zones/couriers/tracking now or later affects schema and admin flows.

## Implementation log

### 2026-04-26
- **Docs**: Added `docs/plan.md`, `docs/progress.md`, `docs/api.md`.
- **Backend**:
  - Removed previous `backend/api` NestJS/Prisma scaffold (stack changed to Express + MongoDB).
  - Initialized new `backend/api` Express backend with TypeScript + env validation (`zod`), Mongo connection (`mongoose`), logging (`pino`), security middleware (`helmet`, CORS allowlist, rate limiting), and health endpoints.
- **Schemas (MongoDB)**:
  - Added Mongoose models for `User`, `Address`, `Product` (with weight variants + stock), `Order` (items + embedded payment), and `WebhookEvent` (idempotency).
- **APIs (Client)**:
  - Implemented `POST /api/v1/auth/register`, `POST /api/v1/auth/login`.
  - Implemented `GET /api/v1/products` and `GET /api/v1/products/:slug`.
- **Security note**: MongoDB URI must be stored in `.env` (not committed). `.gitignore` updated to ignore `.env` files.

### 2026-04-27
- **Admin UI**:
  - Fixed missing admin icons by loading Material Symbols font in `admin/index.html` (icons previously rendered as plain text).
- **Backend (`backend/`)**:
  - Implemented production backend per requested structure with JWT auth (7d), bcrypt hashing, and modular routes:
    - Auth: register/login/me
    - Users: profile/update
    - Products: list/get + admin CRUD
    - Orders: create/my-orders/get/cancel/return + admin list/status update
    - Analytics: dashboard metrics endpoint
  - **Business rules**:
    - Order creation reduces stock + increments `totalSold` with atomic `$inc` checks.
    - Cancel allowed only before Shipped; restores stock.
    - Admin status transitions enforced: Placed → Processing → Shipped → Delivered.
  - **Tests**:
    - Added Jest integration tests for `register/login/me` and `order create/cancel stock restore` using in-memory MongoDB.

