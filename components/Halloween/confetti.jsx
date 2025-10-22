"use client";
import { useEffect, useRef } from "react";
import JSConfetti from "js-confetti";

export default function CandyConfetti() {
  const confettiRef = useRef(null);

  useEffect(() => {
    confettiRef.current = new JSConfetti();
  }, []);

  const candies = ["🍬", "🍫", "🍭", "🎃"];

  function throwCandiesEverywhere() {
    confettiRef.current?.addConfetti({
      emojis: candies,
      emojiSize: 40,
      confettiNumber: 40,
    });
  }

  return (
    <img
      src="/candy.png"
      alt="Candy"
      onClick={throwCandiesEverywhere}
      style={{
        display: "block",
        cursor: "pointer",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        width: "50%",
        marginTop: 32,
        userSelect: "none",
      }}
    />
  );
}
