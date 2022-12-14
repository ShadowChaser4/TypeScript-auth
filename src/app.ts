import express from 'express';
const app  = express();
require("dotenv").config()
import {json, urlencoded} from 'body-parser'
import router from './routes/router';


///for parsing json and x-www-form-urlencoded////
app.use(urlencoded({extended:false}))//for x-www-form-urlencoded
app.use(json())//for json


app.use('',router )

export {app}