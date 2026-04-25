import prisma from "../config/db.js";
import { dispatchNotificationEventService } from "./notification.service.js";

const ensureProblemExists = async (problemId) => {
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      createdById: true,
      isPublished: true,
      reviewStatus: true,
    },
  });

  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  return problem;
};

export const listProblemsForReviewService = async () => {
  return prisma.problem.findMany({
    where: {
      reviewStatus: "PENDING",
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
      testCases: {
        select: {
          id: true,
          isHidden: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const submitProblemForReviewService = async ({
  problemId,
  actorUserId,
}) => {
  const existing = await ensureProblemExists(problemId);

  const actor = await prisma.user.findUnique({
    where: { id: actorUserId },
    select: {
      id: true,
      role: true,
    },
  });

  const canSubmit =
    actor?.role === "ADMIN" || existing.createdById === actorUserId;

  if (!canSubmit) {
    const error = new Error("You are not allowed to submit this problem");
    error.statusCode = 403;
    throw error;
  }

  if (existing.isPublished) {
    const error = new Error("Published problem cannot be submitted for review");
    error.statusCode = 400;
    throw error;
  }

  const problem = await prisma.problem.update({
    where: { id: problemId },
    data: {
      reviewStatus: "PENDING",
      reviewNotes: null,
      isPublished: false,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "PROBLEM_SUBMITTED_FOR_REVIEW",
      actorUserId,
      metadata: {
        problemId,
        problemTitle: existing.title,
      },
    },
  });

  await dispatchNotificationEventService({
    event: "PROBLEM_SUBMITTED_FOR_REVIEW",
    actorUserId,
    payload: {
      problemId,
      problemTitle: existing.title,
      creatorUserId: existing.createdById,
    },
  });

  return problem;
};

export const approveProblemService = async ({ problemId, actorUserId }) => {
  const existing = await ensureProblemExists(problemId);

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
  const existing = await ensureProblemExists(problemId);

  const finalReason = String(reason || "").trim() || "Rejected by admin";

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