export const localMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "WeTube";
  res.locals.loggedInUser = req.session.user || {};
  console.log(req.session.user);
  next();
};

//사용자가 로그인 돼 있지 않은걸 확인하면, 로그인 페이지로 redirect하게하는 미들웨어
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
