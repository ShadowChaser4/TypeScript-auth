
import { string } from "joi"
import { Model, model, Schema, Types } from "mongoose"



interface ILeave {
    type:string, 
    manager_comment:string, 
    leave_note :string, 
    from_date:Date, 
    to_date:Date, 
    for: Types.ObjectId
    reviewed_by?:Types.ObjectId, 
    reviewed?:Boolean, 
    leave_status?:string
}

interface ILeaveMethods 
{
    totaldays():number
}

type LeaveModel = Model<ILeave,{},ILeaveMethods>

const leaveSchema :Schema = new Schema<ILeave, LeaveModel,ILeaveMethods>(
    {
        type:{
            type:String,
            enum :['sick', 'personal'], 
            default:'personal',
            required:[true, "leave type required"]
        }, 
        manager_comment:{
            type:String, 
        }, 
        leave_note:{
            type:String, 
            required:[true, "include a note for leave"]
        }, 
        for:{
            type:Schema.Types.ObjectId, 
            ref:"User",
            required:true
        }, 
        from_date:{
            type:Date, 
            required:[true, "include a date from when leave is applied"]
        }, 
        to_date: {
            type:Date, 
            required:[true, "include date till leave is applied"]
        }, 
        reviewed_by:
        {
            type: Schema.Types.ObjectId, 
            ref:"User", 
        }, 
        reviewed:{
            type:Boolean
        }, 
        leave_status: {
            type:String , 
            enum:['pending', 'approved', 'not approved'], 
            default:'pending'
        }

    }
)


const Leave = model<ILeave, LeaveModel>("Leave", leaveSchema)



leaveSchema.method("totalleavedays", function totalleavedays():number
{
    var from_date = this.from_date; 
    var till_date = this.to_date
    var weekend:number = 0

    while(from_date <= till_date)
      {
       (from_date.getDay() == 6)? weekend++ : null; //check if the day is saturday .getDay() gives no. of day 0-6 , 6 being saturday
    from_date = new Date(from_date.getTime() + 1000 * 60 * 60 * 24)
    }
    
    var totaldays = (this.to_date.getTime() - this.from_date.getTime()) /(1000 * 60 * 60 * 24) //what's happening?
    // .getTime() method delivers total time from unix epoch start in miliseconds 
    // by dividing miliseconds with 1000 we get seconds and % by 60 gives minutes and % by 60 gives hours similarly we % by 24
    //to get no. of days
    
    return totaldays - weekend
} 
)


export {Leave, ILeave,LeaveModel}