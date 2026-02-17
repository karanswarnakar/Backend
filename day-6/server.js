const app = require("./src/app")
const mongoose = require("mongoose") 


function ConnectToDB(){
    mongoose.connect("mongodb+srv://karan:JMuIAKgfdQruAH4u@cluster0.b8qol8z.mongodb.net/day-6")
    .then(()=>{
        console.log("Connected Database successfully")
    })
    .catch(()=>{
        console.log("Error! connection Database");
        
    })
}
ConnectToDB()



app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
