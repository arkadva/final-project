import { Request, Response } from "express";
import UserModel from '../models/user_model';

class UserController {
  async get(req: Request, res: Response) {
    try {
      let users;
      const name = typeof req.query.name === 'string' ? req.query.name : undefined;
      
      if (name) {
        users = await UserModel.find({ name: name });
      } else {
        users = await UserModel.find();
      }
      res.status(200).send(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(400).send(error.message);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      console.log(req.params);
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.status(200).send(user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      res.status(400).send(error.message);
    }
  }

  async post(req: Request, res: Response) {
    try {
      const newUser = await UserModel.create(req.body);
      res.status(201).send(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).send(error.message);
    }
  }

  async edit(req: Request, res: Response) {
    try {
      const { name, email, profileImg } = req.body.user;
      const { id } = req.params;

      console.log(name, email, profileImg);
      
      if (!name && !email && !profileImg) {
        return res.status(400).send({ message: 'At least one of name, email, or image must be provided.' });
      }

      if (email) {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser && existingUser._id.toString() !== id) {
          return res.status(400).send({ message: 'Email already in use by another user.' });
        }
      }

      const updateFields: any = {};
      if (name) updateFields.name = name;
      if (email) updateFields.email = email;
      if (profileImg) updateFields.image = profileImg;

      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send({ message: 'User not found.' });
      }

      res.status(200).send(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send({ message: 'An error occurred while updating the user.' });
    }
  }
}

export default new UserController();
