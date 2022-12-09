import { Router } from "express";
import { authorize } from "../middlewares/authorize.middleware";
const router:Router = Router()
import { login, register, getaccesstoken } from "../controllers/authentication.controllers";
import { jwtverify } from "../middlewares/jwtauth.middleware";

router.post('/login',  login)

router.post("/register",jwtverify,authorize(['administrator']), register)

router.get("/access_token", getaccesstoken)



export 
{
    router
}