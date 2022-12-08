
import mongoose from 'mongoose'



 function Connect():void
{
    mongoose.connect(process.env.MONGODBURI!).then(
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