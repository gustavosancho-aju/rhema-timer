"use client";

import { useMemo, useState, type CSSProperties, type ReactNode, type SVGProps } from "react";

/* ---------- Pulse: luminous dot ---------- */

export function Pulse({
  color = "var(--luxo-glow)",
  size = 8,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 ${size}px ${color}`,
        animation: "rh-pulse 2s var(--ease-out-expo) infinite",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

/* ---------- Dot: static tiny indicator ---------- */

export function Dot({
  color = "var(--fg-3)",
  size = 4,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

/* ---------- Eyebrow: uppercase label ---------- */

export function Eyebrow({
  children,
  color = "var(--fg-3)",
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.22em",
        color,
        fontFamily: "var(--font-sans)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ---------- Serif: italic accent text ---------- */

export function Serif({
  children,
  italic = true,
  style,
}: {
  children: ReactNode;
  italic?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-serif)",
        fontStyle: italic ? "italic" : "normal",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ---------- Badge ---------- */

export type BadgeVariant =
  | "live"
  | "green"
  | "gold"
  | "purple"
  | "neutral"
  | "ghost";

const BADGE_VARIANTS: Record<BadgeVariant, CSSProperties> = {
  live: {
    background: "rgba(176,240,240,0.12)",
    color: "var(--luxo-glow)",
    border: "1px solid rgba(176,240,240,0.3)",
  },
  green: {
    background: "var(--luxo-green)",
    color: "var(--luxo-void)",
  },
  gold: {
    background: "transparent",
    color: "var(--luxo-gold)",
    border: "1px solid rgba(143,216,220,0.4)",
  },
  purple: {
    background: "rgba(45,27,105,0.55)",
    color: "#1B5670",
    border: "1px solid rgba(27,86,112,0.2)",
  },
  neutral: {
    background: "rgba(176,240,240,0.05)",
    color: "var(--fg-2)",
    border: "1px solid var(--border-subtle)",
  },
  ghost: {
    background: "transparent",
    color: "var(--fg-3)",
    border: "1px solid var(--border-subtle)",
  },
};

export function Badge({
  variant = "neutral",
  children,
  style,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    height: 24,
    padding: "0 10px",
    borderRadius: 9999,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.04em",
    fontFamily: "var(--font-sans)",
    whiteSpace: "nowrap",
  };
  return (
    <span style={{ ...base, ...BADGE_VARIANTS[variant], ...style }}>
      {variant === "live" && <Pulse size={5} />}
      {children}
    </span>
  );
}

/* ---------- IconBtn: 36×36 rounded action button ---------- */

export function IconBtn({
  children,
  onClick,
  active,
  title,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  title?: string;
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: active
          ? "rgba(176,240,240,0.08)"
          : hover
            ? "rgba(176,240,240,0.05)"
            : "transparent",
        border: active
          ? "1px solid rgba(176,240,240,0.3)"
          : "1px solid var(--border-subtle)",
        color: active ? "var(--luxo-glow)" : hover ? "var(--fg-1)" : "var(--fg-2)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 240ms var(--ease-out-expo)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ---------- Icons (1.5px stroke line style) ---------- */

type IcoProps = SVGProps<SVGSVGElement>;

export const Ico = {
  mic: (p: IcoProps) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  ),
  play: (p: IcoProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M7 5v14l12-7z" />
    </svg>
  ),
  pause: (p: IcoProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ),
  stop: (p: IcoProps) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  ),
  copy: (p: IcoProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  ),
  check: (p: IcoProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),
  chevron: (p: IcoProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  settings: (p: IcoProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
  history: (p: IcoProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5M12 7v5l3 2" />
    </svg>
  ),
  wave: (p: IcoProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}>
      <path d="M3 12h2M7 8v8M11 4v16M15 9v6M19 11v2M21 12h1" />
    </svg>
  ),
  bible: (p: IcoProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 4v15a2 2 0 0 0 2 2h14V4H6a2 2 0 0 0-2 2z" />
      <path d="M12 7v6M9 10h6" />
    </svg>
  ),
  heart: (p: IcoProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20.8 6.6a5 5 0 0 0-7.1 0L12 8.3l-1.7-1.7a5 5 0 0 0-7.1 7.1l1.7 1.7L12 22.5l7.1-7.1 1.7-1.7a5 5 0 0 0 0-7.1z" />
    </svg>
  ),
  brain: (p: IcoProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 3a3 3 0 0 0-3 3v.5A3 3 0 0 0 4 9v2a3 3 0 0 0 2 3v2a3 3 0 0 0 3 3h1V3H9zM15 3a3 3 0 0 1 3 3v.5A3 3 0 0 1 20 9v2a3 3 0 0 1-2 3v2a3 3 0 0 1-3 3h-1V3h1z" />
    </svg>
  ),
  sparkle: (p: IcoProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" />
    </svg>
  ),
  arrow: (p: IcoProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  close: (p: IcoProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  grid: (p: IcoProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
};

/* ---------- Waveform ---------- */

export function Waveform({
  bars = 32,
  color = "var(--luxo-glow)",
  height = 32,
  active = true,
}: {
  bars?: number;
  color?: string;
  height?: number;
  active?: boolean;
}) {
  const pattern = useMemo(
    () =>
      Array.from({ length: bars }, (_, i) => {
        const s = Math.sin(i * 0.5) * 0.5 + Math.cos(i * 0.9) * 0.3 + 0.2;
        return Math.max(0.15, Math.min(1, Math.abs(s) + 0.2));
      }),
    [bars],
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height, minWidth: bars * 5 }}>
      {pattern.map((h, i) => (
        <span
          key={i}
          style={{
            width: 2,
            height: `${h * 100}%`,
            background: color,
            borderRadius: 2,
            opacity: active ? 0.9 : 0.3,
            transformOrigin: "center",
            animation: active
              ? `rh-bar ${0.9 + (i % 5) * 0.18}s ${i * 0.05}s ease-in-out infinite`
              : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Elapsed: monospaced clock value ---------- */

export function Elapsed({
  value = "00:00:00",
  color = "var(--fg-1)",
}: {
  value?: string;
  color?: string;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        color,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "0.02em",
      }}
    >
      {value}
    </span>
  );
}
