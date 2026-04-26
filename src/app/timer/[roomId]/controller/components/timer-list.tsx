"use client";

import { useTimerStore, type TimerState } from "@/store/timer-store";
import { formatTime } from "@/lib/timer/format-time";
import { COLOR_MAP, type TimerColor } from "@/lib/timer/colors";

export default function TimerList({
  timers,
  activeTimerId,
  sendCommand,
  onEdit,
  roomId,
}: {
  timers: TimerState[];
  activeTimerId: string | null;
  sendCommand: (p: Record<string, unknown>) => void;
  onEdit: (id: string) => void;
  roomId: string;
}) {
  const removeTimer = useTimerStore((s) => s.removeTimer);

  async function deleteTimer(id: string) {
    if (!confirm("Apagar este timer?")) return;
    const res = await fetch(`/api/timer/rooms/${roomId}/timers/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      removeTimer(id);
      sendCommand({ type: "room:sync-all" });
    }
  }

  async function reorder(ids: string[]) {
    const res = await fetch(`/api/timer/rooms/${roomId}/timers/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (res.ok) sendCommand({ type: "room:sync-all" });
  }

  function move(id: string, dir: -1 | 1) {
    const idx = timers.findIndex((t) => t.id === id);
    const target = idx + dir;
    if (target < 0 || target >= timers.length) return;
    const next = [...timers];
    [next[idx], next[target]] = [next[target], next[idx]];
    reorder(next.map((t) => t.id));
  }

  if (timers.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center text-sm"
        style={{
          border: "1px dashed var(--border-default)",
          color: "var(--fg-3)",
        }}
      >
        Nenhum timer na sala. Clique em &ldquo;+ Timer&rdquo; para adicionar.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {timers.map((t, idx) => {
        const isActive  = t.id === activeTimerId;
        const colorMap  = COLOR_MAP[t.color as TimerColor] ?? COLOR_MAP.white;
        const running   = t.status === "running";
        const paused    = t.status === "paused";
        return (
          <li
            key={t.id}
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              background: "var(--bg-1)",
              border: `1px solid ${isActive ? "var(--border-accent)" : "var(--border-default)"}`,
              boxShadow: isActive ? "var(--glow-ai)" : "none",
            }}
          >
            {/* Color accent bar */}
            <span
              className={`w-1 self-stretch rounded-full ${colorMap.dot}`}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span
                  className="font-medium truncate"
                  style={{ color: "var(--fg-1)" }}
                >
                  {t.title || "(sem título)"}
                </span>
                {t.autoAdvance && (
                  <span
                    className="text-xs"
                    style={{ color: "var(--fg-4)" }}
                  >
                    ↻ auto
                  </span>
                )}
              </div>
              {t.presenter && (
                <div
                  className="text-xs truncate"
                  style={{ color: "var(--fg-3)" }}
                >
                  {t.presenter}
                </div>
              )}
              <div
                className="text-xs font-mono"
                style={{ color: "var(--fg-3)" }}
              >
                {t.type === "countdown"
                  ? formatTime(t.duration)
                  : t.type === "countup"
                  ? "↑ contagem"
                  : "⏲ relógio"}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              {running ? (
                <button
                  onClick={() =>
                    sendCommand({ type: "timer:pause", timerId: t.id })
                  }
                  className="px-2 py-1 rounded-lg transition"
                  style={{ color: "#fbbf24" }}
                  title="Pausar"
                >
                  ⏸
                </button>
              ) : (
                <button
                  onClick={() =>
                    sendCommand({
                      type: paused ? "timer:resume" : "timer:start",
                      timerId: t.id,
                    })
                  }
                  className="px-2 py-1 rounded-lg transition"
                  style={{ color: "var(--luxo-aqua)" }}
                  title={paused ? "Retomar" : "Iniciar"}
                >
                  ▶
                </button>
              )}
              <button
                onClick={() =>
                  sendCommand({ type: "timer:stop", timerId: t.id })
                }
                className="px-2 py-1 rounded-lg transition"
                style={{ color: "var(--fg-3)" }}
                title="Parar"
              >
                ⏹
              </button>
              <button
                onClick={() =>
                  sendCommand({ type: "timer:reset", timerId: t.id })
                }
                className="px-2 py-1 rounded-lg transition"
                style={{ color: "var(--fg-3)" }}
                title="Resetar"
              >
                ↺
              </button>
              {isActive && t.type === "countdown" && (
                <>
                  <button
                    onClick={() =>
                      sendCommand({
                        type: "timer:nudge",
                        timerId: t.id,
                        deltaSec: 60,
                      })
                    }
                    className="ml-1 px-1.5 py-1 text-xs rounded-lg font-mono"
                    style={{
                      background: "var(--bg-2)",
                      color: "var(--fg-2)",
                      border: "1px solid var(--border-subtle)",
                    }}
                    title="+1 min"
                  >
                    +1m
                  </button>
                  <button
                    onClick={() =>
                      sendCommand({
                        type: "timer:nudge",
                        timerId: t.id,
                        deltaSec: -60,
                      })
                    }
                    className="px-1.5 py-1 text-xs rounded-lg font-mono"
                    style={{
                      background: "var(--bg-2)",
                      color: "var(--fg-2)",
                      border: "1px solid var(--border-subtle)",
                    }}
                    title="-1 min"
                  >
                    -1m
                  </button>
                </>
              )}
            </div>

            {/* Reorder */}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => move(t.id, -1)}
                disabled={idx === 0}
                className="text-[10px] disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ color: "var(--fg-3)" }}
              >
                ▲
              </button>
              <button
                onClick={() => move(t.id, 1)}
                disabled={idx === timers.length - 1}
                className="text-[10px] disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ color: "var(--fg-3)" }}
              >
                ▼
              </button>
            </div>

            <button
              onClick={() => onEdit(t.id)}
              className="text-xs px-2 transition"
              style={{ color: "var(--fg-3)" }}
            >
              Editar
            </button>
            <button
              onClick={() => deleteTimer(t.id)}
              className="text-xs px-2 transition"
              style={{ color: "#f87171" }}
            >
              ✕
            </button>
          </li>
        );
      })}
    </ul>
  );
}
