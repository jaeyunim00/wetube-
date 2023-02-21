import express from "express";
import {
  see,
  getUpload,
  postUpload,
  getEdit,
  postEdit,
  deleteVideo,
} from "../controller/videosController";

import { protectorMiddleware } from "../middlewares";

const videosRouter = express.Router();

videosRouter.get("/:id([0-9a-f]{24})", see);
videosRouter
  .all(protectorMiddleware)
  .route("/:id([0-9a-f]{24})/edit")
  .get(getEdit)
  .post(postEdit);
videosRouter
  .all(protectorMiddleware)
  .route("/upload")
  .get(getUpload)
  .post(postUpload);
videosRouter
  .all(protectorMiddleware)
  .route("/:id([0-9a-f]{24})/delete")
  .get(deleteVideo);

export default videosRouter;
