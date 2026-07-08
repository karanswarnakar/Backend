# Day 3 — Simple Notes API

## What this project is
This is a small Express app that lets you manage notes in memory. It is a beginner-friendly API project, and the notes disappear when the server restarts.

## Main idea
Think of it as: "a tiny backend for storing notes temporarily in an array."

## Folder structure
- .env
  - Stores the port number, currently: `PORT=3000`
- package.json
  - Contains dependencies and the `dev` script
- server.js
  - Starts the app
- src/app.js
  - Contains all the API routes and logic

## How to run
1. Open the folder:
   ```bash
   cd day-3
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## What the app does
The app has these routes:

- GET /notes
  - Returns all saved notes
- POST /notes
  - Adds a new note
- PUT /notes/:idx
  - Updates a note using its index number
- DELETE /notes/:idx
  - Deletes a note using its index number

## Important things to remember
- The notes are stored in an array called `notes`.
- This is not a database project.
- The app uses index-based routes, so `:idx` means the note position in the list.
- The code has some typos in response messages such as `massage` and `fatch`.

## Current behavior
- The server starts on the port from `.env` or falls back to `3000`.
- Requests are handled through `src/app.js`.
- New notes are pushed directly into the array without validation.

## Example requests
Get notes:
```bash
curl http://localhost:3000/notes
```

Add a note:
```bash
curl -X POST http://localhost:3000/notes -H "Content-Type: application/json" -d '{"title":"Test","text":"Hello"}'
```

## Quick recall summary
If you need to remember this project later, think:
- Day 3 = a small Express notes API
- Data = stored in memory
- Routes = GET, POST, PUT, DELETE
- Purpose = practice backend routing and simple JSON responses
