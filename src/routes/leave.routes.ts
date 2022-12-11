import {Router} from 'express'
import { add_leave_type, apply_leave, leave_types, } from '../controllers/leave.controller'
import { authorize } from '../middlewares/authorize.middleware'
import { jwtverify } from '../middlewares/jwtauth.middleware'

const router:Router = Router()


router.post("/apply", jwtverify,authorize(['staff'] ), apply_leave)
router.post("/add_type", jwtverify, authorize(['administrator']), add_leave_type)
router.get("/leave_types",jwtverify,authorize(['staff']), leave_types)

export {
    router
}