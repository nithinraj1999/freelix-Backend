

export interface IFreelancerRepository{
    createFreelancerAccount(data: any, profileImagePath: string | null):Promise<any>
    getAllFreelancers():Promise<any>
    findFreelancerById(id: string) :Promise<any>
    switchToBuying(userID: string):Promise<any>
    switchToSelling(userID: string):Promise<any>
    editProfile(data: any, portfolioUrl:null | string):Promise<any>
    getFreelancerDetails(freelancerId: string):Promise<any>
    deletePortFolioImg(imageId: string, userId: string):Promise<any>
    dashboardData(userId:any):Promise<any>
}