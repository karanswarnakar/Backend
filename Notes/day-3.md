# Day 3 — Pocket Reference (folder-only)

Quick summary

- Project: `day-3` — small Express app that serves an in-memory notes list.
- Start: uses `PORT` from `.env` (`PORT = 3000`).

Files

- `.env` — contains: `PORT = 3000`
- `package.json` — dependencies: `dotenv`, `express`, `mongoos` (typo), `nodemon`
- `server.js` — loads `src/app.js`, calls `app.listen(process.env.PORT, ...)`
- `src/app.js` — Express app with `GET /notes` and `POST /notes` using an in-memory `notes` array
- `node_modules/`, `package-lock.json`

Run (fast)

1. Install deps:

```bash
cd day-3
npm install
```

2. Start dev server:

```bash
npm run dev
```

Endpoints (what they do)

- GET /notes
  - Returns HTTP 200 and JSON: { message: "Notes fetch successful", data: notes }
  - (Current code uses `massage: "Notes fatch successfuly"` — that's a typo.)

- POST /notes
  - Accepts JSON body and appends it to the in-memory `notes` array.
  - Returns HTTP 201 and JSON: { message: "New note added", data: notes }
  - (Current code returns the same but with typos.)

Exact behavior (current code)

- Server listens on `process.env.PORT` (no fallback). If `.env` not loaded, server may crash.
- `src/app.js` pushes `req.body` directly into `notes` without validation or IDs.

Quick fixes to consider (optional)

- Add a default port in `server.js`: `const PORT = process.env.PORT || 3000`.
- Fix `package.json` typo `mongoos` → `mongoose` (only if MongoDB is intended).
- Fix response typos: `massage` → `message`, `fatch` → `fetch`.
- Add minimal validation for `POST /notes` and assign `id`/`createdAt`.

Testing examples

```bash
curl http://localhost:3000/notes
curl -X POST http://localhost:3000/notes -H "Content-Type: application/json" -d '{"title":"Test","text":"Hello"}'
```

Remember

- This note contains only information derived from the `day-3/` folder. No external context.
- Tell me which quick fix (default port, typos, validation, dependency) to apply and I'll make code changes now.
