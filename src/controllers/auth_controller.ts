import { Request, Response } from "express";
import UserModel from '../models/user_model';

class AuthController {
  async login(req: Request, res: Response) {
    res.status(400).send("error 1");
  }

  async register(req: Request, res: Response) {
    res.status(400).send("error 2");
  }

  async logout(req: Request, res: Response) {
    res.status(400).send("error 3");
  }
}

export default new AuthController();
