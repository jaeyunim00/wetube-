import express from "express";
import { login, getJoin, postJoin } from "../controller/userController";
import { home, search } from "../controller/videosController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/login", login);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/search", search);

export default rootRouter;
