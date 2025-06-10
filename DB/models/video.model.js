import mongoose, { Schema, model } from "mongoose";

const videoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    videos: {
        
          video_ar: { type: String, required: true },
          video_gr:{ type: String, required: true},
          video_en: { type: String, required: true },
          
    
    }
    
}, { timestamps: true });

const Video = mongoose.model.Video || model('Video', videoSchema);
export default Video;
