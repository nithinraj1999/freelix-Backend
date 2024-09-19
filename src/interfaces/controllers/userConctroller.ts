
import { Request, Response } from "express";
import { IUserUseCase } from "../../application/useCases/interfaces/IUserUseCase";

export class UserController   {
  private userUseCase : IUserUseCase ;
  constructor(userUseCase:  IUserUseCase) {
    this.userUseCase = userUseCase;
  }

  //================================== user registration =======================================

  async register(req: Request, res: Response) {
    try {
      await this.userUseCase.registerUser(req.body);
      res.status(201).json("User registration successful. Please verify the OTP sent to your email.");
    } catch (err) {
      throw err
    }
  }
}