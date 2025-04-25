import { IPaymentRepository } from "../../../domain/interfaces/user/repositoryInterfaces/IPaymentRepository"

export class PaymentRepository implements IPaymentRepository{

    private escrowModel
    private walletModel
    private orderModel

    constructor(EscrowModel:any,WalletModel:any,OrderModel:any){
        this.escrowModel =EscrowModel
        this.walletModel = WalletModel
        this.orderModel = OrderModel
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

            const escrowUpdate = await this.escrowModel.findOneAndUpdate(
                { clientId, freelancerId, projectId },
                { $set: { amount: platformCharge } },
                { new: true }
            ).populate('projectId') 

            let freelancerWallet = await this.walletModel.findOne({
                userId: freelancerId,
            })

            if (!freelancerWallet) {
                freelancerWallet = new this.walletModel({
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

            const order = await this.orderModel.updateOne(
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
}