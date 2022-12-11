import { NOTFOUND } from "dns";
import { Request, Response } from "express";


function errorhandler(err:Error| any,req:Request, res:Response, next:Function)
{
    if (err.name == 'ValidationError')
    return res.status(400).json({"message":err.message})
    
    if (err.name == 'MongoServerError')
    {
        if (err.message.split(' ')[0] == 'E11000') return res.status(400).json({"message":"Duplicate key error"})

        return res.status(500).json({"message":err.message})
    }

    if (err.name == 'JsonWebTokenError')
    {
        return res.status(401).json({"message":err.message})
    }
return res.status(err.status||500).json({message:err.message})

 
}


export default errorhandler

