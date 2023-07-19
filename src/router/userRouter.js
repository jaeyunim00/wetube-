import express from "express";
import {
  remove,
  see,
  logout,
  startGithubLogin,
  finishGithubLogin,
  getProfie,
  postProfile,
  getChangePassword,
  postChangePassword,
} from "../controller/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";
import { uploadFiles } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/profile")
  .all(protectorMiddleware)
  .get(getProfie)
  .post(uploadFiles.single("avatar"), postProfile);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

export default userRouter;
