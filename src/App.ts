import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRouter from "./routes/user_route";
import authRouter from "./routes/auth_route";
import testRouter from "./routes/test_route";

dotenv.config();
const app = express();

const initApp = async (): Promise<Express> => {
  return new Promise((resolve, reject) => {
    const db = mongoose.connection;

    db.on("error", (err) => {
      console.log(err);
      reject(err);
    });

    db.once("open", () => {
      console.log("Database connected");

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use("/user", userRouter);
      app.use("/auth", authRouter);
      app.use("/post", testRouter);

      resolve(app);
    });

    mongoose.connect(process.env.DATABASE_URL);
  });
};

export default initApp;
