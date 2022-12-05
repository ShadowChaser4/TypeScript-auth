import { app } from "./app"
import Connect from './db/Connect'
const port:number = 3000


Connect()

app.listen(port,function ():void{
    console.log("server is listening at ", port)
})
