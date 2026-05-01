# Chat Summary (living context)

Use this as the **first reference** when starting a new chat in this repo.

## Frontend — UX/UI fixes shipped

- **Mobile navbar**: ensured **Sign In** is visible on small screens and in the drawer (`client-frontend/src/components/Navbar.tsx`).
- **Auth pages footer cleanup**: removed Privacy/Terms/Support link row; centered copyright
  - `client-frontend/src/pages/Login.tsx`
  - `client-frontend/src/pages/Signup.tsx`
  - `client-frontend/src/pages/ForgotPassword.tsx`
- **Forgot password / reset flow UI**: improved card layout; centered lock icon; “Send Code” copy; confirm-password eye toggle
  - `client-frontend/src/pages/ForgotPassword.tsx`
  - `client-frontend/src/pages/VerifyResetCode.tsx`
  - `client-frontend/src/pages/ResetPassword.tsx`
- **Scroll position bug on navigation**: fixed “new page opens mid-scroll” by resetting scroll on route change
  - `client-frontend/src/components/ScrollToTop.tsx`
  - wired in `client-frontend/src/App.tsx`

## Frontend — premium motion / scroll reveal

- Introduced smooth on-scroll reveals (respects `prefers-reduced-motion`)
  - `client-frontend/src/components/ScrollReveal.tsx`
  - app motion wrapper: `LazyMotion` in `client-frontend/src/App.tsx`
- Applied `ScrollReveal` across pages/sections (major content blocks across the site).
- **Freshness hero small/medium UI**: reduced “100% Organic Harvest” block dominance and constrained image sizing for mobile/tablet
  - `client-frontend/src/pages/Freshness.tsx`

## Shop hero carousel + Home testimonials (premium loop motion)

- **Shop page hero carousel redesign**: CTA moved to **top-right** (opposite copy), improved subtitle color/legibility, premium glass CTA, smoother transitions, and auto-loop
  - `client-frontend/src/components/HeroCarousel.tsx`
- **Home “Customer Love”**: wrapped in a premium framed container and tuned springs for a smoother, more premium feel
  - `client-frontend/src/pages/Home.tsx`

## Password reset flow (backend + client wiring)

### Client
- Auth store calls backend endpoints and stores reset token between steps
  - `client-frontend/src/store/auth.ts`
  - `client-frontend/src/lib/password-reset.ts` (sessionStorage token key)
- Route added: `/verify-reset-code` in `client-frontend/src/App.tsx`

### Backend (Express + Mongo under `backend/`)
- Added password reset fields to user model and implemented endpoints:
  - `backend/models/user.model.js` (reset hash + expiry)
  - `backend/utils/generateToken.js` (`typ: "pwd_reset"` token)
  - `backend/controllers/auth.controller.js` (`forgotPassword`, `verifyResetCode`, `resetPassword`)
  - `backend/routes/auth.routes.js` (POST `/forgot-password`, `/verify-reset-code`, `/reset-password`)
- **Dev test code**: `424242` allowed **only if user exists** (for testing).

## Testing / stability

- Jest integration tests adjusted for mongodb-memory-server download slowness (increased timeouts).
- Orders test product fixture updated to match schema (name/slug/collection/price/weights).

