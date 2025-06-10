import Video from '../../../DB/models/video.model.js';
import catchError from '../../utils/catchError.js';

export const createVideo = catchError(async (req, res) => {
    const { title, videos  } = req.body;

    const video = await Video.create({
        title,
        videos: {
           video_ar: videos.arabic,
            video_en: videos.english,
            video_gr: videos.german
        },
        
        
    });

    res.status(201).json({
        success: true,
        message: "Video created successfully",
        data: video
    });
});

export const getAllVideos = catchError(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find()
        .skip(skip)
        .limit(limit);

    const totalCount = await Video.countDocuments();

    res.status(200).json({
        success: true,
        data: {
            videos,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        }
    });
});

export const getVideoById = catchError(async (req, res) => {
    const video = await Video.findById(req.params.id)

    if (!video) {
        return res.status(404).json({
            success: false,
            message: "Video not found"
        });
    }

    res.status(200).json({
        success: true,
        data: video
    });
});

export const updateVideo = catchError(async (req, res) => {
    const { title, videos, orderInChapter } = req.body;

    const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
            title,
            videos,
            orderInChapter
        },
        { new: true }
    );

    if (!updatedVideo) {
        return res.status(404).json({
            success: false,
            message: "Video not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Video updated successfully",
        data: updatedVideo
    });
});




