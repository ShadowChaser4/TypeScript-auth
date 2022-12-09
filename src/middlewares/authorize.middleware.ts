import { Request, Response, NextFunction } from "express"
import { authuser } from "../types"

export const authorize  = (authorized_roles:string[]):any=>{
  return  (req:Request<authuser>, res:Response, next:NextFunction):any=>{
        const {roles} = req.user!

        for (let role of roles!)
        {
            
            if (authorized_roles.includes(role)) return next()
        }
              res.
               status(401).
               json({"message":"You are not authorized to perfrom this action"})
    }
}

