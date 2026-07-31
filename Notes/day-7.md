# Day 7 — Notes App Backend CRUD

## One-line idea
This day focused on building the backend part of a notes app using Express, MongoDB, and Mongoose.

## What I learned
- How to start an Express server
- How to connect Node.js to MongoDB
- How to create a Mongoose schema and model
- How to create API routes for notes
- How to use JSON requests and responses between frontend and backend

## Main files
- Backend/server.js
  - Starts the server and calls the database connection
- Backend/src/app.js
  - Creates the Express app and defines API routes
- Backend/src/config/database.js
  - Connects the app to MongoDB
- Backend/src/models/notes.model.js
  - Defines the note structure for the database

## API routes used
- POST /api/notes
  - Creates a new note
- GET /api/notes
  - Reads all notes
- DELETE /api/notes/:id
  - Deletes a note by ID
- PATCH /api/notes/:id
  - Updates a note by ID

## Important concepts
- Use express.json() to read incoming JSON data
- Use cors so the frontend can call the backend
- Use Mongoose methods like create(), find(), findByIdAndDelete(), and findByIdAndUpdate()
- Keep the server entry file, app setup, database logic, and model in separate files for cleaner code

## Quick recall summary
If you want to remember this day quickly, think:
- Day 7 = backend CRUD for notes
- Main idea = make the server able to create, read, update, and delete notes
- Tools used = Express, MongoDB, Mongoose
