
import { Model, model, Schema, Types } from "mongoose"
import { Holiday } from "./Holidays"


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
    totalleavedays():number
}

type LeaveModel = Model<ILeave,{},ILeaveMethods>

const leaveSchema :Schema = new Schema<ILeave,LeaveModel,ILeaveMethods>(
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



leaveSchema.method("totalleavedays",async function totalleavedays():Promise<number>
{
    var from_date = this.from_date; 
    var weekend:number = 0
    const totaldays = (this.to_date.getTime() - this.from_date.getTime()) /(1000 * 60 * 60 * 24) + 1 //what's happening?
    // .getTime() method delivers total time from unix epoch start in miliseconds 
    // by dividing miliseconds with 1000 we get seconds and % by 60 gives minutes and % by 60 gives hours similarly we % by 24
    //to get no. of days 
    // +1 for anamoly in days calcutaion, since calculating from 0:00 hours 1 day gets missing

    while(from_date.getTime() <= this.to_date.getTime())
      {
       (from_date.getDay() == 6)? weekend++ : null; //check if the day is saturday .getDay() gives no. of day 0-6 , 6 being saturday
       from_date = new Date(from_date.getTime() + 1000 * 60 * 60 * 24) 
    }
    
    const holidays =await Holiday.find({
       $or:[ {starting_date:{ $gte: this.from_date, $lte:this.to_date} },
            {starting_date:{$lte:this.from_date && this.to_date}}]
    }) //we are retriving holidays where start of holiday is greater than or equal to leave starting day and less than leave end day
    
    console.log(weekend, totaldays)
    var holiday_days:number = 0
    for (let holiday of holidays)
    {
         var startdate = this.from_date //starting from leave's first day
         while (startdate.getTime() <= holiday.ending_date.getTime() && startdate.getTime() <= this.to_date) 
         /* Loop will continue to run till it gets to holiday ending date or till leave ending date*/
         {
            const condition:Boolean = (startdate.getDay()!=6 && startdate.getTime() >= holiday.starting_date.getTime())
            //making sure that the day is not weekend and day is greater than holiday starting date
            condition?holiday_days++: null //if condition fails null, else add to holiday days
            startdate = new Date(startdate.getTime() + 1000 * 60 * 60 *24)
         }
    }
    
    return totaldays - weekend - holiday_days
} 
)

const Leave = model<ILeave, LeaveModel>("Leave", leaveSchema)
export {Leave, ILeave,LeaveModel}