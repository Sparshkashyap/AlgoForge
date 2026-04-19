import confetti from "canvas-confetti";

export const fireCenterConfetti = () => {
  const duration = 1600;
  const end = Date.now() + duration;

  const colors = ["#6366f1", "#ec4899", "#22c55e", "#f59e0b"];

  const frame = () => {
    confetti({
      particleCount: 6,
      startVelocity: 28,
      spread: 360,
      ticks: 80,
      origin: { x: 0.5, y: 0.5 },
      scalar: 1.1,
      colors,
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  // 💥 initial burst (impact feel)
  confetti({
    particleCount: 120,
    spread: 70,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.5 },
    colors,
    zIndex: 9999,
  });

  frame();
};