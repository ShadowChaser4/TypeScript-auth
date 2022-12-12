
import { Redisclient } from '../db/Redis/Connect'
import { IUser, User } from '../model/User'
import { compare, hash } from 'bcrypt'
import {verify, JwtPayload} from 'jsonwebtoken'


async function login_service(email:string, password:string):Promise<object>
{

  const user = await User.findOne({email:email}).select("-__v +password")

  if (! user) throw ({message:"User not found", status:404})

  const match:Boolean  = await compare(password,user.password)
  
  if (! match) throw ({message:"Invalid password", status:400})
  
  const access_token:string = await user.getAccessToken()
  const refresh_token:string = await user.getRefreshToken()

  
  return {access_token, refresh_token,
     user:{email:user.email, name:user.getFullName(), joinedAt:user.joinedAt, _id:user._id, roles:user.roles}
    }

 
}


async function get_access_token(refresh_token:string):Promise<string|undefined>
{
  const in_blacklist = await Redisclient.get(`bl_${refresh_token}`)
  if (! in_blacklist) throw ({"status":400,"message":"Invalid token"})
  const unseralized:string | JwtPayload = verify(refresh_token, process.env.REFRESHKEY!) //verifying the refresh 

  if ( typeof unseralized !='string')
  {
      const user = await User.findOne({_id:unseralized._id})
      if ( ! user) throw ({message:"User not found", status:404})
      return await  user.getAccessToken()       
  }
}

async function change_password(oldpassword:string,password:string, auth_user:Express.User)
{
  const user = await User.findOne({_id:auth_user._id!}).select("-__v +password")
  if (! user) throw ({"status":404, "message":"No user found"})
  // if not user found throw 404 error
  console.log(user)
  console.log(oldpassword)
  const match:Boolean =await compare(oldpassword,user.password) //compare old password with entered one
  if (! match) throw ({"status":401, "message":"Incorrect password"})

  const hash_password:string = await hash(password,10) //hash the password
  user.password = hash_password
  await user.save() 
  //save it

  return {message:"Successfully changed password"} 
  
}

async function logout_service(access_token:string, refresh_token:string, user:Express.User):Promise<object |undefined>
{
 const unseralized:string | JwtPayload = verify(refresh_token,process.env.REFRESHKEY !)
 //verifying refresh_token is valid
 if (typeof unseralized !='string') //typescript mandated check that infact decoded info isn't string
 {
    console.log(user._id)
    console.log(unseralized._id)
    if (user._id != unseralized._id) throw({"message":"invalid access and refresh token", "status":400})
     //making sure that refresh and access token is of same user

     //blacklisting access and refresh token
    const value :string= "blacklisted"
    await Redisclient.setEx(`bl_${refresh_token}`,unseralized.exp as number,value) //keep value until the token expires
    await Redisclient.setEx(`bl_${access_token}`, 60*15, value) //keep value for 15 minutes

    return {"message":"Logged out successfully"}
 }
}




export 
{
    login_service, 
    get_access_token, 
    change_password, 
    logout_service
}