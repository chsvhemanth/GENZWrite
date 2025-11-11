## MongoDB Setup Guide for Zenz Write

This guide shows multiple ways to create a MongoDB database and collections for the backend:
- Option A: MongoDB Atlas (cloud) – recommended
- Option B: Local MongoDB Community Server
- Tools: MongoDB Compass (GUI) and mongosh (CLI)

You only need ONE of the options.

---

## Prerequisites
- Node.js 18+ installed
- Git installed
- For Atlas: a free MongoDB Atlas account

---

## Option A — MongoDB Atlas (Cloud)

1) Create an Atlas account
- Go to `https://www.mongodb.com/atlas/database` and sign up (free tier is fine).

2) Create a Project
- Click “New Project” → name it “ZenzWrite” → Create Project.

3) Create a Cluster
- Click “Build a Database”.
- Choose “Serverless” or “Shared (M0)” free tier.
- Choose a cloud provider/region near you.
- Click “Create”.

4) Create a Database User
- Security → “Database Access” → “Add New Database User”.
- Choose “Password” auth.
- Username: `zenzwrite_user` (example), generate a strong password and save it.
- Role: “Atlas Admin” or minimally “Read and write to any database”.
- Click “Add User”.

5) Allow Network Access (IP Whitelist)
- Security → “Network Access” → “Add IP Address”.
- For local dev, choose “Allow access from anywhere” (0.0.0.0/0) or add your current IP specifically.

6) Get Your Connection String (URI)
- Clusters → “Connect” → “Shell” or “Drivers”.
- Copy the URI; it looks like:
```
mongodb+srv://zenzwrite_user:<PASSWORD>@<cluster-name>.<id>.mongodb.net/zenzwrite
```
- Replace `<PASSWORD>` with your user’s password (URL-encode special characters if any).

7) Create Database and Collections (Compass GUI)
- Download and open MongoDB Compass: `https://www.mongodb.com/products/compass`
- Click “New Connection” and paste your Atlas connection string (add the db name at the end if not present).
- Click “Connect”.
- In the left sidebar, click “Create database”:
  - Database name: `zenzwrite`
  - Collection name: `users`
  - Click “Create Database”
- Create two more collections:
  - `posts`
  - `notifications`

8) (Optional) Create Indexes
- Open the `users` collection → Indexes → “Create Index”
  - Keys: `email` (Ascending)
  - Options: Unique = true
- Open the `posts` collection → Indexes:
  - Keys: `authorId` (Ascending)
  - Keys: `createdAt` (Descending) if you plan frequent sorted queries
- Open the `notifications` collection → Indexes:
  - Keys: `userId` (Ascending)
  - Keys: `createdAt` (Descending)

9) Update Backend Environment
- In `server/.env`, set:
```
MONGODB_URI=mongodb+srv://zenzwrite_user:<PASSWORD>@<cluster-name>.<id>.mongodb.net/zenzwrite
```
- Keep other variables as configured earlier.

10) Start the server
```bash
cd server
npm run dev
```
If connected successfully, you’ll see “Server on http://localhost:4000” in the console without connection errors.

---

## Option B — Local MongoDB Community Server (Windows)

1) Install
- Download “MongoDB Community Server” from `https://www.mongodb.com/try/download/community`.
- During setup, include “MongoDB Compass” if you want the GUI.
- The Windows service will run as “MongoDB” by default on port 27017.

2) Verify service
- Open Services (Win+R → `services.msc`) and ensure MongoDB service is “Running”.
- Or run in PowerShell: `netstat -ano | findstr 27017` to confirm the port.

3) Connect with Compass
- Start MongoDB Compass.
- Connection string for local dev:
```
mongodb://localhost:27017
```
- Click “Connect”.

4) Create database and collections
- Click “Create database”:
  - Database: `zenzwrite`
  - Collection: `users`
- Then create collections: `posts` and `notifications`.
- Add the same indexes as in Atlas (see Option A, step 8).

5) Update Backend Environment
- In `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/zenzwrite
```

6) Start the server
```bash
cd server
npm run dev
```

---

## Creating Collections via mongosh (CLI)

If you prefer CLI over Compass:

1) Install mongosh: `https://www.mongodb.com/try/download/shell`

2) Connect
- Atlas:
```bash
mongosh "mongodb+srv://<cluster-url>/zenzwrite" --username zenzwrite_user
```
- Local:
```bash
mongosh "mongodb://localhost:27017/zenzwrite"
```

3) Create collections and indexes
```javascript
use zenzwrite

db.createCollection('users')
db.createCollection('posts')
db.createCollection('notifications')

// users: unique email
db.users.createIndex({ email: 1 }, { unique: true })

// posts: authorId + createdAt
db.posts.createIndex({ authorId: 1 })
db.posts.createIndex({ createdAt: -1 })

// notifications: userId + createdAt
db.notifications.createIndex({ userId: 1 })
db.notifications.createIndex({ createdAt: -1 })
```

4) Seed a test user
```javascript
db.users.insertOne({
  name: 'Test User',
  email: 'test@example.com',
  bio: '',
  avatarUrl: '',
  followers: [],
  following: [],
  createdAt: new Date()
})
```

---

## Wiring Zenz Write to Your Database

1) Set `MONGODB_URI` in `server/.env` (Atlas or local URI).
2) Start the backend:
```bash
cd server
npm run dev
```
3) Start the frontend:
```bash
npm run dev
```
4) Visit `http://localhost:5173`. Sign up or use Google to sign in. Data will persist in the `zenzwrite` database.

---

## Troubleshooting
- AUTH/Network error in server logs:
  - Atlas: ensure your IP is whitelisted and the database user exists with the right password.
  - Local: ensure the MongoDB Windows service is running and port 27017 is open.
- Timeout connecting to Atlas:
  - Check corporate VPN/firewall rules. Try “Allow access from anywhere” during development.
- “E11000 duplicate key error”:
  - You inserted another user with the same email while a unique index exists. Change the email or drop the duplicate.
- Special characters in password:
  - URL-encode them in the connection string (e.g., `@` → `%40`).

---

## Production Notes
- Use a dedicated Atlas cluster with strong user/password and IP rules.
- Create separate users for dev/staging/prod and rotate credentials periodically.
- Backups: enable automated backups in Atlas for recovery.


