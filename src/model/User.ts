import { compare } from "bcrypt";
import { Schema, model, Model } from "mongoose";
import { sign } from "jsonwebtoken";

interface IUser 
{
    first_name:string,
    middle_name? :string , 
    last_name:string,
    email: string, 
    password:string, 
    roles: string [], 
    joinedAt: Date, 
    dob: Date
}

interface IUserMethods
{
    getAccessToken(): string 
    getRefreshToken(): string , 
    getFullName(): string, 

}

type UserModel = Model<IUser, {}, IUserMethods>

const userSchema:Schema = new Schema<IUser, UserModel,IUserMethods>({
    first_name : {type:String, 
                  required:[true, 'first name required']
                }, 
    middle_name :{
        type:String,
        }, 

    last_name:{type:String, 
        required:[true, "last name required"]
    }, 

    email:{type:String,
         required:[true, "enter a valid email address"], 
         unique:true, 
         lowercase:true,
         match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },

    password:{type:String, 
        required:[true, "Enter your password"], 
        select:false //hide password
    }, 

    joinedAt: {
      type:Date, 
      default :new Date(), 
      immutable:true
     },

     dob: {
        type: Date
     },
    roles :{
        type: [String], 
        required:true, 
        validate:{
            validator: function(arr :string[])
            {
                if (arr.length > 3) return false
                
                console.log(arr)
                const definedroles : string[] = ['staff', 'administrator', 'manager']
                for ( let indx in arr)
                {
                    
                    console.log( !definedroles.includes(arr[indx]))
                   if (! definedroles.includes(arr[indx]))  
                   {
                       return false;
                   }
                }
                return true;
            }, 
            message:" must be of type 'staff' , 'administrator' or 'manager'"
        }
    }

})


userSchema.method("getAccessToken",async function ():Promise<string>
{
    const details = {
        email:this.email, 
        _id:this._id, 
        roles:this.roles
    }

    return sign(details, process.env.SECRETKEY !, {expiresIn:'5m'})
}
)

userSchema.method("getRefreshToken",async function getRefreshToken ():Promise<string> 
{
    const details = {
        _id: this._id,
        refresh_token : true
    }
    return sign(details, process.env.REFRESHKEY!, {expiresIn:"1d"} )
}
)

userSchema.method( "getFullName", function getFullName():string{
    return this.first_name + this.middle_name || null + this.last_name
}
)

const User = model <IUser, UserModel> ("User", userSchema)






export{User , IUser, IUserMethods, UserModel}