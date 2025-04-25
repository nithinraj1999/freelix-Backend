import { Request, Response, NextFunction } from "express";
import { jwtInterface } from "../../../application/services/interfaces/jwtInterface";
import { IAdminAuthUseCase } from "../../../domain/interfaces/admin/useCases/IAdminAuthUseCase";

export class AdminAuthController {
  
  constructor(private adminAuthUseCase: IAdminAuthUseCase, private jwt: jwtInterface) {}

  async loginAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const admin = await this.adminAuthUseCase.authenticateAdmin(email, password);

      if (!admin) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const accessToken = this.jwt.generateAccessToken({ _id: admin._id, role: admin.role });
      const refreshToken = this.jwt.generateRefreshToken({ _id: admin._id, role: admin.role });

      res.cookie("adminRefreshJWT", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ success: true, admin, message: "Login successful", accessToken });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.adminRefreshJWT;
      if (!refreshToken) return res.status(401).json({ success: false, message: "Refresh token not found" });

      const userData = this.jwt.verifyRefreshToken(refreshToken);
      const newAccessToken = this.jwt.generateAccessToken({ _id: userData._id, role: userData.role });

      res.status(200).json({ success: true, accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  }
}
