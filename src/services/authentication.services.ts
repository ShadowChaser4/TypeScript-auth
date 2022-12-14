
import { Redisclient } from '../db/Redis/Connect'
import { IUser, IUserMethods, User, UserModel } from '../model/User'
import { compare, hash } from 'bcrypt'
import {verify, JwtPayload} from 'jsonwebtoken'
import { HydratedDocument } from 'mongoose'
import { hostname } from 'os'
import sendemail from '../utils/sendemail.utils'


async function login_service(email:string, password:string):Promise<object>
{

  const user = await User.findOne({email:email}).select("-__v +password")

  if (! user) throw ({message:"User not found", status:404})

  const match:Boolean  = await compare(password,user.password)
  
  if (! match) throw ({message:"Invalid password", status:400})
  
  const access_token:string = await user.getAccessToken()
  const refresh_token:string = await user.getRefreshToken()

  
  return {access_token, refresh_token,
     user:{email:user.email, name:user.getFullName(), started_from:user.startingfrom, _id:user._id, roles:user.roles, designation:user.designation}
    }

 
}


async function get_access_token(refresh_token:string):Promise<string|undefined>
{
  const in_blacklist = await Redisclient.get(`bl_${refresh_token}`)
  if ( in_blacklist) throw ({"status":400,"message":"Invalid token"})

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
  
  const match:Boolean =await compare(oldpassword,user.password) //compare old password with entered one
  if (! match) throw ({"status":401, "message":"Incorrect password"})

  const hash_password:string = await hash(password,10) //hash the password
  user.password = hash_password
  await user.save() 
  //save it

  return {message:"Successfully changed password"} 
  
}


async function resettoken_service(user:HydratedDocument<IUser,{},IUserMethods>,host:string)
{
  console.log('working here')
  const token:string= await user.generatePasswordResetToken()
  
  const subject :string = "Password reset"
  const message :string = `Dear sir/madam \n
                             ${user.getFullName()}, your password for account has been reset. \n 
                            Click on below link to proceed: If this isn't by you or by your admin, please contact admin immediately. \n
                            ${'localhost:3001'/* only for dev purpose */}/auth/recover/id/${user._id}/token/${token} \n
                            \n note: It is only valid for 30 minutes`
  const email: string = user.email
  try 
  {

   await sendemail(subject,message,email)
  }
  catch(err)
  {
    console.log(err)
    throw ({"status":500, "message":"Something wrong with email server"})
  }

}


async function resetpassword_service(id:string, token:string,password:string)
{
  console.log(`id ${id}, token ${token}, password ${password}`)
  const user = await User.findOne({_id:id}).select("+password")
  
  if (! user) throw ({"status":404,"message":"User not found"})
   
   await user.verifyReset(token)
  //verify that user is indeed allowed to reset password
 
  const hash_password =await  hash(password,10)
  user.password  = hash_password
  await user.save()
  return ({"message":"Password set"})
}

async function logout_service(access_token:string, refresh_token:string, user:Express.User):Promise<object |undefined>
{
 const unseralized:string | JwtPayload = verify(refresh_token,process.env.REFRESHKEY !)
 //verifying refresh_token is valid
 if (typeof unseralized !='string') //typescript mandated check that infact decoded info isn't string
 {
   
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
    logout_service, 
    resettoken_service, 
    resetpassword_service
}