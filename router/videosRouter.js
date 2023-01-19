import express from "express";
import { see, edit, remove, upload } from "../controller/videosController"

const videosRouter = express.Router();

videosRouter.get("/upload", upload);
videosRouter.get("/:id(\\d+)", see);
videosRouter.get("/:id(\\d+)/edit", edit);
videosRouter.get("/:id(\\d+)/delete", remove);

export default videosRouter;