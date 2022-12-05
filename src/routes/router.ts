import { Router } from "express";


const router:Router = Router()

const authroutes:Router = require("./authroutes/routes_auth").router
router.use('/auth',authroutes)

export default router