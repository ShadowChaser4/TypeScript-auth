import { IUser, User} from "../../db/UserStrategy";
import { Router, Request,Response } from "express";
import { CallbackError, HydratedDocument } from "mongoose";


const router:Router = Router(); 




router.post("", 
   (req:Request<IUser>, res:Response):void=>
    {
       if(! req.isAuthenticated() ) 
       {
        res.status(403)
        res.send({"message":"not authorized"})
        return
       }
            const {email, first_name, middle_name, last_name,password, role} = req.body

            const user: HydratedDocument<IUser> = new User({
                first_name: first_name, 
                middle_name: middle_name, 
                last_name : last_name, 
                email:email, 
                password:password, 
                role:role
                
            })
            
            user.save(
               (error:CallbackError, user:IUser)=>{
                  if (error)
                  {
                    res.status(503)
                    res.json({"message":error.message})
                    return
                  }
                  
                   res.json({
                    user
                })

               }
            )
           

    })

export{router}

