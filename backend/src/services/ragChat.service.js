export const askRagChatService = async ({ question, context = [] }) => {
  const contextText = Array.isArray(context) ? context.join("\n") : String(context || "");

  return {
    answer: `Bhai, tumne jo poocha hai uska short answer ye hai:

${question}

Context ke basis par:
${contextText || "Abhi project-specific context wired nahi hai, so generic answer diya ja raha hai."}

Next version me isko vector search + embeddings ke saath connect karna hai.`,
    sources: context,
  };
};