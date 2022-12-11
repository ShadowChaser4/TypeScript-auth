import { HydratedDocument } from "mongoose";
import { hash } from "bcrypt";
import { IUser, User } from "../model/User";
import { ILeave, Leave } from "../model/Leave";
import { Holiday, IHolidays } from "../model/Holidays";

async function CreateUser(body:IUser):Promise<IUser>
{        
    const hashed_password:string = await hash(body.password, 10) //generating hash from bcrypt
    body.password = hashed_password
    const user: HydratedDocument<IUser> = new User({
       ...body
    })

   return (await user.save())
}

async function CreateLeave(body:ILeave)
{
    const leave = new Leave(
        {
            ...body
        } 
    )

    return (await leave.save()).populate("for")
}

async function CreateHoliday(body:IHolidays)
{
    const exist = await Holiday.exists({ starting_date:{ $lte: body.starting_date }, ending_date:{$gte: body.ending_date} })
    if (exist) throw ({"status":400, "message":"Holiday's starting and ending date clashes with existing holiday"})

    const holiday = new Holiday(
        {
            ...body
        }
    )

    return (await holiday.save())
}




export {
    CreateUser, 
    CreateLeave, 
    CreateHoliday
}
