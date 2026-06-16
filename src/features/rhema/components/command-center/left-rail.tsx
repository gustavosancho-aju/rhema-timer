"use client";

import type { CSSProperties, ReactNode } from "react";
import { Badge, Dot, Eyebrow, Serif } from "@/shared/components/ui/primitives";
import { CULTO_LABELS } from "@/features/rhema/lib/gravacoes-types";
import type { GravacaoCliente } from "@/features/rhema/lib/gravacoes-types";

const CULTO_COR: Record<string, string> = {
  sozo: "#8FD8DC",
  familia: "#F59E0B",
  quarta: "#A855F7",
};

function formatData(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDur(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

export function LeftRail({
  gravando,
  decorridoMs,
  palavras,
  titulo = "Sessão sem título",
  subtitulo,
  historico = [],
  onRestaurar,
}: {
  gravando: boolean;
  decorridoMs: number;
  palavras: number;
  titulo?: string;
  subtitulo?: { texto: string; autor?: string };
  historico?: GravacaoCliente[];
  onRestaurar?: (g: GravacaoCliente) => void;
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
          <Eyebrow>Últimas gravações</Eyebrow>
          {historico.length > 0 && (
            <span style={{ fontSize: 11, color: "var(--fg-3)" }}>
              {historico.length}
            </span>
          )}
        </div>
        <div className="thin-scroll" style={{ overflowY: "auto", flex: 1 }}>
          {historico.length === 0 ? (
            <div
              style={{
                padding: "24px 16px",
                fontSize: 12,
                color: "var(--fg-4)",
                borderTop: "1px solid var(--border-subtle)",
                lineHeight: 1.6,
              }}
            >
              Nenhuma gravação salva ainda.
              <br />
              Gere legendas, escolha a sua favorita, marque o culto e clique em{" "}
              <strong style={{ color: "var(--fg-2)" }}>Salvar no histórico</strong>.
            </div>
          ) : (
            historico.map((g) => (
              <GravacaoRow key={g.id} g={g} onRestaurar={onRestaurar} />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function GravacaoRow({
  g,
  onRestaurar,
}: {
  g: GravacaoCliente;
  onRestaurar?: (g: GravacaoCliente) => void;
}) {
  const escolhida =
    g.escolhidaIdx != null ? g.legendas[g.escolhidaIdx] : undefined;
  const previa = (escolhida?.texto ?? g.legendas[0]?.texto ?? "").replace(
    /\n+/g,
    " ",
  );
  const cor = CULTO_COR[g.cultoTipo] ?? "var(--fg-3)";

  return (
    <button
      type="button"
      onClick={() => onRestaurar?.(g)}
      className="rh-history-row transition"
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "12px 16px",
        borderTop: "1px solid var(--border-subtle)",
        background: "transparent",
        cursor: onRestaurar ? "pointer" : "default",
      }}
    >
      <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: cor,
            background: `${cor}1f`,
            border: `1px solid ${cor}40`,
            borderRadius: 9999,
            padding: "2px 8px",
          }}
        >
          {CULTO_LABELS[g.cultoTipo]}
        </span>
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            color: "var(--fg-3)",
          }}
        >
          {formatData(g.createdAt)}
        </span>
        {escolhida && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              fontWeight: 600,
              color: "var(--luxo-glow)",
            }}
          >
            ✓ escolhida
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "var(--fg-2)",
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {previa || "(sem legendas)"}
      </div>
      <div
        className="flex gap-2.5"
        style={{
          fontSize: 10,
          color: "var(--fg-4)",
          fontFamily: "var(--font-mono)",
          marginTop: 6,
        }}
      >
        <span>{formatDur(g.duracaoMs)}</span>
        <Dot size={3} color="var(--fg-4)" />
        <span>
          {g.legendas.length} legenda{g.legendas.length === 1 ? "" : "s"}
        </span>
      </div>
    </button>
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
