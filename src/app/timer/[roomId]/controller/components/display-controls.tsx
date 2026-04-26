"use client";

import { useTimerStore } from "@/store/timer-store";

export default function DisplayControls({
  sendCommand,
}: {
  sendCommand: (p: Record<string, unknown>) => void;
}) {
  const blackout   = useTimerStore((s) => s.blackout);
  const focusMode  = useTimerStore((s) => s.focusMode);

  return (
    <div className="rh-card p-4 flex flex-col gap-3">
      <h2 className="rh-eyebrow">Controles de Display</h2>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() =>
            sendCommand({ type: "display:blackout", active: !blackout })
          }
          className="text-sm font-medium py-2 rounded-lg transition"
          style={
            blackout
              ? { background: "#dc2626", color: "#fff", border: "1px solid #ef4444" }
              : { background: "var(--bg-0)", border: "1px solid var(--border-default)", color: "var(--fg-2)" }
          }
        >
          {blackout ? "● BLACKOUT" : "Blackout"}
        </button>

        <button
          onClick={() => sendCommand({ type: "display:flash" })}
          className="text-sm font-medium py-2 rounded-lg transition"
          style={{
            background: "var(--bg-0)",
            border: "1px solid var(--border-default)",
            color: "var(--fg-2)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(245,158,11,0.12)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.4)";
            (e.currentTarget as HTMLElement).style.color = "#fcd34d";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--bg-0)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
            (e.currentTarget as HTMLElement).style.color = "var(--fg-2)";
          }}
        >
          ⚡ Flash
        </button>

        <button
          onClick={() =>
            sendCommand({ type: "display:focus", active: !focusMode })
          }
          className="text-sm font-medium py-2 rounded-lg transition"
          style={
            focusMode
              ? { background: "var(--luxo-teal-mid)", color: "var(--luxo-white)", border: "1px solid var(--luxo-aqua)" }
              : { background: "var(--bg-0)", border: "1px solid var(--border-default)", color: "var(--fg-2)" }
          }
        >
          {focusMode ? "● FOCUS" : "Focus Mode"}
        </button>
      </div>
    </div>
  );
}
