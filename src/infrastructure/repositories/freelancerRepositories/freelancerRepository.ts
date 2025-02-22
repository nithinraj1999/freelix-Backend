

export class FreelancerRepository{
    private freelancerModel
    constructor(freelancerModel:any){
        this.freelancerModel = freelancerModel
    }


    async getAllFreelancers() {
        try {
            const freelancer = await this.freelancerModel
                .find({ hasFreelancerAccount: true }, { _id: 1 })
                .lean()
            return freelancer
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}