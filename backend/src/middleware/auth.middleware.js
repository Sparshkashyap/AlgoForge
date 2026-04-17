import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import env from "../config/env.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        avatarUrl: true,
        solvedCount: true,
        streak: true,
        createdAt: true,
        lastSeenAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.user = {
      userId: user.id,
      ...user,
    };

    next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};