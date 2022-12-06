import { IUser, User} from "../../db/UserStrategy";
import { Router, Request,Response } from "express";
import { CallbackError, HydratedDocument } from "mongoose";
import { hash } from "bcrypt";

const router:Router = Router(); 




router.post("", 
  async (req:Request<IUser>, res:Response):Promise<void>=>
    {
      try{
      //  if(! req.isAuthenticated() ) 
      //  {
      //   res.status(403)
      //   res.send({"message":"not authorized"})
      //   return
      //  }
            const {email, first_name, middle_name, last_name,password, roles} = req.body
            
            const emailpattern:RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 

            if (!emailpattern.test(email)) 
            {
                  res.status(400)
                  res.json({"message":"Bad request, email invalid"})
                  return 
            }
            const hashed_password:string = await hash(password, 10)

            const user: HydratedDocument<IUser> = new User({
                first_name: first_name, 
                middle_name: middle_name, 
                last_name : last_name, 
                email:email.toLowerCase(), 
                password: hashed_password, 
                roles:roles
                
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
           
            }
            catch(error)
            {
               if (error instanceof Error)
               {
                  res.status(500)
                  res.json({"error":error.name})
               }
            }
    }
    )

export{router}

