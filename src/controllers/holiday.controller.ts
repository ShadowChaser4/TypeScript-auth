import { NextFunction, Request, Response } from "express";
import Joi, {ValidationResult} from "joi";
import { CreateHoliday } from "../services/mongodb.services";
import { IHolidays,HolidayModel } from "../model/Holidays";


async function createholiday(req:Request, res:Response, next:NextFunction):Promise<any>
{
    console.log(req.body)
   const {error}  = holidayvalidation(req.body)
   
   if (error) return res.json( {"message":error.details[0].message})

   const holiday = await CreateHoliday(req.body)
   return res.json({holiday, days:holiday.totaldays()})
}




function holidayvalidation(body:object):ValidationResult
{
   const schema = Joi.object({
    name : Joi.string().required() ,
    starting_date:Joi.date().required(), 
    ending_date:Joi.date().required()
})
return schema.validate(body)
}

export {
    createholiday
}