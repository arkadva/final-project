import express from 'express';
import PostController from '../controllers/post_controller';
import upload from '../common/multer';
import authMiddleware from '../common/auth_middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: img
 *         type: file
 *         description: The image for the post
 *       - in: formData
 *         name: text
 *         type: string
 *         required: true
 *         description: The text of the post
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Text is required
 *       500:
 *         description: An error occurred while creating the post
 */
router.post('/', authMiddleware, upload.single('img'), PostController.create);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Edit an existing post
 *     tags: [Posts]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to edit
 *       - in: formData
 *         name: img
 *         type: file
 *         description: The new image for the post
 *       - in: formData
 *         name: text
 *         type: string
 *         description: The new text of the post
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Either text or image must be provided
 *       404:
 *         description: Post not found or you are not the owner
 *       500:
 *         description: An error occurred while updating the post
 */
router.put('/:id', authMiddleware, PostController.edit);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of posts
 *       400:
 *         description: Error occurred while fetching posts
 */
router.get('/', authMiddleware, PostController.get);

/**
 * @swagger
 * /posts/by/{userId}:
 *   get:
 *     summary: Get posts by user ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose posts to fetch
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of posts by the user
 *       404:
 *         description: No posts found for this user
 *       400:
 *         description: Error occurred while fetching posts by user ID
 */
router.get('/by/:userId', authMiddleware, PostController.getById);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by its ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found or you are not the owner
 *       500:
 *         description: An error occurred while deleting the post
 */
router.delete('/:id', authMiddleware, PostController.delete);

export default router;
