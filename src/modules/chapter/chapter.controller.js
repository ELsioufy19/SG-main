import Chapter from '../../../DB/models/chapter.model.js';
import catchError from '../../utils/catchError.js';
import User from '../../../DB/models/user.model.js';
// Create chapter with error handling
export const createChapter = catchError(async (req, res) => {
    const { title, description , content, chapterNumber, cover } = req.body;

    const chapter = await Chapter.create({
        title,
        content, 
        chapterNumber,
        description,
        cover
    });

    res.status(201).json({
        success: true,
        message: "Chapter created successfully",
        data: chapter
    });
});

// Get all chapters with pagination
export const getAllChapters = catchError(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let chapters = await Chapter.find()
        .select('title description cover chapterNumber')
        .sort({ chapterNumber: 1 })
        .skip(skip)
        .limit(limit);

    // Map through chapters and add progress information
    chapters = chapters.map(chapter => {
        const isUserChapter = chapter._id.toString() === req.user.chapter.id?.toString();
        return {
            ...chapter.toObject(),
            progress: isUserChapter ? req.user.chapter.progress : 0,
            
        };
    });

    const totalCount = await Chapter.countDocuments();

    res.status(200).json({
        success: true,
        data: {
            chapters,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        }
    });
});
// Update chapter progress with validation
export const updateChapterProgress = catchError(async (req, res) => {
    const { userId,chapterId } = req.query;
    const { progress } = req.body;
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId, 'chapter.id': chapterId },
        { $inc: { 'chapter.$.progress': progress || 1 } }, // Increment progress for the matched chapter
        { new: true }
    );
    if (!updatedUser) {
        return res.status(404).json({
            success: false,
            message: 'Chapter not found'
        });
    }

    const existchapter = await Chapter.findById(chapterId)
    if (!existchapter) {
        return res.status(404).json({
            success: false,
            message: 'Chapter not found'
        });
    }
    const updatedChapter = updatedUser.chapter.find(
        (ch) => ch.id.toString() === chapterId
      );
    if (existchapter.content.length==updatedChapter.progress) { 
       const nextchapter = await Chapter.findOne({chapterNumber:existchapter.chapterNumber+1})
        await User.findByIdAndUpdate(userId,
            {
              $addToSet: {
                chapter: {
                  id: nextchapter._id,
                  progress: 0,
                  quizProgress: 0,
                  videosProgress: 0,
                },
              },
            }
        )
    }
  

    res.status(200).json({
        success: true,
        data: updatedChapter
    });
});

// Get single chapter with proper error handling
export const getSingleChapter = catchError(async (req, res) => {
    const chapter = await Chapter.findById(req.params.id)
        .select('title content chapterNumber cover');

    if (!chapter) {
        return res.status(404).json({
            success: false,
            message: "Chapter not found"
        });
    }

    return res.json({
        success: true,
        data: chapter
    });
});

export const toggleFavoriteChapter = catchError(async (req, res) => {
    const { chapterId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    // Toggle favorite status
    if (!user.favoriteChapters) {
        user.favoriteChapters = [];
    }
    
    const chapterIndex = user.favoriteChapters.indexOf(chapterId);
    if (chapterIndex === -1) {
        user.favoriteChapters.push(chapterId);
    } else {
        user.favoriteChapters.splice(chapterIndex, 1);
    }
    
    await user.save();

    res.status(200).json({
        success: true,
        message: chapterIndex === -1 ? 'Chapter added to favorites' : 'Chapter removed from favorites',
        data: {
            favoriteChapters: user.favoriteChapters
        }
    });
});

export const updateVideoProgress = catchError(async (req, res) => {
    const { userId, chapterId } = req.query;
    const { videoProgress } = req.body;

    const updatedUser = await User.findOneAndUpdate(
        { 
            _id: userId,
            'chapters.chapterId': chapterId 
        },
        { 
            $inc: { 'chapters.$.videosProgress': 1 }
        },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({
            success: false,
            message: 'User or chapter not found'
        });
    }

    const chapter = await Chapter.findById(chapterId);
    const userChapter = updatedUser.chapters.find(c => c.chapterId.toString() === chapterId);

    // Check if all videos are completed
    if (chapter.videos && userChapter.videosProgress >= chapter.videos.length) {
        const nextChapter = await Chapter.findOne({ chapterNumber: chapter.chapterNumber + 1 });
        if (nextChapter) {
            await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        chapters: {
                            chapterId: nextChapter._id,
                            progress: 0,
                            videosProgress: 0,
                            quizprogress: 0
                        }
                    }
                }
            );
        }
    }

    res.status(200).json({
        success: true,
        data: updatedUser
    });
});
export const updateQuizProgress = catchError(async (req, res) => {
    const { userId, chapterId } = req.query;
    const { quizScore } = req.body;

    const updatedUser = await User.findOneAndUpdate(
        { 
            _id: userId,
            'chapters.chapterId': chapterId 
        },
        { 
            $inc: { 'chapters.$.quizprogress': quizScore }
        },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({
            success: false,
            message: 'User or chapter not found'
        });
    }

    const chapter = await Chapter.findById(chapterId);
    const userChapter = updatedUser.chapters.find(c => c.chapterId.toString() === chapterId);

    // Check if quiz score meets passing threshold (e.g., 70%)
    if (userChapter.quizprogress >= 70) {
        const nextChapter = await Chapter.findOne({ chapterNumber: chapter.chapterNumber + 1 });
        if (nextChapter) {
            await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        chapters: {
                            chapterId: nextChapter._id,
                            progress: 0,
                            videosProgress: 0,
                            quizprogress: 0
                        }
                    }
                }
            );
        }
    }

    res.status(200).json({
        success: true,
        message: 'Quiz progress updated successfully',
        data: updatedUser
    });
});