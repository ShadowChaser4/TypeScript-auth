
export {};

export interface authuser {
    email?:string, 
    first_name?:string, 
    middle_name?:string, 
    last_name?:string, 
    roles?:string[], 
    _id?:string
  }
  
  
declare global {
 namespace Express {
 export interface User extends authuser {
 
  }
 }

}

