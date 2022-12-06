import {Router, Request, Response} from 'express'
import {passport} from '../../auth/PassportLocal'
import {sign} from 'jsonwebtoken'
import { client } from '../../db/Redis/Connect'
import { IUser } from '../../db/MongoDB/UserStrategy'
const router:Router = Router()


router.post('', passport.authenticate('local', {session:false}),
 (req: Request, res:Response):void=>{

   const secret:any = process.env.SECRETKEY
   const token:any = sign(
      {...req.user}, 
      secret,
      {
        expiresIn:"1d"
      }
      )
   const user:string | undefined=req.user?.username
   console.log(user)

   res.json({"access_token":token, ...req.user})
 })


export {router}


