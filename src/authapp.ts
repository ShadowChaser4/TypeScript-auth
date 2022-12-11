import express, {Express} from "express";
import { urlencoded,json } from "body-parser";
import {router as Authrouter} from './routes/auth.routes'
import errorhandler from "./middlewares/errrorhandler";

const authapp:Express = express()

authapp.use(json()) //for json support
authapp.use(urlencoded({extended:false}))//for x-www-form-urlencoded support

authapp.use('/auth', Authrouter)
authapp.use(errorhandler)


export default authapp
