const Redis = require('ioredis').default;

const redis = new Redis({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
}) 

redis.on("connect", ()=>{
    console.log("Radis connected successfully.")
})
redis.on("error", (err)=>{
    console.log(err);
})

module.exports = redis