"use client";

import { useMemo } from "react";
import { useRealtimeTimer } from "@/features/timer/hooks/use-realtime-timer";
import { useTimerTick } from "@/features/timer/hooks/use-timer";
import { useTimerStore } from "@/features/timer/store/timer-store";
import { formatTime } from "@/features/timer/lib/format-time";
import { COLOR_MAP, type TimerColor } from "@/features/timer/lib/colors";
import { RoleTopBar } from "@/features/rhema/components/command-center/role-top-bar";
import { Badge, Ico } from "@/shared/components/ui/primitives";

export default function AgendaClient({
  roomId,
  roomName,
}: {
  roomId: string;
  roomName: string;
}) {
  useRealtimeTimer(roomId, "agenda");
  const timers = useTimerStore((s) => s.timers);
  const activeTimerId = useTimerStore((s) => s.activeTimerId);
  const wsConnected = useTimerStore((s) => s.wsConnected);
  const active = timers.find((t) => t.id === activeTimerId) ?? null;
  const tick = useTimerTick(active);

  const totals = useMemo(() => {
    const totalSec = timers
      .filter((t) => t.type === "countdown")
      .reduce((s, t) => s + t.duration, 0);

    let elapsedSec = 0;
    for (const t of timers) {
      if (t.status === "finished") elapsedSec += t.duration;
    }
    if (active && active.type === "countdown") {
      elapsedSec += Math.min(Math.floor(tick.elapsed), active.duration);
    }
    return {
      total: totalSec,
      elapsed: Math.min(elapsedSec, totalSec),
      remaining: Math.max(0, totalSec - elapsedSec),
    };
  }, [timers, active, tick.elapsed]);

  const today = new Date();
  const dateLabel = today.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <>
      <RoleTopBar
        role="Agenda"
        wsConnected={wsConnected}
        statusLabel={wsConnected ? "ao vivo" : "desconectado"}
      >
        <span style={{ color: "var(--fg-4)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500 }}>
          {roomName}
        </span>
      </RoleTopBar>

      <section
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 28px",
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        <header
          className="flex items-center justify-between"
          style={{
            padding: "20px 0",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: "var(--fg-3)" }}>
              {roomName} · {dateLabel}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "var(--fg-1)",
                marginTop: 4,
              }}
            >
              Agenda da sessão
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 10,
                color: "var(--fg-3)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Total
            </div>
            <div
              style={{
                fontSize: 20,
                fontFamily: "var(--font-mono)",
                color: "var(--fg-1)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatTime(totals.total)}
            </div>
          </div>
        </header>

        <div
          className="thin-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 0",
          }}
        >
          {timers.length === 0 ? (
            <div
              style={{
                padding: "48px 0",
                textAlign: "center",
                color: "var(--fg-3)",
                fontSize: 13,
              }}
            >
              Nenhum item na agenda.
            </div>
          ) : (
            timers.map((t, i) => {
              const isActive = t.id === activeTimerId;
              const isFinished = t.status === "finished";
              const color = COLOR_MAP[t.color as TimerColor] ?? COLOR_MAP.white;

              const remainingLabel =
                isActive && t.type === "countdown"
                  ? formatTime(Math.max(0, Math.ceil(tick.remaining)))
                  : t.type === "countdown"
                    ? formatTime(t.duration)
                    : t.type === "countup"
                      ? "↑"
                      : "⏲";

              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3.5"
                  style={{
                    padding: "16px 0",
                    borderBottom:
                      i === timers.length - 1
                        ? "none"
                        : "1px solid var(--border-subtle)",
                    opacity: isFinished ? 0.45 : 1,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: isActive
                        ? "rgba(176,240,240,0.12)"
                        : "rgba(176,240,240,0.04)",
                      border: isActive
                        ? "1px solid rgba(176,240,240,0.4)"
                        : "1px solid var(--border-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isActive
                        ? "var(--luxo-glow)"
                        : isFinished
                          ? "var(--luxo-glow)"
                          : "var(--fg-3)",
                      fontSize: 11,
                      fontWeight: 700,
                      boxShadow: isActive
                        ? "0 0 10px rgba(176,240,240,0.3)"
                        : "none",
                    }}
                  >
                    {isActive ? (
                      <Ico.play />
                    ) : isFinished ? (
                      <Ico.check />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div
                    className={color.dot}
                    style={{
                      width: 3,
                      height: 36,
                      borderRadius: 2,
                      boxShadow: isActive
                        ? `0 0 8px currentColor`
                        : "none",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className="flex items-center gap-2"
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        marginBottom: 3,
                        color: "var(--fg-1)",
                      }}
                    >
                      <span className="truncate">
                        {t.title || "(sem título)"}
                      </span>
                      {isActive && <Badge variant="live">agora</Badge>}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "var(--fg-3)" }}
                    >
                      {t.presenter || "—"}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontFamily: "var(--font-mono)",
                      color: isActive ? "var(--luxo-glow)" : "var(--fg-2)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {remainingLabel}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <footer
          className="flex items-center justify-between"
          style={{
            padding: "14px 0",
            borderTop: "1px solid var(--border-subtle)",
            fontSize: 11,
            color: "var(--fg-3)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>decorrido {formatTime(totals.elapsed)}</span>
          <span>restante {formatTime(totals.remaining)}</span>
        </footer>
      </section>
    </>
  );
}
