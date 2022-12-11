import { Router } from "express";
import { createholiday } from "../controllers/holiday.controller";
import { authorize } from "../middlewares/authorize.middleware";
import { jwtverify } from "../middlewares/jwtauth.middleware";

const router:Router = Router()


router.post("/create",jwtverify,authorize(['administrator']), createholiday)


export {
    router
}