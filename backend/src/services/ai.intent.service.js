const containsAny = (text, keywords) =>
  keywords.some((word) => text.includes(word));

export const detectAiIntentService = ({ message = "", role = "USER" }) => {
  const text = String(message || "").trim().toLowerCase();

  if (!text) {
    return {
      intent: "general_help",
      confidence: 0.2,
    };
  }

  if (
    containsAny(text, [
      "billing",
      "price",
      "pricing",
      "subscription",
      "pro plan",
      "standard plan",
      "payment",
      "checkout",
      "razorpay",
      "refund",
      "cancel subscription",
    ])
  ) {
    return { intent: "billing_help", confidence: 0.9 };
  }

  if (
    containsAny(text, [
      "roadmap",
      "what should i solve",
      "what should i do next",
      "next problem",
      "weak topic",
      "improve",
      "how to improve",
      "learn",
      "study plan",
      "topic",
    ])
  ) {
    return { intent: "learning_guidance", confidence: 0.92 };
  }

  if (
    containsAny(text, [
      "submission",
      "accepted",
      "wrong answer",
      "runtime",
      "analytics",
      "stats",
      "why am i failing",
      "verdict",
      "heatmap",
      "progress",
    ])
  ) {
    return { intent: "performance_analysis", confidence: 0.9 };
  }

  if (
    containsAny(text, [
      "contest",
      "ranking",
      "register",
      "live contest",
      "contest strategy",
      "contest prep",
    ])
  ) {
    return { intent: "contest_help", confidence: 0.85 };
  }

  if (
    role === "CREATOR" &&
    containsAny(text, [
      "create problem",
      "problem quality",
      "draft",
      "review",
      "hidden testcase",
      "testcase",
      "problem coverage",
      "duplicate",
      "author",
      "creator",
    ])
  ) {
    return { intent: "creator_assistance", confidence: 0.94 };
  }

  if (
    role === "ADMIN" &&
    containsAny(text, [
      "revenue",
      "growth",
      "admin",
      "platform health",
      "blocked users",
      "conversion",
      "premium users",
      "sales",
      "review queue",
      "pending reviews",
      "what is weak in platform",
      "what should admin do",
    ])
  ) {
    return { intent: "admin_insights", confidence: 0.95 };
  }

  if (
    containsAny(text, [
      "daily question",
      "notification",
      "where is",
      "how do i use",
      "feature",
      "platform",
      "dashboard",
      "bookmark",
      "discussion",
      "notes",
    ])
  ) {
    return { intent: "platform_support", confidence: 0.82 };
  }

  return {
    intent: "general_help",
    confidence: 0.55,
  };
};