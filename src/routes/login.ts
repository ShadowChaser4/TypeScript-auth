import {Router, Request, Response} from 'express'
import {passport} from '../auth/authschema'

const router:Router = Router()


router.post('', passport.authenticate('local'), (req: Request, res:Response)=>{
   res.json({"done":req.user})
})


export {router}


