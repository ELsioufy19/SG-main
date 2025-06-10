import { Router } from "express";
import {register, confirmEmail, login, forgetPass, resetPass} from "./auth.controller.js"
import catchError from "../../utils/catchError.js"
import isValid from "../../middleware/isValid.js";
import { registerSchema, loginSchema, forgetSchema, resetSchema } from "./auth.valid.schema.js";

const router = new Router();

router.post(
  "/register",
  isValid(registerSchema),
  catchError(register)
);

router.get("/confirmEmail/:activationCode", catchError(confirmEmail))

router.post("/login", isValid(loginSchema), catchError(login))

router.patch("/forgetpass", isValid(forgetSchema), catchError(forgetPass))

router.patch("/resetpass", isValid(resetSchema), catchError(resetPass))

export default router;