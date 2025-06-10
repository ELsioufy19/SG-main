import Token from "../../DB/models/token.model.js";
import User from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import catchError from "../utils/catchError.js"
export const isAuthenticated = catchError(async (req, res, next) => {
  let { token } = req.headers;
  if(!token) return next(new Error("token is required"));
  let payload = jwt.verify(token, process.env.SECRET_KEY);
  if (!payload) return next(new Error("invalid token"));
  const user = await User.findById(payload.id);
  if (!user) return next(new Error("user not found"));
  req.user = user;
  return next();
});
