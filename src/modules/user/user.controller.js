import User from '../../../DB/models/user.model.js';
import jwt from 'jsonwebtoken';
import express from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { sendEmail } from '../../utils/sendEmail.js';
import bcrypt from "bcryptjs";
import { profile } from 'console';
import cloudinary from '../../utils/cloudinary.js';



export const createUser = async (req, res) => {
  const {
      userName,
      email,
      password,
      confirmPassword,
  } = req.body;
  

  const existingUser = await User.findOne({ email });
  if (existingUser) {
      return res.status(409).json({
          success: false,
          message: "Email already exists"
      });
  }
  if (password !== confirmPassword)
    throw new Error("passowrd didn't match confirm password");
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      chapter: [{
          id: chapter.id || null,
          progress: chapter.progress || 0,
          quizProgress: chapter.quizProgress || 0,
          videosProgress: chapter.videosProgress || 0

      }]
  });

  return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
  });
}


export const updateUser = async (req, res) => {
    const updates = req.body;
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "users" }
    );
    console.log(secure_url,public_id)
  
    const user = await User.findByIdAndUpdate(
        req.user._id,

        { $set: updates },
        { new: true }
    ).select('-password');
user.porfilePic.url = secure_url
user.porfilePic.id = public_id
await user.save()
    return res.json({
        success: true,
        message: "User updated successfully",
        data: user
    });
}

export const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-password');
    
    return res.json({
        success: true,
        message: "User retrieved successfully",
        data: user
    });
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    


    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");
    

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: "2d" }
      );
      
      user.token = token;
      await user.save();

    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            token,
        }
    });
}
export const forgetPass = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("User not found"));
  const code = crypto.randomBytes(32).toString("hex");
  user.forgetCode = code;
  await user.save();
  const resetUrl = `http://localhost:3000/user/reset-password/${code}`;
  return sendEmail({
    to: user.email,
    subject: "reset Password",
    temp:`<p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
    
  })
    ? res.json({ success: true, message: "Get reset link from your email" })
    : next(new Error("some error occured"));
};

export const resetPass = async (req, res, next) => {
  const { code} = req.params;
  const { newPassword } = req.body;
  console.log(newPassword);

  // Find user by token and check expiration
  const user = await User.findOne({
    forgetCode: code
  });

  if (!user) {
    return res.status(400).send("Invalid or expired token.");
  }

  // Hash new password
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Save new password and clear token
  user.password = hashedPassword;
  user.forgetCode = undefined;
  await user.save();

  res.status(200).send("Password has been reset successfully!");
};

export const userProgress = async (req, res) => {
  
  const user = await User.findById(req.user._id).populate({
    path: 'chapter.id',
    select: 'chapterNumber', // Fetch only the fields you need from the Chapter model
  });
  const lastChapter = user.chapter[user.chapter.length - 1]
  console.log(user);
  const result = {"chapterProgress": (lastChapter.id.chapterNumber /5)*100, "quizProgress": (lastChapter.id.chapterNumber /5)*100, "videosProgress": (lastChapter.id.chapterNumber /5)*100}
   console.log("string",lastChapter) 
  return res.json({
        success: true,
        message: "User progress retrieved successfully",
        result
    });
}
  


const router = express.Router();

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

// Generate and Send Confirmation Link
router.post("/register", async (req, res) => {
  const { email } = req.body;

  // Generate a confirmation token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  // Save user and token in DB
  const user = new User({
    email,
    confirmationToken: token,
    confirmationExpires: expires,
  });
  await user.save();

  // Send confirmation email
  const confirmationUrl = `http://localhost:3000/confirm/${token}`;
  await transporter.sendMail({
    to: email,
    subject: "Confirm Your Email",
    html: `<p>Click <a href="${confirmationUrl}">here</a> to confirm your email.</p>`,
  });

  res.status(200).send("Confirmation link sent to email!");
});




 

export default  router;
