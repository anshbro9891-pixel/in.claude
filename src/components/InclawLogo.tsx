"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * INCLAW Animated Logo — Framer Motion version
 *
 * Design:
 * - Hexagonal neural-node shape (AI/ML topology)
 * - Saffron-to-amber gradient (India / Tiranga)
 * - Cyan electric inner glow (AI / tech)
 * - Framer Motion: spring orbital, pulsing nodes, rotating rings
 */
export default function InclawLogo({
  size = 40,
  className = "",
  animated = false,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  const shouldReduce = useReducedMotion();
  const isAnimated = animated && !shouldReduce;
  const id = `inclaw-${size}`;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="INCLAW logo"
      initial={false}
    >
      <defs>
        {/* Saffron gradient */}
        <linearGradient id={`${id}-g1`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FF6B00" />
          <stop offset="50%"  stopColor="#FF9500" />
          <stop offset="100%" stopColor="#FFCC00" />
        </linearGradient>

        {/* Cyan-electric gradient */}
        <linearGradient id={`${id}-g2`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#0066FF" />
        </linearGradient>

        {/* Soft glow filter */}
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Inner node glow */}
        <filter id={`${id}-node-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Outer pulsing hex ring ── */}
      {isAnimated ? (
        <motion.polygon
          points="50,4 90,26 90,74 50,96 10,74 10,26"
          fill={`url(#${id}-g1)`}
          stroke={`url(#${id}-g1)`}
          strokeWidth="1.5"
          animate={{ opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <polygon
          points="50,4 90,26 90,74 50,96 10,74 10,26"
          fill={`url(#${id}-g1)`}
          opacity="0.12"
          stroke={`url(#${id}-g1)`}
          strokeWidth="1.5"
        />
      )}

      {/* ── Rotating middle hex ring ── */}
      {isAnimated ? (
        <motion.polygon
          points="50,10 84,30 84,70 50,90 16,70 16,30"
          fill="none"
          stroke={`url(#${id}-g1)`}
          strokeWidth="1"
          style={{ originX: "50px", originY: "50px" }}
          animate={{ rotate: 360, opacity: [0.3, 0.5, 0.3] }}
          transition={{ rotate: { duration: 18, repeat: Infinity, ease: "linear" }, opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
        />
      ) : (
        <polygon
          points="50,10 84,30 84,70 50,90 16,70 16,30"
          fill="none"
          stroke={`url(#${id}-g1)`}
          strokeWidth="1"
          opacity="0.4"
        />
      )}

      {/* ── Inner dark hex ── */}
      <polygon
        points="50,18 78,34 78,66 50,82 22,66 22,34"
        fill="#0A0020"
        stroke={`url(#${id}-g2)`}
        strokeWidth="1.5"
        filter={`url(#${id}-glow)`}
      />

      {/* ── "I" letterform ── */}
      <rect x="46" y="30" width="8" height="40" rx="2" fill={`url(#${id}-g1)`} />
      <rect x="37" y="30" width="26" height="7"  rx="2" fill={`url(#${id}-g1)`} />
      <rect x="37" y="63" width="26" height="7"  rx="2" fill={`url(#${id}-g1)`} />

      {/* ── Circuit corner nodes ── */}
      {[
        { cx: 37, cy: 33 },
        { cx: 63, cy: 33 },
        { cx: 37, cy: 67 },
        { cx: 63, cy: 67 },
      ].map(({ cx, cy }, i) =>
        isAnimated ? (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="2.5"
            fill="#00D4FF"
            filter={`url(#${id}-node-glow)`}
            animate={{ opacity: [0.6, 1, 0.6], r: [2.5, 3.2, 2.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ) : (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill="#00D4FF" filter={`url(#${id}-node-glow)`} />
        )
      )}

      {/* ── Center nucleus ── */}
      {isAnimated ? (
        <motion.circle
          cx="50" cy="50" r="3"
          fill="#FFCC00"
          filter={`url(#${id}-glow)`}
          animate={{ r: [3, 4, 3], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <circle cx="50" cy="50" r="3" fill="#FFCC00" filter={`url(#${id}-glow)`} />
      )}

      {/* ── Orbital ring ── */}
      {isAnimated ? (
        <motion.circle
          cx="50" cy="50" r="46"
          fill="none"
          stroke={`url(#${id}-g2)`}
          strokeWidth="0.75"
          strokeDasharray="4 8"
          style={{ originX: "50px", originY: "50px" }}
          animate={{ rotate: 360, opacity: [0.2, 0.4, 0.2] }}
          transition={{ rotate: { duration: 12, repeat: Infinity, ease: "linear" }, opacity: { duration: 3, repeat: Infinity } }}
        />
      ) : (
        <circle cx="50" cy="50" r="46" fill="none" stroke={`url(#${id}-g2)`} strokeWidth="0.75" strokeDasharray="4 8" opacity="0.3" />
      )}

      {/* ── Orbital particle ── */}
      {isAnimated && (
        <motion.circle
          r="2.5"
          fill="#00D4FF"
          opacity="0.85"
          animate={{
            cx: [96, 50, 4, 50, 96],
            cy: [50, 4, 50, 96, 50],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* ── Corner circuit traces ── */}
      <line x1="10" y1="26" x2="4"  y2="20" stroke={`url(#${id}-g2)`} strokeWidth="1" opacity="0.4" />
      <line x1="90" y1="26" x2="96" y2="20" stroke={`url(#${id}-g2)`} strokeWidth="1" opacity="0.4" />
      <line x1="10" y1="74" x2="4"  y2="80" stroke={`url(#${id}-g2)`} strokeWidth="1" opacity="0.4" />
      <line x1="90" y1="74" x2="96" y2="80" stroke={`url(#${id}-g2)`} strokeWidth="1" opacity="0.4" />
      <circle cx="4"  cy="20" r="1.5" fill={`url(#${id}-g2)`} opacity="0.5" />
      <circle cx="96" cy="20" r="1.5" fill={`url(#${id}-g2)`} opacity="0.5" />
      <circle cx="4"  cy="80" r="1.5" fill={`url(#${id}-g2)`} opacity="0.5" />
      <circle cx="96" cy="80" r="1.5" fill={`url(#${id}-g2)`} opacity="0.5" />
    </motion.svg>
  );
}
