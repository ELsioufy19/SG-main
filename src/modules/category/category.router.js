import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import {
  createCatSchema,
  deleteSchema,
  updateSchema,
} from "./category.valid.schema.js";
import isValid from "../../middleware/isValid.js";
import catchError from "../../utils/catchError.js";
import isAuthroized from "../../middleware/authroization.js";
import { create, deleteCat, getCat, update } from "./category.controller.js";
import uploadFile, { typesObj } from "../../utils/multer.js";

const router = new Router();


router.post(
  "/",
  isAuthenticated,
  isAuthroized("admin"),
  uploadFile(typesObj.img).single("catImg"),
  isValid(createCatSchema),
  catchError(create)
);

router.patch(
  "/:catId",
  isAuthenticated,
  isAuthroized("admin"),
  uploadFile(typesObj.img).single("catImg"),
  isValid(updateSchema),
  catchError(update)
);

router.delete("/:catId", isAuthenticated, isAuthroized("admin"),isValid(deleteSchema), catchError(deleteCat));

router.get("/", catchError(getCat));

export default router;
