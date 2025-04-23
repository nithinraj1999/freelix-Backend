import OrderModel from "../../models/orderModel";
import jobPostModel from "../../models/jobPostModel";
import EscrowModel from "../../models/escrow";
import WalletModel from "../../models/wallet";
import userModel from "../../models/userModel";
import { IAdminDashboardRepository } from "../../../domain/interfaces/admin/repository/IAdminDashboardRepository";
export class DashboardAdminRepository implements IAdminDashboardRepository{
  async getDashboardData() {
    const revenueData = await OrderModel.aggregate([
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalEarnings: { $sum: { $multiply: ["$total", 0.3] } },
        },
      },
    ]);

    const totalFreelancers = await userModel.countDocuments({ hasFreelancerAccount: true });
    const totalJobPost = await jobPostModel.countDocuments();
    const escrowBalance = await EscrowModel.aggregate([
      { $group: { _id: null, escrowBalance: { $sum: "$amount" } } },
    ]);
    const walletAmount = await WalletModel.findOne({ isAdmin: true }, { balance: 1, _id: 0 });
    const monthlyRevenue = await OrderModel.aggregate([
      { $match: { status: "Completed" } },
      { $project: { _id: 1, orderDate: 1, total: 1 } },
    ]);

    return {
      revenueData,
      totalFreelancers,
      totalJobPost,
      escrowBalance,
      walletAmount,
      monthlyRevenue,
    };
  }
}
