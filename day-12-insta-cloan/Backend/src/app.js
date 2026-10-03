import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express()
app.use(express.json()) 
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))

/* Require Routes */
import authRouter from './routes/auth.route.js';
import postRouter from './routes/post.route.js';
import userRouter from './routes/user.route.js';
import notificationRouter from './routes/notification.route.js';
import messageRouter from './routes/message.route.js';

/* Using Routes */
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)
app.use("/api/notifications", notificationRouter)
app.use("/api/messages", messageRouter)

export default app