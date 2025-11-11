## Zenz Write - Monorepo

A modern social writing app built with Vite + React + TypeScript on the frontend and Node + Express + MongoDB on the backend.

### Requirements
- Node 18+ and npm
- MongoDB (local or Atlas)
- Google OAuth credentials (Client ID/Secret)

---

## 1) Frontend (Vite React)

Location: `./`

### Environment
Create a `.env` at the project root:

```
VITE_SERVER_URL=http://localhost:4000
```

### Install and Run
```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 2) Backend (Express + MongoDB)

Location: `./server`

### Environment
Create `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/zenzwrite
PORT=4000
JWT_SECRET=replace_with_strong_secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
```

Notes:
- Create OAuth credentials in Google Cloud Console. Add `Authorized redirect URI` as:
  - `http://localhost:4000/api/auth/google/callback`
- `CLIENT_URL` must match the frontend origin.

### Install and Run
```bash
cd server
npm install
npm run dev
```

The API will be available at `http://localhost:4000`.

---

## Features Implemented
- Branding: Zenz Write with logo
- Auth: local email/password + Google OAuth, JWT cookie
- Users: profile, bio, avatar
- Posts: rich text editor (TipTap) with image upload & cropping
- Uploads: `POST /api/uploads` (stored locally in `server/uploads`)
- Notifications: REST endpoints and SSE heartbeat wiring in client

---

## Useful Scripts
- Frontend:
  - `npm run dev` – start Vite dev server
  - `npm run build` – production build
  - `npm run preview` – preview build
- Backend:
  - `npm run dev` – start Express server with ts-node + nodemon
  - `npm run build` – compile TypeScript
  - `npm start` – run compiled server

---

## Directory Overview
```
/
  src/                # Frontend source
  public/             # Frontend static assets
  server/
    src/              # Backend source
    uploads/          # Runtime upload storage (gitignored)
```

---

## Production Considerations
- Use a hosted MongoDB (Atlas) and set `MONGODB_URI` accordingly.
-,Secure cookies and CORS in production (set `secure: true`, proper domains).
- Replace local uploads with cloud storage (S3/GCS) and signed URLs.
- Serve the frontend build via a static host or from the backend.


