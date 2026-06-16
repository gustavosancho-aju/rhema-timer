"use client";

import Link from "next/link";
import { Pulse, Badge, Serif } from "@/shared/components/ui/primitives";

export function RoleTopBar({
  role,
  wsConnected,
  statusLabel,
  showBackLink = true,
  children,
}: {
  role: "Controller" | "Viewer" | "Operator" | "Moderator" | "Agenda";
  wsConnected: boolean;
  statusLabel?: string;
  showBackLink?: boolean;
  children?: React.ReactNode;
}) {
  const liveLabel = statusLabel ?? (wsConnected ? "sincronizado" : "desconectado");
  return (
    <header
      className="flex items-center justify-between"
      style={{
        padding: "16px 28px",
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(0,16,16,0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <span style={{ fontSize: 14, fontWeight: 700 }}>
          Rhema{" "}
          <Serif style={{ color: "var(--luxo-gold)" }}>AI</Serif>
        </span>
        <Badge variant="ghost" style={{ fontFamily: "var(--font-mono)" }}>
          {role}
        </Badge>
        {showBackLink && (
          <>
            <span style={{ color: "var(--fg-4)" }}>/</span>
            <Link
              href="/timer"
              className="rh-nav-link"
              style={{ fontSize: 12 }}
            >
              ← Salas
            </Link>
          </>
        )}
        {children}
      </div>
      <div className="flex items-center gap-2">
        {wsConnected && <Pulse size={6} />}
        <span
          style={{
            fontSize: 12,
            color: wsConnected ? "var(--luxo-glow)" : "#f87171",
          }}
        >
          {liveLabel}
        </span>
      </div>
    </header>
  );
}
