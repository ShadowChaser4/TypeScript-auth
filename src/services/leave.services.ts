import { Leave,ILeave, ILeaveTypes, LeaveType } from "../model/Leave"
import { dateformatter } from "../utils/date.formatter.utils"
import { CreateLeave } from "./mongodb.services"


async function create_leave_service(user:Express.User, body:ILeave):Promise<object>
{
  
    body.from_date = dateformatter(body.from_date ) //setting as any to mitigate clash of types
    body.to_date = dateformatter(body.to_date) //setting as any to mitigate clash of types
    
    const exist = await Leave.exists({for:user._id, from_date:{$lte:body.from_date}, to_date:{$gte:body.to_date}})
   
    if (exist) throw ({"status":400,"message":"Leave around that time exist"}) //single line so no braces

    const leave = await CreateLeave(body)
    return {leave}
}


async function create_leave_type_service(body:ILeaveTypes):Promise<ILeaveTypes>
{
   const exist = await LeaveType.exists({name:body.name})

   if (exist) throw ({'status':400, "message":"Leave type with same name exist already"})

  const type= new LeaveType(
    {
        ...body
    }
  )
  return await type.save()
}


export {
    create_leave_service, 
    create_leave_type_service
}