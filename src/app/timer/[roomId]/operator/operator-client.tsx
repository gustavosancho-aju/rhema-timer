"use client";

import { useMemo, useState } from "react";
import { useWsTimer } from "@/features/timer/hooks/use-ws-timer";
import { useTimerTick } from "@/features/timer/hooks/use-timer";
import { useTimerStore } from "@/features/timer/store/timer-store";
import { formatTime } from "@/features/timer/lib/format-time";
import { COLOR_MAP, type TimerColor } from "@/features/timer/lib/colors";
import { RoleTopBar } from "@/features/rhema/components/command-center/role-top-bar";
import { Badge, Eyebrow, Ico } from "@/shared/components/ui/primitives";

export default function OperatorClient({
  roomId,
  roomName,
}: {
  roomId: string;
  roomName: string;
}) {
  const { sendCommand } = useWsTimer(roomId, "operator");
  const timers = useTimerStore((s) => s.timers);
  const activeTimerId = useTimerStore((s) => s.activeTimerId);
  const wsConnected = useTimerStore((s) => s.wsConnected);
  const active = timers.find((t) => t.id === activeTimerId) ?? null;
  const tick = useTimerTick(active);
  const [text, setText] = useState("");

  const running = active?.status === "running";
  const paused = active?.status === "paused";

  const position = useMemo(() => {
    if (!active) return { idx: 0, total: timers.length };
    const idx = timers.findIndex((t) => t.id === active.id) + 1;
    return { idx, total: timers.length };
  }, [active, timers]);

  const upcoming = timers.filter(
    (t) => t.status === "idle" && t.id !== active?.id,
  );

  function sendQuick(color: "white" | "green" | "red") {
    const t = text.trim();
    if (!t) return;
    sendCommand({ type: "message:send", text: t, color });
    setText("");
  }

  return (
    <>
      <RoleTopBar role="Operator" wsConnected={wsConnected}>
        <span style={{ color: "var(--fg-4)" }}>/</span>
        <span
          style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500 }}
        >
          {roomName}
        </span>
      </RoleTopBar>

      <section
        style={{
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Active timer hero */}
        <div
          style={{
            padding: 28,
            borderRadius: 24,
            background:
              "radial-gradient(400px 200px at 0% 0%, rgba(176,240,240,0.12), transparent 60%), rgba(4,32,40,0.7)",
            border: active
              ? "1px solid rgba(176,240,240,0.3)"
              : "1px solid var(--border-subtle)",
            boxShadow: active ? "0 0 30px rgba(176,240,240,0.1)" : "none",
          }}
        >
          <div className="flex items-center gap-2.5" style={{ marginBottom: 8 }}>
            {active ? (
              <Badge variant="live">ATIVO</Badge>
            ) : (
              <Badge variant="ghost">sem timer ativo</Badge>
            )}
            {active && (
              <span style={{ fontSize: 12, color: "var(--fg-3)" }}>
                {position.idx} de {position.total}
              </span>
            )}
          </div>
          <div className="flex items-end justify-between gap-5 flex-wrap">
            <div>
              <div style={{ fontSize: 26, fontWeight: 600, color: "var(--fg-1)" }}>
                {active?.title || "Nenhum timer"}
              </div>
              <div style={{ fontSize: 14, color: "var(--fg-3)" }}>
                {active?.presenter || "—"}
                {active && (
                  <>
                    {" · "}
                    {active.type === "countdown"
                      ? "countdown"
                      : active.type === "countup"
                        ? "countup"
                        : "relógio"}
                  </>
                )}
              </div>
            </div>
            <div
              style={{
                fontSize: 108,
                fontWeight: 500,
                fontFamily: "var(--font-mono)",
                color: active ? "var(--luxo-glow)" : "var(--fg-4)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                textShadow: active ? "0 0 40px rgba(176,240,240,0.35)" : "none",
              }}
            >
              {active ? tick.displayTime : "00:00"}
            </div>
          </div>

          <div
            className="grid gap-2.5"
            style={{ marginTop: 20, gridTemplateColumns: "repeat(5, 1fr)" }}
          >
            {running ? (
              <BigBtn
                label="Pausar"
                solid
                onClick={() =>
                  active && sendCommand({ type: "timer:pause", timerId: active.id })
                }
                disabled={!active}
              />
            ) : (
              <BigBtn
                label={paused ? "Retomar" : "Iniciar"}
                solid
                onClick={() =>
                  active &&
                  sendCommand({
                    type: paused ? "timer:resume" : "timer:start",
                    timerId: active.id,
                  })
                }
                disabled={!active}
              />
            )}
            <BigBtn
              label="Parar"
              onClick={() =>
                active && sendCommand({ type: "timer:stop", timerId: active.id })
              }
              disabled={!active}
            />
            <BigBtn
              label="Reset"
              onClick={() =>
                active && sendCommand({ type: "timer:reset", timerId: active.id })
              }
              disabled={!active}
            />
            <BigBtn
              label="−1 min"
              onClick={() =>
                active &&
                sendCommand({
                  type: "timer:nudge",
                  timerId: active.id,
                  deltaSec: -60,
                })
              }
              disabled={!active || active.type !== "countdown"}
            />
            <BigBtn
              label="+1 min"
              onClick={() =>
                active &&
                sendCommand({
                  type: "timer:nudge",
                  timerId: active.id,
                  deltaSec: 60,
                })
              }
              disabled={!active || active.type !== "countdown"}
            />
          </div>
        </div>

        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "1fr 280px" }}
        >
          {/* Upcoming list */}
          <div
            style={{
              borderRadius: 16,
              background: "rgba(4,32,40,0.5)",
              border: "1px solid var(--border-subtle)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <Eyebrow>Próximos</Eyebrow>
            </div>
            <div
              className="thin-scroll"
              style={{ flex: 1, overflowY: "auto", maxHeight: 420 }}
            >
              {upcoming.length === 0 ? (
                <div
                  style={{
                    padding: 24,
                    fontSize: 13,
                    color: "var(--fg-4)",
                  }}
                >
                  Nenhum próximo timer.
                </div>
              ) : (
                upcoming.map((t, i) => {
                  const color =
                    COLOR_MAP[t.color as TimerColor] ?? COLOR_MAP.white;
                  return (
                    <div
                      key={t.id}
                      className="flex items-center gap-3"
                      style={{
                        padding: "14px 16px",
                        borderTop:
                          i === 0 ? "none" : "1px solid var(--border-subtle)",
                      }}
                    >
                      <div
                        className={color.dot}
                        style={{ width: 4, height: 28, borderRadius: 2 }}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "var(--fg-1)",
                          }}
                        >
                          {t.title || "(sem título)"}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--fg-3)",
                          }}
                        >
                          {t.presenter || "—"}
                          {t.type === "countdown" && (
                            <>
                              {" · "}
                              <span style={{ fontFamily: "var(--font-mono)" }}>
                                {formatTime(t.duration)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          sendCommand({ type: "timer:start", timerId: t.id })
                        }
                        style={{
                          height: 40,
                          padding: "0 16px",
                          borderRadius: 9999,
                          background: "rgba(176,240,240,0.08)",
                          border: "1px solid rgba(176,240,240,0.3)",
                          color: "var(--luxo-glow)",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Ico.play /> Ativar
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick message */}
          <div
            style={{
              borderRadius: 16,
              background: "rgba(4,32,40,0.5)",
              border: "1px solid var(--border-subtle)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Eyebrow>Recado rápido</Eyebrow>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva ao palco..."
              className="rh-input"
              style={{
                marginTop: 10,
                padding: 12,
                minHeight: 72,
                borderRadius: 12,
                background: "rgba(0,16,16,0.6)",
                fontSize: 13,
                resize: "none",
              }}
            />
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: "repeat(3, 1fr)", marginTop: 10 }}
            >
              {(
                [
                  { l: "Ok", c: "#F0FAFA", color: "white" as const },
                  { l: "Go", c: "#2E6A7A", color: "green" as const },
                  { l: "!", c: "#ff6b6b", color: "red" as const },
                ] as const
              ).map((c) => (
                <button
                  key={c.l}
                  type="button"
                  disabled={!text.trim()}
                  onClick={() => sendQuick(c.color)}
                  style={{
                    height: 44,
                    borderRadius: 10,
                    background: "rgba(176,240,240,0.04)",
                    border: "1px solid var(--border-subtle)",
                    color: c.c,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: text.trim() ? "pointer" : "not-allowed",
                    opacity: text.trim() ? 1 : 0.5,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: c.c,
                    }}
                  />
                  {c.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function BigBtn({
  label,
  onClick,
  solid,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  solid?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 64,
        borderRadius: 14,
        background: solid
          ? "var(--luxo-glow)"
          : "rgba(176,240,240,0.05)",
        color: solid ? "var(--luxo-void)" : "var(--fg-1)",
        border: solid ? "none" : "1px solid var(--border-default)",
        fontSize: 15,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "var(--font-sans)",
        boxShadow: solid ? "0 0 20px rgba(176,240,240,0.3)" : "none",
        opacity: disabled ? 0.35 : 1,
        transition: "all 240ms var(--ease-out-expo)",
      }}
    >
      {label}
    </button>
  );
}
