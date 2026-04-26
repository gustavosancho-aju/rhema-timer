"use client";

import { useState } from "react";
import { useTimerStore } from "@/store/timer-store";

type Color = "white" | "green" | "red";

export default function MessagePanel({
  sendCommand,
}: {
  sendCommand: (p: Record<string, unknown>) => void;
}) {
  const [text, setText] = useState("");
  const [color, setColor] = useState<Color>("white");
  const currentMessage = useTimerStore((s) => s.currentMessage);

  function send(overrideColor?: Color) {
    const t = text.trim();
    if (!t) return;
    sendCommand({ type: "message:send", text: t, color: overrideColor ?? color });
    setText("");
  }

  const colorOptions: { key: Color; label: string; active: object; idle: object }[] = [
    {
      key: "white",
      label: "Branco",
      active: { background: "var(--fg-1)", color: "var(--bg-0)", border: "1px solid var(--fg-1)" },
      idle:   { background: "var(--bg-0)", border: "1px solid var(--border-default)", color: "var(--fg-3)" },
    },
    {
      key: "green",
      label: "Verde",
      active: { background: "var(--luxo-teal-mid)", color: "var(--luxo-white)", border: "1px solid var(--luxo-aqua)" },
      idle:   { background: "var(--bg-0)", border: "1px solid var(--border-default)", color: "var(--fg-3)" },
    },
    {
      key: "red",
      label: "Vermelho",
      active: { background: "#dc2626", color: "#fff", border: "1px solid #ef4444" },
      idle:   { background: "var(--bg-0)", border: "1px solid var(--border-default)", color: "var(--fg-3)" },
    },
  ];

  return (
    <div
      className="rh-card p-4 flex flex-col gap-3 sticky top-4"
    >
      <h2 className="rh-eyebrow">Mensagens para o palco</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Ex: Faltam 2 minutos"
        className="rh-input px-3 py-2 text-sm resize-none w-full"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            send();
          }
        }}
      />

      {/* Color selector */}
      <div className="flex items-center gap-2">
        {colorOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setColor(opt.key)}
            className="flex-1 text-xs font-medium py-1.5 rounded-lg transition"
            style={color === opt.key ? opt.active : opt.idle}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => send()}
          disabled={!text.trim()}
          className="rh-btn rh-btn-primary flex-1 justify-center"
          style={{ borderRadius: "var(--radius-sm)" }}
        >
          Enviar (Ctrl+Enter)
        </button>
        <button
          onClick={() => sendCommand({ type: "message:clear" })}
          className="rh-btn rh-btn-ghost"
          style={{ borderRadius: "var(--radius-sm)" }}
        >
          Limpar
        </button>
      </div>

      {currentMessage && (
        <div
          className="pt-3"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <div className="rh-eyebrow mb-2">Mensagem atual no palco</div>
          <div
            className="rounded-lg p-2 text-sm font-medium"
            style={
              currentMessage.color === "red"
                ? { background: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }
                : currentMessage.color === "green"
                ? { background: "rgba(143,216,220,0.10)", color: "var(--luxo-aqua)", border: "1px solid var(--border-accent)" }
                : { background: "var(--bg-2)", color: "var(--fg-1)", border: "1px solid var(--border-default)" }
            }
          >
            {currentMessage.text}
          </div>
        </div>
      )}

      <button
        onClick={() => sendCommand({ type: "display:flash" })}
        className="rh-btn mt-1 w-full justify-center"
        style={{
          background: "rgba(245,158,11,0.15)",
          border: "1px solid rgba(245,158,11,0.4)",
          color: "#fcd34d",
          borderRadius: "var(--radius-sm)",
        }}
      >
        ⚡ Flash (chamar atenção)
      </button>
    </div>
  );
}
