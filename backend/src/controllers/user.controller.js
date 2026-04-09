import prisma from "../config/db.js";
import { successResponse } from "../utils/response.js";

export const dashboardController = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        solvedCount: true,
        streak: true,
        plan: true,
        role: true,
        createdAt: true
      }
    });

    const recentSubmissions = await prisma.submission.findMany({
      where: { userId: req.user.id },
      include: {
        problem: {
          select: {
            title: true,
            slug: true,
            difficulty: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    });

    return successResponse(
      res,
      {
        user,
        recentSubmissions
      },
      "Dashboard fetched"
    );
  } catch (error) {
    next(error);
  }
};