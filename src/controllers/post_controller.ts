import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import Post from '../models/post_model';

interface RequestWithUser extends Request {
  user?: string | jwt.JwtPayload;
}

class PostController {
  async create(req: RequestWithUser, res: Response) {
    try {
      const { text, img } = req.body;
      const owner = req.user.userId;

      console.log(req.user);

      if (!text) {
        return res.status(400).send({ message: 'Text is required.' });
      }

      console.log({ text, img, owner });

      const newPost = await Post.create({ text, img, owner });

      res.status(201).send(newPost);
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while creating the post.' });
    }
  }
}

export default new PostController();
