import { func } from "joi";
import { model, Model, Schema } from "mongoose";

interface IHolidays 
{
    name: string, 
    starting_date: Date, 
    ending_date:Date, 
}

interface IHolidaysMethods 
{
    totaldays():number
}

type HolidayModel = Model<IHolidays,{},IHolidaysMethods>

const holidaySchema:Schema = new Schema<IHolidays, HolidayModel,IHolidaysMethods> (
    {
        name:{
            type:String, 
            required:[true, 'please enter name of the holiday']
        }, 
        starting_date: {
            type:Date, 
            required:[true, "please enter when does the holiday start"]
        },
        ending_date : {
            type:Date, 
            required:[true, "please enter when does the holiday end"]
        }
    }
)

holidaySchema.method("totaldays", function totaldays():number{
  const days_in_milliseconds:number = 1000* 60 * 60 * 24; 
  const  totaldays:number = ((this.ending_date.getTime() - this.starting_date.getTime()) / (days_in_milliseconds) ) + 1
  
  this.totaldays = totaldays
  return totaldays
  
})

const Holiday = model<IHolidays,HolidayModel>("Holiday", holidaySchema)
export {Holiday, IHolidays, HolidayModel}