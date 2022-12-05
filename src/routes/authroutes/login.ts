import {Router, Request, Response} from 'express'
import {passport} from '../../auth/Passport'

const router:Router = Router()


router.post('', passport.authenticate('local'), (req: Request, res:Response):void=>{
   res.json({"done":req.user})
})


export {router}


