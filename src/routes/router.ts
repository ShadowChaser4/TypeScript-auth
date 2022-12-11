import { Router } from "express";
const router:Router = Router()
import {router as Authrouter} from './auth.routes'
import {router as Leaverouter} from './leave.routes'
import {router as Holidayrouter} from './holiday.routes'

router.use("/auth", Authrouter)
router.use("/leave", Leaverouter)
router.use("/holiday", Holidayrouter) 


export default router