import chapterRouter from "./chapter/chapter.router.js"
import authRouter from "./auth/auth.router.js";
import catRouter from "./category/category.router.js";
import userRouter from "./user/user.router.js";
import express from 'express'
import videoRouter from "./videos/video.router.js";
// import bodyParser from 'bodyParser'
const app = express()

app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser.json());


const appRouter = (app)=>{
  app.use("/reg", authRouter);
  app.use("/category", catRouter);
  app.use("/user", userRouter);
  app.use("/chapter", chapterRouter);
  app.use("/video",videoRouter)
  app.all("*", (req, res, next) =>
    next(new Error("page not found", { cause: 404 }))
);

app.use((err, req, res, next) =>
  res.status(err.cause || 500).json({
    sucess: false,
    message: err.message,
    ...(process.env.MODE == "DEV" ? { stack: err.stack } : ""),
  })
);
}

export default appRouter;