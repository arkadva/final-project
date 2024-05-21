import express from "express";
const router = express.Router();
import upload from '../common/multer';
import userController from "../controllers/auth_controller";

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
 *         description: The profile image of the user
 *       - in: formData
 *         name: email
 *         type: string
 *         required: true
 *         description: The email of the user
 *       - in: formData
 *         name: password
 *         type: string
 *         required: true
 *         description: The password of the user
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: The name of the user
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Error occurred during registration
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
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", userController.login.bind(userController));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Error occurred during logout
 */
router.post("/logout", userController.logout.bind(userController));

/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: Refresh user token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Missing or invalid token
 */
router.post("/refreshToken", userController.refreshToken.bind(userController));

export default router;
