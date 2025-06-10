import mongoose from 'mongoose';
import connectDB from "./DB/connection.js";
import express  from 'express'
import appRouter from "./src/modules/app.router.js";
import dotenv from 'dotenv'
dotenv.config()
const app = express();
// setupRoutes(app); 
const port = process.env.PORT
app.use(express.json());
appRouter(app)
connectDB()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(express.urlencoded({ extended: true }));




