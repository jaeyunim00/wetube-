import User from "../models/User";
import bcrypt from "bcrypt";
import { json, request } from "express";

//##########PROFILE############
export const getProfie = (req, res) => {
  return res.render("profile", {
    pageTitle: "profile",
    User: req.session.User,
  });
};

export const postProfile = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
  } = req;
  await User.findByIdAndUpdate(_id, {
    name,
    email,
    username,
    location,
  });

  req.session.user = {
    ...req.session.user,
    name,
    email,
    username,
    location,
  };
  return res.redirect("/user/profile");
};

//######CHANGE PASSWORD#######
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("user/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  //send 비밀번호 잘  변경
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok) {
    return res.status(400).render("user/change-password", {
      pageTitle: "Change Password",
      errMsg: "비밀번호 오류",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    console.log(newPassword, newPasswordConfirmation);
    return res.status(400).render("user/change-password", {
      pageTitle: "Change Password",
      errMsg: "Confirm password does not match",
    });
  }

  const user = await User.findById(_id);
  console.log("OLD: ", user.password);
  user.password = newPassword;
  console.log("NEW(UNHASH): ", user.password);
  await user.save();
  req.session.user.password = user.password;
  console.log("NEW(HASHED):", user.password);
  return res.redirect("/user/logout");
};

export const remove = (req, res) => {
  return res.send("<h1>HERE IS removeUserPAGE</h1>");
};

//#######login########
export const getLogin = (req, res) => {
  return res.render("login");
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "email not exists" });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "wrong password" });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

//#####logout#######
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

//###########join############
export const getJoin = (req, res) => {
  return res.render("join");
};

export const postJoin = async (req, res) => {
  const { name, email, username, password, passwordCheck, location } = req.body;
  const pageTitle = "Join";
  const exists = await User.exists({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  //check login error
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

//#######GITHUB LOGIN API#########
export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GIT_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GIT_CLIENT,
    client_secret: process.env.GIT_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const data = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const json = await data.json();
  if ("access_token" in json) {
    //access api
    const { access_token } = json;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    const existingUser = await User.findOne({ email: emailObj.email });
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      //create An account
      const user = await User.create({
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};
