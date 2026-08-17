require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');


app.use(express.json())
app.use(cookieParser())

// Require Routes
const authRouth = require('./routes/auth.route');

// Routes
app.use("/api/auth", authRouth)




module.exports = app;
