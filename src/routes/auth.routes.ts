import { Router } from "express";
const router:Router = Router()
import { login, getaccesstoken, changepassword, logout, generateresetoken, resetpassword } from "../controllers/authentication.controller";
import { authorize } from "../middlewares/authorize.middleware";
import { jwtverify } from "../middlewares/jwtauth.middleware";

router.post('/login',  login)

router.get("/access_token", getaccesstoken)

router.post("/changepassword", jwtverify,changepassword)

router.post("/resetpassword", jwtverify,authorize(['administrator','root']), generateresetoken)

router.patch("/recover/id/:id/token/:token",resetpassword)

router.post("/logout", jwtverify, logout)


export 
{
    router
}