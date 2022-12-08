import { Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import { IUser, IUserMethods, User, UserModel } from "../model/User";
const Joi = require("joi")
import{login_service} from  '../services/authentication.services'
import { CreateUser } from "../services/mongodb.services";

async function login(req:Request, res:Response, next:Function)
{
   try {

    const {error} = loginvalidation(req.body)
    if (error) 
        return res.status(400).json({message:error.details[0].message})
        //single line so no brackets
    const {username, password} = req.body
    return  res.json( await login_service(username,password))
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
        const {error} = refresh_token_validation(req.body)

        if (error)
             return res.status(400).json({message:error.details[0].message})
    
        const unseralized:string | JwtPayload = verify(req.body.refresh_token, process.env.REFRESHKEY!) 
        if ( typeof unseralized !='string')
        {
            const user = await User.findOne({_id:unseralized._id})
            if ( ! user) return res.status(404).json({message:"user not found"})

            return res.json({"access_token": await  user.getAccessToken()})          
        }
}
    catch(error)
    {
        next(error)
    }
}



function loginvalidation(body:object)
{
    const schema = Joi.object(
        {
            username: Joi.string().email(), 
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
        password: Joi.string().required(), 
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



export{
    login, 
    register, 
    getaccesstoken
}
