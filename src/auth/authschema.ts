import passport from "passport";
import passportLocal from 'passport-local'
import {Express} from 'express';

const LocalStrategy = passportLocal.Strategy

const user:{ username:string, password:string} = {
    username :"Kushal", password:"Hie Yaar"
}


passport.use(
  new LocalStrategy( (
    function verify(username:string, password_entered:string, cb:Function){
       console.log(username, password_entered)

        if (user.username == username && user.password == password_entered)
        {
          return cb(null, {"username": username, "hakuna":"matata"})
        }
        return  cb(null, false)

    }
  )) 
)

passport.serializeUser(
    (user:Express.User, cb: Function)=>{
       process.nextTick( ()=>{
        cb (null, {"username":user})
       })
    }
)

passport.deserializeUser(
    (user:Express.User, cb:Function) =>{
        process.nextTick( ()=>{
            return cb(null, user)
        })
    }
)


export{}
export{passport}