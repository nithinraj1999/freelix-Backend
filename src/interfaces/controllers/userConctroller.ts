import { Request, Response } from "express";
import { RegisterUser } from "../../application/useCases/registerUser";
export class UserController {
  constructor(private registerUser: RegisterUser) {}

  async register(req: Request, res: Response) {
    const { id,name, email, password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    try {
      await this.registerUser.execute({ id,name, email, password });
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }
}