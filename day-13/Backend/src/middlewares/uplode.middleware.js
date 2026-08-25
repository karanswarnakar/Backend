const multer = require('multer');

const uplode = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 1024 * 1024 * 15 // 10MB
    }
}) 

module.exports = uplode



