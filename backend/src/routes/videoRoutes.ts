import express from 'express';
import { uploadVideo, getVideos, streamVideo } from '../controllers/videoController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router.post('/', protect, authorizeRoles('Editor', 'Admin'), upload.single('video'), uploadVideo);
router.get('/', protect, getVideos);
router.get('/:id/stream', protect, streamVideo);

export default router;
