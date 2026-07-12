# Day 4 — Simple Notes API

## One-line idea
This project is a tiny Express backend that lets you create, read, update, and delete notes.

## What I learned
- How to build a basic API with Express
- How to handle different HTTP routes
- How to work with JSON requests and responses
- How to keep data in memory using an array

## Project purpose
Think of it as a very small note-taking app for practice. It is not connected to a database, so notes disappear when the server restarts.

## Main files
- package.json
  - Contains dependencies and the dev script
- server.js
  - Starts the server
- src/app.js
  - Contains all the API routes and logic

## API routes
- POST /notes
  - Adds a new note
- GET /notes
  - Gets all notes
- PATCH /notes/:index
  - Updates the title of a note by its position
- DELETE /notes/:index
  - Deletes a note by its position

## How the app works
1. The server starts with Express.
2. Requests come in through the routes in src/app.js.
3. Notes are stored in an array called notes.
4. Each request returns a JSON response.

## Important reminders
- This is an in-memory project, not a real database app.
- The app uses index numbers, so the first note is at position 1.
- The response messages contain a few spelling mistakes like "massage" and "fatch".

## Example commands
Run the server:
```bash
cd day-4
npm install
npm run dev
```

Create a note:
```bash
curl -X POST http://localhost:3000/notes -H "Content-Type: application/json" -d '{"title":"My Note","text":"Hello"}'
```

Get all notes:
```bash
curl http://localhost:3000/notes
```

## Quick recall summary
If you want to remember this project later, think:
- Day 4 = Express CRUD notes API
- Data = stored in memory
- Main concept = routes + JSON responses
- Goal = practice backend basics
