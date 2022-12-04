import {Router, Request,Response} from 'express';

const router:Router = Router()

const loginrouter:Router = require("./login").router
router.use('/login', loginrouter)

export {}
export default router