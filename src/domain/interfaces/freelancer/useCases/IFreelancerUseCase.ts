
export interface IFreelancerUseCase{
    createFreelancer(data:any,file:any | null):Promise<any>
    findFreelancerById (id:string):Promise<any>
    switchToBuying(id:string):Promise<any>
    switchToSelling(id:string):Promise<any>
    editProfile(data:any,file: any):Promise<any>
    fetchFreelancerDetails(freelancerId:string):Promise<any>;
    deletePortFolioImg(imageId:string,userId:string,image:string):Promise<any>
    dashboardData(userId:string):Promise<any>
    getSkills():Promise<any>
}