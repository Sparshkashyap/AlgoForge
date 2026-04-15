import confetti from "canvas-confetti";

export const fireCenterConfetti = () => {
  const duration = 1400;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      startVelocity: 26,
      spread: 360,
      ticks: 70,
      origin: { x: 0.5, y: 0.5 },
      scalar: 1.05,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};