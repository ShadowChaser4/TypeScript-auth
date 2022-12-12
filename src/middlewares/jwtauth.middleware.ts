import  {JwtPayload, verify} from 'jsonwebtoken'
import { Request, Response } from 'express'
import { Redisclient } from '../db/Redis/Connect'



async function jwtverify(req:Request, res:Response, next:Function)
{
    const bearer :string | undefined = req.headers.authorization
    
    if (! bearer) 
        return res.
                status(401).
                json({"message":"Pass auth token within the request"}) //single line of code so no brackets

    const token = bearer?.split(" ")[1]
    
   const in_blacklist = await Redisclient.get(`bl_${token}`)
   console.log(in_blacklist)
   if (!in_blacklist) res.status(401).json({"message":"Invalid token", "status":400})

    try 
    {
       
        const unseralized = verify(token !, process.env.SECRETKEY !)
        if (typeof unseralized != 'string')
        {
            const {email, _id, roles} = unseralized
            req.user = {email, _id, roles}
            return next()
        }
       
    }
    catch(error)
    {
      res.status(400).json({"message":"Invalid token"})
    }
}

export {jwtverify}