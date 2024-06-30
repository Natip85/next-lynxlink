"use client";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function ConfettiEffect() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [pieces, setPieces] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setPieces(200);
    setTimeout(() => {
      setPieces(0);
    }, 3500);
  }, []);
  return isMounted && <Confetti gravity={0.2} numberOfPieces={pieces} />;
}
