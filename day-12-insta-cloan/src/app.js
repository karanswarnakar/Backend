require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.route.js');
const { postRouter } = require('./routes/post.route.js');

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/post", postRouter)

module.exports = app