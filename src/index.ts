import { app } from "./app"

const port:number = 3000

app.listen(port,function ():void{
    console.log("server is listening at ", port)
})
