import { Router } from "express";
const router:Router = Router()
import {router as Leaverouter} from './leave.routes'
import {router as Holidayrouter} from './holiday.routes'


router.use("/leave", Leaverouter)
router.use("/holiday", Holidayrouter) 


export default router