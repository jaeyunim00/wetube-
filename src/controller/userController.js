import User from "../models/User";

export const edit = (req, res) => {
  return res.send("<h1>HERE IS editUserPAGE</h1>");
};
export const remove = (req, res) => {
  return res.send("<h1>HERE IS removeUserPAGE</h1>");
};
export const see = (req, res) => {
  return res.send("<h1>HERE IS seeUserPAGE</h1>");
};

export const login = (req, res) => {
  return res.send("<h1>HERE IS LOGINPAGE</h1>");
};
export const logout = (req, res) => {
  return res.send("<h1>HERE IS LOGOUTPAGE</h1>");
};

//join
export const getJoin = (req, res) => {
  return res.render("join");
};

export const postJoin = async (req, res) => {
  const { name, email, username, password, passwordCheck, location } = req.body;
  const pageTitle = "Join";
  const exists = await User.exists({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });

  //check base error
  if (password !== passwordCheck) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "password does not match.",
    });
  }
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is aleardy taken",
    });
  }

  //try catch page error
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};
