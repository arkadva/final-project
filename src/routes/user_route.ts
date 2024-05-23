import express from "express";
const router = express.Router();
import userController from "../controllers/user_controller";
import authMiddleware from '../common/auth_middleware';
import upload from '../common/multer';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter users by name
 *     responses:
 *       200:
 *         description: A list of users
 *       400:
 *         description: Error occurred while fetching users
 */
router.get("/", userController.get.bind(userController));

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: A user object
 *       404:
 *         description: User not found
 *       400:
 *         description: Error occurred while fetching user by ID
 */
router.get("/:id", userController.getById.bind(userController));

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Error occurred while creating user
 */
router.post("/", userController.post.bind(userController));

router.put('/:id', authMiddleware, upload.single('img'), userController.edit.bind(userController));

export default router;
