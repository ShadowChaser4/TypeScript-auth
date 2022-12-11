import Joi, { ValidationResult } from "joi";
import { Request,Response, NextFunction } from "express";
import { create_leave_service, create_leave_type_service } from "../services/leave.services";
import { LeaveType } from "../model/Leave";

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
        return res.status(201).json(await create_leave_service(req.user!, req.body))
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

async function add_leave_type(req:Request, res:Response, next:NextFunction)
{
    try 
    {
      const {error} = validateLeaveType(req.body)
      if (error) throw ({'status':400 , "message":error.details[0].message})
      
      res.status(201).json(await create_leave_type_service(req.body))
      
    }
    catch(err)
    {
        next(err)
    }
}

async function leave_types(req:Request,res:Response,next:NextFunction)
{
    try{
     const types =await LeaveType.find().sort({name:1})
     return res.json(types)
    }
    catch(err){
     next(err)
    }
}

function validateLeaveApplication(body:object):ValidationResult
{
    const schema = Joi.object({
        type:Joi.string().required(), 
        leave_note:Joi.string().required(), 
        for: Joi.string().required(), 
        from_date:Joi.date().required(), 
        to_date:Joi.date()
    })
return schema.validate(body)
}

function validateLeaveType(body:object):ValidationResult
{
    const schema = Joi.object(
        {
           name: Joi.string().required(), 
           per_month_allowance:Joi.string()
        }
    )
    return schema.validate(body)
}


export {
    apply_leave, 
    add_leave_type, 
    leave_types
}