import prisma from "../config/db.js";

export const getMyProblemNoteService = async ({ userId, problemId }) => {
  return prisma.problemNote.findUnique({
    where: {
      userId_problemId: {
        userId,
        problemId,
      },
    },
  });
};

export const saveMyProblemNoteService = async ({ userId, problemId, content }) => {
  return prisma.problemNote.upsert({
    where: {
      userId_problemId: {
        userId,
        problemId,
      },
    },
    update: {
      content,
    },
    create: {
      userId,
      problemId,
      content,
    },
  });
};