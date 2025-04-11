import { IFreelancerRepository } from '../../../domain/interfaces/freelancer/repository/IFreelancerRepository'

export class FreelancerRepository implements IFreelancerRepository {
    private freelancerModel
    constructor(freelancerModel: any) {
        this.freelancerModel = freelancerModel
    }

    async createFreelancerAccount(data: any, profileImagePath: string | null) {
        try {
            const { name, description, skills, languages, education, userID } =
                data
            const skillsArray: string[] = Array.isArray(skills)
                ? skills
                : typeof skills === 'string'
                ? JSON.parse(skills)
                : []

            const languageArray: string[] = Array.isArray(languages)
                ? languages
                : typeof languages === 'string'
                ? JSON.parse(languages)
                : []

            const response = await this.freelancerModel.updateOne(
                { _id: userID },
                {
                    $set: {
                        title: name,
                        description: description,
                        languages: languageArray,
                        skills: skillsArray,
                        profilePicture: profileImagePath,
                        role: 'freelancer',
                        hasFreelancerAccount: true,
                    },
                }
            )
            return response
        } catch (error) {
            console.error(error)
        }
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

    async findFreelancerById(id: string) {
        try {
            const freelancer = await this.freelancerModel.findOne({ _id: id })
            return freelancer
        } catch (error) {
            console.error()
        }
    }

    async switchToBuying(userID: string) {
        try {
            const freelancer = await this.freelancerModel.updateOne(
                { _id: userID },
                { $set: { role: 'client' } }
            )
            return freelancer
        } catch (error) {
            console.error()
        }
    }

    async switchToSelling(userID: string) {
        try {
            const freelancer = await this.freelancerModel.updateOne(
                { _id: userID },
                { $set: { role: 'freelancer' } }
            )
            return freelancer
        } catch (error) {
            console.error()
        }
    }

    async editProfile(data: any, portfolioUrl: string) {
        try {
            const { userID, name, title, description, skills } = data
            const updateObject: any = {}
            if (name) {
                updateObject.name = name
            }
            if (title) {
                updateObject.title = title
            }

            if (description) {
                updateObject.description = description
            }
            if (skills) {
                updateObject.skills = skills
            }
            if (portfolioUrl) {
                const portfolioItem = {
                    image: portfolioUrl,
                    title: title || '',
                    description: description || '',
                }

                const updatedPortfolio =
                    await this.freelancerModel.findOneAndUpdate(
                        { _id: userID },
                        { $push: { portfolio: portfolioItem } },
                        { new: true, projection: { password: 0 } }
                    )
                return updatedPortfolio
            }
            const updatedUser = await this.freelancerModel.findOneAndUpdate(
                { _id: userID },
                { $set: updateObject },
                { new: true, projection: { password: 0 } }
            )
            return updatedUser
        } catch (error) {
            console.error('Error updating profile:', error)
            throw error
        }
    }

    async getFreelancerDetails(freelancerId: string) {
        try {
            const details = await this.freelancerModel.findOne({
                _id: freelancerId,
            })
            return details
        } catch (error) {
            throw error
        }
    }

    async deletePortFolioImg(imageId: string, userId: string) {
        try {
            const deletePortfolio = await this.freelancerModel.updateOne(
                { _id: userId },
                { $pull: { portfolio: { _id: imageId } } }
            )
            return deletePortfolio
        } catch (error) {
            throw error
        }
    }
}
