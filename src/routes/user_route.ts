import express from "express";
const router = express.Router();
import userController from "../controllers/user_controller";

router.get("/", userController.get.bind(userController));

router.get("/:id", userController.getById.bind(userController));

router.post("/", userController.post.bind(userController));

export default router;
