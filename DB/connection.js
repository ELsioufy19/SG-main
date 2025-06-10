import mongoose from "mongoose";
import { catSchema } from "./models/category.model.js";
const connectDB = async () =>
  await mongoose
    .connect(process.env.ATLAS)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));

export default connectDB;

// selection golablizing
mongoose.Query.prototype.selection = function (feilds) {
  if (!feilds) return this;
  const modelKeys = Object.keys(catSchema.paths);
  const feildsArray = feilds.split(" ");
  feilds = feildsArray.filter(
    (feild) =>
      modelKeys.includes(feild) || modelKeys.includes(feild.split("-")[1])
  );
  return this.select(feilds);
};
