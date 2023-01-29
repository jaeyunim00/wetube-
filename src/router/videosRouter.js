import express from "express";
import { see, getUpload, postUpload, getEdit, postEdit } from "../controller/videosController"

const videosRouter = express.Router();

videosRouter.get("/:id(\\d+)", see);
videosRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videosRouter.route("/upload").get(getUpload).post(postUpload);

export default videosRouter;