import { app } from "./app"
import Connect from './db/MongoDB/Connect'
import { ConnectRedis } from "./db/Redis/Connect"

const port:number = 3000




app.listen(port,function ():void{
    console.log("server is listening at ", port)
})

Connect()
ConnectRedis()

