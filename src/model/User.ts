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
    dob: Date, 
    startingfrom:Date, 
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
        required:[true, "Enter the password"], 
        select:false, //hide password,  
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
        required:[true, "roles are required for registration"], 
        validate:{
            validator: rolevalidator , 
            message:" must be of type 'staff' , 'administrator' or 'manager'"
        }
    }

})
function rolevalidator(arr :string[]):Boolean //function that validates that entered values are only of 'staff' ,'administrator' or 'manager' type 
  {
                if (arr.length > 3) return false //only possible to add three or less than three role to a person
                
                const definedroles : string[] = ['staff', 'administrator', 'manager']
                for ( let indx in arr)
                {
                   if (! definedroles.includes(arr[indx]))  
                   {
                       return false;
                   }
                }
                return true;
}

userSchema.method("getAccessToken",async function ():Promise<string>
{
    const details = {
        email:this.email, 
        _id:this._id, 
        roles:this.roles
    }

    return sign(details, process.env.SECRETKEY !, {expiresIn:'15m'}) //15m for dev purpose only
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
    return `${this.first_name} ${this.middle_name || ' '}${this.last_name}`
}
)


const User = model <IUser, UserModel> ("User", userSchema)
export{User , IUser, IUserMethods, UserModel}