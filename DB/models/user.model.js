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
  porfilePic: {
    url: {type: String, default: ""},
    id: {type: String, default: ""}
  },
  
  token:{
    type: String,
  },

  forgetCode: {
    type: String,
  }


},{toJSON: {virtuals: true}, toObject: {virtuals: true }});

const User = mongoose.model.User || model('User', userSchema)
export default User;