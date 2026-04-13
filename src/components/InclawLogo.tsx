/**
 * INCLAW — Unique SVG Logo Component
 *
 * Design concept:
 * - Hexagonal neural-node shape (AI/ML topology) 
 * - Saffron-to-amber gradient representing India (Tiranga)
 * - Cyan-electric inner glow for AI/technology
 * - "I" letterform integrated as a stylized circuit path
 * - Quantum particle ring orbital
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
  const id = `inclaw-logo-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="INCLAW logo"
    >
      <defs>
        {/* Saffron-orange gradient — India's primary */}
        <linearGradient id={`${id}-g1`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B00" />
          <stop offset="50%" stopColor="#FF9500" />
          <stop offset="100%" stopColor="#FFCC00" />
        </linearGradient>

        {/* Cyan-electric gradient — AI/Tech */}
        <linearGradient id={`${id}-g2`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#0066FF" />
        </linearGradient>

        {/* Glow filter */}
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Inner glow */}
        <filter id={`${id}-inner-glow`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feComposite in="blur" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="innerShadow" />
          <feFlood floodColor="#00D4FF" floodOpacity="0.6" result="color" />
          <feComposite in="color" in2="innerShadow" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer hexagon — rotated 30° for "gem" orientation */}
      <polygon
        points="50,4 90,26 90,74 50,96 10,74 10,26"
        fill="url(#${id}-g1)"
        opacity="0.12"
        stroke={`url(#${id}-g1)`}
        strokeWidth="1.5"
      />

      {/* Middle hexagon ring */}
      <polygon
        points="50,10 84,30 84,70 50,90 16,70 16,30"
        fill="none"
        stroke={`url(#${id}-g1)`}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Inner filled hexagon */}
      <polygon
        points="50,18 78,34 78,66 50,82 22,66 22,34"
        fill="#0A0020"
        stroke={`url(#${id}-g2)`}
        strokeWidth="1.5"
        filter={`url(#${id}-glow)`}
      />

      {/* Circuit "I" letterform — stylized center */}
      {/* Vertical spine */}
      <rect x="46" y="30" width="8" height="40" rx="2" fill={`url(#${id}-g1)`} />
      {/* Top bar */}
      <rect x="37" y="30" width="26" height="7" rx="2" fill={`url(#${id}-g1)`} />
      {/* Bottom bar */}
      <rect x="37" y="63" width="26" height="7" rx="2" fill={`url(#${id}-g1)`} />

      {/* Circuit nodes on letter */}
      <circle cx="37" cy="33" r="2.5" fill="#00D4FF" filter={`url(#${id}-inner-glow)`} />
      <circle cx="63" cy="33" r="2.5" fill="#00D4FF" filter={`url(#${id}-inner-glow)`} />
      <circle cx="37" cy="67" r="2.5" fill="#00D4FF" filter={`url(#${id}-inner-glow)`} />
      <circle cx="63" cy="67" r="2.5" fill="#00D4FF" filter={`url(#${id}-inner-glow)`} />
      <circle cx="50" cy="50" r="3" fill="#FFCC00" filter={`url(#${id}-glow)`} />

      {/* Quantum orbital ring — animated if requested */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={`url(#${id}-g2)`}
        strokeWidth="0.75"
        strokeDasharray="4 8"
        opacity="0.3"
      >
        {animated && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="12s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Orbital particle */}
      {animated && (
        <circle r="2.5" fill="#00D4FF" opacity="0.8">
          <animateMotion dur="12s" repeatCount="indefinite">
            <mpath href={`#${id}-orbit`} />
          </animateMotion>
        </circle>
      )}
      {animated && (
        <path
          id={`${id}-orbit`}
          d="M 50 4 A 46 46 0 1 1 49.99 4"
          fill="none"
        />
      )}

      {/* Corner circuit traces */}
      <line x1="10" y1="26" x2="4" y2="20" stroke={`url(#${id}-g2)`} strokeWidth="1" opacity="0.4" />
      <line x1="90" y1="26" x2="96" y2="20" stroke={`url(#${id}-g2)`} strokeWidth="1" opacity="0.4" />
      <line x1="10" y1="74" x2="4" y2="80" stroke={`url(#${id}-g2)`} strokeWidth="1" opacity="0.4" />
      <line x1="90" y1="74" x2="96" y2="80" stroke={`url(#${id}-g2)`} strokeWidth="1" opacity="0.4" />
      <circle cx="4" cy="20" r="1.5" fill={`url(#${id}-g2)`} opacity="0.5" />
      <circle cx="96" cy="20" r="1.5" fill={`url(#${id}-g2)`} opacity="0.5" />
      <circle cx="4" cy="80" r="1.5" fill={`url(#${id}-g2)`} opacity="0.5" />
      <circle cx="96" cy="80" r="1.5" fill={`url(#${id}-g2)`} opacity="0.5" />
    </svg>
  );
}
