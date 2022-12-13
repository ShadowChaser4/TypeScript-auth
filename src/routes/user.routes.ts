import { Router } from "express";
import { register, update_own_details } from "../controllers/user.contorllers";
import { jwtverify } from "../middlewares/jwtauth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { getuser } from "../controllers/user.contorllers";

const router:Router = Router()


router.post("/register",jwtverify,authorize(['administrator']), register)

router.get("/get", jwtverify, getuser)

router.post("/edit-own", jwtverify,update_own_details)


export {router}