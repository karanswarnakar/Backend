const express = require('express');
const app = express()
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/auth.routes');


require('dotenv').config()
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)


module.exports = app

