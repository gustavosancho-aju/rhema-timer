"use client";

import type { TimerState } from "@/store/timer-store";

interface Tick {
  displayTime: string;
  remaining: number;
  elapsed: number;
  status: TimerState["status"];
}

export default function ActiveTimerBanner({
  timer,
  tick,
}: {
  timer: TimerState | null;
  tick: Tick;
}) {
  if (!timer) {
    return (
      <div
        className="px-6 py-6 text-center text-sm"
        style={{
          background: "var(--bg-1)",
          borderBottom: "1px solid var(--border-subtle)",
          color: "var(--fg-3)",
        }}
      >
        Nenhum timer ativo. Clique em ▶ em um timer abaixo para iniciar.
      </div>
    );
  }

  const isCountdown = timer.type === "countdown";
  const isWrapup   = isCountdown && tick.remaining <= 60 && tick.remaining > 10;
  const isCritical = isCountdown && tick.remaining <= 10;
  const overtime   = isCountdown && tick.remaining < 0;

  const timeColor = overtime
    ? "#ef4444"
    : isCritical
    ? "#f87171"
    : isWrapup
    ? "#fbbf24"
    : timer.status === "paused"
    ? "var(--fg-3)"
    : "var(--luxo-aqua)";

  return (
    <div
      className="px-6 py-6"
      style={{
        background: "var(--bg-1)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-6 flex-wrap">
        <div>
          <div className="rh-eyebrow mb-1">Ativo</div>
          <div
            className="text-xl font-semibold"
            style={{ color: "var(--fg-1)" }}
          >
            {timer.title || "Sem título"}
          </div>
          {timer.presenter && (
            <div className="text-sm" style={{ color: "var(--fg-3)" }}>
              {timer.presenter}
            </div>
          )}
        </div>

        <div
          className="font-mono text-5xl sm:text-6xl tabular-nums"
          style={{
            color: timeColor,
            opacity: timer.status === "paused" ? 0.5 : 1,
          }}
        >
          {tick.displayTime}
        </div>

        <div
          className="text-xs uppercase tracking-wider"
          style={{ color: "var(--fg-3)" }}
        >
          {timer.status}
        </div>
      </div>
    </div>
  );
}
