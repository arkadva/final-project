import express from 'express';
import PostController from '../controllers/post_controller';
import upload from '../common/multer';
import authMiddleware from '../common/auth_middleware';

const router = express.Router();

router.post('/', authMiddleware, upload.single('img'), PostController.create);
router.put('/:id', authMiddleware, upload.single('img'), PostController.edit);
router.get('/', authMiddleware, PostController.get);

export default router;
