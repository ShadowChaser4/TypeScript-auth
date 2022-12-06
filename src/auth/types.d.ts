import usertypes from './usertypes'
export {};
declare global {
 namespace Express {
  export interface User {
   username?: string;
  }
 }
}