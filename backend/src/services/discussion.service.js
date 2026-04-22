import prisma from "../config/db.js";

export const listProblemDiscussionsService = async (problemId) => {
  return prisma.problemDiscussion.findMany({
    where: { problemId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createProblemDiscussionService = async ({
  problemId,
  userId,
  content,
}) => {
  return prisma.problemDiscussion.create({
    data: {
      problemId,
      userId,
      content,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      replies: true,
    },
  });
};

export const createDiscussionReplyService = async ({
  discussionId,
  userId,
  content,
}) => {
  return prisma.problemDiscussionReply.create({
    data: {
      discussionId,
      userId,
      content,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });
};