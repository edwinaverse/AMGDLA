"use client";

import { useCallback } from "react";
import confetti from "canvas-confetti";

export function useConfetti() {
  return useCallback((originEl?: HTMLElement | null) => {
    let origin = { x: 0.5, y: 0.5 };
    if (originEl) {
      const rect = originEl.getBoundingClientRect();
      origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
    }
    confetti({
      particleCount: 60,
      spread: 65,
      startVelocity: 28,
      gravity: 1,
      scalar: 0.8,
      ticks: 150,
      origin,
      colors: ["#f3aecb", "#8fb4c2", "#c9cbd3", "#f4f3ef"],
    });
  }, []);
}
