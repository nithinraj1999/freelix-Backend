import { User } from "../../entities/user";

export interface IAdminFreelancerRepository {
    getAllFreelancers():Promise<any>
    getAllFreelancerData(): Promise<any>;
    blockFreelancer(id: string): Promise<any>;
    unblockFreelancer(id: string): Promise<any>;
    createFreelancer(data: User, profileUrl: string | null, hashedPassword: string): Promise<User>;
    editFreelancer(data: User, profileUrl: string | null): Promise<any>;
  }
  