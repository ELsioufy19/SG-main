import mongoose, {Schema, Types, model} from 'mongoose'
const tokenSchema = new Schema({
    token: {type: String, required: true, unique: true},
    user: {type: Types.ObjectId, ref: 'User', required: true},
    isValid: {type: Boolean, default: true},
    agent: String,
    expiredAt: String

});
const Token = mongoose.models.Token || model('Token', tokenSchema);
export default Token;