import { app } from "./app"
import Connect from './db/MongoDB/Connect'
import { ConnectRedis } from "./db/Redis/Connect"
import errorhandler from './middlewares/errrorhandler';
import authapp from "./authapp";

const port:string | number = process.env.PORT || 3000
const authport:string | number = process.env.PORT || 3001

app.use(errorhandler)



app.listen(port,function ():void{
    console.log("server is listening at ", port)
})

authapp.listen(authport, ()=>console.log(" auth server is listening at ", authport))
Connect()
// ConnectRedis()

