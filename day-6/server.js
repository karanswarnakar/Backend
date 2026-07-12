const app = require('./src/app.js');
const connectToDB = require('./src/config/databace.js');




connectToDB()   

port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})