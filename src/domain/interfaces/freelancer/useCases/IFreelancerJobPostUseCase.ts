export interface IFreelancerJobPostUseCase{
    getJobList(projectType: string, minPrice: string, maxPrice: string, skills: any, deliveryDays: string, sort: string, search: string, page: string, experience: string, freelancerSkills: any):Promise<any>
    getJobListCount():Promise<any>
    getJobDetails(jobID: string):Promise<any>
}