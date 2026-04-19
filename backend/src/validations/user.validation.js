import { z } from "zod";

export const notificationIdParamSchema = z.object({
  body: z.object({}),
  params: z.object({
    notificationId: z.string().min(1, "notificationId is required"),
  }),
  query: z.object({}),
});

export const readAllNotificationsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({}),
});