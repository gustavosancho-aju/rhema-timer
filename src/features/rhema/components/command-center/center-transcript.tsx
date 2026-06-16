"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  Badge,
  Dot,
  Elapsed,
  Eyebrow,
  Ico,
  Pulse,
  Serif,
  Waveform,
} from "@/shared/components/ui/primitives";

function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// Split finalized transcript into paragraph-ish chunks with synthetic timestamps
// based on the recording start time. Used only for display rhythm.
function splitIntoLines(texto: string, startedAt: number | null): { t: string; text: string }[] {
  if (!texto.trim()) return [];
  const chunks = texto
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!startedAt) {
    return chunks.map((c) => ({ t: "--:--:--", text: c }));
  }
  const per = Math.max(8000, 15000);
  return chunks.map((c, i) => {
    const d = new Date(startedAt + i * per);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return {
      t: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
      text: c,
    };
  });
}

export function CenterTranscript({
  gravando,
  decorridoMs,
  textoFinal,
  textoInterim,
  startedAt,
  onToggle,
  keywords = [],
}: {
  gravando: boolean;
  decorridoMs: number;
  textoFinal: string;
  textoInterim: string;
  startedAt: number | null;
  onToggle: () => void;
  keywords?: string[];
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const lines = useMemo(
    () => splitIntoLines(textoFinal, startedAt),
    [textoFinal, startedAt],
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [textoFinal, textoInterim]);

  return (
    <div className="flex flex-col gap-4" style={{ minHeight: 0 }}>
      {/* transport bar */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "12px 20px",
          borderRadius: 16,
          background: "rgba(4,32,40,0.5)",
          border: "1px solid var(--border-subtle)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggle}
            aria-label={gravando ? "Parar gravação" : "Iniciar gravação"}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: gravando
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(176, 240, 240, 0.12)",
              border: gravando
                ? "1px solid rgba(239, 68, 68, 0.35)"
                : "1px solid rgba(176, 240, 240, 0.35)",
              color: gravando ? "#ff6b6b" : "var(--luxo-glow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 240ms var(--ease-out-expo)",
            }}
          >
            {gravando ? <Ico.stop /> : <Ico.play />}
          </button>
          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--fg-3)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              {gravando ? "Gravando" : "Pronto"}
            </div>
            <div className="flex items-center gap-2.5">
              {gravando && <Pulse size={7} color="#ff6b6b" />}
              <Elapsed value={formatElapsed(decorridoMs)} />
              {gravando ? (
                <>
                  <Dot size={3} color="var(--fg-4)" />
                  <span style={{ fontSize: 12, color: "var(--fg-2)" }}>ao vivo · pt-BR</span>
                </>
              ) : (
                <>
                  <Dot size={3} color="var(--fg-4)" />
                  <span style={{ fontSize: 12, color: "var(--fg-3)" }}>
                    clique para iniciar
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5">
            <span
              style={{
                fontSize: 10,
                color: "var(--fg-3)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Áudio
            </span>
            <Waveform bars={28} color="var(--luxo-glow)" height={28} active={gravando} />
          </div>
          <div style={{ width: 1, height: 22, background: "var(--border-subtle)" }} />
          <MetaStat label="Engine" value="Web Speech" tone="muted" />
          <MetaStat label="Idioma" value="pt-BR" tone="ok" />
        </div>
      </div>

      {/* transcript surface */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          borderRadius: 24,
          background:
            "radial-gradient(800px 400px at 50% 0%, rgba(45,27,105,0.22), transparent 60%), rgba(4,32,40,0.55)",
          border: "1px solid var(--border-subtle)",
          boxShadow:
            "inset 0 1px 0 rgba(176,240,240,0.05), 0 20px 60px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            padding: "18px 28px 12px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex items-center gap-3">
            <Eyebrow>Transcrição ao vivo</Eyebrow>
            <Badge variant="gold">
              <Serif>pt-BR</Serif>
            </Badge>
          </div>
          <div
            className="flex items-center gap-3"
            style={{ fontSize: 11, color: "var(--fg-3)" }}
          >
            <span>autoscroll</span>
            <div
              style={{
                width: 28,
                height: 16,
                borderRadius: 9999,
                background: "rgba(176,240,240,0.25)",
                border: "1px solid rgba(176,240,240,0.35)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 1,
                  right: 1,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "var(--luxo-glow)",
                  boxShadow: "0 0 6px var(--luxo-glow)",
                }}
              />
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="thin-scroll"
          style={{ flex: 1, overflowY: "auto", padding: "28px 36px 0" }}
        >
          {lines.length === 0 && !textoInterim && !gravando && (
            <div
              style={{
                fontSize: 15,
                color: "var(--fg-4)",
                padding: "32px 0",
              }}
            >
              Clique no botão ▶ acima e permita o acesso ao microfone para começar a
              transcrição ao vivo.
            </div>
          )}

          {lines.map((line, i) => (
            <TranscriptLine
              key={`${i}-${line.t}`}
              t={line.t}
              text={line.text}
              dim={i < Math.max(0, lines.length - 4)}
            />
          ))}

          {(gravando || textoInterim) && (
            <LiveLine interim={textoInterim} gravando={gravando} />
          )}
        </div>

        <div
          className="flex items-center justify-between"
          style={{
            padding: "14px 28px 18px",
            borderTop: "1px solid var(--border-subtle)",
            background: "rgba(0,16,16,0.4)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <span
              style={{
                fontSize: 10,
                color: "var(--fg-3)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Agora · palavras-chave detectadas
            </span>
          </div>
          <div className="flex gap-1.5">
            {keywords.length > 0 ? (
              keywords.map((w, i) => (
                <span
                  key={w}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 9999,
                    background:
                      i === 0 ? "rgba(176,240,240,0.08)" : "rgba(176,240,240,0.05)",
                    border:
                      i === 0
                        ? "1px solid rgba(176,240,240,0.3)"
                        : "1px solid var(--border-subtle)",
                    fontSize: 11,
                    color: i === 0 ? "var(--luxo-glow)" : "var(--fg-2)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {w}
                </span>
              ))
            ) : (
              <span style={{ fontSize: 11, color: "var(--fg-4)" }}>—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TranscriptLine({
  t,
  text,
  dim,
}: {
  t: string;
  text: string;
  dim?: boolean;
}) {
  return (
    <div
      className="flex gap-5"
      style={{
        marginBottom: 20,
        opacity: dim ? 0.35 : 1,
        transition: "opacity 400ms",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 64,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--fg-3)",
          letterSpacing: "0.05em",
          paddingTop: 8,
        }}
      >
        {t}
      </span>
      <div
        style={{
          fontSize: 20,
          lineHeight: 1.5,
          color: "var(--fg-1)",
          letterSpacing: "-0.005em",
          maxWidth: 680,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function LiveLine({ interim, gravando }: { interim: string; gravando: boolean }) {
  return (
    <div className="flex gap-5" style={{ marginBottom: 28 }}>
      <span
        style={{
          flexShrink: 0,
          width: 64,
          paddingTop: 8,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {gravando && <Pulse size={6} />}
        <span
          style={{
            fontSize: 10,
            color: "var(--luxo-glow)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
          }}
        >
          agora
        </span>
      </span>
      <div
        style={{
          fontSize: 22,
          lineHeight: 1.5,
          color: interim ? "var(--fg-1)" : "var(--fg-4)",
          letterSpacing: "-0.005em",
          maxWidth: 680,
          fontWeight: 500,
        }}
      >
        {interim || "…"}
        <span
          style={{
            display: "inline-block",
            marginLeft: 4,
            width: 2,
            height: 20,
            verticalAlign: "middle",
            background: "var(--luxo-glow)",
            boxShadow: "0 0 8px var(--luxo-glow)",
            animation: "rh-caret 1s infinite",
          }}
        />
      </div>
    </div>
  );
}

function MetaStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "muted";
}) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span
        style={{
          fontSize: 9,
          color: "var(--fg-3)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          color: tone === "ok" ? "var(--luxo-glow)" : "var(--fg-2)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
