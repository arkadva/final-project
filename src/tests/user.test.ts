import request from "supertest";
import appInit from "../App";
import mongoose from "mongoose";
import { Express } from "express";

import User from "../models/user_model";

let app: Express;

beforeAll(async () => {
  app = await appInit();
  console.log("beforeAll");
  await User.deleteMany();
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

describe("Users", () => {
  test("Get /user - No users", async () => {
    const res = await request(app).get("/user");
    expect(res.statusCode).toBe(200);

    const data = res.body;
    expect(data).toEqual([]);
  });
});
