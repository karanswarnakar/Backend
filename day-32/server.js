import app from "./src/app.js";
import dotenv from "dotenv/config"
import connectToDB from "./src/config/database.js"


connectToDB()
const port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`)
})

