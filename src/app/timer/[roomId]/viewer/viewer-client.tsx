"use client";

import { useEffect, useRef, useState } from "react";
import { useWsTimer } from "@/features/timer/hooks/use-ws-timer";
import { useTimerTick } from "@/features/timer/hooks/use-timer";
import { useTimerStore } from "@/features/timer/store/timer-store";
import { playChime } from "@/features/timer/lib/chime";
import { Serif } from "@/shared/components/ui/primitives";

export default function ViewerClient({
  roomId,
  roomName,
}: {
  roomId: string;
  roomName?: string;
}) {
  const { flashPulse } = useWsTimer(roomId, "viewer");
  const timers = useTimerStore((s) => s.timers);
  const activeTimerId = useTimerStore((s) => s.activeTimerId);
  const blackout = useTimerStore((s) => s.blackout);
  const focusMode = useTimerStore((s) => s.focusMode);
  const currentMessage = useTimerStore((s) => s.currentMessage);
  const wsConnected = useTimerStore((s) => s.wsConnected);
  const active = timers.find((t) => t.id === activeTimerId) ?? null;
  const tick = useTimerTick(active);
  const [flashing, setFlashing] = useState(false);
  const lastChimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (flashPulse === 0) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setFlashing(true);
    });
    const t = setTimeout(() => setFlashing(false), 450);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [flashPulse]);

  useEffect(() => {
    if (!active || active.type !== "countdown") return;
    if (active.status !== "running") {
      lastChimeRef.current = null;
      return;
    }
    const r = Math.ceil(tick.remaining);
    if (r === 60 && lastChimeRef.current !== 60) {
      playChime(600);
      lastChimeRef.current = 60;
    } else if (r === 10 && lastChimeRef.current !== 10) {
      playChime(800);
      lastChimeRef.current = 10;
    } else if (r === 0 && lastChimeRef.current !== 0) {
      playChime(1000, 250);
      lastChimeRef.current = 0;
    }
  }, [tick.remaining, active]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const onDbl = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      }
    };
    document.addEventListener("dblclick", onDbl);
    return () => document.removeEventListener("dblclick", onDbl);
  }, []);

  const isCountdown = active?.type === "countdown";
  const remaining = tick.remaining;
  const elapsed = tick.elapsed;
  const duration = active?.duration ?? 0;

  const pct =
    isCountdown && duration > 0
      ? Math.max(0, Math.min(100, (elapsed / duration) * 100))
      : 0;

  const wrapLevel = !isCountdown
    ? 0
    : remaining <= 0
      ? 3
      : remaining <= 10
        ? 3
        : remaining <= 60
          ? 2
          : remaining <= 300
            ? 1
            : 0;

  const timerColor =
    wrapLevel >= 3
      ? "#ff6b6b"
      : wrapLevel === 2
        ? "#fbbf24"
        : "var(--fg-1)";

  const wrapGlow =
    wrapLevel >= 3
      ? "radial-gradient(900px 500px at 50% 50%, rgba(255,107,107,0.10), transparent 70%)"
      : wrapLevel === 2
        ? "radial-gradient(900px 500px at 50% 50%, rgba(251,191,36,0.08), transparent 70%)"
        : wrapLevel === 1
          ? "radial-gradient(900px 500px at 50% 50%, rgba(176,240,240,0.06), transparent 70%)"
          : "transparent";

  if (blackout) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          zIndex: 100,
        }}
      >
        <span
          style={{
            position: "fixed",
            top: 12,
            right: 16,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: wsConnected ? "#2E6A7A" : "#ef4444",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={flashing ? "animate-flash" : undefined}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        color: "var(--fg-1)",
        fontFamily: "var(--font-sans)",
        overflow: "hidden",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <style jsx global>{`
        @keyframes flashAnim {
          0%, 100% { background-color: #000; }
          30%, 70% { background-color: #fbbf24; }
        }
        .animate-flash { animation: flashAnim 0.45s ease-in-out; }
      `}</style>

      {/* Wrap-up ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: wrapGlow,
          transition: "background 400ms",
          pointerEvents: "none",
        }}
      />

      {/* Top label */}
      {!focusMode && (
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "rgba(240,250,250,0.4)",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            {roomName ?? "Sessão"}
          </div>
        </div>
      )}

      {/* WS status */}
      <div
        className="flex items-center gap-2"
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          fontSize: 10,
          color: "rgba(240,250,250,0.3)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.1em",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: wsConnected ? "#2E6A7A" : "#ef4444",
            boxShadow: wsConnected ? "0 0 4px #2E6A7A" : "none",
          }}
        />
        {wsConnected ? "conectado" : "reconectando"}
      </div>

      {/* Main */}
      {focusMode ? (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            zIndex: 2,
            maxWidth: "90%",
          }}
        >
          {currentMessage ? (
            <div
              style={{
                fontSize: "8vw",
                lineHeight: 1.1,
                fontWeight: 600,
                color:
                  currentMessage.color === "red"
                    ? "#ffcaca"
                    : currentMessage.color === "green"
                      ? "var(--luxo-aqua)"
                      : "var(--fg-1)",
              }}
            >
              {currentMessage.text}
            </div>
          ) : (
            <div style={{ color: "var(--fg-4)", fontSize: 24 }}>
              Focus mode
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
          {active ? (
            <>
              <div
                style={{
                  fontSize: "24vw",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  color: timerColor,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.9,
                  fontVariantNumeric: "tabular-nums",
                  textShadow:
                    wrapLevel >= 3
                      ? "0 0 80px rgba(255,107,107,0.3)"
                      : wrapLevel === 2
                        ? "0 0 60px rgba(251,191,36,0.25)"
                        : "none",
                  opacity: active.status === "paused" ? 0.4 : 1,
                  animation:
                    wrapLevel >= 3 && remaining <= 0
                      ? "rh-pulse 1s infinite"
                      : "none",
                }}
              >
                {tick.displayTime}
              </div>
              {active.title && (
                <div
                  style={{
                    marginTop: 20,
                    fontSize: "2.6vw",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: "var(--fg-1)",
                  }}
                >
                  {active.title}
                </div>
              )}
              {active.presenter && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: "1.4vw",
                    color: "rgba(240,250,250,0.5)",
                  }}
                >
                  <Serif style={{ color: "var(--luxo-gold)" }}>
                    {active.presenter}
                  </Serif>
                </div>
              )}
            </>
          ) : (
            <div style={{ color: "var(--fg-4)", fontSize: 48 }}>
              Aguardando…
            </div>
          )}
        </div>
      )}

      {/* Progress bar */}
      {active && isCountdown && !focusMode && (
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            bottom: 180,
          }}
        >
          <div
            style={{
              height: 4,
              borderRadius: 2,
              background: "rgba(176,240,240,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, #2E6A7A, #8FD8DC 60%, #ff6b6b)",
                transition: "width 250ms linear",
              }}
            />
          </div>
        </div>
      )}

      {/* Message overlay pill */}
      {currentMessage && !focusMode && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 60,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              padding: "18px 40px",
              borderRadius: 16,
              background:
                currentMessage.color === "red"
                  ? "rgba(255,107,107,0.18)"
                  : currentMessage.color === "green"
                    ? "rgba(143,216,220,0.14)"
                    : "rgba(240,250,250,0.12)",
              border:
                currentMessage.color === "red"
                  ? "1px solid rgba(255,107,107,0.4)"
                  : currentMessage.color === "green"
                    ? "1px solid rgba(143,216,220,0.4)"
                    : "1px solid rgba(240,250,250,0.25)",
              boxShadow:
                currentMessage.color === "red"
                  ? "0 0 40px rgba(255,107,107,0.2)"
                  : currentMessage.color === "green"
                    ? "0 0 40px rgba(143,216,220,0.18)"
                    : "0 0 40px rgba(240,250,250,0.12)",
              fontSize: 28,
              fontWeight: 500,
              color:
                currentMessage.color === "red"
                  ? "#ffcaca"
                  : currentMessage.color === "green"
                    ? "var(--luxo-aqua)"
                    : "var(--fg-1)",
              letterSpacing: "-0.01em",
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            {currentMessage.text}
          </div>
        </div>
      )}
    </div>
  );
}
