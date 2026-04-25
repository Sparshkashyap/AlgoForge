import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const MIN_VISIBLE_DURATION = 500;
const START_DELAY = 0;
const DOT_COUNT = 4;

export default function RouteLoader() {
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const [visible, setVisible] = useState(false);
  const scrollPos = useRef(0);

  useEffect(() => {
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;

    let startTimer: ReturnType<typeof setTimeout> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    startTimer = setTimeout(() => {
      // freeze background: lock scroll position
      scrollPos.current = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "none";
      document.body.style.userSelect = "none";
      setVisible(true);

      hideTimer = setTimeout(() => {
        // unfreeze
        document.body.style.overflow = "";
        document.body.style.pointerEvents = "";
        document.body.style.userSelect = "";
        setVisible(false);
      }, MIN_VISIBLE_DURATION);
    }, START_DELAY);

    return () => {
      if (startTimer) clearTimeout(startTimer);
      if (hideTimer) clearTimeout(hideTimer);
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
      document.body.style.userSelect = "";
    };
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          // pointer-events: all on the overlay itself so it blocks clicks
          style={{ pointerEvents: "all" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-[6px]"
          aria-live="polite"
          aria-label="Navigating, please wait"
        >
          {/* Dot row */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-[10px]"
          >
            {Array.from({ length: DOT_COUNT }, (_, i) => (
              <motion.span
                key={i}
                className="block rounded-full bg-primary"
                style={{ width: 10, height: 10 }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.85, 1.15, 0.85],
                }}
                transition={{
                  duration: 0.72,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.13,
                }}
              />
            ))}
          </motion.div>

          {/* Optional label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.2 }}
            className="mt-5 text-[12px] uppercase tracking-[0.22em] text-muted-foreground"
          >
            Loading
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
























































// import { AnimatePresence, motion } from "framer-motion";
// import { useEffect, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";

// const START_DELAY = 120;
// const MIN_VISIBLE_DURATION = 250;

// export default function RouteLoader() {
//   const location = useLocation();
//   const prevPath = useRef(location.pathname);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     if (prevPath.current === location.pathname) return;
//     prevPath.current = location.pathname;

//     let startTimer: ReturnType<typeof setTimeout> | null = null;
//     let hideTimer: ReturnType<typeof setTimeout> | null = null;

//     startTimer = setTimeout(() => {
//       setVisible(true);

//       hideTimer = setTimeout(() => {
//         setVisible(false);
//       }, MIN_VISIBLE_DURATION);
//     }, START_DELAY);

//     return () => {
//       if (startTimer) clearTimeout(startTimer);
//       if (hideTimer) clearTimeout(hideTimer);
//     };
//   }, [location.pathname]);

//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.div
//           initial={{ scaleX: 0, opacity: 1 }}
//           animate={{ scaleX: 1, opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.35, ease: "easeOut" }}
//           className="fixed left-0 top-0 z-[9999] h-[3px] w-full origin-left bg-primary"
//         />
//       )}
//     </AnimatePresence>
//   );
// }