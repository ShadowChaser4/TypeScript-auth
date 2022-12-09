import { HydratedDocument } from "mongoose";
import { hash } from "bcrypt";
import { IUser, User } from "../model/User";
import { ILeave, Leave } from "../model/Leave";

async function CreateUser(body:IUser):Promise<IUser>
{        
    const hashed_password:string = await hash(body.password, 10) //generating hash from bcrypt
    body.password = hashed_password
    const user: HydratedDocument<IUser> = new User({
       ...body
    })
    
   return (await user.save())
}

async function CreateLeave(body:ILeave):Promise<ILeave>
{
    const leave: HydratedDocument<ILeave> = new Leave(
        {
            ...body
        } 
    )

    return await (await leave.save()).populate("for")
}




export {
    CreateUser, 
    CreateLeave
}
