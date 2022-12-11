import { Leave,ILeave } from "../model/Leave"
import { CreateLeave } from "./mongodb.services"


async function create_leave_service(user:Express.User, body:ILeave)
{
    const exist = await Leave.exists({for:user._id, from_date:{$gte:body.from_date}, to_date:{$lte:body.to_date}})

    if (exist) throw ({status:400,message:"Leave around that time exist"}) //single line so no braces

    const leave = await CreateLeave(body)
    return {leave, total_applicable_days: leave.totalleavedays()}
}



export {
    create_leave_service
}