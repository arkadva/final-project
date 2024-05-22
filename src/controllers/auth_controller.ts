import { Request, Response } from "express";
import UserModel from '../models/user_model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

function sendError(res: Response, msg: string) {
  return res.status(400).send({ error: msg });
}

class AuthController {
  generateToken(userId: string, email: string) {
    return jwt.sign(
      { userId, email },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
    );
  }

  generateRefreshToken(userId: string, email: string) {
    return jwt.sign(
      { userId, email },
      process.env.REFRESH_TOKEN_SECRET!
    );
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "All fields are required.");
    }

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return sendError(res, "Invalid credentials.");
      }

      const isMatch = await bcrypt.compare(password, user.password!);
      if (!isMatch) {
        return sendError(res, "Invalid credentials.");
      }

      const token = this.generateToken(user._id, user.email);
      const refreshToken = this.generateRefreshToken(user._id, user.email);

      if (!user.tokens) {
        user.tokens = [refreshToken];
      } else {
        user.tokens.push(refreshToken);
      }

      await user.save();

      res.status(200).send({ message: "User logged in successfully.", token, refreshToken });
    } catch (err) {
      return sendError(res, "Login error.");
    }
  }

  async register(req: RequestWithFile, res: Response) {
    console.log(req.body);
    const { email, password, name } = req.body;
    const img = req.file ? req.file.path : null;

    console.log(img);
    
    if (!email || !password || !name) {
      return sendError(res, "All fields are required.");
    }

    try {
      let user = await UserModel.findOne({ email });
      if (user) {
        return sendError(res, "User already registered.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new UserModel({
        name,
        email,
        password: hashedPassword,
        profileImg: img,
      });

      await user.save();
      res.status(201).send({ message: "User registered successfully." });
    } catch (err) {
      return sendError(res, err.message);
    }
  }

  async logout(req: Request, res: Response) {
    sendError(res, "Yet to be implemented.");
  }

  async refreshToken(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader?.split(' ')[1];

    if (!refreshToken) {
      return res.status(401).send("Missing token");
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (err, decoded) => {
      if (err) return res.status(403).send("Invalid token");

      const userId = (decoded as any).userId;

      try {
        const user = await UserModel.findById(userId);
        if (!user || !user.tokens || !user.tokens.includes(refreshToken)) {
          return res.status(403).send("Invalid token");
        }

        const newAccessToken = this.generateToken(user._id, user.email);
        const newRefreshToken = this.generateRefreshToken(user._id, user.email);

        user.tokens = user.tokens.filter(token => token !== refreshToken);
        user.tokens.push(newRefreshToken);
        await user.save();

        return res.status(200).send({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        });
      } catch (error) {
        return res.status(400).send(error instanceof Error ? error.message : "An error occurred");
      }
    });
  }
}

export default new AuthController();
