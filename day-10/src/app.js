const express = require('express');
const authRouter = require('./routers/auth.routes');
const cookieParser = require('cookie-parser');
const app = express()
require("dotenv").config()

app.use(express.json())
app.use("/api/auth/", authRouter)
app.use(cookieParser())



module.exports = app