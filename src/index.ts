import { app } from "./app"
import Connect from './db/MongoDB/Connect'
import { ConnectRedis } from "./db/Redis/Connect"
import errorhandler from './middlewares/errrorhandler';

const port:string | number = process.env.PORT || 3000

app.use(errorhandler)



app.listen(port,function ():void{
    console.log("server is listening at ", port)
})
Connect()
// ConnectRedis()

