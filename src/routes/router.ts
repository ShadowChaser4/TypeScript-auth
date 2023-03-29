import { Router } from "express";
const router:Router = Router()
import {router as Userrouter} from './user.routes'


router.use("/user", Userrouter)

export default router