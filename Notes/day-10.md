# Day 10 — Routes, Authentication, JWT, and Cookies

## 🌟 Main Idea
Today I learned how to keep the backend cleaner by moving auth logic into its own route file. I also learned how JWT and cookies help the server know who is making a request.

# Routing in Express

Difficulty

🟢 Easy

---

## 📌 What is it?
A route is a path in the backend. It tells the server what to do when the user sends a request to a specific URL.

For example, when the user goes to /register, the server knows to run the registration logic.

## 🌍 Real World Example
Think of a hotel front desk.

- The guest says, “I want to check in.”
- The receptionist knows which desk to send the guest to.

In the same way, a route tells the server which handler should respond.

## 💡 Why do we use it?
We use routes to keep the code organized.

Instead of putting everything in one big file, we split the app into smaller parts.

This makes the code:
- easier to read
- easier to maintain
- easier to expand later

## 🧩 Syntax
```js
const express = require('express');
const authRouter = express.Router();

app.use('/api/auth', authRouter);
```

## 🔍 Code Breakdown
Line 1
↓
Creates the Express app

Line 2
↓
Creates a small router for auth-related routes

Line 4
↓
Tells the app to use that router for the /api/auth path

## ⚠ Common Mistakes
- Putting all logic in app.js instead of splitting it into route files
- Forgetting to connect the router to the app
- Using the wrong path name

## 📝 Important Notes
- Keep related routes together in one folder
- A clean structure helps you find code faster
- This is a good habit for big projects

## 🔗 Related Concepts
← Express app

→ Middleware

→ Authentication

## 🧠 30 Second Recall
- What is a route?
- Why do we use route files?
- What problem does route organization solve?

---

# Authentication

Difficulty

🟡 Medium

---

## 📌 What is it?
Authentication means checking who the user is.

When a user sends a request, the server should know if that request is coming from a real user or an unknown person.

## 🌍 Real World Example
Imagine entering a school building.

You need an ID card to prove you belong there.

Authentication works like that.

The server needs proof that the user is allowed to access the system.

## 💡 Why do we use it?
Without authentication, the server cannot safely know who is making the request.

This is important for:
- user registration
- login
- protecting private data
- identifying the correct account

## 🧩 Syntax
```js
const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
```

## 🔍 Code Breakdown
Line 1
↓
Creates a token for the user

id and email
↓
Store basic identity information inside the token

JWT_SECRET
↓
Acts like a private signature key

## ⚠ Common Mistakes
- Using the wrong secret key
- Forgetting to create a token after registration or login
- Assuming the server can “see” the user without identity data

## 📝 Important Notes
- Authentication helps identify the user
- Tokens are one common way to do this in web apps
- A token is not the same as a password

## 🔗 Related Concepts
← Routes

→ JWT

→ Cookies

## 🧠 30 Second Recall
- What is authentication?
- Why do we need it?
- What does the server use to identify a user?

---

# JWT

Difficulty

🟡 Medium

---

## 📌 What is it?
JWT stands for JSON Web Token.

It is a small piece of data that the server creates to identify a user.

## 🌍 Real World Example
Think of a ticket at a theme park.

When you enter, the staff gives you a ticket.

That ticket proves you are allowed inside.

A JWT works in a similar way.

## 💡 Why do we use it?
We use JWT to remember who the user is after login or registration.

The server can send a token to the browser, and later the browser can send it back.

This helps the server know:
- who the user is
- which account the request belongs to

## 🧩 Syntax
```js
const token = jwt.sign(payload, secretKey);
```

## 🔍 Code Breakdown
payload
↓
Contains user identity information such as id and email

secretKey
↓
Used to sign the token so it can be trusted

## ⚠ Common Mistakes
- Thinking JWT is the same as a password
- Forgetting that the token must be kept secret
- Using a weak or missing secret key

## 📝 Important Notes
- JWT is used to identify users
- It is created when the user registers or logs in
- The token is signed so the server can verify it was created by the app

## 🔗 Related Concepts
← Authentication

→ Cookies

→ Login

## 🧠 30 Second Recall
- What does JWT mean?
- Why is it created?
- Why do we sign it?

---

# Cookies and cookie-parser

Difficulty

🟢 Easy

---

## 📌 What is it?
A cookie is a small piece of data stored in the browser.

The cookie-parser package helps the server read cookies sent from the browser.

## 🌍 Real World Example
Think of a visitor card.

When you enter a building, the guard gives you a card.

Later, you show the same card to enter again.

A cookie works like that for websites.

## 💡 Why do we use it?
We use cookies to store things like a JWT token.

This allows the browser to remember the user session.

## 🧩 Syntax
```js
app.use(cookieParser()); - inside // [app.js]
res.cookie('jwt_token', token); // [/routers/auth.router.js]
```

## 🔍 Code Breakdown
app.use(cookieParser())
↓
Lets the app read cookies from requests

res.cookie('jwt_token', token)
↓
Stores the token in the browser cookie storage

## ⚠ Common Mistakes
- Forgetting to use cookie-parser
- Saving the token in the wrong place
- Not checking whether the browser actually received the cookie

## 📝 Important Notes
- Cookies help the browser remember the login state
- This is a common way to store JWT tokens
- The token is sent back later with future requests

## 🔗 Related Concepts
← JWT

→ Sessions

→ Login

## 🧠 30 Second Recall
- What is a cookie?
- Why do we use cookie-parser?
- What is stored in the cookie in this lesson?

---

## 🧠 Final Memory Summary
Today I learned that:
- routes help organize backend code
- authentication helps identify the user
- JWT creates a token for identity
- cookies store that token in the browser

This is the basic idea behind user registration and login in a backend app.
