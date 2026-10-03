import dotenv from 'dotenv/config';
import { createServer } from "node:http";
import app from './src/app.js';
import connectToDB from './src/config/database.js';     
import { initializeSocket } from "./src/services/socket.js";

const server = createServer(app);
initializeSocket(server);
await connectToDB();
server.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})