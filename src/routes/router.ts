import { Router } from "express";
const router:Router = Router()
import {router as Authrouter} from './auth.routes'
import errorhandler from "../utils/errrorhandler";


router.use("/auth", Authrouter)




export default router