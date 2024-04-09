import express from "express";
const router = express.Router();
import testController from "../controllers/test_controller";
import authenticate from "../common/auth_middleware";

router.post("/", authenticate, testController.post);

export default router;
