import { Request, Response } from "express";
import { IAdminUseCase } from "../../application/useCases/interfaces/IAdminUseCase";
import { jwtInterface } from "../../application/services/interfaces/jwtInterface";
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
        const token = await this.jwt.generateToken({ userID: admin._id });
        res.cookie("adminJWT", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
      }

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
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  }

  async getClientData(req: Request, res: Response) {
    try {
      const clients = await this.adminUseCase.getClientData();
      res.json({ sucees: true, clients: clients });
    } catch (error) {
      throw error;
    }
  }

  async blockClient(req: Request, res: Response) {
    try {
      const {clientID} = req.body
      const response = await this.adminUseCase.blockClient(clientID);
      if(response){
        res.json({ success: true});
      }
    } catch (error) {
      throw error;
    }
  }

  
  async unblockClient(req: Request, res: Response) {
    try {
      const {clientID} = req.body
      const response = await this.adminUseCase.unblockClient(clientID);
      if(response){
        res.json({ success: true});
      }
    } catch (error) {
      throw error;
    }
  }

  async createUser(req:Request,res:Response){
    try{
      const data = req.body
      const profilePicPath: string | null = req.file?.path ? req.file.path : null;
      const response = await this.adminUseCase.createUser(data,profilePicPath);
      res.json({succes:true})

    }catch(error){
      console.error(error);
      
    }
  }
  async editUser(req: Request, res: Response) {
    try {
      const data = req.body;
      const profilePicPath: string | null = req.file?.path || null;
      
      // Pass the data and profile picture path to the use case for updating the user
      const response = await this.adminUseCase.editUser(data, profilePicPath);
      res.json({ success: true, message: "User updated successfully", data: response });
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
      res.status(500).json({ success: false, message: "Failed to retrieve freelancers" });
    }
  }
  // Block a freelancer
async blockFreelancer(req: Request, res: Response) {
  try {
    const { freelancerID } = req.body;
    const response = await this.adminUseCase.blockFreelancer(freelancerID);
    if (response) {
      res.json({ success: true, message: "Freelancer blocked successfully" });
    } else {
      res.status(400).json({ success: false, message: "Error blocking freelancer" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error blocking freelancer" });
  }
}

// Unblock a freelancer
async unblockFreelancer(req: Request, res: Response) {
  try {
    const { freelancerID } = req.body;
    const response = await this.adminUseCase.unblockFreelancer(freelancerID);
    if (response) {
      res.json({ success: true, message: "Freelancer unblocked successfully" });
    } else {
      res.status(400).json({ success: false, message: "Error unblocking freelancer" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error unblocking freelancer" });
  }
}

// Create a freelancer
async createFreelancer(req: Request, res: Response) {
  try {
    const data = req.body;
    console.log("bbhbjhbh",req.body);
    const profilePicPath: string | null = req.file?.path ? req.file.path : null;
    const response = await this.adminUseCase.createFreelancer(data, profilePicPath);
    res.json({ success: true, message: "Freelancer created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating freelancer" });
  }
}

// Edit a freelancer
async editFreelancer(req: Request, res: Response) {
  try {
    const data = req.body;
    console.log("....req.body... edit...",req.body);
    
    const profilePicPath: string | null = req.file?.path || null;
    
    const response = await this.adminUseCase.editFreelancer(data, profilePicPath);
    res.json({ success: true, message: "Freelancer updated successfully", data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating freelancer" });
  }
}

}
