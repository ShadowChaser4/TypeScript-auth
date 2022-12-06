import { Router , Request, Response} from "express";
import {passport} from '../../auth/Jwtconfig'
const router:Router = Router()

router.get("", passport.authenticate('jwt', {session:false}),
(req:Request,res:Response) =>{
     const token: string= req.headers.authorization?.split(" ")[1]!;
     res.json({"token":token, ...req.user})
}
)

export {router}