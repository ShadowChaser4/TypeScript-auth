import { Router } from "express";
const router:Router = Router()
import {router as Authrouter} from './auth.routes'
import {router as Leaverouter} from './leave.routes'

router.use("/auth", Authrouter)
router.use("/leave", Leaverouter)



export default router