import { NextFunction, Request, Response } from "express";
import Joi, { ValidationResult } from "joi";
import{change_password, get_access_token, login_service} from  '../services/authentication.services'
import { CreateUser } from "../services/mongodb.services";

async function login(req:Request, res:Response, next:Function)
{
   try {

    const {error} = loginvalidation(req.body)
    if (error) 
        return res.status(400).json({message:error.details[0].message})
        //single line so no brackets
    const {email, password} = req.body
    return  res.json( await login_service(email,password))
   }
   catch(error)
   {
    next(error)
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


async function getaccesstoken(req:Request, res:Response, next:Function):Promise<any>
{
    try 
    {
        const {error} = refresh_token_validation(req.query)
        if (error)
             return res.status(400).json({message:error.details[0].message})
        
        const {refresh_token} = req.query
        if (typeof(refresh_token=='string')) 
        {
            return res.json({access_token: await get_access_token(refresh_token as string)}) 
        }
        else 
        {
            throw ({message:"Invalid request, no token found in query",status:400})
        }
    
      
}
    catch(error)
    {
        next(error)
    }
}

async function changepassword(req:Request, res:Response, next:NextFunction)
{
    try 
    {
        const {password,password2,old_password} = req.body
        res.json(await change_password(old_password, password, req.user !)) 
    }
    catch(error)
    {
      next(error)
    }
}

///joi validation validating req.body////
function loginvalidation(body:object)
{
    const schema = Joi.object(
        {
            email: Joi.string().email(), //must contain username 
            password: Joi.string()
        }
    ); 

    return schema.validate(body)
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

function refresh_token_validation(body:object)
{
    const schema = Joi.object(
        {
            refresh_token : Joi.string().required()
        }
    )
    return schema.validate(body)
}

function change_password_validation(body:object):ValidationResult
{
    const  schema = Joi.object(
        {
            old_password: Joi.string().required(), 
            password:Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-+_~`"']){8,}/), 
            password2: Joi.ref('password')
        }
    ).
    xor('password','old_password')
    .with('password','password2')
    return schema.validate(body)
}


export{
    login, 
    register, 
    getaccesstoken, 
    changepassword
}
