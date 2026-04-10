import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const bearerToken =
      req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null;

    const cookieToken = req.cookies?.accessToken || null;
    const token = bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = verifyToken(token);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};