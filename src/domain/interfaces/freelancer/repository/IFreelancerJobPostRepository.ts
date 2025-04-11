export interface IFreelancerJobPostRepository {
    jobList(
        projectType: string,
        minPrice: string,
        maxPrice: string,
        skills: string[],
        deliveryDays: string,
        sort: string,
        search: string,
        page: string,
        experience: string,
        freelancerSkills: any
    ): Promise<any>

    getJobListCount():Promise<any>
    jobDetails(jobID: string):Promise<any>
}
