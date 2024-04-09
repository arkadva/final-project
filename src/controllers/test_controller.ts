import { Request, Response } from "express";

class TestController {
  async post(req: Request, res: Response) {
    res.status(200).send("hello");
  }
}

export default new TestController();
