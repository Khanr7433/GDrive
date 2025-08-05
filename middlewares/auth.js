import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const token =
    req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.redirect("/user/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (err) {
    return res.redirect("/user/login");
  }
}

export default auth;
