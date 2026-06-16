"use client";

import type { CSSProperties, ReactNode } from "react";
import { Badge, Dot, Eyebrow, Serif } from "@/shared/components/ui/primitives";

function formatDur(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

interface HistoryItem {
  date: string;
  title: string;
  duration: string;
  words: number;
  status: "posted" | "draft";
}

export function LeftRail({
  gravando,
  decorridoMs,
  palavras,
  titulo = "Sessão sem título",
  subtitulo,
  historico = [],
}: {
  gravando: boolean;
  decorridoMs: number;
  palavras: number;
  titulo?: string;
  subtitulo?: { texto: string; autor?: string };
  historico?: HistoryItem[];
}) {
  return (
    <div className="flex flex-col gap-4" style={{ minHeight: 0 }}>
      <Card noPad>
        <div className="flex items-center justify-between" style={{ padding: "14px 16px 12px" }}>
          <Eyebrow>Sessão atual</Eyebrow>
          {gravando ? (
            <Badge variant="live">ao vivo</Badge>
          ) : (
            <Badge variant="ghost">pausado</Badge>
          )}
        </div>
        <div style={{ padding: "0 16px 16px" }}>
          <div
            style={{
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              marginBottom: 4,
              color: "var(--fg-1)",
            }}
          >
            {titulo}
          </div>
          {subtitulo && (
            <div style={{ fontSize: 13, color: "var(--fg-3)" }}>
              {subtitulo.texto && (
                <Serif style={{ color: "var(--luxo-gold)" }}>
                  &ldquo;{subtitulo.texto}&rdquo;
                </Serif>
              )}
              {subtitulo.autor && <> · {subtitulo.autor}</>}
            </div>
          )}
        </div>
        <div
          className="grid grid-cols-2"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <Stat label="Duração" value={formatDur(decorridoMs)} mono />
          <Stat
            label="Palavras"
            value={palavras.toLocaleString("pt-BR").replace(",", " ")}
            mono
            borderLeft
          />
        </div>
      </Card>

      <Card noPad style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div className="flex items-center justify-between" style={{ padding: "14px 16px 10px" }}>
          <Eyebrow>Histórico</Eyebrow>
          <span style={{ fontSize: 11, color: "var(--fg-3)" }}>últimos 14 dias</span>
        </div>
        <div className="thin-scroll" style={{ overflowY: "auto", flex: 1 }}>
          {historico.length === 0 ? (
            <div
              style={{
                padding: "24px 16px",
                fontSize: 12,
                color: "var(--fg-4)",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              Nenhuma sessão publicada ainda. Grave e gere sua primeira legenda.
            </div>
          ) : (
            historico.map((h, i) => <HistoryRow key={i} {...h} />)
          )}
        </div>
      </Card>
    </div>
  );
}

function HistoryRow({ date, title, duration, words, status }: HistoryItem) {
  return (
    <div
      className="transition"
      style={{
        padding: "12px 16px",
        borderTop: "1px solid var(--border-subtle)",
        cursor: "pointer",
      }}
    >
      <div className="flex items-center gap-2.5" style={{ marginBottom: 6 }}>
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            color: "var(--fg-3)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {date}
        </span>
        <Dot size={3} color="var(--fg-4)" />
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: status === "posted" ? "var(--luxo-glow)" : "var(--luxo-gold)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {status === "posted" ? "publicado" : "rascunho"}
        </span>
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--fg-1)",
          marginBottom: 4,
          letterSpacing: "-0.005em",
        }}
      >
        {title}
      </div>
      <div
        className="flex gap-2.5"
        style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}
      >
        <span>{duration}</span>
        <span>{words.toLocaleString("pt-BR").replace(",", " ")} palavras</span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
  borderLeft,
}: {
  label: string;
  value: string;
  mono?: boolean;
  borderLeft?: boolean;
}) {
  return (
    <div
      style={{
        padding: "12px 16px",
        borderLeft: borderLeft ? "1px solid var(--border-subtle)" : "none",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "var(--fg-3)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
          color: "var(--fg-1)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Card({
  children,
  noPad,
  style,
}: {
  children: ReactNode;
  noPad?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        background: "rgba(4,32,40,0.55)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "inset 0 1px 0 rgba(176,240,240,0.05)",
        padding: noPad ? 0 : 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
