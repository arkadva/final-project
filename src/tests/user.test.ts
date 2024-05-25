import request from "supertest";
import appInit from "../App";
import mongoose from "mongoose";
import { Express } from "express";

import User from "../models/user_model";

let app: Express;
let token: string;

beforeAll(async () => {
  app = await appInit();
  console.log("beforeAll");
  await User.deleteMany();

  const newUser = { name: "John Doe", email: "john@example.com", password: "password123" };
  await request(app).post("/auth/register").send(newUser);
  
  const res = await request(app).post("/auth/login").send({ email: "john@example.com", password: "password123" });
  token = res.body.token;

  console.log("Status Code:", res.statusCode);
  console.log("Response Body:", res.body);
  
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

describe("Users", () => {
  test("Get /user - One user", async () => {
    const res = await request(app).get("/user").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);

    const data = res.body;
    expect(data.length).toBe(1);
    expect(data[0].email).toBe("john@example.com");
  });

  test("Post /user - Create user", async () => {
    const newUser = { name: "Jane Doe", email: "jane@example.com", password: "password123" };
    const res = await request(app).post("/user").send(newUser);
    expect(res.statusCode).toBe(201);

    const data = res.body;
    expect(data.name).toBe(newUser.name);
    expect(data.email).toBe(newUser.email);
  });

  test("Get /user - Filter users by name", async () => {
    const res = await request(app).get("/user").query({ name: "Jane Doe" }).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);

    const data = res.body;
    expect(data.length).toBe(1);
    expect(data[0].name).toBe("Jane Doe");
  });

  test("Get /user/:id - Get user by ID", async () => {
    const user = await User.findOne({ email: "jane@example.com" });
    const res = await request(app).get(`/user/${user?._id}`).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);

    const data = res.body;
    expect(data.name).toBe(user?.name);
    expect(data.email).toBe(user?.email);
  });

  test("Put /user/:id - Edit user", async () => {
    const user = await User.findOne({ email: "jane@example.com" });
    const updatedUser = { name: "Jane Updated", email: "jane.updated@example.com" };
    const res = await request(app)
      .put(`/user/${user?._id}`)
      .send({ user: updatedUser })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);

    const data = res.body;
    expect(data.name).toBe(updatedUser.name);
    expect(data.email).toBe(updatedUser.email);
  });

  test("Get /user/:id - User not found", async () => {
    const res = await request(app).get("/user/60f8c0a5b4d9b91aaf0f6e99").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe("User not found");
  });

  test("Put /user/:id - Email already in use", async () => {
    const newUser = { name: "Jake Doe", email: "jake@example.com", password: "password123" };
    await request(app).post("/user").send(newUser);

    const user = await User.findOne({ email: "jane.updated@example.com" });
    const res = await request(app)
      .put(`/user/${user?._id}`)
      .send({ user: { email: "jake@example.com" } })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already in use by another user.");
  });

  test("Put /user/:id - Missing required fields", async () => {
    const user = await User.findOne({ email: "jane.updated@example.com" });
    const res = await request(app)
      .put(`/user/${user?._id}`)
      .send({ user: {} })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("At least one of name, email, or image must be provided.");
  });
});
