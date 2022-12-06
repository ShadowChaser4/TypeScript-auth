import {Router} from 'express';

const router:Router = Router()

const loginrouter:Router = require("./login").router
router.use('/login', loginrouter)

const registerrouter:Router = require("./register").router
router.use("/register", registerrouter)

const gettoken:Router = require("./gettoken").router
router.use("/gettoken", gettoken)

export {router}