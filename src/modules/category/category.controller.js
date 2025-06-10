import slugify from "slugify";
import Category from "../../../DB/models/category.model.js";

export const create = async (req, res, next) => {
  const { name } = req.body;
  const createdBy = req.user._id;
  if (!req.file) return next(new Error("file required"));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_FOLDER}/categoryImg` }
  );
  const slug = slugify(name);
  const category = await Category.create({
    name,
    createdBy,
    img: { id: public_id, url: secure_url },
    slug,
  });
  return res.json({ sucess: true, results: category });
};

export const update = async (req, res, next) => {
  const cat = await Category.findOne({ _id: req.params.catId });
  if (!cat) return next(new Error("Category not found"));
  if(cat.createdBy.toString() != req.user._id.toString()) return next(new Error("not authorized", {cause: 401}));
  cat.name = req.body.name ? req.body.name : cat.name;
  cat.slug = slugify(cat.name);
  await cat.save();
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: cat.img.id,
    });
    cat.img.url = secure_url;
    await cat.save();
  }
  res.json({ sucess: true, result: cat });
};

export const deleteCat = async (req, res, next) => {
  const id = req.params.catId;
  const cat = await Category.findById(id);
  cloudinary.uploader.destroy(cat.img.id).catch(err => console.log(err));

  await Category.findOneAndDelete({ _id: id });
  res.json({ sucess: true, message: "Category deleted" });
};

export const getCat = async (req, res, next) => {
  const cats = await Category.find().selection(req.query.feilds).populate("subcategories");
  if (cats.length == 0) return next(new Error("No Categories yet"));
  res.json({ sucess: true, results: cats });
};
