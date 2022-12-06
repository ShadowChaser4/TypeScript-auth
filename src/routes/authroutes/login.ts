import {Router, Request, Response} from 'express'
import {passport} from '../../auth/PassportLocal'
import {sign} from 'jsonwebtoken'

const router:Router = Router()


router.post('', passport.authenticate('local', {session:false}),
 (req: Request, res:Response):void=>{

   const secret:any = process.env.SECRETKEY
   const token:any = sign(
      {...req.user}, 
      secret,
      )
   res.json({"access_token":token, ...req.user})
 })


export {router}


