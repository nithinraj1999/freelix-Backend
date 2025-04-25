import { Request, Response,NextFunction } from "express";
import { ILoginUseCase } from "../../../../domain/interfaces/user/useCaseInterfaces/ILoginUseCase";
import { IJwt } from "../../../../domain/interfaces/serviceInterfaces/jwtInterface";

export class LoginController{

    private emailLoginUseCase:ILoginUseCase;
    private jwt: IJwt;

    constructor(emailLoginUseCase:ILoginUseCase,jwt:IJwt){
        this.emailLoginUseCase = emailLoginUseCase;
        this.jwt =jwt
    }
    
    async loginUser(req: Request, res: Response,next:NextFunction) {
        try {
            const credentials: { email: string; password: string } = req.body;
            const user = await this.emailLoginUseCase.login(credentials);
          if (!user) {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          } else {
          }
    
          const accessToken = await this.jwt.generateAccessToken({
            _id: user._id,
            role: user.role,
          });
    
          const refreshToken = await this.jwt.generateRefreshToken({
            _id: user._id,
            role: user.role,
          });
    
          res.cookie("userRefreshJWT", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
          
          res.status(200).json({
            success: true,
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
              hasFreelancerAccount: user.hasFreelancerAccount,
              profilePicture: user.profilePicture,
              isBlock: user.isBlock,
              isVerified: user.isVerified,
              description: user.description,
              skills: user.skills,
              languages: user.languages,
              isFreelancerBlock: user.isFreelancerBlock,
            },
            message: "Login successfull",
            accessToken: accessToken,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: "Login failed" });
        }
      }
}