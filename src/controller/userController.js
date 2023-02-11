import User from "../models/User";
import bcrypt from "bcrypt";

export const edit = (req, res) => {
  return res.send("<h1>HERE IS editUserPAGE</h1>");
};
export const remove = (req, res) => {
  return res.send("<h1>HERE IS removeUserPAGE</h1>");
};
export const see = (req, res) => {
  return res.send("<h1>HERE IS seeUserPAGE</h1>");
};

//login lougout
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
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
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

//GITHUB LOGIN API
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
  console.log(json);
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
    console.log(userData);
    console.log(emailData);
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

//KAKAO LOGIN APT
export const startKakaoLogin = (req, res) => {
  const baseUrl = `https://kauth.kakao.com`;
  const config = {
    rest_api: process.env.KAKAO_REST,
    redirect_uri: `http://localhost:4000/kakao/finish`,
  };
  const backUrl = `/oauth/authorize?client_id=${config.rest_api}&redirect_uri=http://localhost:4000/kakao/finish&response_type=code`;
  const finalUrl = `${baseUrl}${config}`;
  console.log(finalUrl);
  return res.redirect(finalUrl);
};

export const finishKakaoLogin = (req, res) => {
  console.log("hello kakao");
};
