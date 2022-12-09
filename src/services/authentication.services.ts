
import { client } from '../db/Redis/Connect'
import { User } from '../model/User'
import { compare } from 'bcrypt'
import {verify, JwtPayload} from 'jsonwebtoken'

async function login_service(email:string, password:string):Promise<object>
{

  const user = await User.findOne({email:email}).select("-__v +password")

  if (! user) return {error:"User not found", status:400}

  const match:Boolean  = await compare(password,user.password)
  
  if (! match) return {error:"Password not match", status :400}
  
  const access_token:string = await user.getAccessToken()
  const refresh_token:string = await user.getRefreshToken()

  
  return {access_token, refresh_token,
     user:{email:user.email, name:user.getFullName(), joinedAt:user.joinedAt, _id:user._id}
    }

 
}


async function get_access_token(refresh_token:string):Promise<string|undefined>
{
  const unseralized:string | JwtPayload = verify(refresh_token, process.env.REFRESHKEY!) 
  if ( typeof unseralized !='string')
  {
      const user = await User.findOne({_id:unseralized._id})
      if ( ! user) throw new Error ((
                                    JSON.stringify({'message':"User not found", 'status':"404"})
                                    ))
      return await  user.getAccessToken()       
  }
}





export 
{
    login_service, 
    get_access_token
}