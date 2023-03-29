import { HydratedDocument } from "mongoose";
import { hash } from "bcrypt";
import { IUser, User } from "../model/User";
import { dateformatter } from "../utils/date.formatter.utils";


async function CreateUser(body:IUser)
{ 
    body.startingfrom = dateformatter(body.startingfrom)
    const hashed_password:string = await hash(body.password, 10) //generating hash from bcrypt
    body.password = hashed_password
    const user: HydratedDocument<IUser> = new User({
       ...body
    })
  
   return await user.save()
}

async function GetUser(name?:string, offset_s?:string, designation?:string, email?:string)
{
    const offset = parseInt(offset_s!) || 0
    name = name || ''
    const users = await User.find({
        $or:[{first_name: { $regex:name ,$options: 'ix'}}, {middle_name:{$regex:name, $options:'ix'}}, {last_name:{$regex:name, $options:"ix"}}],
          $and:[ {designation:{$regex:designation || '', $options:'x'}}, {email:{$regex:email || '', $options:"i"}} ], 
    }).skip(offset).limit(10).select("-__v").sort("first_name")

    return users
}


async function UpdateOwnDetails(body:IUser, id:string)
{
    const user = await User.findOneAndUpdate({_id:id}, {...body}, {useFindAndModify:false, new:true}) 
    
    if(!user) throw({"status":404, "message":"No user found"})
    return await user.save()

}




export {
    CreateUser, 
    GetUser, 
    UpdateOwnDetails
}
