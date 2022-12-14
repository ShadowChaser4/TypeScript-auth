import { NextFunction, Request,Response } from "express";
import Joi, { ValidationResult } from 'joi'
import { omit } from "lodash";
import { CreateUser, GetUser, UpdateOwnDetails } from "../services/mongodb.services";

async function getuser(req:Request, res:Response, next:NextFunction)
{
try 
{
    const {error} = getuservalidation(req.query)
    if (error) throw ({"status":400, "message":error.details[0].message})
    
    const {name, offset, designation, email} = req.query
    return res.json(await GetUser( name as string, 
                                   offset as string, 
                                   designation as string, 
                                   email as string
                                 ))
}
catch(err){
next(err)
}
}


async function register(req:Request<Express.User>, res:Response, next:NextFunction)
{
    try 
    {
        const {error} = registervalidation(req.body)
        if (error)
          return  res.status(400).json({"message":error.details[0].message})
        const user = await CreateUser(req.body)
        
        const filtered_user = omit(user.toObject(), ['password'])
        res.status(201).json(filtered_user ) 
        
    }
    catch(error)
    {
        next(error)
    }
}

async function update_own_details(req:Request<Express.User>, res:Response, next:NextFunction)
{
    try 
    {
       const {error} = update_own_detailsvalidation(req.body)

       if (error) throw ({"status":400, "message":error.details[0].message})

       res.json(await UpdateOwnDetails(req.body, req.user!._id!))
    }
    catch(err)
    {
        next(err)
    }
}





function registervalidation(body:object)
{
     const schema = Joi.object(
    {
        email: Joi.string().email().required(), 
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_+`~'"]){8,}/), 
        dob:Joi.date().required(), 
        first_name:Joi.string().required().max(50), 
        last_name:Joi.string().required().max(50), 
        middle_name: Joi.string().max(50), 
        roles: Joi.array().items(Joi.string().valid("administrator", "staff", "role")).required(), 
        designation:Joi.string().required(), 
        starting_from :Joi.date().required(), 
        emergency_contact:Joi.number(), 
        relation_to_emergency_contact: Joi.string(), 
        reports_to:Joi.string(), 
        contact_number:Joi.number()
    }
   ).xor("emergency_contact","contact_number")
    return schema.validate(body)
   
}

function getuservalidation(body:object):ValidationResult
{
    const schema = Joi.object(
        {
            name:Joi.string(), 
            offset:Joi.number(), 
            designation:Joi.string(), 
            email:Joi.string().email()
        }
    )
    return schema.validate(body)
}


function update_own_detailsvalidation(body:object):ValidationResult

{
    const schema = Joi.object(
        {
            emergency_contact:Joi.number(), 
            relation_to_emergency_contact: Joi.string(), 
        }
    ).with("emergency_contact", "relation_to_emergency_contact")
    return schema.validate(body)
}

export 
{
    register, 
    getuser, 
    update_own_details
}