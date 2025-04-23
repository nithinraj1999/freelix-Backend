import { Request, Response, NextFunction } from "express";
import { IAdminClientUseCase } from "../../../domain/interfaces/admin/useCases/IAdminClientUseCase";

export class ClientController {
    constructor(private adminClientUseCase: IAdminClientUseCase) {}
  
    async getClientData(req: Request, res: Response, next: NextFunction) {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const skip = (page - 1) * limit;
  
        const totalClients = await this.adminClientUseCase.getTotalClients();
        const clients = await this.adminClientUseCase.getClientData(skip, limit);
  
        res.json({
          success: true,
          clients,
          totalClients,
          totalPages: Math.ceil(totalClients / limit),
          currentPage: page,
        });
      } catch (error) {
        next(error);
      }
    }
  
    async blockClient(req: Request, res: Response, next: NextFunction) {
      try {
        const response = await this.adminClientUseCase.blockClient(req.body.clientID);
        res.json({ success: !!response });
      } catch (error) {
        next(error);
      }
    }
  
    async unblockClient(req: Request, res: Response, next: NextFunction) {
      try {
        const response = await this.adminClientUseCase.unblockClient(req.body.clientID);
        res.json({ success: !!response });
      } catch (error) {
        next(error);
      }
    }
  
    async createUser(req: Request, res: Response, next: NextFunction) {
      try {
        await this.adminClientUseCase.createUser(req.body, req.file);
        res.json({ success: true });
      } catch (error) {
        next(error);
      }
    }
  
    async editUser(req: Request, res: Response, next: NextFunction) {
      try {
        const updatedUser = await this.adminClientUseCase.editUser(req.body, req.file);
        res.json({ success: true, message: "User updated successfully", data: updatedUser });
      } catch (error) {
        next(error);
      }
    }
  }
  