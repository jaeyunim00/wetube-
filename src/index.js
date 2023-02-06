import "dotenv/config";

import "./db";
import "./models/Video";
import "./models/User";

import { localMiddleware } from "./middlewares";

import session from "express-session";
import express from "express";
import morgan from "morgan";
import rootRouter from "./router/rootRouter";
import userRouter from "./router/userRouter";
import videosRouter from "./router/videosRouter";
import MongoStore from "connect-mongo";

//use PORT
const PORT = 4000;
const app = express();

//CONTROLLER
const handleListening = () => {
  console.log(`server open http://localhost:${PORT} ⭐`);
};

//app.set
app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");

//app.use
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(session);
    next();
  });
});

app.use(localMiddleware);

app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/videos", videosRouter);

//listen local PORT
app.listen(PORT, handleListening);
