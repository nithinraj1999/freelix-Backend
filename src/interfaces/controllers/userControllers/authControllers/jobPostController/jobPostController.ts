import { Request, Response,NextFunction } from "express";
import { User } from "../../../../../domain/entities/user";
import { IJobPostUseCase } from "../../../../../domain/interfaces/user/useCaseInterfaces/IJobPostUseCase";
export class JobPostController {
    private JobPostUsecase:IJobPostUseCase
    private userSocketMap
    private notificationService
    constructor(JobPostUsecase:IJobPostUseCase,userSocketMap:any,NotificationService:any) {
        this.JobPostUsecase = JobPostUsecase
        this.userSocketMap = userSocketMap
        this.notificationService = NotificationService
    }

    
  async createJobPost(req: Request, res: Response) {
    try {
      const file = req.file ? req.file.path : null;
      const jobPost = await this.JobPostUsecase.createJobPost(req.body, file);
      const freelancers: User[] =
        await this.JobPostUsecase.getAllFreelancers(); 

      const freelancersWithSocketIds = freelancers
        .filter((freelancer) => this.userSocketMap.has(freelancer._id.toString())) // Keep only freelancers with a valid socket ID
        .map((freelancer) => ({
          ...freelancer,
          socketId: this.userSocketMap.get(freelancer._id.toString()), // Convert ObjectId to string and get socketId
        }));

      this.notificationService.sendJobPostNotification(
        freelancersWithSocketIds,
        jobPost
      );

      res.status(200).json({ success: true, data: jobPost });
    } catch (error) {
      console.error("Error in controller:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to create job post" });
    }
  }
}