export interface User {
    _id?:any;
    name: string;
    email: string;
    password: string;
    role?: "client" | "freelancer" | "admin";
    profilePicture?: string;
    isBlocked?:boolean
}
