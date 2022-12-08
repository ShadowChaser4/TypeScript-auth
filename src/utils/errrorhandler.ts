import { NOTFOUND } from "dns";
import { Request, Response } from "express";


function errorhandler(err:Error| any,req:Request, res:Response, next:Function)
{
if (err instanceof Error){
    if (err.name == 'ValidationError')
    return res.status(400).json({message:err.message})

return res.status(500).json({message:err.message})
}
return res.status(500).json({"message":err.message})

 
}


export default errorhandler

