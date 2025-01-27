// import { IUserRepository } from "../../domain/ports/userRepositoryInterface";
import { IUserRepository } from './interface/userRepositoryInterface'
import { User } from '../../domain/entities/user'
import userModel from '../models/userModel'
import Otp from '../models/otpModel'
import jobPostModel from '../models/jobPostModel'
import { IJobPost } from '../models/jobPostModel'
import BidModel from '../models/bidModel'
import notificationModel from '../models/notification'
import skillsModel from '../models/skillsModel'
import OrderModel from '../models/orderModel'
import EscrowModel from '../models/escrow'
import mongoose from 'mongoose'
import WalletModel from '../models/wallet'
import ReviewModel from '../models/reviewModel'
import MessageModel from '../models/message'
import { skip } from 'node:test'

export class UserRepository implements IUserRepository {
    async checkEmailExist(email: string): Promise<User | null> {
        try {
            const user = await userModel.findOne({
                email: email,
                isAdmin: false,
                isBlock: false,
            })
            if (!user) return null
            return user
        } catch (error) {
            throw error
        }
    }
    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await userModel.findOne({
                email: email,
                isAdmin: false,
                isBlock: false,
                isVerified: true,
            })
            if (!user) return null
            return user
        } catch (error) {
            throw error
        }
    }

    async save(user: User): Promise<User> {
        const newUser = userModel.create({
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            isVerified: true,
        })
        return newUser
    }

    async saveUserOtp(otp: string, email: string, userDta: any): Promise<any> {
        const otpExpirationTime = 120000
        const newOtp = new Otp({
            otp: otp,
            email: email,
            userData: {
                name: userDta.name,
                email: userDta.email,
                password: userDta.password,
                phone: userDta.phone,
            },
            createdAt: Date.now(),
        })
        const otpDoc = await newOtp.save()
        setTimeout(async () => {
            await Otp.updateOne({ email: email }, { $set: { otp: null } })
        }, otpExpirationTime)
        return otpDoc
    }

    async updateUserOtp(otp: string, email: string): Promise<any> {
        const newOtp = await Otp.findOneAndUpdate(
            { email: email },
            { $set: { otp: otp } }
        )
        return newOtp
    }

    async findOTP(otp: string, email: string) {
        const matchOTP = await Otp.findOne({ email: email, otp: otp })
        return matchOTP
    }

    async findById(userID: string): Promise<User | null> {
        try {
            const user = await userModel.findOne({ _id: userID })
            if (!user) return null
            return user
        } catch (error) {
            throw error
        }
    }

    async createJobPost(data: IJobPost, file: string | null) {
        try {
            const {
                userID,
                title,
                category,
                skills,
                subCategory,
                description,
                experience,
                fixedPrice,
                paymentType,
                hourlyPrice,
            } = data
            console.log(skills)
            const skillsArray: string[] = Array.isArray(skills)
                ? skills
                : typeof skills === 'string'
                ? JSON.parse(skills) // Use JSON.parse to convert the string into an array
                : [] // Default to an empty array if skills is undefined or not a string

            const response = await jobPostModel.create({
                userID: userID,
                title: title,
                category: category,
                subCategory: subCategory,
                skills: skillsArray,
                file: file, // File will either be a string or null
                description: description,
                experience: experience,
                paymentType: paymentType,
                fixedPrice: fixedPrice,
                hourlyPrice: {
                    from: hourlyPrice?.from,
                    to: hourlyPrice?.to,
                },
            })

            return response
        } catch (error) {
            console.error('Error creating job post:', error)
            // Rethrow the error so that it can be handled by the use case or controller
            throw new Error('Failed to create job post')
        }
    }

    async getAllFreelancers() {
        try {
            const freelancer = await userModel
                .find({ hasFreelancerAccount: true }, { _id: 1 })
                .lean()
            return freelancer
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getAllJobPosts(userID: string, searchQuery: string, page: string) {
        try {
            const searchFilter = searchQuery
                ? {
                      $or: [
                          { title: { $regex: searchQuery, $options: 'i' } }, // Case insensitive search for job title
                      ],
                  }
                : {}
            const skip = parseInt(page) * 3 - 3
            const MyPost = await jobPostModel
                .find({ userID: userID, isDelete: false, ...searchFilter })
                .skip(skip)
                .limit(3)
            const totalDocs = await jobPostModel.countDocuments({
                userID: userID,
                isDelete: false,
                ...searchFilter,
            })
            console.log(MyPost)

            return { MyPost, totalDocs }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async deleteJobPost(jobId: string) {
        try {
            const result = await jobPostModel.findByIdAndUpdate(
                { _id: jobId },
                { $set: { isDelete: true } }
            ) // Delete job by ID
            return result
        } catch (error) {
            console.error(`Error deleting job with ID ${jobId}:`, error)
        }
    }

    async editPost(data: any) {
        try {
            const {
                _id,
                title,
                description,
                skills,
                paymentType,
                hourlyPrice,
                fixedPrice,
            } = data

            const updateData: Partial<{
                title: string
                description: string
                skills: string[]
                paymentType: string
                hourlyPrice?: {
                    from?: number
                    to?: number
                } | null
                fixedPrice?: number | null
            }> = {
                title,
                description,
                skills,
                paymentType,
            }

            if (paymentType === 'hourly') {
                updateData.hourlyPrice = {
                    from: hourlyPrice.from,
                    to: hourlyPrice.to,
                }
                updateData.fixedPrice = null
            } else if (paymentType === 'fixed') {
                updateData.fixedPrice = fixedPrice
                updateData.hourlyPrice = null
            }

            const result = await jobPostModel.findByIdAndUpdate(
                _id,
                updateData,
                {
                    new: true,
                }
            )

            if (result) {
                return result 
            } else {
                console.log('Job post not found.')
                return null 
            }
        } catch (error) {
            console.error(`Error updating job post with ID ${data._id}:`, error)
            throw error 
        }
    }

    async jobDetails(jobId: string) {
        try {
            const jobDetails = await jobPostModel.findOne({ _id: jobId })
            return jobDetails
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async allBids(jobId: string) {
        try {
            const allBids = await BidModel.find({
                jobId: jobId,
                status: { $ne: 'Withdrawn' },
            })
                .populate('freelancerId')
                .sort({ createdAt: -1 })
            return allBids
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getFreelancerDetails(freelancerId: string) {
        try {
            const details = await userModel.findOne({ _id: freelancerId })
            return details
        } catch (error) {
            throw error
        }
    }

    async fetchAllNotifications(userID: string) {
        try {
            const notifications = await notificationModel.find({
                userID: userID,
            })
            return notifications
        } catch (error) {
            throw error
        }
    }

    async getSkills() {
        try {
            const skills = await skillsModel.find({}, { skill: 1, _id: 0 })
            return skills
        } catch (error) {
            throw error
        }
    }

    async storeOrder(
        bidAmount: string,
        userId: string,
        bidId: string,
        freelancerId: string,
        jobId: string
    ) {
        try {
            const order = await OrderModel.create({
                projectId: jobId,
                clientId: userId,
                freelancerId: freelancerId,
                bidId: bidId,
                paymentStatus: 'completed',
                total: bidAmount,
            })

            // ========= store funds in escrow

            const escrow = await EscrowModel.create({
                clientId: userId,
                freelancerId: freelancerId,
                projectId: jobId,
                amount: bidAmount,
            })

            return order
        } catch (error) {
            throw error
        }
    }

    async getAllHirings(clientId: string) {
        try {
            const hirings = await OrderModel.find({ clientId: clientId })
                .populate('projectId','title')
                .populate('freelancerId', 'name')
            return hirings
        } catch (error) {
            throw error
        }
    }

 
    async releasePayment(
        projectId: string,
        clientId: string,
        freelancerId: string,
        total: string
    ) {
        try {
            const totalAmount = parseFloat(total)

            const freelancerAmount = totalAmount * 0.7
            const platformCharge = totalAmount * 0.3

            const escrowUpdate = await EscrowModel.findOneAndUpdate(
                { clientId, freelancerId, projectId },
                { $set: { amount: platformCharge } },
                { new: true }
            ).populate('projectId') 

            let freelancerWallet = await WalletModel.findOne({
                userId: freelancerId,
            })

            if (!freelancerWallet) {
                freelancerWallet = new WalletModel({
                    userId: freelancerId,
                    balance: freelancerAmount,
                    walletHistory: [
                        {
                            date: new Date(),
                            amount: freelancerAmount,
                            type: 'Credit',
                            description: `Payment received for project - ${escrowUpdate?.projectId.title}`,
                        },
                    ],
                })

                const saveResult = await freelancerWallet.save()
                if (!saveResult) {
                    throw new Error('Failed to create freelancer wallet.')
                }
            } else {
                // If wallet exists, update the balance and add transaction history
                freelancerWallet.balance += freelancerAmount

                freelancerWallet.walletHistory.push({
                    date: new Date(),
                    amount: freelancerAmount,
                    type: 'Credit',
                    description: `Payment received for project - ${escrowUpdate?.projectId.title}`,
                })

                const updateResult = await freelancerWallet.save() // Save the updated balance and history
                if (!updateResult) {
                    throw new Error('Failed to update freelancer wallet.')
                }
            }

            const order = await OrderModel.updateOne(
                { projectId: projectId },
                { $set: { isPaymentReleased: true } }
            )

            return {
                success: true,
                freelancerAmount,
            }
        } catch (error) {
            console.error('Error releasing payment:', error)
            throw error
        }
    }

    async submitReview(
        clientId: string,
        freelancerId: string,
        review: string,
        rating: string
    ) {
        try {
            const reviewDoc = await ReviewModel.create({
                clientId: clientId,
                freelancerId: freelancerId,
                rating: rating,
                comment: review,
            })
            return reviewDoc
        } catch (error) {
            throw error
        }
    }

    // async fetchAllContacts(userId:string){
    //   try{

    //     const messages = await MessageModel.find({
    //       $or: [{ senderId: userId }, { recipientId: userId }],
    //     }).populate("senderId","name")
    //     .lean();

    //     // Extract unique contact IDs
    //     const contactIds = new Set<string>();
    //     messages.forEach((message) => {
    //       if (message.senderId !== userId) contactIds.add(message.senderId);
    //       if (message.recipientId !== userId) contactIds.add(message.recipientId);
    //     });

    //     // Prepare contacts list
    //     const contacts = Array.from(contactIds).map((id) => ({
    //       id,
    //       name: `User ${id}`,
    //     }));

    //     return contacts

    //   }catch(error){
    //     throw error
    //   }
    // }

    async fetchAllContacts(userId: string) {
        try {
            const messages = await MessageModel.find({
                $or: [{ senderId: userId }, { recipientId: userId }],
            })
                .populate<{ senderId: any }>('senderId', 'name')
                .populate<{ recipientId: any }>('recipientId', 'name')
                .lean<any[]>()

            // Extract unique contacts
            const contactMap = new Map<string, { id: string; name: string }>()
            messages.forEach((message) => {
                // Normalize senderId and recipientId
                const sender =
                    typeof message.senderId === 'string'
                        ? { _id: message.senderId, name: null }
                        : message.senderId
                const recipient =
                    typeof message.recipientId === 'string'
                        ? { _id: message.recipientId, name: null }
                        : message.recipientId

                // Add sender to the map
                if (sender._id !== userId) {
                    contactMap.set(sender._id.toString(), {
                        id: sender._id.toString(),
                        name: sender.name,
                    })
                }

                // Add recipient to the map
                if (recipient._id !== userId) {
                    contactMap.set(recipient._id.toString(), {
                        id: recipient._id.toString(),
                        name: recipient.name,
                    })
                }
            })

            // Convert Map to Array
            const contacts = Array.from(contactMap.values())
            console.log(contacts)

            return contacts
        } catch (error) {
            throw error
        }
    }

    async fetchChat(userId: string, contactId: string) {
        try {
            const chat = await MessageModel.find({
                $or: [
                    { senderId: userId, recipientId: contactId },
                    { senderId: contactId, recipientId: userId },
                ],
            }).sort({ createdAt: 1 })

            return chat
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async updatePassword(userId: string, password: string) {
        try {
            const updated = await userModel.updateOne(
                { _id: userId },
                { $set: { password: password } }
            )
            return updated
        } catch (error) {
            throw error
        }
    }

    async getUserData(userId: string) {
        try {
            const userData = await userModel.findOne(
                { _id: userId },
                { name: 1, email: 1, phone: 1, profilePicture: 1 }
            )
            return userData
        } catch (error) {
            throw error
        }
    }

    async editData(
        profilePicture: string,
        name: string,
        email: string,
        userId: string
    ) {
        try {
            const data: any = {}
            if (profilePicture) {
                data.profilePicture = profilePicture
            }
            if (name) {
                data.name = name
            }
            if (email) {
                data.email = email
            }
            const userData = await userModel.findOneAndUpdate(
                { _id: userId },
                { $set: data },
                {new:true}
            )
            return userData
        } catch (error) {
            throw error
        }
    }

    async getDeliverable(orderId:string){
        try{
          const order = await OrderModel.findOne({_id:orderId}, { "delivery.fileUrl": 1,_id:0 })
          return order
        }catch(error){
          throw error
        }
    }
}
