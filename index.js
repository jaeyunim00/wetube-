import express from "express";
import morgan from "morgan";
import globalRouter from "./router/globalRouter";
import userRouter from "./router/userRouter";
import videosRouter from "./router/videosRouter";

//use PORT
const PORT = 4000;
const app = express();

//CONTROLLER
const handleListening = () => {
    console.log(`server open http://localhost:${PORT} ⭐`);
}

//app.use
app.use(morgan("dev"));
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/videos", videosRouter);

//listen local PORT
app.listen(PORT, handleListening);