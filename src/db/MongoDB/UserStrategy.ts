import { Schema, model } from "mongoose";


interface IUser 
{
    first_name:string,
    middle_name? :string , 
    last_name:string,
    email: string, 
    password:string, 
    roles: string []
}

const userSchema:Schema = new Schema<IUser>({
    first_name : {type:String, required:true}, 

    middle_name :{type:String, required:false}, 

    last_name:{type:String, required:true}, 

    email:{type:String, required:true, unique:true, index:true,},

    password:{type:String, required:true}, 

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



const User = model <IUser> ("User", userSchema)





export{User , IUser}