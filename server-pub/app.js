const express = require('express');
const redis = require('redis');
const {v4} = require('uuid');
const app = express()
const PORT = 3000
const nameChannel = "message-channel";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const redisClient = redis.createClient({ url: "redis://localhost:6379" });

redisClient.on('error', err => console.log('Redis Client Error', err));

app.post('/messages',(req,res)=>{
    try {
        const message = {
            id: v4(),
            message: req.body.message,
            date: new Date(),
        };

        redisClient.publish(nameChannel,JSON.stringify(message));

        console.log(`Publishing using redis: ${req.body.message}`)

        return res.json({
            detail: 'Publishing an Event using Redis successful',
        })
        
    } catch (error) {
        return res.status(500).json({
            detail: error.message
        })
        
    }
});

redisClient.connect().then(()=>{
    console.log("Redis Connected")
    app.listen(PORT,()=>{
        console.log(`Server on port ${PORT}`)
    });
});