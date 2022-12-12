import { createClient } from "redis";

const Redisclient = createClient()

async function ConnectRedis():Promise<void> {
    Redisclient.connect()

    Redisclient.on("error", (err):void=>{
       console.log("Redis Client error", err)
    })

    Redisclient.on("connect", ():void=>{
        console.log("Redis connected")
    }) 
}


export{ConnectRedis, Redisclient}