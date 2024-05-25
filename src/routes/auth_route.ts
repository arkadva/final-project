import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import userController from "../controllers/auth_controller";
import upload from '../common/multer';

const router = express.Router();

interface RequestWithUser extends Request {
  user?: any;
  login: (user: any, callback: (err?: any) => void) => void;
}

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: profileImg
 *         type: file
 *         description: Profile image of the user
 *       - in: formData
 *         name: username
 *         type: string
 *         required: true
 *         description: Username of the user
 *       - in: formData
 *         name: password
 *         type: string
 *         required: true
 *         description: Password of the user
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", upload.single('profileImg'), userController.register.bind(userController));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user
 *                 example: "user1"
 *               password:
 *                 type: string
 *                 description: Password of the user
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/login", userController.login.bind(userController));

/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: Refresh user authentication token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/refreshToken", userController.refreshToken.bind(userController));

export default router;
