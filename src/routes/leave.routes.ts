import {Router} from 'express'
import { apply_leave } from '../controllers/leave.controller'
import { authorize } from '../middlewares/authorize.middleware'
import { jwtverify } from '../middlewares/jwtauth.middleware'

const router:Router = Router()


router.post("/apply", jwtverify,authorize(['staff'] ), apply_leave)


export {
    router
}