## What

Replace localStorage JWT auth with Cookie-based sessions (V7 23.1).

## Breaking Change

Auth no longer uses localStorage `cc_token`/`cc_uid`. All token state is now server-managed via HttpOnly Cookie.

## Changes

- Remove all localStorage.getItem/setItem for tokens
- Remove client-side JWT parsing (parseJwtPayload, isTokenValid)
- Use `credentials: 'include'` for automatic Cookie sending
- Resolve session via `GET /api/v1/auth/me` on app mount
- CSRF token fetched from `GET /api/v1/auth/csrf`, stored in memory only
- Write requests include `X-CSRF-Token` header
- login/register/logout call server endpoints; Cookie set/cleared by server
- Backward compat: `JwtAuthProvider`/`useJwtAuth` re-exported as aliases

## Verified

- tsc --noEmit: 0 errors
- pytest tests/: 9 passed
- vitest run: 12 passed

## V7 refs

23.1 (no localStorage token), 12.1 (CSRF flow), 12.2 (auth API contract)
