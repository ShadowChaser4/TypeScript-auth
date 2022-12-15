import { NextFunction, Request, Response } from "express";
import Joi, { ValidationResult } from "joi";
import{change_password, get_access_token, login_service, logout_service, resetpassword_service, resettoken_service} from  '../services/authentication.services'
import { User } from "../model/User";


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
        const {error} = change_password_validation(req.body)
        if (error) throw ({"status":400, "message":error.details[0].message})
        const {password,old_password} = req.body
        res.json(await change_password(old_password, password, req.user !)) 
    }
    catch(error)
    {
      next(error)
    }
}

async function generateresetoken(req:Request, res:Response, next:NextFunction)
{
 try 
 {
    console.log(req.body)
    const {error} =Joi.object({
                                email:Joi.string().email().required()
                            }).validate(req.body) //validating that req.body only contains email
    if (error) throw ({"status":400, "message":error.details[0].message})

    const user = await User.findOne({email:req.body.email})
    if (! user) throw ({"status":404, "message":"User not found"})
    await resettoken_service(user,req.hostname)
    
    res.status(200).json({"message":"Successfully reset"})
 }
 catch(err)
 {
    next(err)
 }
}

async function resetpassword(req:Request, res:Response, next:NextFunction)
{
   try 
   {
       const {token, id} = req.params
       const {password1,password2} = req.body
       
       const {error} = resetpasswordvalidation({token,id,password1,password2})
       if (error) throw ({"status":400, "message":error.details[0].message})

       return res.json(await resetpassword_service(id,token,password1))
       
   }
   catch(err)
   {
    next(err)
   }
}


async function logout (req:Request, res:Response, next:NextFunction)
{
    try 
    {
      const {error}  = logoutvalidation(req.body)
      if (error) throw ({"status":400, "message":"Refresh token missing in body"})
      const refresh_token:string = req.body.refresh_token
     const response = await  logout_service(req.headers.authorization?.split(" ")[1]!, refresh_token, req.user !)
      return  res.json(response)
    }
    catch(err)
    {
        next(err)
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

function resetpasswordvalidation(obj:object)
{
    const schema = Joi.object({
        password1:Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-+_~`"']){8,}/),
        password2:Joi.ref("password1"),
        token: Joi.string().required(), 
        id:Joi.string().required()
    }).with("password1","password2")

    return schema.validate(obj)
}


function logoutvalidation(body:object):ValidationResult
{
    const schema = Joi.object(
        {
            refresh_token:Joi.string().required()
        }
    )
return schema.validate(body)
}


export{
    login, 
    getaccesstoken, 
    changepassword, 
    logout, 
    generateresetoken, 
    resetpassword
}
