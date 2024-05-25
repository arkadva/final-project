import request from "supertest";
import appInit from "../App";
import mongoose from "mongoose";
import { Express } from "express";
import { jwtDecode } from 'jwt-decode';

import User from "../models/user_model";
import Post from "../models/post_model";

let app: Express;
let token: string;
let userId: string;

interface DecodedToken {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

beforeAll(async () => {
  app = await appInit();
  console.log("beforeAll");
  await User.deleteMany();
  await Post.deleteMany();

  const newUser = { name: "John Doe", email: "john@example.com", password: "password123" };
  const userRes = await request(app).post("/auth/register").send(newUser);
  
  const loginRes = await request(app).post("/auth/login").send({ email: "john@example.com", password: "password123" });
  const decoded: DecodedToken = jwtDecode<DecodedToken>(loginRes.body.token);

  token = loginRes.body.token;
  userId = decoded.userId;
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

describe("Posts", () => {
  test("Post /posts - Create post", async () => {
    const newPost = { text: "This is a test post" };
    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send(newPost);
    expect(res.statusCode).toBe(201);

    const data = res.body;

    expect(data.text).toBe(newPost.text);
    expect(data.owner).toBe(userId);
  });

  test("Put /posts/:id - Edit post", async () => {
    const newPost = await Post.create({ text: "This is a test post", owner: userId });
    const updatedPost = { text: "This is an updated test post" };
    const res = await request(app)
      .put(`/posts/${newPost._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedPost);
    expect(res.statusCode).toBe(200);

    const data = res.body;
    expect(data.text).toBe(updatedPost.text);
  });

  test("Get /posts - Get all posts", async () => {
    const res = await request(app).get("/posts").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);

    const data = res.body;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test("Get /posts/by/:userId - Get posts by user ID", async () => {
    const res = await request(app).get(`/posts/by/${userId}`).set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);

    const data = res.body;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].owner).toBe(userId);
  });

  test("Delete /posts/:id - Delete post", async () => {
    const newPost = await Post.create({ text: "This is a test post to delete", owner: userId });
    const res = await request(app)
      .delete(`/posts/${newPost._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Post deleted successfully.");
  });

  test("Post /posts - Missing text", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Text is required.");
  });

  test("Put /posts/:id - Post not found or not owner", async () => {
    const res = await request(app)
      .put(`/posts/60f8c0a5b4d9b91aaf0f6e99`)
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "Trying to update a non-existent post" });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Post not found or you are not the owner.");
  });

  test("Put /posts/:id - Missing required fields", async () => {
    const newPost = await Post.create({ text: "This is a test post", owner: userId });
    const res = await request(app)
      .put(`/posts/${newPost._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Text must be provided.");
  });
});
