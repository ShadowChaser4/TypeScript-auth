import { Schema, model } from "mongoose";



interface IUser 
{
    first_name:string,
    middle_name? :string , 
    last_name:string,
    email: string, 
    password:string, 
    role: string []
}

const userSchema:Schema = new Schema<IUser>({
    first_name : {type:String, required:true}, 
    middle_name :{type:String, required:false}, 
    last_name:{type:String, required:true}, 
    email:{type:String, required:true, unique:true, index:true}, 
    password:{type:String, required:true}, 
    role :{
        type: [String], 
        required:true, 
        validate:{
            validator: function(arr :string[])
            {
                if (arr.length > 3) return false
                
                const definedroles : string[] = ['staff', 'administrator', 'manager']
                for ( let role in arr)
                {
                   if (! definedroles.includes(role))  
                   {
                       return false;
                   }
                }
            }, 
            message:" must be of type 'user' , 'administrator' or 'manager'"
        }
    }

})



const User = model <IUser> ("User", userSchema)





export{User , IUser}