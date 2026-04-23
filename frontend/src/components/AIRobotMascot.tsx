import { motion, AnimatePresence } from "framer-motion";

type Props = {
  compact?: boolean;
  active?: boolean;
  hovering?: boolean;
};

export default function AIRobotMascot({
  compact = false,
  active = false,
  hovering = false,
}: Props) {
  const width = compact ? 64 : 104;
  const height = compact ? 82 : 128;

  const floatY = hovering ? [0, -8, 0] : active ? [0, -6, 0] : [0, -4, 0];
  const rotate = hovering
    ? [0, -2.5, 2.5, 0]
    : active
    ? [0, -1.5, 1.5, 0]
    : [0, -1, 1, 0];

  return (
    <motion.div
      animate={{
        y: floatY,
        rotate,
        scale: hovering ? [1, 1.025, 1] : 1,
      }}
      transition={{
        duration: hovering ? 2 : active ? 2.8 : 3.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative select-none"
      style={{ width, height }}
    >
      <motion.div
        animate={{
          scaleX: hovering ? [1, 1.16, 1] : [1, 1.08, 1],
          opacity: hovering ? [0.2, 0.34, 0.2] : [0.14, 0.24, 0.14],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[3px] left-1/2 h-3.5 w-14 -translate-x-1/2 rounded-full bg-black/35 blur-md"
      />

      <motion.div
        animate={{
          scale: hovering ? [1, 1.18, 1] : [1, 1.1, 1],
          opacity: hovering ? [0.38, 0.78, 0.38] : [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1 left-1/2 h-8 w-12 -translate-x-1/2 rounded-full bg-cyan-300/55 blur-xl"
      />

      <AnimatePresence>
        {hovering ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.72 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] text-slate-900 shadow-[0_10px_24px_rgba(0,0,0,0.22)] dark:border-slate-700 dark:bg-slate-900 dark:text-cyan-100"          >
            HELLO
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        animate={{
          opacity: hovering ? [0.16, 0.4, 0.16] : [0.1, 0.2, 0.1],
          scale: hovering ? [1, 1.06, 1] : [1, 1.02, 1],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-x-2 top-4 z-0 h-14 rounded-full bg-cyan-300/15 blur-2xl"
      />

      <svg
        viewBox="0 0 280 340"
        className="relative z-10 h-full w-full drop-shadow-[0_18px_34px_rgba(69,116,255,0.22)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient
            id="robot_head_shell"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(130 96) rotate(90) scale(100 102)"
          >
            <stop stopColor="#FDFEFF" />
            <stop offset="0.52" stopColor="#E3E8F7" />
            <stop offset="1" stopColor="#BEC9E7" />
          </radialGradient>

          <radialGradient
            id="robot_face_core"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(138 100) rotate(90) scale(72 78)"
          >
            <stop stopColor="#4D4677" />
            <stop offset="1" stopColor="#17152F" />
          </radialGradient>

          <radialGradient
            id="robot_body_shell"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(139 224) rotate(90) scale(100 82)"
          >
            <stop stopColor="#F3F7FF" />
            <stop offset="0.65" stopColor="#D2DCF1" />
            <stop offset="1" stopColor="#ACBBE0" />
          </radialGradient>

          <linearGradient id="robot_glow_blue" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#8EF7FF" />
            <stop offset="1" stopColor="#58CAFF" />
          </linearGradient>

          <linearGradient id="robot_neck_glow" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#88F7FF" />
            <stop offset="1" stopColor="#5D7FFF" />
          </linearGradient>

          <filter id="robot_soft_blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <motion.g
          animate={
            hovering
              ? { rotate: [0, -16, 8, -12, 0] }
              : { rotate: [0, -4, 3, 0] }
          }
          transition={{
            duration: hovering ? 1.1 : 4.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "222px 170px" }}
        >
          <path
            d="M210 161C225 145 248 145 256 160C263 173 258 197 237 208C227 213 216 212 209 205C201 198 198 187 198 178C198 171 202 165 210 161Z"
            fill="url(#robot_head_shell)"
          />
          <path
            d="M208 165C218 154 234 154 242 166"
            stroke="#92A0CF"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </motion.g>

        <motion.g
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "58px 204px" }}
        >
          <path
            d="M76 188C66 180 49 184 42 199C35 214 39 238 48 258C54 270 62 272 70 269C78 266 82 258 83 247C84 232 83 199 76 188Z"
            fill="url(#robot_head_shell)"
          />
          <path
            d="M54 269C62 266 68 262 71 255"
            stroke="#92A0CF"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </motion.g>

        <motion.g
          animate={{ y: hovering ? [0, 3, 0] : [0, 2, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M62 92C62 44 99 17 139 17C182 17 220 45 220 94C220 140 183 159 139 159C97 159 62 138 62 92Z"
            fill="url(#robot_head_shell)"
          />
          <path
            d="M81 97C81 62 108 39 140 39C174 39 204 63 204 98C204 131 176 145 139 145C104 145 81 129 81 97Z"
            fill="url(#robot_face_core)"
          />
          <path
            d="M72 68C60 74 54 88 57 107"
            stroke="#534E80"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M64 116C50 106 46 87 52 65"
            stroke="#463C73"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M92 50C107 37 128 31 150 32C173 33 190 41 201 51"
            stroke="#D4DCF0"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.92"
          />

          <motion.ellipse
            animate={{
              scaleY: hovering ? [1, 0.9, 1] : [1, 0.98, 1],
              scaleX: hovering ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            cx="117"
            cy="86"
            rx="16"
            ry="22"
            transform="rotate(18 117 86)"
            fill="url(#robot_glow_blue)"
            style={{ transformOrigin: "117px 86px" }}
          />
          <motion.ellipse
            animate={{
              scaleY: hovering ? [1, 0.9, 1] : [1, 0.98, 1],
              scaleX: hovering ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            cx="164"
            cy="85"
            rx="16"
            ry="22"
            transform="rotate(-18 164 85)"
            fill="url(#robot_glow_blue)"
            style={{ transformOrigin: "164px 85px" }}
          />
          <motion.rect
            animate={{ scaleY: hovering ? [1, 0.84, 1] : [1, 0.96, 1] }}
            transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
            x="102"
            y="116"
            width="40"
            height="20"
            rx="10"
            fill="url(#robot_glow_blue)"
            style={{ transformOrigin: "122px 126px" }}
          />
        </motion.g>

        <rect x="116" y="146" width="46" height="17" rx="8.5" fill="#22203B" />
        <rect x="102" y="160" width="76" height="12" rx="6" fill="#171A28" />
        <rect
          x="97"
          y="162"
          width="86"
          height="9"
          rx="4.5"
          fill="url(#robot_neck_glow)"
          opacity="0.72"
          filter="url(#robot_soft_blur)"
        />

        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M89 188C89 149 113 140 139 140C164 140 190 150 190 190C190 238 172 287 139 310C106 286 89 237 89 188Z"
            fill="url(#robot_body_shell)"
          />
          <path
            d="M103 178C113 167 125 163 139 163C153 163 165 168 174 179"
            stroke="#E3EAFA"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.95"
          />
          <ellipse cx="87" cy="188" rx="10" ry="18" fill="url(#robot_glow_blue)" opacity="0.74" />
          <ellipse cx="191" cy="188" rx="10" ry="18" fill="url(#robot_glow_blue)" opacity="0.74" />
        </motion.g>

        <path
          d="M78 151C60 140 49 122 51 100"
          stroke="#4A4178"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect x="103" y="157" width="25" height="10" rx="5" fill="#151420" />

        <motion.path
          animate={{ scaleY: [1, 1.15, 1], opacity: [0.72, 1, 0.72] }}
          transition={{ duration: 1.45, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "139px 316px" }}
          d="M124 299C130 314 133 323 139 325C145 323 148 314 154 299C146 304 132 304 124 299Z"
          fill="url(#robot_glow_blue)"
        />
      </svg>
    </motion.div>
  );
}