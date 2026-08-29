import cookieParser from 'cookie-parser'
import express from 'express'


// Require Routers
import authRouter from "./routes/auth.route.js"


const app = express()


app.use(express.json())
app.use(cookieParser())



// Routers
app.use("/api/auth",authRouter)






export default app