# API Catalog — Royal Orchard

This file lists **all APIs** the frontend will use and the backend must implement, **segregated by Client vs Admin** and **grouped by domain**.

Conventions:
- All responses are JSON.
- Auth: `Authorization: Bearer <accessToken>` unless using cookie-based sessions.
- Pagination: `page`, `limit`, optional filters per endpoint.
- Error shape: `{ "error": { "code": string, "message": string, "details"?: any } }`

---

## Backend services in this repo

- **`backend/`** (this implementation): base path is **`/api`** (e.g. `POST /api/auth/login`)
- **`backend/api/`** (older scaffold): base path is **`/api/v1`**

This document now tracks the **`backend/`** service as the production backend for the UI.

## Client APIs (Storefront)

### Client/Auth
- `POST /api/auth/register` **(implemented + tested)**
  - Create a customer account.
  - **Body**: `{ name, email, password }`
  - **Returns**: `{ token, user }`
- `POST /api/auth/login` **(implemented + tested)**
  - Login as customer/admin.
  - **Body**: `{ email, password }`
  - **Returns**: `{ token, user }`
- `GET /api/auth/me` **(implemented + tested)**
  - Get current user from JWT.
  - **Header**: `Authorization: Bearer <token>`
  - **Returns**: `{ user }`
- `POST /auth/refresh`
  - Rotate/refresh tokens.
- `POST /auth/logout`
  - Logout and invalidate refresh token.
- `POST /auth/password-reset/request`
  - Request password reset (email OTP/token).
- `POST /auth/password-reset/confirm`
  - Confirm reset with token + set new password.
- `GET /me`
  - Get current user profile. **(implemented, build ok)**
- `PATCH /me`
  - Update profile fields (name/phone). **(implemented, build ok)**

### Client/Addresses
- `GET /me/addresses` **(implemented, build ok)**
- `POST /me/addresses` **(implemented, build ok)**
- `PATCH /me/addresses/:addressId` **(implemented, build ok)**
- `DELETE /me/addresses/:addressId` **(implemented, build ok)**
- `POST /me/addresses/:addressId/default` **(implemented, build ok)**

### Client/Products
- `GET /api/products` **(implemented)**
  - List products
  - **Query**: `page`, `limit`, `active`, `collection`, `variety`
  - **Returns**: `{ page, limit, total, items }`
- `GET /api/products/:id` **(implemented)**
  - Product detail by id
  - **Returns**: `{ product }`
- `POST /api/products/:id/view` **(implemented)** — analytics: increment product views + daily bucket.
- `POST /api/products/:id/cart` **(implemented)** — analytics: increment cart counter (body `{ quantity?: number }`).

### Client/Users
- `GET /api/users/profile` **(implemented)**
  - Current user profile.
- `PUT /api/users/update` **(implemented)**
  - Update profile fields (name/phone/avatar/address).

### Client/Checkout
- `POST /checkout/quote`
  - Server-side totals calculation (subtotal/tax/shipping/discount/total).
- `POST /checkout/orders`
  - Create an order (guest or logged in), validate stock, store address snapshot and line items.
- `GET /checkout/orders/:orderId`
  - Get order for checkout UI (totals + payment status).

### Client/Payments
- `POST /payments/cod/confirm`
  - Confirm COD for an order (no gateway).
- `POST /payments/easypaisa/create-session`
  - Create a payment session/transaction and return redirect URL (or instructions).
- `POST /payments/jazzcash/create-session`
  - Create a payment session/transaction and return redirect URL (or instructions).
- `POST /payments/payfast/create-session`
  - Create a PayFast payment request and return redirect URL.

### Client/Orders
- `POST /api/orders` **(implemented + tested)**
  - Create order. **Reduces stock** and increments `totalSold`.
  - **Body**: `{ items: [{product, weight, quantity}], deliveryDetails, paymentMethod, pricing? }`
  - **Returns**: `{ order }`
- `GET /api/orders/my-orders` **(implemented)**
  - Paginated order list for current user.
- `GET /api/orders/:id` **(implemented)**
  - Order detail (owner or admin).
- `PUT /api/orders/:id/cancel` **(implemented + tested)**
  - Cancel only before Shipped; **restores stock**.
- `POST /api/orders/:id/return` **(implemented)**
  - Allowed only after Delivered (creates return request).
- `POST /orders/:orderId/confirm-received`
  - Confirm delivery receipt (optional; depends on fulfillment model).

---

## Admin APIs (Dashboard)

### Admin/Auth
- `POST /admin/auth/login`
- `POST /admin/auth/refresh`
- `POST /admin/auth/logout`
- `GET /admin/me`

### Admin/Products
- `POST /api/products` **(implemented)** (admin only)
- `PUT /api/products/:id` **(implemented)** (admin only)
- `DELETE /api/products/:id` **(implemented)** (admin only)

#### Admin/ProductVariants & Inventory
- `POST /admin/products/:productId/variants`
- `PATCH /admin/variants/:variantId`
- `DELETE /admin/variants/:variantId`
- `PATCH /admin/inventory/:variantId`
  - Adjust stock/reserved or set absolute stock.

### Admin/Orders
- `GET /api/orders` **(implemented)** (admin only)
  - filter by `status`, pagination via `page`/`limit`
- `PUT /api/orders/:id/status` **(implemented)** (admin only)
  - Valid forward transitions: Placed → Processing → Shipped → Delivered (sets `deliveredDate` on Delivered).
  - From **Delivered** → **Returned** is allowed with body `{ "status": "Returned", "returnReason": "damaged" | "wrong_item" | "quality_issue" | "other" }` (rolls back `totalSold` on line items).
- `GET /admin/orders/:orderId/payments`
- `POST /admin/orders/:orderId/refund` (optional)

### Admin/Customers
- `GET /admin/customers`
- `GET /admin/customers/:customerId`
- `GET /admin/customers/:customerId/orders`

### Admin/Analytics
- **Auth**: same as other admin tools — `x-admin-key: <ADMIN_API_KEY>` (see `backend` env `ADMIN_API_KEY` / admin `VITE_ADMIN_API_KEY`).
- `GET /api/analytics/dashboard` **(implemented, JWT admin)** — legacy summary.
- `GET /api/admin/analytics/dashboard` **(implemented)** — full BI bundle (sales, trending, upcoming, returns, inventory, seasonal, recommendations, hits, insights).
- `GET /api/admin/analytics/sales` — sales KPIs + daily line series + monthly bar series + order-status pie.
- `GET /api/admin/analytics/trending` — top 10 trending products (score from views, `totalSold`, cart adds).
- `GET /api/admin/analytics/upcoming-trending` — “potential trending” from `ProductDailyStat` week-over-week velocity.
- `GET /api/admin/analytics/returns` — return counts, rate, reasons, most-returned SKUs.
- `GET /api/admin/analytics/inventory` — out / critical / low stock buckets + runway estimates.
- `GET /api/admin/analytics/seasonal` — per-season stock vs trailing 30d sales.
- `GET /api/admin/analytics/recommendations` — rule-based stock / demand suggestion cards.
- `GET /api/admin/analytics/hits` — most viewed products + chart payload.
- `GET /api/admin/analytics/insights` — auto-generated business insight strings.

---

## Payment Provider Callbacks / Webhooks (backend-only)

These are not called by the SPA directly; they are called by payment providers.

- **EasyPaisa**
  - `POST /webhooks/easypaisa`
- **JazzCash**
  - `POST /webhooks/jazzcash`
- **PayFast** (ITN)
  - `POST /webhooks/payfast`

All webhook handlers must enforce:
- Signature verification (provider-specific)
- Timestamp tolerance (when supported)
- Idempotency (`WebhookEvent` unique by provider event id / reference)

