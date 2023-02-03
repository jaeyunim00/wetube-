import express from "express";
import {
  getLogin,
  getJoin,
  postJoin,
  postLogin,
} from "../controller/userController";
import { home, search } from "../controller/videosController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/search", search);

export default rootRouter;
