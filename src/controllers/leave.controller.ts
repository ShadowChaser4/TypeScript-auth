import Joi from "joi";
import { Request,Response, NextFunction } from "express";
import { create_leave_service } from "../services/leave.services";

async function apply_leave(req:Request, res:Response, next:NextFunction)
{
    try 
    {
        req.body.for = req.user!._id
        const {error} = validateLeaveApplication(req.body)
        if (error) 
         return res.
             status(400).
             json({message:error.details[0].message})
        return res.json(await create_leave_service(req.user!, req.body))
    }
    catch(err){
     next(err)
    }
}

async function review_leave(req:Request, res:Response, next:NextFunction)
{
    try 
    {
       
    }
    catch(err)
    {
        next(err)
    }
}


function validateLeaveApplication(body:object)
{
    const schema = Joi.object({
        type:Joi.string().valid("sick", "personal").required(), 
        leave_note:Joi.string().required(), 
        for: Joi.string().required(), 
        from_date:Joi.date().required(), 
        to_date:Joi.date()
    })
return schema.validate(body)
}



export {
    apply_leave
}