const app = require('./src/app.js');
const port = process.env.PORT || 3000
const connectToDB = require('./src/config/database.js'); 


connectToDB()
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
    
})