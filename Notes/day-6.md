# Day 6 — Express + MongoDB + Notes Model

## One-line idea
This project shows how to build a simple backend app that connects to MongoDB and defines a basic notes data model with Mongoose.

## What I learned
- How to start an Express app
- How to connect a Node.js app to MongoDB using Mongoose
- How to create a schema and model for data
- How server.js, app.js, and the database file work together

## Project purpose
This day focuses on preparing the backend to store and manage data. The app is still simple, but it introduces the structure needed for real database operations.

## Main files
- package.json
  - Contains project dependencies like express, mongoose, dotenv, and nodemon
- server.js
  - Starts the app and calls the database connection function
- src/app.js
  - Creates the Express app and exports it
- src/config/databace.js
  - Connects the app to MongoDB using mongoose.connect()
- src/models/notes.model.js
  - Defines the notes schema and model
- .env
  - Stores private values such as the MongoDB connection URL and port

## Important setup
- The app uses environment variables from .env
- MongoDB connection is handled in the database config file
- The Express app is created separately and imported into the server entry file
- The notes model is built with Mongoose schema rules

## How the app works
1. The server starts from server.js.
2. The app is created in src/app.js.
3. The database connection is opened through src/config/databace.js.
4. A notes model is defined in src/models/notes.model.js for future CRUD operations.

## Key code reminders
- Use dotenv to load .env values
- Use mongoose.connect() to connect to MongoDB
- Keep the app setup and database connection in separate files for cleaner structure
- A Mongoose schema defines the shape of your data
- A model helps you work with that data in your application

## Run the project
```bash
cd day-6
npm install
npm run dev
```

## Quick recall summary
If you want to remember this day quickly, think:
- Day 6 = backend + database + model setup
- Main concept = connect your app to MongoDB and define data structure
- Tools used = Express, Mongoose, dotenv
- Goal = prepare the app for storing real data like notes
