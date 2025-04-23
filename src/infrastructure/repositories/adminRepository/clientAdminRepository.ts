import userModel from "../../models/userModel";
import { User } from "../../../domain/entities/user";
import { IAdminUserRepository } from "../../../domain/interfaces/admin/repository/IAdminUserRepository";
export class ClientAdminRepository implements IAdminUserRepository {
  async getAllClients(skip: number, limit: number) {
    return await userModel.find({ isAdmin: false }).skip(skip).limit(limit);
  }

  async totalClients() {
    return await userModel.countDocuments({ role: { $ne: "admin" } });
  }

  async blockClient(clientID: string) {
    return await userModel.updateOne({ _id: clientID }, { $set: { isBlock: true } });
  }

  async unblockClient(clientID: string) {
    return await userModel.updateOne({ _id: clientID }, { $set: { isBlock: false } });
  }

  async createUser(data: User, profileUrl: string, hashedPassword: string) {
    const { name, email, phone } = data;
    const newUser: Partial<User> = {
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: true,
      profilePicture: profileUrl || undefined,
    };
    return await userModel.create(newUser);
  }

  async editUser(data: User, profileUrl: string) {
    const { _id, name, email, phone } = data;
    const update: any = { name, email, phone };
    if (profileUrl) update.profilePicture = profileUrl;
    return await userModel.updateOne({ _id }, { $set: update });
  }

  async getAllClientData(skip:number,limit:number){
    const clients = await userModel.find({isAdmin:false }).skip(skip).limit(limit);        
    if (!clients) return null;
    return clients
}

}
