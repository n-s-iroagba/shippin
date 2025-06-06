import express from "express";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./config/database";
import router from "./router";
import cors from 'cors'

// import { applyAssociations } from './models';  // the file from step 1

dotenv.config();
// sss
export const app = express();
app.use(express.json());

  app.use(cors({
    origin: "*", // or your frontend origin
    credentials: true
  }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('./uploads'));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

connectDB();


sequelize.sync(
  // {force:true}
).then(() => {
  console.log("📦 MySQL Database synchronized!");
});


app.use("/api", router);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

