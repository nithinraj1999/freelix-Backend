import { User } from '../../../entities/user';

export interface IAdminFreelancerUseCase {
  getFreelancerData(): Promise<any>;
  blockFreelancer(freelancerID: string): Promise<any>;
  unblockFreelancer(freelancerID: string): Promise<any>;
  createFreelancer(data: User, profilePic: any): Promise<any>;
  editFreelancer(data: User, profilePic: any): Promise<any>;
}
