import express from "express";
const router = express.Router();
import userController from "../controllers/auth_controller";

router.post("/register", userController.register.bind(userController));

router.post("/login", userController.login.bind(userController));

router.post("/logout", userController.logout.bind(userController));

export default router;
