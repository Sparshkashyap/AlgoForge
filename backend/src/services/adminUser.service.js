import prisma from "../config/db.js";

export const listUsersForAdminService = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      solvedCount: true,
      streak: true,
      createdAt: true,
      lastSeenAt: true,
      _count: {
        select: {
          submissions: true,
          problems: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateUserRoleService = async ({ userId, role }) => {
  const validRoles = ["USER", "CREATOR", "ADMIN"];

  if (!validRoles.includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
    },
  });

  return user;
};

export const getAdminStatsService = async () => {
  const [totalUsers, totalCreators, totalAdmins, totalProblems, totalSubmissions] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "CREATOR" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.problem.count(),
      prisma.submission.count(),
    ]);

  return {
    totalUsers,
    totalCreators,
    totalAdmins,
    totalProblems,
    totalSubmissions,
  };
};