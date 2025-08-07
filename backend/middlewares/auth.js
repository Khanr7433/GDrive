import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const token =
    req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    // Check if this is an API request (React frontend) or regular request
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(401).json({
        message: "Unauthorized",
        redirect: "/user/login",
      });
    } else {
      return res.redirect("/user/login");
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (err) {
    // Check if this is an API request (React frontend) or regular request
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(401).json({
        message: "Unauthorized",
        redirect: "/user/login",
      });
    } else {
      return res.redirect("/user/login");
    }
  }
}

export default auth;
