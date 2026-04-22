export const NotificationAudience = {
  USER: "USER",
  CREATOR: "CREATOR",
  ADMIN: "ADMIN",
  USER_ID: "USER_ID",
};

export const buildNotificationPayloadsForEventService = ({
  event,
  actorUserId = null,
  payload = {},
}) => {
  switch (event) {
    case "DAILY_QUESTION_PUBLISHED": {
      return [
        {
          audienceType: NotificationAudience.USER,
          type: "DAILY_QUESTION",
          title: "Daily question is live",
          message: "Aaj ka daily question aa gaya hai. Jaake solve karo.",
          data: {
            dailyQuestionId: payload.dailyQuestionId || null,
            problemSlug: payload.problemSlug || null,
          },
        },
        {
          audienceType: NotificationAudience.CREATOR,
          type: "SYSTEM",
          title: "Daily question published",
          message: "Daily question platform par publish ho gaya hai.",
          data: {
            dailyQuestionId: payload.dailyQuestionId || null,
            problemSlug: payload.problemSlug || null,
          },
        },
        {
          audienceType: NotificationAudience.ADMIN,
          type: "SYSTEM",
          title: "Daily question broadcast complete",
          message: "Daily question users ko push kar diya gaya hai.",
          data: {
            dailyQuestionId: payload.dailyQuestionId || null,
            actorUserId,
          },
        },
      ];
    }

    case "PROBLEM_APPROVED": {
      if (!payload.targetUserId) return [];
      return [
        {
          audienceType: NotificationAudience.USER_ID,
          targetUserId: payload.targetUserId,
          type: "SYSTEM",
          title: "Problem approved",
          message:
            "Tumhara problem approve ho gaya hai aur ab live ho sakta hai.",
          data: {
            problemId: payload.problemId || null,
            problemTitle: payload.problemTitle || null,
          },
        },
      ];
    }

    case "PROBLEM_REJECTED": {
      if (!payload.targetUserId) return [];
      return [
        {
          audienceType: NotificationAudience.USER_ID,
          targetUserId: payload.targetUserId,
          type: "SYSTEM",
          title: "Problem rejected",
          message:
            payload.reason ||
            "Tumhara problem reject hua hai. Review notes check karo aur improve karo.",
          data: {
            problemId: payload.problemId || null,
            problemTitle: payload.problemTitle || null,
            reason: payload.reason || null,
          },
        },
      ];
    }

    case "CREATOR_DRAFT_REMINDER": {
      if (!payload.targetUserId) return [];
      return [
        {
          audienceType: NotificationAudience.USER_ID,
          targetUserId: payload.targetUserId,
          type: "SYSTEM",
          title: "Draft problems need attention",
          message:
            payload.message ||
            "Tumhare unpublished drafts pending pade hain. Review aur publish flow complete karo.",
          data: {
            draftCount: payload.draftCount || 0,
          },
        },
      ];
    }

    case "CONTEST_REMINDER_ONE_HOUR": {
      return [
        {
          audienceType: NotificationAudience.USER,
          type: "CONTEST_REMINDER",
          title: "Contest starts soon",
          message:
            payload.message ||
            "Contest ek ghante ke andar start hoga. Ready ho jao.",
          data: {
            contestId: payload.contestId || null,
            contestTitle: payload.contestTitle || null,
          },
        },
      ];
    }

    case "SUBSCRIPTION_PURCHASED": {
      const notifications = [];

      if (payload.targetUserId) {
        notifications.push({
          audienceType: NotificationAudience.USER_ID,
          targetUserId: payload.targetUserId,
          type: "SYSTEM",
          title: "Subscription activated",
          message: `Tumhara ${
            payload.plan || "premium"
          } subscription active ho gaya hai.`,
          data: {
            plan: payload.plan || null,
            subscriptionId: payload.subscriptionId || null,
          },
        });
      }

      notifications.push({
        audienceType: NotificationAudience.ADMIN,
        type: "SYSTEM",
        title: "New subscription purchase",
        message: `Ek naya ${
          payload.plan || "premium"
        } subscription purchase hua hai.`,
        data: {
          plan: payload.plan || null,
          targetUserId: payload.targetUserId || null,
          subscriptionId: payload.subscriptionId || null,
        },
      });

      return notifications;
    }

    case "SUBSCRIPTION_CANCELLED": {
      const notifications = [];

      if (payload.targetUserId) {
        notifications.push({
          audienceType: NotificationAudience.USER_ID,
          targetUserId: payload.targetUserId,
          type: "SYSTEM",
          title: "Subscription cancellation requested",
          message:
            "Tumhari subscription cancellation request receive ho gayi hai.",
          data: {
            subscriptionId: payload.subscriptionId || null,
          },
        });
      }

      notifications.push({
        audienceType: NotificationAudience.ADMIN,
        type: "SYSTEM",
        title: "Subscription cancelled",
        message: "Ek user ne subscription cancel kiya hai.",
        data: {
          targetUserId: payload.targetUserId || null,
          subscriptionId: payload.subscriptionId || null,
        },
      });

      return notifications;
    }

    case "USER_BLOCKED": {
      if (!payload.targetUserId) return [];
      return [
        {
          audienceType: NotificationAudience.ADMIN,
          type: "SYSTEM",
          title: "User blocked",
          message: `User blocked successfully.${
            payload.reason ? ` Reason: ${payload.reason}` : ""
          }`,
          data: {
            targetUserId: payload.targetUserId,
            reason: payload.reason || null,
            actorUserId,
          },
        },
      ];
    }

    case "USER_UNBLOCKED": {
      if (!payload.targetUserId) return [];
      return [
        {
          audienceType: NotificationAudience.ADMIN,
          type: "SYSTEM",
          title: "User unblocked",
          message: "Blocked user ko restore kar diya gaya hai.",
          data: {
            targetUserId: payload.targetUserId,
            actorUserId,
          },
        },
      ];
    }

    case "CONTEST_PUBLISHED": {
      return [
        {
          audienceType: NotificationAudience.USER,
          type: "CONTEST_REMINDER",
          title: "New contest published",
          message:
            "Ek naya contest live ya scheduled hua hai. Details check karo.",
          data: {
            contestId: payload.contestId || null,
            contestTitle: payload.contestTitle || null,
          },
        },
        {
          audienceType: NotificationAudience.ADMIN,
          type: "SYSTEM",
          title: "Contest published",
          message: "Contest successfully publish ho gaya hai.",
          data: {
            contestId: payload.contestId || null,
            contestTitle: payload.contestTitle || null,
          },
        },
      ];
    }

    case "BADGE_AWARDED": {
      if (!payload.targetUserId) return [];
      return [
        {
          audienceType: NotificationAudience.USER_ID,
          targetUserId: payload.targetUserId,
          type: "BADGE_AWARDED",
          title: "Badge unlocked",
          message: `Tumne "${
            payload.badgeTitle || "new badge"
          }" badge unlock kiya hai.`,
          data: {
            badgeId: payload.badgeId || null,
            badgeTitle: payload.badgeTitle || null,
          },
        },
      ];
    }

    case "STREAK_UPDATED": {
      if (!payload.targetUserId) return [];
      return [
        {
          audienceType: NotificationAudience.USER_ID,
          targetUserId: payload.targetUserId,
          type: "STREAK_UPDATED",
          title: "Streak updated",
          message: `Tumhari streak ab ${
            payload.streak || 0
          } din ki ho gayi hai.`,
          data: {
            streak: payload.streak || 0,
          },
        },
      ];
    }

    default:
      return [];
  }
};