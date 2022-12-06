import {passport }from "./PassportLocal";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { IUser, User } from "../db/MongoDB/UserStrategy";
import { CallbackError } from "mongoose";


const ots:StrategyOptions = {
    secretOrKey:process.env.SECRETKEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

passport.use(
    new Strategy(
        ots, 
        function (jwt_payload:any, cb:Function){
        
            User.findOne({email:jwt_payload.email}, function (err:CallbackError, user:IUser)
            {

                if (err)
                {
                    return cb(err, false)
                }

                if (user)
                {
                    const {email, first_name, middle_name, last_name, roles} = jwt_payload
                    return cb(null,{email, first_name, middle_name, last_name, roles})
                }

                return cb(null, false)
            })
               
        }
    )
)

export {passport}