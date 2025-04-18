import { Request, Response } from "express";
import { IAdminUseCase } from "../../application/useCases/interfaces/IAdminUseCase";
import { jwtInterface } from "../../application/services/interfaces/jwtInterface";
import { log } from "winston";

export class AdminController {
  private adminUseCase: IAdminUseCase;
  private jwt: jwtInterface;
  constructor(adminUseCase: IAdminUseCase, jwt: jwtInterface) {
    this.adminUseCase = adminUseCase;
    this.jwt = jwt;
  }

  
  async loginAdmin(req: Request, res: Response) {
    try {



      const { email, password } = req.body;

      const admin = await this.adminUseCase.authenticateAdmin(email, password);
      if (!admin) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      } else {
        const accessToken = await this.jwt.generateAccessToken({
          _id: admin._id,
          role: admin.role,
        });
        const refreshToken = await this.jwt.generateRefreshToken({
          _id: admin._id,
          role: admin.role,
        });

        res.cookie("adminRefreshJWT", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
          success: true,
          admin: {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            role: admin.role,
            isBlock: admin.isBlock,
            isVerified: admin.isVerified,
          },
          message: "Login successfull",
          accessToken: accessToken,
        });
      }
    } catch (error) {
      
      console.error(error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  }

  async getClientData(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1; // Default page is 1
      const limit = parseInt(req.query.limit as string) || 5; // Default limit is 5

      const skip = (page - 1) * limit;
      const totalClients = await this.adminUseCase.getTotalClients();
      const clients = await this.adminUseCase.getClientData(skip, limit);
      res.json({
        sucees: true,
        clients: clients,
        totalClients,
        totalPages: Math.ceil(totalClients / limit),
        currentPage: page,
      });
    } catch (error) {
      throw error;
    }
  }

  async blockClient(req: Request, res: Response) {
    try {
      const { clientID } = req.body;

      const response = await this.adminUseCase.blockClient(clientID);
      console.log(response);

      if (response) {
        console.log("res cond");

        res.json({ success: true });
      }
    } catch (error) {
      throw error;
    }
  }

  async unblockClient(req: Request, res: Response) {
    try {
      const { clientID } = req.body;
      const response = await this.adminUseCase.unblockClient(clientID);
      if (response) {
        res.json({ success: true });
      }
    } catch (error) {
      throw error;
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const data = req.body;
     
      const response = await this.adminUseCase.createUser(data, req.file);
      res.json({ succes: true });
    } catch (error) {
      console.error(error);
    }
  }
  async editUser(req: Request, res: Response) {
    try {
      const data = req.body;
      

      // Pass the data and profile picture path to the use case for updating the user
      const response = await this.adminUseCase.editUser(data, req.file);
      res.json({
        success: true,
        message: "User updated successfully",
        data: response,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error updating user" });
    }
  }

  async getFreelancerData(req: Request, res: Response) {
    try {
      const freelancers = await this.adminUseCase.getFreelancerData();
      res.json({ success: true, freelancers: freelancers });
    } catch (error) {
      console.error(error); // Optionally log the error for debugging
      res
        .status(500)
        .json({ success: false, message: "Failed to retrieve freelancers" });
    }
  }
  // Block a freelancer
  async blockFreelancer(req: Request, res: Response) {
    try {
      const { freelancerID } = req.body;
      console.log(freelancerID);

      const response = await this.adminUseCase.blockFreelancer(freelancerID);
      if (response) {
        console.log("success ");

        res.json({
          success: true,
          message: "Freelancer blocked successfully",
          freelancer: response,
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Error blocking freelancer" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Error blocking freelancer" });
    }
  }

  // Unblock a freelancer
  async unblockFreelancer(req: Request, res: Response) {
    try {
      const { freelancerID } = req.body;
      const response = await this.adminUseCase.unblockFreelancer(freelancerID);
      if (response) {
        res.json({
          success: true,
          message: "Freelancer unblocked successfully",
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Error unblocking freelancer" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Error unblocking freelancer" });
    }
  }

  // Create a freelancer
  async createFreelancer(req: Request, res: Response) {
    try {
      const data = req.body;
      
      const response = await this.adminUseCase.createFreelancer(
        data,
        req.file
      );
      res.json({ success: true, message: "Freelancer created successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Error creating freelancer" });
    }
  }

  // Edit a freelancer
  async editFreelancer(req: Request, res: Response) {
    try {
      const data = req.body;
      const skills = JSON.parse(req.body.skills); // Parse skills array
      const languages = JSON.parse(req.body.languages); // Parse languages array
      const profilePicPath: string | null = req.file?.path || null;
      const response = await this.adminUseCase.editFreelancer(
        data,
        profilePicPath
      );
      res.json({
        success: true,
        message: "Freelancer updated successfully",
        data: response,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Error updating freelancer" });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.adminRefreshJWT;
      if (!refreshToken) {
        return res
          .status(401)
          .json({ success: false, message: "Refresh token not found" });
      }
      // Verify the refresh token
      const userData = this.jwt.verifyRefreshToken(refreshToken); // Pass true to indicate it's a refresh token
      // If valid, generate a new access token
      const newAccessToken = this.jwt.generateAccessToken({
        _id: userData._id,
        role: userData.role,
      });

      res.status(200).json({ success: true, accessToken: newAccessToken });
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }
  }

  async addSkills(req: Request, res: Response) {
    try {
      const { skill, description } = req.body;
      console.log(req.body);
      
      const skills = await this.adminUseCase.addSkills(skill, description);
      console.log(skills);
      
      if (skills) {
        res.json({ success: true });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getDashboardData(req: Request, res: Response) {
    try {
      const data = await this.adminUseCase.getDashboardData();
      res.json({dashboardData:data})
    } catch (error) {
      console.error(error);
    }
  }

  async getAllSkills(req: Request, res: Response) {
    try {
      const skills = await this.adminUseCase.getAllSkills();
     
      if(skills){
        res.json({success:true,skills})
      }else{
        res.json({success:false})
      }
    } catch (error) {
      console.error(error);
    }
  }
}
