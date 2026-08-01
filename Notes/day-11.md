# Day 11 — Authentication Flow with Express, JWT, and Cookies

## 🌟 Main Idea
Today I built the first real authentication flow in the backend. I learned how a user can register, log in, get a token, and use that token through cookies. I also learned that controllers are functions that handle requests, and that plain text can be changed into a hash using MD5 and crypto.

## ✅ Already covered in Day 10
- Authentication
- JWT
- Cookies
- Express routes

## ✨ Today's addition
- A full register and login flow
- Controllers and callback-style functions
- Hashing plain text with MD5 and crypto
- Cookie-based session handling with JWT

---

# Authentication Flow

Difficulty

🟡 Medium

---

## 📌 What is it?
An authentication flow is the process of checking who the user is.

When a user registers or logs in, the server must confirm the identity before allowing access.

## 🌍 Real World Example
Think of a school gate.

- A student shows an ID card.
- The guard checks the card.
- If the card is valid, the student enters.

The backend works in a similar way.

## 💡 Why do we use it?
We use it to protect private data.

It helps the server know:
- who the user is
- whether the account is real
- whether the request should be allowed

## 🧩 Syntax
```js
authRouter.post("/register", async (req, res) => {
  // check email
  // create user
  // create token
  // send cookie
});
```

## 🔍 Code Breakdown
Line 1
↓
Creates a route for registration

req and res
↓
Represent the incoming request and the response sent back

UserModel.create(...)
↓
Saves a new user into the database

jwt.sign(...)
↓
Creates a token that represents the user

res.cookie(...)
↓
Stores the token inside the browser

## 📊 Diagram
Client
↓
POST /register
↓
Route handler
↓
Create user
↓
Create token
↓
Store cookie
↓
Send response

## ⚠ Common Mistakes
- Forgetting to check if the email already exists
- Sending the wrong data in the request body
- Not handling the response properly

## 📝 Important Notes
- Register and login should be organized in separate routes
- The server should always check the request carefully
- Secrets should be kept in the environment file

## 🔗 Related Concepts
← Express Router

→ JWT

→ Cookies

## 🧠 30 Second Recall
- What is an authentication flow?
- Why do we need it?
- What happens during registration?

---

# Controllers and Callback Functions

Difficulty

🟡 Medium

---

## 📌 What is it?
A controller is a function that handles a request.

In this project, the login and register logic is written inside functions that run when a route is called.

## 🌍 Real World Example
Think of a waiter in a restaurant.

When a customer gives an order, the waiter takes it to the kitchen.

In the same way, a controller takes the request and sends it to the correct logic.

## 💡 Why do we use it?
We use controllers to keep code organized.

They help us separate the request handling from the rest of the app.

## 🧩 Syntax
```js
authRouter.post("/login", async (req, res) => {
  // handle login logic
});
```

## 🔍 Code Breakdown
async
↓
Makes the function work with asynchronous operations

(req, res)
↓
Represents the request and the response

fat arrow function
↓
A shorter way to write a function in JavaScript

## ⚠ Common Mistakes
- Mixing too much logic inside one function
- Forgetting that the function is called when the route runs
- Confusing a controller with a model or route

## 📝 Important Notes
- A controller is another name for a request handler function
- Callback and controller are related ideas in Express
- Clean controllers make the code easier to read

## 🔗 Related Concepts
← Authentication Flow

→ Routes

→ JWT

## 🧠 30 Second Recall
- What is a controller?
- Why do we use it?
- What is a callback-style function?

---

# Hashing with MD5 and Crypto

Difficulty

🟡 Medium

---

## 📌 What is it?
Hashing means changing plain text into a protected value.

This makes passwords harder to read and safer to store.

## 🌍 Real World Example
Think of writing a secret message in a locked box.

The plain text is the original message, and the hash is the locked version.

## 💡 Why do we use it?
We use hashing so passwords are not stored as plain text.

Plain text is easy to read, but a hash is much harder to understand.

## 🧩 Syntax
```js
const crypto = require("crypto");

const hash = crypto.createHash("MD5").update(password).digest("hex");
```

## 🔍 Code Breakdown
crypto
↓
A built-in Node.js module for secure data operations

createHash("MD5")
↓
Creates a hash using the MD5 method

update(password)
↓
Takes the plain password and prepares it for hashing

digest("hex")
↓
Turns the result into a readable hex string

## ⚠ Common Mistakes
- Thinking hashing is the same as encryption
- Using plain text passwords in the database
- Forgetting that hashed values cannot be easily reversed

## 📝 Important Notes
- Plain text is easy to read
- Hashing is safer for passwords
- MD5 is simple, but modern apps usually prefer stronger methods

## 🔗 Related Concepts
← Controllers

→ Authentication Flow

→ JWT

## 🧠 30 Second Recall
- What is hashing?
- Why do we hash passwords?
- What does crypto do?

---

# JWT

Difficulty

🟡 Medium

---

## 📌 What is it?
JWT means JSON Web Token.

It is a small token that carries user identity information.

## 🌍 Real World Example
Think of a movie ticket.

When you enter the cinema, the ticket proves you are allowed inside.

A JWT works in a similar way for the backend.

## 💡 Why do we use it?
We use JWT so the server can remember the user after login.

It helps the app know:
- who the user is
- which account the request belongs to

## 🧩 Syntax
```js
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
```

## 🔍 Code Breakdown
jwt.sign(...)
↓
Creates the token

{id: user._id}
↓
Stores the user identity inside the token

process.env.JWT_SECRET
↓
Uses a secret key to sign the token

## 📊 Diagram
User logs in
↓
Server creates JWT
↓
Token sent to browser
↓
Browser sends token later
↓
Server recognizes the user

## ⚠ Common Mistakes
- Treating JWT like a password
- Forgetting to use a secret key
- Sharing the token carelessly

## 📝 Important Notes
- JWT is not the same as a password
- It is used for identity and session handling
- Keep the secret key safe

## 🔗 Related Concepts
← Authentication Flow

→ Cookies

→ Login Route

## 🧠 30 Second Recall
- What does JWT mean?
- Why do we create it?
- What does the secret key do?

---

# Cookies and cookie-parser

Difficulty

🟢 Easy

---

## 📌 What is it?
A cookie is a small piece of information stored in the browser.

The cookie-parser package helps the server read cookies that the browser sends back.

## 🌍 Real World Example
Think of a visitor card.

The guard gives you a card once, and later you show it again to enter.

A cookie works in a similar way for websites.

## 💡 Why do we use it?
We use cookies to keep a login session alive.

In this project, the JWT is stored in a cookie so the browser can remember the login state.

## 🧩 Syntax
```js
app.use(cookieParser());
res.cookie("jwt_token", token);

// later
req.cookies
```

## 🔍 Code Breakdown
app.use(cookieParser())
↓
Lets the server read cookies

res.cookie("jwt_token", token)
↓
Saves the token in the browser so the client can send it later

req.cookies
↓
Lets the server read all cookies sent by the client

## 📊 Diagram
Browser
↓
Receives cookie
↓
Sends it with future requests
↓
Server reads it

## ⚠ Common Mistakes
- Forgetting to use cookie-parser
- Not setting the cookie before sending the response
- Confusing cookies with local storage

## 📝 Important Notes
- Cookies are useful for simple sessions
- They should be used carefully
- The server can read cookies only if the parser is enabled

## 🔗 Related Concepts
← JWT

→ Authentication Flow

## 🧠 30 Second Recall
- What is a cookie?
- Why do we use cookie-parser?
- How does the browser use the cookie later?

---

# Express Router and User Model

Difficulty

🟡 Medium

---

## 📌 What is it?
An Express router helps split routes into smaller files.

A user model describes what kind of data a user should have in the database.

## 🌍 Real World Example
Think of a school office.

Instead of keeping all files in one big box, the office puts them into separate drawers.

That is what routers and models do for code.

## 💡 Why do we use it?
We use routers to keep code organized.

We use models to give the database a clear structure.

## 🧩 Syntax
```js
const authRouter = express.Router();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
```

## 🔍 Code Breakdown
express.Router()
↓
Creates a route group for auth endpoints

mongoose.Schema(...)
↓
Defines the structure of the user data

## ⚠ Common Mistakes
- Putting all routes in one file
- Forgetting to export the router
- Leaving out required fields in the schema

## 📝 Important Notes
- Separate route files make large apps easier to maintain
- Models help keep data consistent
- The user model is important for login and registration

## 🔗 Related Concepts
← Authentication Flow

→ JWT

→ Database Connection

## 🧠 30 Second Recall
- What does a router do?
- What is a model?
- Why do we keep auth routes separate?

---

# Environment Variables and Database Connection

Difficulty

🟢 Easy

---

## 📌 What is it?
Environment variables are values stored outside the code.

They keep important information such as database links and secret keys safe.

## 🌍 Real World Example
Think of a locker key.

The key is not written on the door. It is kept separate so only trusted people can use it.

## 💡 Why do we use it?
We use environment variables to protect sensitive values.

They also make the app easier to configure in different environments.

## 🧩 Syntax
```js
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);
```

## 🔍 Code Breakdown
dotenv.config()
↓
Loads values from the environment file

process.env.MONGODB_URI
↓
Provides the MongoDB connection string

## ⚠ Common Mistakes
- Forgetting to install dotenv
- Typing the wrong variable name
- Sharing secret values in public code

## 📝 Important Notes
- Keep secrets in a .env file
- Do not share the .env file publicly
- Use the same variable names consistently

## 🔗 Related Concepts
← Express Router

→ MongoDB

→ JWT

## 🧠 30 Second Recall
- What is an environment variable?
- Why do we use it?
- What does dotenv do?

---

## 🧠 Final Memory Summary
Today I learned that a real authentication system is built from small pieces:

- routes handle requests
- models store user data
- JWT creates identity
- cookies carry that identity
- environment variables protect important secrets

This is the foundation of login and session-based systems in web apps.
