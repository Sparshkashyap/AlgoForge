import prisma from "../config/db.js";

export const listAllSubscriptionsForAdminService = async () => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          razorpaySubscriptionId: {
            not: null,
          },
        },
        {
          plan: {
            in: ["STANDARD", "PRO"],
          },
        },
        {
          subscriptionStatus: {
            not: null,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      subscriptionStatus: true,
      currentPeriodEnd: true,
      razorpaySubscriptionId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return users.map((user) => ({
    id: user.razorpaySubscriptionId || user.id,
    userId: user.id,
    plan: user.plan,
    status: user.subscriptionStatus || "INACTIVE",
    currentPeriodEnd: user.currentPeriodEnd,
    razorpaySubscriptionId: user.razorpaySubscriptionId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    user: {
      name: user.name,
      email: user.email,
    },
  }));
};