import Video from "../models/Video";

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
  const video = await Video.findById(id);
  if (video) {
    return res.render("watch", { pageTitle: "watch video", video });
  }
  return res.render("404", { pageTitle: "Video not Found" });
};

//edit video
export const getEdit = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  return res.render("edit", { pageTitle: "edit video", video });
};
export const postEdit = async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const video = await Video.exists({ _id: id });

  if (!video) {
    return res.render("404");
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
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title: title,
      description: description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.render("upload", { errorMessage: error._message });
  }
};

export const deleteVideo = async (req, res) => {
  const id = req.params.id;
  console.log(id);
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
