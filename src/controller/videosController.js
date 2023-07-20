import Video from "../models/Video";
import User from "../models/User";
//home
export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "homepage", videos });
  } catch {
    return res.render("server-error");
  }
};

//see video
export const see = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id).populate("owner");
  console.log(video);
  if (video) {
    return res.render("watch", { pageTitle: "watch video", video });
  }
  return res.status(404).render("404", { pageTitle: "Video not Found" });
};

//edit video
export const getEdit = async (req, res) => {
  const id = req.params.id;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: "edit video", video });
};

export const postEdit = async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const video = await Video.findById(id);
  const {
    user: { _id },
  } = req.session;
  if (!video) {
    return res.render("404");
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/ww");
  }
  await Video.findByIdAndUpdate(id, {
    title: title,
  });
  return res.redirect(`/videos/${id}`);
};

//upload video
export const getUpload = (req, res) => {
  return res.render("upload");
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const file = req.file;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title: title,
      description: description,
      fileUrl: file.path,
      owner: _id,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(404).render("upload", { errorMessage: error._message });
  }
};

export const deleteVideo = async (req, res) => {
  const id = req.params.id;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).render("404");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

//search
export const search = async (req, res) => {
  const keyword = req.query.keyword;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
    console.log(videos);
  }
  return res.render("search", { pageTitle: "search", videos });
};
