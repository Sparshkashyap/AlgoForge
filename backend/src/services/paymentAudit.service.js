import prisma from "../config/db.js";

export const createPaymentAuditService = async ({
  eventId,
  type,
  payload,
  status = "RECEIVED",
}) => {
  return prisma.paymentAudit.create({
    data: {
      eventId,
      type,
      payload,
      status,
    },
  });
};

export const getPaymentAuditByEventIdService = async (eventId) => {
  return prisma.paymentAudit.findUnique({
    where: {
      eventId,
    },
  });
};

export const markPaymentAuditProcessedService = async (eventId) => {
  return prisma.paymentAudit.update({
    where: {
      eventId,
    },
    data: {
      status: "PROCESSED",
      processedAt: new Date(),
      lastError: null,
    },
  });
};

export const markPaymentAuditFailedService = async ({
  eventId,
  errorMessage,
}) => {
  return prisma.paymentAudit.update({
    where: {
      eventId,
    },
    data: {
      status: "FAILED",
      lastError: errorMessage,
      retryCount: {
        increment: 1,
      },
    },
  });
};