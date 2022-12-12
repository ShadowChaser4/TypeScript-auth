import { Router } from "express";
const router:Router = Router()
import { login, getaccesstoken, changepassword, logout } from "../controllers/authentication.controller";
import { jwtverify } from "../middlewares/jwtauth.middleware";

router.post('/login',  login)

router.get("/access_token", getaccesstoken)

router.post("/changepassword", jwtverify,changepassword)

router.post("/logout", jwtverify, logout)


export 
{
    router
}