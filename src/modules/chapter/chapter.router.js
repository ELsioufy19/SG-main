import express from 'express';
import { createChapter, getAllChapters, updateChapterProgress,toggleFavoriteChapter,updateVideoProgress,updateQuizProgress } from './chapter.controller.js';
import { isAuthenticated } from '../../middleware/authentication.js';
import { getSingleChapter } from './chapter.controller.js';
const router = express.Router();


router.post('/chapters',isAuthenticated,createChapter);
router.get('/chapters',isAuthenticated, getAllChapters);
router.get('/chapters',isAuthenticated, updateChapterProgress);
router.patch('/favorite/:chapterId', isAuthenticated, toggleFavoriteChapter);
router.get("/chapter/:id", getSingleChapter);
router.patch('/video-progress', updateVideoProgress);
router.patch('/quiz-progress', updateQuizProgress);

export default router;





