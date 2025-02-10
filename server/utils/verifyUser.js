import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  // console.log(req.cookies);
  
  if (!token) {
    return next(errorHandler(401, "You are not loggedin!"));
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(401, "You are not loggedin!"));
    }
    req.user = user;
    next();
  });
};
