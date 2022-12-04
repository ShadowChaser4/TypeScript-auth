import express from 'express';
import bodyparser from 'body-parser'
import {passport} from './auth/authschema'
import router from './routes/routes';
const app  = express();
const session = require("express-session")

///for parsing json////
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())


//setting sessions
app.use(
   session({
    secret:"Hello world", 
    resave:false, 
    saveUninitialized:true,
    cookie:{
        maxAge:(864000)
    }
   })
)

//setting passport configs
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('session'))



app.use('',router )
export{}
export {app}