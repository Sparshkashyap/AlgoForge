import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Crown,
  Loader2,
  LockKeyhole,
  Minimize2,
  RefreshCcw,
  SendHorizontal,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AIRobotMascot from "@/components/AIRobotMascot";
import { Button } from "@/components/ui/button";
import { askAiAssistantApi, type AiHistoryMessage } from "@/api/ai.api";
import { useAuth } from "@/context/AuthContext";

type WidgetMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    href?: string;
    score: number;
  }>;
  suggestions?: string[];
  meta?: {
    intent?: string;
    model?: string;
    usedFallback?: boolean;
    retrievedChunkCount?: number;
  };
};

type Position = {
  x: number;
  y: number;
};

const ROBOT_SIZE = 132;
const CHAT_WIDTH = 460;
const CHAT_HEIGHT = 360;
const CHAT_MARGIN = 14;
const CHAT_VERTICAL_GAP = 8;
const DEFAULT_MODEL_LABEL = "llama-3.3-70b-versatile";

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const quickPrompts: Record<"USER" | "CREATOR" | "ADMIN", string[]> = {
  USER: [
    "Mere weak topics ke basis par next 5 problems suggest karo",
    "Contest prep ke liye 7 din ka plan do",
    "Meri recent performance ke hisaab se roadmap do",
  ],
  CREATOR: [
    "Mere draft problems me kya weak hai",
    "Rejected problem ko kaise improve karu",
    "Publishing se pehle quality checklist do",
  ],
  ADMIN: [
    "Platform health ke biggest issues kya hain",
    "Premium conversion improve karne ke ideas do",
    "Review queue optimise kaise karein",
  ],
};

const welcomeMessage = (
  role: "USER" | "CREATOR" | "ADMIN"
): WidgetMessage => ({
  id: createId(),
  role: "assistant",
  content:
    role === "ADMIN"
      ? "Admin copilot ready. Platform health, review queue, premium conversion, moderation, growth aur ops insights pooch sakte ho."
      : role === "CREATOR"
        ? "Creator copilot ready. Draft quality, testcase depth, rejection fixes, publishing readiness aur problem quality pooch sakte ho."
        : "Practice copilot ready. Weak topics, next problems, roadmap, contests, analytics aur bookmarks ke basis par help karunga.",
  suggestions: quickPrompts[role],
  meta: {
    model: DEFAULT_MODEL_LABEL,
    usedFallback: false,
    intent: "welcome",
    retrievedChunkCount: 0,
  },
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getViewport = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const getDefaultRobotPosition = (): Position => {
  const { width, height } = getViewport();

  return {
    x: Math.max(width - ROBOT_SIZE - 24, 8),
    y: Math.max(height - ROBOT_SIZE - 24, 8),
  };
};

const clampRobotPosition = (position: Position): Position => {
  const { width, height } = getViewport();

  return {
    x: clamp(position.x, 8, Math.max(width - ROBOT_SIZE - 8, 8)),
    y: clamp(position.y, 8, Math.max(height - ROBOT_SIZE - 8, 8)),
  };
};

const clampChatPosition = (position: Position): Position => {
  const { width, height } = getViewport();

  return {
    x: clamp(
      position.x,
      CHAT_MARGIN,
      Math.max(width - CHAT_WIDTH - CHAT_MARGIN, CHAT_MARGIN)
    ),
    y: clamp(
      position.y,
      CHAT_MARGIN,
      Math.max(height - CHAT_HEIGHT - CHAT_MARGIN, CHAT_MARGIN)
    ),
  };
};

const getChatPositionFromRobot = (robotPosition: Position): Position => {
  const { width } = getViewport();
  const robotCenterX = robotPosition.x + ROBOT_SIZE / 2;
  const openToRight = robotCenterX < width / 2;

  const x = openToRight
    ? robotPosition.x + ROBOT_SIZE + 10
    : robotPosition.x - CHAT_WIDTH - 10;

  const y = robotPosition.y + CHAT_VERTICAL_GAP;

  return clampChatPosition({ x, y });
};

export default function AIChatBox() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = (user?.role || "USER") as "USER" | "CREATOR" | "ADMIN";
  const isPaidUser = user?.plan === "STANDARD" || user?.plan === "PRO";
  const isPrivilegedUser = user?.role === "ADMIN" || user?.role === "CREATOR";
  const hasAccess = isPrivilegedUser || isPaidUser;

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [isHoveringRobot, setIsHoveringRobot] = useState(false);
  const [isDraggingRobot, setIsDraggingRobot] = useState(false);
  const [isDraggingChat, setIsDraggingChat] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [robotPosition, setRobotPosition] = useState<Position>(() =>
    typeof window === "undefined" ? { x: 8, y: 8 } : getDefaultRobotPosition()
  );
  const [chatPosition, setChatPosition] = useState<Position>(() =>
    typeof window === "undefined"
      ? { x: 20, y: 20 }
      : getChatPositionFromRobot(getDefaultRobotPosition())
  );
  const [messages, setMessages] = useState<WidgetMessage[]>([
    welcomeMessage(role),
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pointerOffsetRef = useRef({ x: 0, y: 0 });
  const dragDistanceRef = useRef(0);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const chatPointerOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMessages([welcomeMessage(role)]);
  }, [role]);

  useEffect(() => {
    const handleResize = () => {
      setRobotPosition((prev) => clampRobotPosition(prev));
      setChatPosition((prev) => clampChatPosition(prev));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (!isDraggingRobot) return;

    const handlePointerMove = (event: PointerEvent) => {
      const nextX = event.clientX - pointerOffsetRef.current.x;
      const nextY = event.clientY - pointerOffsetRef.current.y;

      const dx = event.clientX - lastPointerRef.current.x;
      const dy = event.clientY - lastPointerRef.current.y;
      dragDistanceRef.current += Math.abs(dx) + Math.abs(dy);
      lastPointerRef.current = { x: event.clientX, y: event.clientY };

      setRobotPosition(
        clampRobotPosition({
          x: nextX,
          y: nextY,
        })
      );
    };

    const handlePointerUp = () => {
      setIsDraggingRobot(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDraggingRobot]);

  useEffect(() => {
    if (!isDraggingChat) return;

    const handlePointerMove = (event: PointerEvent) => {
      const nextX = event.clientX - chatPointerOffsetRef.current.x;
      const nextY = event.clientY - chatPointerOffsetRef.current.y;

      setChatPosition(
        clampChatPosition({
          x: nextX,
          y: nextY,
        })
      );
    };

    const handlePointerUp = () => {
      setIsDraggingChat(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDraggingChat]);

  const history = useMemo<AiHistoryMessage[]>(
    () =>
      messages
        .filter((item) => item.role === "user" || item.role === "assistant")
        .map((item) => ({
          role: item.role,
          content: item.content,
        }))
        .slice(-10),
    [messages]
  );

  const resetChat = () => {
    setMessages([welcomeMessage(role)]);
    setQuestion("");
  };

  const sendMessage = async (forcedMessage?: string) => {
    const content = (forcedMessage ?? question).trim();

    if (!content || loading) return;

    const userMessage: WidgetMessage = {
      id: createId(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setOpen(true);
    setMinimized(false);

    try {
      setLoading(true);

      const response = await askAiAssistantApi(content, history);
      const data = response?.data;

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: data?.answer || "No answer generated",
          sources: data?.sources || [],
          suggestions: data?.suggestedPrompts || [],
          meta: {
            intent: data?.meta?.intent,
            model: data?.meta?.model || DEFAULT_MODEL_LABEL,
            usedFallback: Boolean(data?.meta?.usedFallback),
            retrievedChunkCount: data?.meta?.retrievedChunkCount,
          },
        },
      ]);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || "AI chat failed"
      );
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const onTextareaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  const handleRobotPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    pointerOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    dragDistanceRef.current = 0;
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    setIsDraggingRobot(true);
    setIsHoveringRobot(false);

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleRobotClick = () => {
    if (dragDistanceRef.current > 8) return;

    const nextChatPosition = getChatPositionFromRobot(robotPosition);
    setChatPosition(nextChatPosition);
    setOpen(true);
    setMinimized(false);
  };

  const handleChatHeaderPointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;

    chatPointerOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    setIsDraggingChat(true);
  };

  if (!user) {
    return null;
  }

  // if (!hasAccess) {
  //   return (
  //     <div className="fixed bottom-5 right-5 z-[79] w-[calc(100vw-2rem)] max-w-[340px] overflow-hidden rounded-[1.6rem] border border-border/70 bg-card/90 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
  //       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_36%)]" />

  //       <div className="relative z-10 flex items-start gap-3">
  //         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
  //           <LockKeyhole className="h-5 w-5" />
  //         </div>

  //         <div>
  //           <div className="flex items-center gap-2">
  //             <p className="font-semibold">AI Copilot locked</p>
  //             <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-yellow-400">
  //               Premium
  //             </span>
  //           </div>

  //           <p className="mt-1 text-sm leading-6 text-muted-foreground">
  //             Upgrade to Standard or Pro to use the practice AI assistant.
  //           </p>

  //           <Button
  //             type="button"
  //             onClick={() => navigate("/pricing")}
  //             className="mt-3 h-10 rounded-xl"
  //           >
  //             Upgrade
  //             <Crown className="ml-2 h-4 w-4" />
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if(!hasAccess)
{
  return null;
}
  return (
    <>
      <AnimatePresence>
        {open && !minimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              left: `${chatPosition.x}px`,
              top: `${chatPosition.y}px`,
            }}
            className="fixed z-[80] w-[calc(100vw-1.5rem)] max-w-[460px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,29,0.97),rgba(18,26,47,0.98))] text-white shadow-[0_28px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            <div
              onPointerDown={handleChatHeaderPointerDown}
              className="relative cursor-grab overflow-hidden border-b border-white/10 px-4 pb-3 pt-3 active:cursor-grabbing"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(111,244,255,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.16),transparent_30%),radial-gradient(circle_at_center,rgba(99,102,241,0.14),transparent_42%)]" />

              <div className="relative flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 text-left transition hover:opacity-90"
                  title="Close AI chat"
                >
                  <AIRobotMascot compact active />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] font-semibold tracking-wide">
                        AlgoForge AI
                      </p>
                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                        {role}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-300">
                      Role-aware RAG assistant powered by {DEFAULT_MODEL_LABEL}.
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={resetChat}
                    className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                    title="Reset chat"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMinimized(true)}
                    className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                    title="Minimize"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="relative mt-3 flex flex-wrap gap-2">
                {quickPrompts[role].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => void sendMessage(item)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-left text-xs leading-4 text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div
              ref={scrollRef}
              className="max-h-[190px] min-h-[140px] space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-[1.2rem] px-4 py-3 text-[14px] leading-6 shadow-sm ${
                      message.role === "user"
                        ? "bg-[linear-gradient(135deg,#5b6dff,#9b5cff)] text-white"
                        : "border border-white/10 bg-white/[0.06] text-slate-100"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>

                    {message.sources?.length ? (
                      <div className="mt-3 space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Retrieved context
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {message.sources.slice(0, 4).map((source) =>
                            source.href ? (
                              <Link
                                key={source.id}
                                to={source.href}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-slate-200 transition hover:bg-white/10"
                              >
                                {source.title}
                              </Link>
                            ) : (
                              <span
                                key={source.id}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-slate-200"
                              >
                                {source.title}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    ) : null}

                    {message.meta ? (
                      <div className="mt-3 flex flex-wrap gap-2 text-[9px] uppercase tracking-[0.12em]">
                        {message.meta.usedFallback ? (
                          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 text-yellow-300">
                            Fallback mode
                          </span>
                        ) : (
                          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                            AI response
                          </span>
                        )}

                        {message.meta.intent ? (
                          <span className="rounded-full border border-white/10 px-2 py-1 text-slate-400">
                            {message.meta.intent.replace(/_/g, " ")}
                          </span>
                        ) : null}

                        <span className="rounded-full border border-white/10 px-2 py-1 text-slate-400">
                          {message.meta.model || DEFAULT_MODEL_LABEL}
                        </span>

                        {typeof message.meta.retrievedChunkCount === "number" ? (
                          <span className="rounded-full border border-white/10 px-2 py-1 text-slate-400">
                            {message.meta.retrievedChunkCount} chunks
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    {message.suggestions?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.slice(0, 3).map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => void sendMessage(suggestion)}
                            className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-[10px] text-fuchsia-100 transition hover:bg-fuchsia-400/18"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {loading ? (
                <div className="flex justify-start">
                  <div className="max-w-[82%] rounded-[1.2rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-[14px] text-slate-200">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking with RAG + {DEFAULT_MODEL_LABEL}...
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-white/10 bg-black/10 p-3">
              <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] p-2">
                <textarea
                  ref={textareaRef}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={onTextareaKeyDown}
                  rows={2}
                  placeholder={
                    role === "ADMIN"
                      ? "Ask about platform health, review queue, premium conversion..."
                      : role === "CREATOR"
                        ? "Ask about draft quality, rejection reasons, testcase gaps..."
                        : "Ask about weak topics, next problems, contests, roadmap..."
                  }
                  className="w-full resize-none bg-transparent px-2 py-2 text-[14px] leading-6 text-white outline-none placeholder:text-slate-400"
                />

                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                    {DEFAULT_MODEL_LABEL}
                  </div>

                  <Button
                    type="button"
                    onClick={() => void sendMessage()}
                    disabled={loading || !question.trim()}
                    className="rounded-full bg-[linear-gradient(135deg,#49e8ff,#5b6dff,#f56cc9)] px-4 text-[13px] text-white shadow-[0_12px_30px_rgba(91,109,255,0.45)] hover:opacity-95"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <SendHorizontal className="mr-2 h-4 w-4" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(!open || minimized) && (
          <motion.button
            initial={false}
            animate={{
              x: robotPosition.x,
              y: robotPosition.y,
              scale: 1,
              opacity: 1,
            }}
            transition={{
              type: isDraggingRobot ? "tween" : "spring",
              duration: isDraggingRobot ? 0.02 : undefined,
              stiffness: 500,
              damping: 40,
              mass: 0.6,
            }}
            type="button"
            onPointerDown={handleRobotPointerDown}
            onClick={handleRobotClick}
            onMouseEnter={() => !isDraggingRobot && setIsHoveringRobot(true)}
            onMouseLeave={() => setIsHoveringRobot(false)}
            onFocus={() => !isDraggingRobot && setIsHoveringRobot(true)}
            onBlur={() => setIsHoveringRobot(false)}
            className="fixed left-0 top-0 z-[79] flex h-[132px] w-[132px] items-end justify-center rounded-full bg-transparent"
            aria-label="Open AI chat"
            title="Open AI chat"
            style={{
              touchAction: "none",
              cursor: isDraggingRobot ? "grabbing" : "grab",
            }}
          >
            <AIRobotMascot
              compact={false}
              active={false}
              hovering={isHoveringRobot}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {minimized && open ? (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          style={{
            left: `${robotPosition.x}px`,
            top: `${Math.max(robotPosition.y - 48, 8)}px`,
          }}
          className="fixed z-[81] flex items-center gap-2 rounded-full border border-white/10 bg-[linear-gradient(135deg,#0f172a,#1e293b)] px-4 py-2 text-sm text-white shadow-[0_18px_50px_rgba(0,0,0,0.34)]"
        >
          <ChevronDown className="h-4 w-4 rotate-180" />
          Reopen AI
        </button>
      ) : null}
    </>
  );
}