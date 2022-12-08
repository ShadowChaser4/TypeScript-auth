
import { client } from '../db/Redis/Connect'
import { User } from '../model/User'
import { compare } from 'bcrypt'

async function login_service(username:string, password:string):Promise<object>
{

  const user = await User.findOne({email:username}).select("-__v +password")

  if (! user) return {error:"User not found", status:400}

  const match:Boolean  = await  compare(password, user.password)
  
  if (! match) return {error:"Password not match", status :400}
  
  const access_token:string = await user.getAccessToken()
  const refresh_token:string = await user.getRefreshToken()

  
  return {access_token, refresh_token, user}

 
}


async function get_access_token(refresh_token:string)
{}





export 
{
    login_service
}