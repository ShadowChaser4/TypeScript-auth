import { HydratedDocument } from "mongoose";
import { hash } from "bcrypt";
import { IUser, User } from "../model/User";
import {omit} from 'lodash'

async function CreateUser(body:IUser):Promise<IUser>
{
    const {email,
         first_name,
         middle_name, 
         last_name,
         password, 
         roles,
          dob} = body //destructuring from req.body
            
    const hashed_password:string = await hash(password, 10) //generating hash from bcrypt
   
    const user: HydratedDocument<IUser> = new User({
        first_name: first_name, 
        middle_name: middle_name, 
        last_name : last_name, 
        email:email, 
        password: hashed_password, 
        roles:roles, 
        dob:dob, 
    })
   return await user.save()
}




export {
    CreateUser
}
