
import mongoose from 'mongoose'



 function Connect():void
{
    mongoose.connect('mongodb://127.0.0.1:27017/serverdb').then(
        ():void=>{
            console.log("database connected")
        }
    ).catch(
        (error:any)=>{
            console.log(error)
        }
    )
}



export default Connect