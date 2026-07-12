# Day 5 — Express + MongoDB Connection

## One-line idea
This project is a small Express server that connects to MongoDB using Mongoose and starts listening on a port.

## What I learned
- How to set up an Express app
- How to use environment variables with dotenv
- How to connect a Node.js app to MongoDB using Mongoose
- How a server file and app file work together

## Project purpose
This is a beginner backend project that shows the first step of making an app database-ready.

## Main files
- package.json
  - Contains the project dependencies and dev script
- server.js
  - Connects to MongoDB and starts the server
- src/app.js
  - Creates the Express app and exports it
- .env
  - Stores private values like the port and MongoDB connection URL

## Important setup
- The app uses MongoDB Atlas connection string in the .env file
- The database connection is made inside server.js
- The Express app is created in src/app.js and imported into server.js

## How the app works
1. The server starts.
2. It loads environment variables from .env.
3. It connects to MongoDB with Mongoose.
4. If the connection is successful, the server starts listening on the selected port.

## Key code reminders
- Use dotenv to load variables from .env
- Use mongoose.connect() to open a MongoDB connection
- Use .then() and .catch() to handle success or failure
- The port can be read from process.env.PORT or defaulted to 3000

## Run the project
```bash
cd day-5
npm install
npm run dev
```

## Quick recall summary
If you want to remember this day quickly, think:
- Day 5 = Express + MongoDB setup
- Main concept = connect backend to a database
- Tools used = Express, Mongoose, dotenv
- Goal = prepare the app for real data storage
