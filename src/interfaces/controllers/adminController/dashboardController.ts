import { Request, Response, NextFunction } from "express";
import { IAdminDashboardUseCase } from "../../../domain/interfaces/admin/useCases/IAdminDashboardUseCase";

export class DashboardController {
    constructor(private adminDashboardUseCase: IAdminDashboardUseCase) {}
  
    async getDashboardData(req: Request, res: Response, next: NextFunction) {
      try {
        const data = await this.adminDashboardUseCase.getDashboardData();
        res.json({ dashboardData: data });
      } catch (error) {
        next(error);
      }
    }
  }
  