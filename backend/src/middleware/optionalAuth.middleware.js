import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const optionalAuthMiddleware = (req, _res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;

    let token = cookieToken || null;

    if (!token && bearerHeader?.startsWith("Bearer ")) {
      token = bearerHeader.split(" ")[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };

    return next();
  } catch (_error) {
    req.user = null;
    return next();
  }
};