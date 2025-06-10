import bcrypt from "bcryptjs";
import User from "../../../DB/models/user.model.js";
import Token from "../../../DB/models/token.model.js";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendEmail.js";
import jwt from "jsonwebtoken";


export const register = async (req, res, next) => {
  let { userName, email, password } = req.body;

  if (await User.findOne({ email }))
    return next(new Error("email already used", { cause: 409 }));

  password = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
  const activationCode = crypto.randomBytes(64).toString("hex");
  const user = await User.create({ userName, email, password, activationCode });

  const confirmationLink = `${host}/user/confirmEmail/${activationCode}`;

  if (!user) return next(new Error("Couldn't create user"));
  return (await sendEmail({
    to: email,
    subject: "Confrimation Your Email",
    temp: confirmationTemp(confirmationLink),
  }))
    ? res.json({
        succes: true,
        message: "Account Created Successfully, Please Check your email",
      })
    : next(new Error("Couldn't Verify your email"));
};

export const confirmEmail = async (req, res, next) => {
  const { activationCode } = req.params;
  const user = await User.findOneAndUpdate(
    { activationCode },
    { isConfirmed: true, $unset: { activationCode: 1 } }
  );
  if (!user) return next(new Error("Couldn't find user"));
  await Cart.create({ user: user._id }).catch((err) => console.log(err));
  return res.send("Your Email is Confirmed🥳, Try to login now");
};

export const login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("Email not valid"));
  const passCompare = bcrypt.compareSync(req.body.password, user.password);
  if (!passCompare) return next(new Error("Wrong password"));
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.SECRET_KEY,
    { expiresIn: "2d" }
  );
  await Token.create({
    token,
    user: user._id,
    agent: req.header["User-Agent"],
  });
  user.status = "online";
  await user.save();
  return res.json({ success: true, token });
};

export const forgetPass = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("User not found"));
  const code = randomstr.generate({ length: 6, charset: "numeric" });
  user.forgetCode = code;
  await user.save();
  return sendEmail({
    to: user.email,
    subject: "reset Password",
    temp: resetTemp(code),
  })
    ? res.json({ success: true, message: "Get reset code from yout email" })
    : next(new Error("some error occured"));
};

export const resetPass = async (req, res, next) => {
  const forgetCode = req.body.forgetCode;
  const user = await User.findOne({ forgetCode });
  if (!user) return next(new Error("user not found"));
  await User.findOneAndUpdate({ forgetCode }, { unset: { forgetCode: 1 } });
  let { password, cPassword } = req.body;
  if (password !== cPassword) return next(new Error("password unmatched"));
  password = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
  user.password = password;
  await user.save();
  const tokens = await Token.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  return res.json({
    success: true,
    message: "Password updated successfully, Your logged out from all devices",
  });
};
