"use client";

import { useMemo, useState } from "react";
import { useRealtimeTimer } from "@/features/timer/hooks/use-realtime-timer";
import { useTimerTick } from "@/features/timer/hooks/use-timer";
import { useTimerStore } from "@/features/timer/store/timer-store";
import { RoleTopBar } from "@/features/rhema/components/command-center/role-top-bar";
import { Eyebrow } from "@/shared/components/ui/primitives";

type Color = "white" | "green" | "red";

interface SentMessage {
  id: string;
  text: string;
  color: Color;
  sentAt: number;
}

const COLOR_OPTIONS: { key: Color; label: string; hex: string }[] = [
  { key: "white", label: "Branco", hex: "#F0FAFA" },
  { key: "green", label: "Verde", hex: "#2E6A7A" },
  { key: "red", label: "Vermelho", hex: "#ff6b6b" },
];

export default function ModeratorClient({
  roomId,
  roomName,
}: {
  roomId: string;
  roomName: string;
}) {
  const { sendCommand } = useRealtimeTimer(roomId, "moderator");
  const timers = useTimerStore((s) => s.timers);
  const activeTimerId = useTimerStore((s) => s.activeTimerId);
  const wsConnected = useTimerStore((s) => s.wsConnected);
  const active = timers.find((t) => t.id === activeTimerId) ?? null;
  const tick = useTimerTick(active);
  const [text, setText] = useState("");
  const [color, setColor] = useState<Color>("white");
  const [sent, setSent] = useState<SentMessage[]>([]);

  const progressPct = useMemo(() => {
    if (!active || active.type !== "countdown" || active.duration === 0) return null;
    return Math.max(
      0,
      Math.min(100, Math.round((tick.elapsed / active.duration) * 100)),
    );
  }, [active, tick.elapsed]);

  function sendMessage() {
    const t = text.trim();
    if (!t) return;
    sendCommand({ type: "message:send", text: t, color });
    setSent((prev) =>
      [
        { id: `${Date.now()}`, text: t, color, sentAt: Date.now() },
        ...prev,
      ].slice(0, 20),
    );
    setText("");
  }

  function clearStage() {
    sendCommand({ type: "message:clear" });
  }

  return (
    <>
      <RoleTopBar
        role="Moderator"
        wsConnected={wsConnected}
        statusLabel={wsConnected ? "sala viva" : "desconectado"}
      >
        <span style={{ color: "var(--fg-4)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500 }}>
          {roomName}
        </span>
      </RoleTopBar>

      <section
        className="grid gap-5"
        style={{
          padding: 28,
          gridTemplateColumns: "1fr 1fr",
          maxWidth: 960,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Read-only timer */}
        <div
          style={{
            padding: 24,
            borderRadius: 20,
            background: "rgba(4,32,40,0.55)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 360,
          }}
        >
          <div>
            <Eyebrow>No palco agora</Eyebrow>
            <div
              style={{
                marginTop: 10,
                fontSize: 22,
                fontWeight: 600,
                color: "var(--fg-1)",
              }}
            >
              {active?.title || "Nenhum timer"}
            </div>
            <div style={{ fontSize: 13, color: "var(--fg-3)" }}>
              {active?.presenter || "—"}
            </div>
          </div>
          <div
            style={{
              fontSize: 120,
              fontWeight: 500,
              fontFamily: "var(--font-mono)",
              color: active ? "var(--luxo-glow)" : "var(--fg-4)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              textAlign: "center",
              margin: "20px 0",
              textShadow: active ? "0 0 40px rgba(176,240,240,0.3)" : "none",
            }}
          >
            {active ? tick.displayTime : "—:—"}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--fg-3)",
              textAlign: "center",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            somente leitura
            {progressPct != null && (
              <>
                {" · "}
                <span style={{ color: "var(--fg-2)" }}>
                  {progressPct}% decorrido
                </span>
              </>
            )}
          </div>
        </div>

        {/* Send message */}
        <div
          style={{
            padding: 24,
            borderRadius: 20,
            background: "rgba(4,32,40,0.55)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Eyebrow>Enviar ao palco</Eyebrow>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Texto que aparecerá no palco"
            className="rh-input"
            style={{
              marginTop: 12,
              padding: 14,
              minHeight: 110,
              borderRadius: 12,
              background: "rgba(0,16,16,0.6)",
              fontSize: 15,
              resize: "none",
            }}
          />
          <div className="flex gap-1.5" style={{ marginTop: 10 }}>
            {COLOR_OPTIONS.map((c) => {
              const isActive = color === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setColor(c.key)}
                  style={{
                    flex: 1,
                    height: 42,
                    borderRadius: 10,
                    background: isActive ? `${c.hex}22` : "rgba(176,240,240,0.04)",
                    border: isActive
                      ? `1px solid ${c.hex}55`
                      : "1px solid var(--border-subtle)",
                    color: c.hex,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
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
                      background: c.hex,
                    }}
                  />
                  {c.label}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2" style={{ marginTop: 12 }}>
            <button
              type="button"
              onClick={sendMessage}
              disabled={!text.trim()}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 9999,
                background: "var(--luxo-glow)",
                color: "var(--luxo-void)",
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: text.trim() ? "pointer" : "not-allowed",
                boxShadow: text.trim()
                  ? "0 0 20px rgba(176,240,240,0.3)"
                  : "none",
                opacity: text.trim() ? 1 : 0.5,
              }}
            >
              Enviar
            </button>
            <button
              type="button"
              onClick={clearStage}
              style={{
                height: 44,
                padding: "0 16px",
                borderRadius: 9999,
                background: "transparent",
                border: "1px solid var(--border-default)",
                color: "var(--fg-2)",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Limpar palco
            </button>
          </div>
        </div>

        {/* History full width */}
        <div
          style={{
            gridColumn: "1 / -1",
            padding: 20,
            borderRadius: 16,
            background: "rgba(4,32,40,0.5)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <Eyebrow>
            Histórico da sessão · {sent.length}{" "}
            {sent.length === 1 ? "envio" : "envios"}
          </Eyebrow>
          <div
            className="flex flex-col gap-2"
            style={{ marginTop: 12 }}
          >
            {sent.length === 0 ? (
              <div
                style={{
                  padding: "12px 14px",
                  fontSize: 12,
                  color: "var(--fg-4)",
                  textAlign: "center",
                }}
              >
                Nenhuma mensagem enviada ainda.
              </div>
            ) : (
              sent.map((m) => {
                const hex =
                  m.color === "red"
                    ? "#ff6b6b"
                    : m.color === "green"
                      ? "#2E6A7A"
                      : "#F0FAFA";
                const time = new Date(m.sentAt);
                const pad = (n: number) => n.toString().padStart(2, "0");
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3.5"
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "rgba(176,240,240,0.03)",
                      borderLeft: `2px solid ${hex}`,
                      fontSize: 13,
                      color: "var(--fg-2)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--fg-3)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {pad(time.getHours())}:{pad(time.getMinutes())}
                    </span>
                    <span className="flex-1 truncate">{m.text}</span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--fg-4)",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                      }}
                    >
                      entregue
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
}
