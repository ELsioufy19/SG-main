import { Router } from "express";
import { createVideo, getAllVideos, getVideoById, updateVideo  } from "./video.controller.js";

const router = Router();

// Video routes
router.post('/create', createVideo);
router.get('/all', getAllVideos);
router.get('/:id', getVideoById);
router.patch('/update/:id', updateVideo);


export default router;
