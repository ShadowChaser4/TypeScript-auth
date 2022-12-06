import passport from "passport";
import passportLocal from 'passport-local'
import { IUser, User } from "../db/MongoDB/UserStrategy";
import { CallbackError, HydratedDocument } from "mongoose";
import {compare} from 'bcrypt';
const LocalStrategy = passportLocal.Strategy




passport.use(
  new LocalStrategy( (
 async function verify(username:string, password_entered:string, cb:Function){
    try{  
    const user: IUser |null = await User.findOne({email:username.toLowerCase()})

    if (! user) return cb(null, false)

    const match: Boolean = await compare(password_entered, user.password)
    
    if (! match) return cb(null, false)

    const {email,first_name, middle_name, last_name , roles} = user

    return cb(null , {email, first_name, middle_name, last_name, roles})

       
    }
    catch(err)
    {
      if (err instanceof Error)
      {
        cb(err, false)
      }
    }
  }
  )) 
)



export{passport}