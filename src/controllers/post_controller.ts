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

      if (!text && !img) {
        return res.status(400).send({ message: 'Either text or image must be provided.' });
      }

      const updateFields: any = {};
      if (text) updateFields.text = text;
      if (img) updateFields.img = img;

      const updatedPost = await Post.findOneAndUpdate(
        { _id: id, owner },
        updateFields,
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

  async getById(req: RequestWithUser, res: Response) {
    try {
      const { userId } = req.params;
      console.log(req.params);

      const posts = await Post.find({ owner: userId });

      res.status(200).send(posts);
    } catch (error) {
      console.error("Error fetching posts by user ID:", error);
      res.status(400).send(error.message);
    }
  }

  async delete(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const owner = req.user?.userId;
      
      const deletedPost = await Post.findOneAndDelete({ _id: id, owner });

      if (!deletedPost) {
        return res.status(404).send({ message: 'Post not found or you are not the owner.' });
      }

      res.status(200).send({ message: 'Post deleted successfully.' });
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while deleting the post.' });
    }
  }
}

export default new PostController();
