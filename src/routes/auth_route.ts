import express from "express";
const router = express.Router();
import upload from '../common/multer';
import userController from "../controllers/auth_controller";

router.post("/register", upload.single('profileImg'), userController.register.bind(userController));

router.post("/login", userController.login.bind(userController));

router.post("/logout", userController.logout.bind(userController));

router.post("/refreshToken", userController.refreshToken.bind(userController))
export default router;
