require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express()
const cors = require('cors');


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))


// Required Router 
const authRouter = require('./routers/auth.route');
const songRouter = require('./routers/song.route');


// Router
app.use("/api/auth", authRouter)
app.use("/api/songs", songRouter)




module.exports = app