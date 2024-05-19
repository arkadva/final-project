import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import Post from '../models/post_model';

interface RequestWithUser extends Request {
  user?: { userId: string | jwt.JwtPayload };
}

class PostController {
  async create(req: RequestWithUser, res: Response) {
    try {
      const { text } = req.body;
      const img = req.file?.path;
      const owner = req.user?.userId;

      if (!text) {
        return res.status(400).send({ message: 'Text is required.' });
      }

      const newPost = await Post.create({ text, img, owner });

      res.status(201).send(newPost);
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while creating the post.' });
    }
  }

  async edit(req: RequestWithUser, res: Response) {
    try {
      const { text } = req.body;
      const img = req.file?.path;
      const owner = req.user?.userId;
      const { id } = req.params;

      if (!text) {
        return res.status(400).send({ message: 'Text is required.' });
      }


      const updatedPost = await Post.findOneAndUpdate(
        { _id: id, owner },
        { text, img },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).send({ message: 'Post not found or you are not the owner.' });
      }

      res.status(200).send(updatedPost);
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while updating the post.' });
    }
  }

  async get(req: RequestWithUser, res: Response) {
    try {
      const posts = await Post.find();
      res.status(200).send(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(400).send(error.message);
    }
  }
}

export default new PostController();
