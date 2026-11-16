import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';

const COLORS = ['#2e7d32', '#f9a825', '#e53935', '#1e88e5', '#8e24aa', '#fb8c00'];
const PIECE_COUNT = 48;
const DURATION_MS = 4000;

interface ConfettiProps {
  onDone: () => void;
}

/** פיצוץ קונפטי קצר (CSS בלבד, בלי ספריות) שנעלם מעצמו אחרי כמה שניות. */
export default function Confetti({ onDone }: ConfettiProps) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const pieces = useMemo(
    () =>
      Array.from({ length: PIECE_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2 + Math.random() * 1.5,
        size: 6 + Math.random() * 6,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
      })),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => onDoneRef.current(), DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * 1.6}px`,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--confetti-rotate': `${p.rotate}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
