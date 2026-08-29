import app from "./src/app.js";
import dotenv from "dotenv/config"
import connectToDB from "./src/config/database.js"
import { testAi } from "./src/services/ai.service.js";

testAi("What is Ai in 10 words")
connectToDB()
const port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`)
})

