import { NextFunction, Request,Response } from "express";
import Joi, {  ValidationResult } from 'joi'
import { CreateUser, GetUser } from "../services/mongodb.services";

async function getuser(req:Request, res:Response, next:NextFunction)
{
try 
{
    const {error} = getuservalidation(req.query)
    if (error) throw ({"status":400, "message":error.details[0].message})

    return res.json(await GetUser(req.query.name as string, req.query.offset as string))
}
catch(err){
next(err)
}
}


async function register(req:Request<Express.User>, res:Response, next:Function)
{
    try 
    {
        const {error} = registervalidation(req.body)
        if (error)
          return  res.status(400).json({"message":error.details[0].message})

        res.status(201).json(await CreateUser(req.body) ) 
        
    }
    catch(error)
    {
        next(error)
    }
}





function registervalidation(body:object)
{
     const schema = Joi.object(
    {
        email: Joi.string().email().required(), 
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_+`~'"]){8,}/), 
        dob:Joi.date().required(), 
        first_name:Joi.string().required(), 
        last_name:Joi.string().required(), 
        middle_name: Joi.string(), 
        roles: Joi.array().items(Joi.string()).required()
    }
   )
    return schema.validate(body)
   
}

function getuservalidation(body:object):ValidationResult
{
    const schema = Joi.object(
        {
            name:Joi.string(), 
            offset:Joi.number()
        }
    )
    return schema.validate(body)
}


export 
{
    register, 
    getuser
}