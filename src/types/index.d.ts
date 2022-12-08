
export {};

export interface authuser {
    email?:string, 
    first_name?:string, 
    middle_name?:string, 
    last_name?:string, 
    roles?:string[]
  }
  
  
declare global {
 namespace Express {
  interface User extends authuser {
 
  }
 }

}

