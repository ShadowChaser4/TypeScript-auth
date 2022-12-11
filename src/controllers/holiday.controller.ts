import { NextFunction, Request, Response } from "express";
import Joi, {ValidationResult} from "joi";
import { CreateHoliday } from "../services/mongodb.services";


async function createholiday(req:Request, res:Response, next:NextFunction):Promise<any>
{
    try {
        const {error}  = holidayvalidation(req.body)
   
        if (error) return res.json( {"message":error.details[0].message})
     
        const holiday = await CreateHoliday(req.body)
        return res.status(201).json({holiday, days:holiday.totaldays()})
    }
    catch(err)
    {
        next(err)
    }
  
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