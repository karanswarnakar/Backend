import cookieParser from 'cookie-parser'
import express from 'express'
import cors from "cors"
import morgan from "morgan"
// Require Routers
import authRouter from "./routes/auth.route.js"
import chatRouter from './routes/chat.route.js'


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: `${process.env.FRONTEND_URL}:5173`,
    credentials: true
}))

app.use(morgan("dev"))

// Routers
app.use("/api/auth",authRouter)
app.use("/api/chats",chatRouter)

export default app