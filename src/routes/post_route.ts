import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import authenticate from "../common/auth_middleware";

router.post("/", authenticate, postController.create.bind(postController));

export default router;
