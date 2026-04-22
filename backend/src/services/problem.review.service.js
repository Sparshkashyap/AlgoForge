import prisma from "../config/db.js";
import { dispatchNotificationEventService } from "./notification.service.js";

export const listProblemsForReviewService = async () => {
  return prisma.problem.findMany({
    where: {
      isPublished: false,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const approveProblemService = async ({ problemId, actorUserId }) => {
  const existing = await prisma.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      createdById: true,
      isPublished: true,
      reviewStatus: true,
    },
  });

  if (!existing) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  const problem = await prisma.problem.update({
    where: { id: problemId },
    data: {
      isPublished: true,
      reviewStatus: "APPROVED",
      reviewNotes: null,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "PROBLEM_APPROVED",
      actorUserId,
      metadata: {
        problemId,
        problemTitle: existing.title,
      },
    },
  });

  if (existing.createdById) {
    await dispatchNotificationEventService({
      event: "PROBLEM_APPROVED",
      actorUserId,
      payload: {
        targetUserId: existing.createdById,
        problemId: existing.id,
        problemTitle: existing.title,
      },
    });
  }

  return problem;
};

export const rejectProblemService = async ({
  problemId,
  actorUserId,
  reason,
}) => {
  const existing = await prisma.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      createdById: true,
      isPublished: true,
      reviewStatus: true,
    },
  });

  if (!existing) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  const finalReason = reason || "Rejected by admin";

  const problem = await prisma.problem.update({
    where: { id: problemId },
    data: {
      reviewStatus: "REJECTED",
      reviewNotes: finalReason,
      isPublished: false,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "PROBLEM_REJECTED",
      actorUserId,
      metadata: {
        problemId,
        problemTitle: existing.title,
        reason: finalReason,
      },
    },
  });

  if (existing.createdById) {
    await dispatchNotificationEventService({
      event: "PROBLEM_REJECTED",
      actorUserId,
      payload: {
        targetUserId: existing.createdById,
        problemId: existing.id,
        problemTitle: existing.title,
        reason: finalReason,
      },
    });
  }

  return problem;
};