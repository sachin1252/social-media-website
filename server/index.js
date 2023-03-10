const express = require("express");
const dotenv = require("dotenv");
const authRouter = require("./Routerss/authRouter");
const postRouter = require("./Routerss/postRouter");
const dbconnect = require("./dbConnectMongoose");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const userRouter = require("./Routerss/userRouter");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

dotenv.config("./.evn");

// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET
});


const app = express();

// //middlewares
app.use(express.json({limit:"10mb"}));
app.use(morgan("common"));
app.use(cookieparser());
let origin = 'http://localhost:3000';
console.log('here env', process.env.NODE_ENV);
if(process.env.NODE_ENV === 'production') {
    origin = process.env.CLIENT_ORIGIN;
}
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use("/posts", postRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.get("/", (req, res) => {
  res.status(200).send("ok from server");
});

const PORT = process.env.PORT || 4001;

dbconnect();

app.listen(PORT, () => {
  console.log("listening on port:", PORT);
});
