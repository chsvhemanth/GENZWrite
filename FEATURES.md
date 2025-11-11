## Zenz Write — Features Overview

This document summarizes all features currently implemented across the web app and the Node/Express backend, followed by gaps and recommended next steps.

---

## Implemented Features

### Branding and UI
- Zenz Write branding with logo and updated titles/meta.
- Responsive layout, modern UI using Tailwind + shadcn/ui components.
- Light/dark theme toggle.

### Authentication and Authorization
- Local email/password signup and login (backend).
- Google OAuth 2.0 login via Passport (backend).
- JWT cookie-based session (httpOnly, sameSite=lax) issued by backend.
- Client bootstraps session by fetching `/api/users/me` and falls back to mock if backend is offline.
- Logout clears session cookie.

### User Accounts
- Profile data model (name, email, bio, avatar).
- Settings page:
  - Edit name, email, and bio.
  - Change password (client-side flow; endpoint can be added).
  - Preferences toggles (email and push).
  - Avatar upload with preview and cropping; uploads to backend and persists URL.

### Posts and Editor
- Rich text editor (TipTap) with bold/italic, lists, block quotes, undo/redo, placeholder.
- Image attachment:
  - Toolbar button to upload image with client-side crop.
  - Upload to backend (`/api/uploads`) and auto-insert into the editor.
- Post model with author, tags, likes, comments, attachments (backend).
- Basic posts API:
  - `GET /api/posts` (list latest)
  - `POST /api/posts` (create; requires auth)

### Notifications
- Backend notifications model (like, comment, follow).
- REST endpoint to list notifications.
- SSE endpoint for realtime channel (currently sends heartbeats; ready for push).
- Client notifications page with:
  - Realtime connection open.
  - List UI, icons for types, relative time, “Mark all read”.
- Navbar bell with dynamic unread badge.

### Media and Uploads
- Backend uploads with `multer`.
- Static hosting for uploaded files at `/uploads/*`.
- Frontend handles upload for profile avatars and editor attachments.

### Frontend Foundation
- Vite + React + TypeScript + React Router.
- React Query installed and ready (QueryClientProvider).
- shadcn/ui kit wired and themed.
- Basic pages: Home, Explore, Post Detail, Profile, Notifications, Auth, Settings, Not Found.

### Developer Experience
- Monorepo layout (`/` for web, `/server` for API).
- TS configs for both frontend and backend.
- .gitignore at root and in server.
- README with setup steps and environment variables.
- MongoDB setup guide (`MONGODB_SETUP.md`).

---

## Partially Implemented or MVP-State Features

These work at a basic level and are designed to be extended.

- Notifications realtime: SSE channel is established; server currently emits heartbeats. Push events need to be published on actions (likes/comments/follows) to become fully realtime.
- Password change: UI exists on the Settings page; backend endpoint is not yet implemented to update `passwordHash`.
- Posts: List/create API is present; edit/delete, pagination, search, and detailed permissions are not yet implemented.
- Comments and likes: Data model exists; write endpoints and UI interactions are not yet wired to the backend.
- Preferences: Toggle state is stored client-side and synced to `/api/users/me` for name/bio/avatar. A separate preferences field and persistence are not yet implemented.
- Follows: Data model fields exist; follow/unfollow endpoints and UI are not yet implemented.

---

## Missing Features and Recommended Roadmap

### Security and Auth
- Add `POST /api/auth/change-password` with current password verification and `bcrypt` re-hash.
- Add refresh token rotation if moving away from cookie-only sessions or to extend session robustness.
- Enforce HTTPS and `secure` cookies in production; strict CORS with explicit origins.
- Email verification and password reset flow with signed tokens and an email provider (e.g., SES, SendGrid, Resend).

### Users and Profiles
- Public profile pages (SSR/SEO optional).
- Editable handle/username; unique constraints and slug resolution.
- Preferences persistence field on `User` (e.g., `prefs: { emailNotifications: boolean, pushNotifications: boolean }`) and `/api/users/me` update contract.
- Account deletion and data export endpoints.

### Social Graph
- Follow/Unfollow endpoints and UI, with derived feed and counts.
- Block/mute/report users; moderation flows and admin tools.

### Posts
- Full CRUD: `GET /api/posts/:id`, `PUT /api/posts/:id`, `DELETE /api/posts/:id`.
- Pagination/infinite scroll, sorting, and search by full-text index or Atlas Search.
- Drafts vs published status, scheduled posts.
- Tag taxonomy, trending topics, and tag pages.
- Content sanitization and XSS protection for rich text (e.g., DOMPurify on insert/render).

### Comments and Reactions
- Endpoints: `POST /api/posts/:id/comments`, `DELETE /api/comments/:id`, `POST /api/posts/:id/like` and unlike.
- Nested comments/threading, emoji reactions.
- Realtime comment stream via SSE or WebSockets.

### Notifications (Realtime and Delivery)
- Server-side publishing on actions (like/comment/follow) to:
  - Insert notification documents
  - Push via SSE/WebSocket to targeted users
- “Mark as read” endpoint (`POST /api/notifications/mark-read`).
- Email digests for missed notifications.

### Media and Uploads
- Switch from local storage to S3/GCS; signed upload URLs; CDN delivery.
- Image processing (thumbnailing, format conversion) via a worker.
- Storage quotas and cleanup policies.

### Observability and Reliability
- Request logging with pino/winston.
- Centralized error handling and structured error shape.
- Health checks (`/healthz`) and readiness (`/readyz`).
- Rate limiting and abuse prevention (e.g., express-rate-limit, Redis).
- Input validation with zod on server routes.

### Testing and CI/CD
- Unit tests (Jest/Vitest) and integration tests for API routes.
- E2E tests (Playwright/Cypress) for critical flows.
- Linting and type checks in CI; build and Docker images for deployment.

### Performance and UX
- React Query usage for posts/notifications lists with caching and optimistic updates.
- Code-splitting and prefetching routes.
- Offline/PWA improvements (background sync for drafts).

### Internationalization and Accessibility
- i18n framework (e.g., i18next) and translation files.
- Accessibility audits; keyboard nav and ARIA improvements.

### Admin and Moderation
- Admin dashboard for user management, content reports, and trends.
- Moderation queues, content flagging, automatic filters.

---

## Quick Status Summary
- Core auth (local + Google), user profiles, editor with image upload/crop, and notifications UI are implemented.
- Backend provides models and core endpoints, including uploads and basic posts.
- Several social actions (follows, likes, comments) and production concerns (storage, email, moderation) are scoped and ready to implement next.


