export interface IUserUseCase{
    editData(profilePicture:any,name:string,email:string,userId:string):Promise<any>
    getUserData(userId:string):Promise<any>
    validateAndStorePassword(userId:string,password:string,confirmPassword:string):Promise<any>
    resetPassword(email:string):Promise<any>
    fetchFreelancerDetails(freelancerId:string):Promise<any>
    getAllFreelancers():Promise<any>

}