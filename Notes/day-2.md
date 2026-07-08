# Day 2 - Express.js Basics

## Quick Recall
- Express is a Node.js framework used to create web servers easily.
- It helps us build routes and respond to requests.
- `npm install express` adds Express to the project.

## Basic Structure
```javascript
const express = require('express');
const app = express();
```

## Routes
- `app.get("/", ...)` creates a route for the home page.
- `app.get("/about", ...)` creates another route.
- `res.send(...)` sends a response back to the browser.

## Example from Day 2
```javascript
const express = require('express');
const app = express();

app.get("/", (req, res) => {
    res.send("Welcome, Karan Swarnakar");
});

app.get("/about", (req, res) => {
    res.send("I am a backend Developer");
});

app.listen(3000, () => {
    console.log("Server is running on port: 3000");
});
```

## Important Terms
- `req` = request
- `res` = response
- `app.listen(3000)` = start the server on port 3000

## Memory Trick
- Express = easy server creation
- `app.get` = route handler
- `res.send` = send reply

## Run the Server
```bash
node server.js
```

## package.json Note
The project dependency was added as:
```json
"dependencies": {
  "express": "^5.2.1"
}
```