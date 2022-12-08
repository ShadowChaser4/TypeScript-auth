import { app } from "./app"
import Connect from './db/MongoDB/Connect'
import { ConnectRedis } from "./db/Redis/Connect"
import errorhandler from './utils/errrorhandler';

const port:string | number = process.env.PORT || 3000




app.listen(port,function ():void{
    console.log("server is listening at ", port)
})
app.use(errorhandler)
Connect()
// ConnectRedis()

