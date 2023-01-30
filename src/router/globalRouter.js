import express from "express";
import { login, join } from "../controller/userController";
import { home, search } from "../controller/videosController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/login", login);
globalRouter.get("/join", join);
globalRouter.get("/search", search);

export default globalRouter;
