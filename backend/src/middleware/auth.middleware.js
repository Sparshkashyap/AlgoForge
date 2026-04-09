import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const cookieToken = req.cookies?.accessToken;
    const token = bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};