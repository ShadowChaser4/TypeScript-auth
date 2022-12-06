import express from 'express';
const app  = express();

require("dotenv").config()
import bodyparser from 'body-parser'
import {passport} from './auth/Jwtconfig'
import router from './routes/router';

///for parsing json////
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())


//setting passport configs
app.use(passport.initialize())




app.use('',router )
export {app}