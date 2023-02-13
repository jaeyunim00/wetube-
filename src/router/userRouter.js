import express from "express";
import {
  edit,
  remove,
  see,
  logout,
  startGithubLogin,
  finishGithubLogin,
  startKakaoLogin,
  finishKakaoLogin,
  getProfie,
  postProfile,
} from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.route("/profile").get(getProfie).post(postProfile);
userRouter.get("/delete", remove);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/kakao/start", startKakaoLogin);
userRouter.get("/kakao/finish", finishKakaoLogin);
userRouter.get("/:id", see);

export default userRouter;
