import { createClient } from "redis";

const client = createClient()

async function ConnectRedis():Promise<void> {
    client.connect()

    client.on("error", (err):void=>{
       console.log("Redis Client error", err)
    })

    client.on("connect", ():void=>{
        console.log("Redis connected")
    }) 
}


export{ConnectRedis, client}