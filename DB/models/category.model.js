import mongoose, { model, Schema, Types } from "mongoose";

export const catSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, minlength: 3 },
    slug: String,
    img: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    brand: {type: Types.ObjectId, ref: "Brand"},
    createdBy: { type: Types.ObjectId, ref: "User", requird: true },
  },
  { timeseries: true, toJSON: {virtuals: true} }
);
catSchema.virtual("subcategories", {
  ref: "Subcategory",
  localField: "_id",
  foreignField: "category",
});
const Category = mongoose.models.Category || model("Category", catSchema);
export default Category;
