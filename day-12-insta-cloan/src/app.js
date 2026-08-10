require('dotenv').config()
const express = require('express'); 
const app = express()
const authRouter = require('../src/routes/auth.route');
const cookieParser = require('cookie-parser');
const postRouter = require('./routes/post.route');
const userRouter = require('./routes/user.route');

app.use(express.json()) 
app.use(cookieParser())


app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)

module.exports = app