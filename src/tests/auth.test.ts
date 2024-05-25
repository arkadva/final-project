import request from "supertest";
import appInit from "../App";
import mongoose from "mongoose";
import { Express } from "express";

import User from "../models/user_model";

let app: Express;
let token: string;
let refreshToken: string;

beforeAll(async () => {
  app = await appInit();
  console.log("beforeAll");
  await User.deleteMany();
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

describe("Auth", () => {
  test("POST /auth/register - Register a new user", async () => {
    const newUser = { name: "John Doe", email: "john@example.com", password: "password123" };
    const res = await request(app).post("/auth/register").send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully.");
  });

  test("POST /auth/register - User already registered", async () => {
    const existingUser = { name: "John Doe", email: "john@example.com", password: "password123" };
    const res = await request(app).post("/auth/register").send(existingUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("User already registered.");
  });

  test("POST /auth/register - Missing fields", async () => {
    const res = await request(app).post("/auth/register").send({ email: "john@example.com", password: "password123" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("All fields are required.");
  });

  test("POST /auth/login - Login a user", async () => {
    const res = await request(app).post("/auth/login").send({ email: "john@example.com", password: "password123" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User logged in successfully.");
    token = res.body.token;
    refreshToken = res.body.refreshToken;
  });

  test("POST /auth/login - Invalid credentials", async () => {
    const res = await request(app).post("/auth/login").send({ email: "john@example.com", password: "wrongpassword" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid credentials.");
  });

  test("POST /auth/login - Missing fields", async () => {
    const res = await request(app).post("/auth/login").send({ email: "john@example.com" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("All fields are required.");
  });

  test("POST /auth/refreshToken - Refresh token", async () => {
    const res = await request(app).post("/auth/refreshToken").set("Authorization", `Bearer ${refreshToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).not.toBeNull();
    expect(res.body.refreshToken).not.toBeNull();
    // Update tokens for further use
    token = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  test("POST /auth/refreshToken - Missing token", async () => {
    const res = await request(app).post("/auth/refreshToken");
    expect(res.statusCode).toBe(401);
    expect(res.text).toBe("Missing token");
  });

  test("POST /auth/refreshToken - Invalid token", async () => {
    const res = await request(app).post("/auth/refreshToken").set("Authorization", "Bearer invalidtoken");
    expect(res.statusCode).toBe(403);
    expect(res.text).toBe("Invalid token");
  });
});
