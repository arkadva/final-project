import express, { Express } from "express";
import path from 'path';
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import userRouter from "./routes/user_route";
import authRouter from "./routes/auth_route";
import postRouter from "./routes/post_route";

dotenv.config();
const app = express();

const initApp = async (): Promise<Express> => {
  return new Promise((resolve, reject) => {
    const db = mongoose.connection;

    app.use(cors({ origin: '*' }));

    db.on("error", (err) => {
      console.log(err);
      reject(err);
    });

    db.once("open", () => {
      console.log("Database connected");

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
      app.use("/user", userRouter);
      app.use("/auth", authRouter);
      app.use("/posts", postRouter);

      resolve(app);
    });

    mongoose.connect(process.env.DATABASE_URL);
  });
};

export default initApp;
