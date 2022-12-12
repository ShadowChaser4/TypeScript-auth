import { Router } from "express";
const router:Router = Router()
import {router as Leaverouter} from './leave.routes'
import {router as Holidayrouter} from './holiday.routes'
import {router as Userrouter} from './user.routes'


router.use("/leave", Leaverouter)
router.use("/holiday", Holidayrouter) 
router.use("/user", Userrouter)

export default router