import mongoose, {Schema, model} from "mongoose"

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20 
    },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
    },
  password: {
    type: String,
    required: true,
    
    },
  forgetCode: {type: String, },
  activationCode: {type: String},
  isConfirmed: {type: String,},
  porfilePic: {
    url: {type: String, default: ""},
    id: {type: String, default: ""}
  },
  chapter: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
      progress: { type: Number, default: 0 }, // Overall progress for the chapter
      quizProgress: { type: Number, default: 0 }, // Progress for quizzes
      videosProgress: { type: Number, default: 0 }, // Progress for videos
    },
  ],
  token:{
    type: String,
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  }],
  forgetCode: {
    type: String,
  }


},{toJSON: {virtuals: true}, toObject: {virtuals: true }});

const User = mongoose.model.User || model('User', userSchema)
export default User;