import express from "express";
import { treding, login, join } from "../controller/userController"
import { search } from "../controller/videosController"

const globalRouter = express.Router();

globalRouter.get("/", treding);
globalRouter.get("/login", login);
globalRouter.get("/join", join);
globalRouter.get("/search", search);

export default globalRouter;