import { User } from "../../../domain/entities/user";
import userModel from "../../models/userModel";
import { IAdminFreelancerRepository } from "../../../domain/interfaces/admin/repository/IAdminFreelancerRepository";

export class FreelancerAdminRepository implements IAdminFreelancerRepository {
  async getAllFreelancers() {
    return await userModel.find({ isAdmin: false, hasFreelancerAccount: true });
  }

  async blockFreelancer(freelancerID: string) {
    return await userModel.updateOne({ _id: freelancerID }, { $set: { isFreelancerBlock: true } });
  }

  async unblockFreelancer(freelancerID: string) {
    return await userModel.updateOne({ _id: freelancerID }, { $set: { isFreelancerBlock: false } });
  }

  async createFreelancer(data: User, profileUrl: string, hashedPassword: string) {
    const { name, email, phone, description, skills, languages } = data;
    const newFreelancer: Partial<User> = {
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: true,
      description,
      skills: Array.isArray(skills) ? skills : JSON.parse(skills as any),
      languages: Array.isArray(languages) ? languages : JSON.parse(languages as any),
      hasFreelancerAccount: true,
      profilePicture: profileUrl || undefined,
    };
    return await userModel.create(newFreelancer);
  }

  async editFreelancer(data: User, profileUrl: string) {
    const { _id, name, email, phone, description, skills, languages } = data;
    const update: Partial<User> = {
      name,
      email,
      phone,
      description,
      skills: Array.isArray(skills) ? skills : JSON.parse(skills as any),
      languages: Array.isArray(languages) ? languages : JSON.parse(languages as any),
      profilePicture: profileUrl || undefined,
    };
    return await userModel.updateOne({ _id }, { $set: update });
  }

  
  async getAllFreelancerData(){
    const clients = await userModel.find({isAdmin:false,hasFreelancerAccount:true });
    if (!clients) return null;
    return clients
}

}
