const app = require('./src/app.js');
const mongoose = require('mongoose');   

function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("MongoDB connected successfully");
    })
    .catch((err)=>{
        console.log(`MongoDB connection error: ${err} `);
        
    })
}
connectDB()

const port = process.env.port || 3000
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
    
})