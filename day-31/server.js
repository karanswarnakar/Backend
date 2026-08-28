import app from "./src/app.js";
import { Server } from "socket.io";
import { createServer } from "http"
import { Socket } from "dgram";

const httpServer = createServer(app)

const io = new Server(httpServer)

// io.broadcast.emit("hello", "hello everyone")

io.on("connection", (socket)=>{

    socket.on("message", (msg)=>{
        console.log("Message event:", msg);
        
        io.emit("abc", msg)

    })
    
})




httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
})