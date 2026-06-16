"use client";

import Link from "next/link";
import { Pulse, Dot, Ico, IconBtn } from "@/shared/components/ui/primitives";

const TABS = [
  { key: "live", label: "Ao vivo", href: "/" },
  { key: "history", label: "Histórico", href: "/" },
  { key: "refs", label: "Referências", href: "/" },
  { key: "settings", label: "Ajustes", href: "/config/holyrics" },
] as const;

export function TopBar({
  active = "live",
  extraLinks = [],
}: {
  active?: "live" | "history" | "refs" | "settings";
  extraLinks?: { label: string; href: string }[];
}) {
  return (
    <header
      className="flex items-center justify-between"
      style={{
        height: 72,
        padding: "0 28px",
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(0,16,16,0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div className="flex items-center gap-7">
        <Logo />
        <div style={{ width: 1, height: 22, background: "var(--border-subtle)" }} />
        <nav className="flex gap-1">
          {TABS.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                className="inline-flex items-center gap-2 transition"
                style={{
                  height: 34,
                  padding: "0 14px",
                  borderRadius: 9999,
                  background: isActive ? "rgba(176,240,240,0.08)" : "transparent",
                  color: isActive ? "var(--luxo-glow)" : "var(--fg-2)",
                  border: isActive
                    ? "1px solid rgba(176,240,240,0.22)"
                    : "1px solid transparent",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                {isActive && <Pulse size={5} />}
                {item.label}
              </Link>
            );
          })}
          {extraLinks.map((ex) => (
            <Link
              key={ex.href}
              href={ex.href}
              className="inline-flex items-center gap-2 transition"
              style={{
                height: 34,
                padding: "0 14px",
                borderRadius: 9999,
                background: "transparent",
                color: "var(--fg-2)",
                border: "1px solid transparent",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              {ex.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2.5"
          style={{
            height: 34,
            padding: "0 14px",
            borderRadius: 9999,
            background: "rgba(176,240,240,0.04)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <Ico.mic />
          <span style={{ fontSize: 12, color: "var(--fg-2)" }}>
            Microfone · navegador
          </span>
          <Dot size={3} color="var(--fg-4)" />
          <span
            style={{
              fontSize: 12,
              color: "var(--fg-3)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Web Speech API
          </span>
        </div>
        <IconBtn title="Ajustes">
          <Ico.settings />
        </IconBtn>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--luxo-teal-mid), var(--luxo-petroleo))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "var(--luxo-void)",
          }}
        >
          GV
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background:
            "radial-gradient(circle at 30% 30%, var(--luxo-glow), rgba(176,240,240,0.1))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 18px rgba(176,240,240,0.35)",
          color: "var(--luxo-void)",
          fontWeight: 800,
          fontSize: 15,
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
        }}
      >
        R
      </div>
      <div className="flex flex-col gap-0.5" style={{ lineHeight: 1 }}>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>
          Rhema{" "}
          <span
            style={{
              color: "var(--luxo-gold)",
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontStyle: "italic",
            }}
          >
            AI
          </span>
        </span>
        <span
          style={{
            fontSize: 10,
            color: "var(--fg-3)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Palavra ao vivo
        </span>
      </div>
    </div>
  );
}
