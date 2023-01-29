import Video from "../models/Video";

//home
export const home = (req, res) => {
    Video.find({}, (error, videos) => {
        console.log("errors", error);
        console.log("videos", videos);
    })
    return res.render("home", { pageTitle: "Trending", videos });
};

//video
export const see = (req, res) => {
    const id = req.params.id;
    const video = videos[id - 1];
    return res.render("watch", { pageTitle: video.title, video });
};

//edit video
export const getEdit = (req, res) => {
    const id = req.params.id;
    const video = videos[id - 1];
    return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
};
export const postEdit = (req, res) => {
    const id = req.params.id;
    const title = req.body.title;

    videos[id - 1].title = title;

    return res.redirect(`/videos/${id}`);
}

//upload video
export const getUpload = (req, res) => {
    return res.render("upload");
}
export const postUpload = (req, res) => {
    //here will be add a video to the videos array.
    const temp = req.body.uploadVideo;
    const video = {
        title: temp,
        views: 0,
        rating: 0,
        comments: 0,
        id: videos.length + 1
    }

    videos.push(video);

    return res.redirect("/");
}
