import { IFreelancerRepository } from '../../../domain/interfaces/freelancer/repository/IFreelancerRepository'
import OrderModel from '../../models/orderModel'
import mongoose from 'mongoose'
import BidModel from '../../models/bidModel'
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

    
        async dashboardData(userId: string) {
            try {
                const userObjectId = new mongoose.Types.ObjectId(userId)
    
                const revenueData = await OrderModel.aggregate([
                    {
                        $match: {
                            freelancerId: userObjectId,
                            status: 'Completed',
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: '$total' },
                            totalEarnings: {
                                $sum: {
                                    $multiply: ['$total', 0.7],
                                },
                            },
                        },
                    },
                ])
    
                const pendingData = await OrderModel.aggregate([
                    {
                        $match: {
                            freelancerId: userObjectId,
                            status: 'pending',
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalPendingEarnings: {
                                $sum: {
                                    $multiply: ['$total', 0.7],
                                },
                            },
                        },
                    },
                ])
                const totalOrders = await OrderModel.aggregate([
                    {
                        $match: {
                            freelancerId: userObjectId,
                        },
                    },
                    {
                        $count: 'totalOrders',
                    },
                ])
    
                const totalBids = await BidModel.aggregate([
                    {
                        $match: {
                            freelancerId: userObjectId,
                        },
                    },
                    {
                        $count: 'totalBids',
                    },
                ])
                const pendingOrders = await OrderModel.aggregate([
                    {
                        $match: {
                            freelancerId: userObjectId,
                            status: 'pending',
                        },
                    },
                    {
                        $count: 'totalPendingOrders',
                    },
                ])
    
                const orderByDate = await OrderModel.aggregate([
                    {
                        $match: {
                            freelancerId: userObjectId,
                            status: 'Completed',
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            orderDate: 1,
                            total: 1,
                        },
                    },
                ])
    
                const totalPendingOrders =
                    pendingOrders.length > 0
                        ? pendingOrders[0].totalPendingOrders
                        : 0
                const totalBidsCount =
                    totalBids.length > 0 ? totalBids[0].totalBids : 0
                const totalOrdersCount =
                    totalOrders.length > 0 ? totalOrders[0].totalOrders : 0
                const pendingEarnings =
                    pendingData.length > 0 ? pendingData[0].totalPendingEarnings : 0
                const revenue =
                    revenueData.length > 0 ? revenueData[0].totalRevenue : 0
                const earnings =
                    revenueData.length > 0 ? revenueData[0].totalEarnings : 0
    
                // console.log(revenue);
                // console.log(earnings);
                // console.log(pendingEarnings);
                // console.log(totalOrdersCount);
                // console.log(totalBidsCount);
                // console.log(totalPendingOrders);
                // console.log(orderByDate);
    
                return {
                    revenue,
                    earnings,
                    pendingEarnings,
                    totalOrdersCount,
                    totalBidsCount,
                    totalPendingOrders,
                    orderByDate,
                }
            } catch (error) {
                console.error(
                    'Error calculating total revenue and earnings:',
                    error
                )
                throw error
            }
        }
}
