import passport from "passport";
import passportLocal from 'passport-local'
import { IUser, User } from "../db/UserStrategy";
import { CallbackError, HydratedDocument } from "mongoose";
const LocalStrategy = passportLocal.Strategy




passport.use(
  new LocalStrategy( (
    function verify(username:string, password_entered:string, cb:Function){
      
     User.findOne({email:username}, 
      function(err:CallbackError, user:IUser )
      {
        
        if (err)
        {
          return cb(err, false)
        }

        if (! user)
        {
          return cb(null , false)
        }

        const {email,first_name, middle_name, last_name , roles} = user

        return cb(null , {email, first_name, middle_name, last_name, roles})

      }
      ) 
       

        

    }
  )) 
)



export{passport}