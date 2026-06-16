"use client";

import type { SugestaoVersiculo } from "@/shared/types";

type Props = {
  sugestao: SugestaoVersiculo;
  agora: number;
  onExibir: (s: SugestaoVersiculo) => void;
  onDescartar: (id: string) => void;
};

function formatarTempo(detectadoEm: number, agora: number): string {
  const segundos = Math.max(0, Math.floor((agora - detectadoEm) / 1000));
  if (segundos < 60) return `há ${segundos}s`;
  const min = Math.floor(segundos / 60);
  return `há ${min}min`;
}

function referenciaLonga(s: SugestaoVersiculo): string {
  const faixa =
    s.versiculo_inicio === s.versiculo_fim
      ? `${s.versiculo_inicio}`
      : `${s.versiculo_inicio}-${s.versiculo_fim}`;
  return `${s.livro} ${s.capitulo}:${faixa}`;
}

export function VersiculoCard({ sugestao, agora, onExibir, onDescartar }: Props) {
  const conf = sugestao.confianca;

  const confStyle =
    conf >= 0.85
      ? { bg: "rgba(143,216,220,0.10)", text: "var(--luxo-aqua)", border: "rgba(143,216,220,0.35)" }
      : conf >= 0.7
      ? { bg: "rgba(245,158,11,0.10)", text: "#fcd34d", border: "rgba(245,158,11,0.3)" }
      : { bg: "rgba(176,240,240,0.06)", text: "var(--fg-3)", border: "var(--border-subtle)" };

  const tipoStyle =
    sugestao.tipo === "citacao_direta"
      ? { bg: "rgba(143,216,220,0.08)", text: "var(--luxo-glow)", border: "rgba(176,240,240,0.2)", label: "Citação" }
      : { bg: "rgba(176,240,240,0.05)", text: "var(--fg-2)", border: "var(--border-subtle)", label: "Alusão" };

  const cardStyle =
    sugestao.status === "exibido"
      ? { background: "rgba(143,216,220,0.06)", border: "1px solid var(--border-accent)" }
      : sugestao.status === "erro"
      ? { background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.3)" }
      : sugestao.status === "enviando"
      ? { background: "var(--bg-glass)", border: "1px solid var(--border-default)" }
      : { background: "var(--bg-1)", border: "1px solid var(--border-default)" };

  const disabled =
    sugestao.status === "enviando" ||
    sugestao.status === "exibido" ||
    sugestao.status === "descartado";

  return (
    <article
      className="rounded-xl p-4 flex flex-col gap-3 transition-all"
      style={{ ...cardStyle, boxShadow: "var(--shadow-card)" }}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <h3
            className="text-lg font-semibold truncate"
            style={{ color: "var(--fg-1)" }}
          >
            {referenciaLonga(sugestao)}
          </h3>
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <span
              className="px-2 py-0.5 rounded-full"
              style={{
                background: confStyle.bg,
                color: confStyle.text,
                border: `1px solid ${confStyle.border}`,
              }}
              title="Confiança do detector"
            >
              {(conf * 100).toFixed(0)}%
            </span>
            <span
              className="px-2 py-0.5 rounded-full"
              style={{
                background: tipoStyle.bg,
                color: tipoStyle.text,
                border: `1px solid ${tipoStyle.border}`,
              }}
            >
              {tipoStyle.label}
            </span>
            <span style={{ color: "var(--fg-3)" }}>
              {formatarTempo(sugestao.detectadoEm, agora)}
            </span>
          </div>
        </div>

        {sugestao.status === "exibido" && (
          <span
            className="text-xs font-medium shrink-0"
            style={{ color: "var(--luxo-aqua)" }}
          >
            ✓ exibindo
          </span>
        )}
      </header>

      <p
        className="text-sm leading-relaxed line-clamp-3"
        style={{ color: "var(--fg-2)" }}
      >
        {sugestao.texto_sugerido}
      </p>

      {sugestao.status === "erro" && sugestao.erroMensagem && (
        <p
          className="text-xs rounded-lg px-2 py-1"
          style={{
            color: "#fca5a5",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          {sugestao.erroMensagem}
        </p>
      )}

      <footer className="flex gap-2 pt-1">
        <button
          onClick={() => onExibir(sugestao)}
          disabled={disabled}
          className="rh-btn rh-btn-primary flex-1 justify-center"
          style={{ borderRadius: "var(--radius-sm)" }}
        >
          {sugestao.status === "enviando"
            ? "Enviando…"
            : sugestao.status === "exibido"
            ? "Exibido"
            : sugestao.status === "erro"
            ? "Tentar de novo"
            : "Exibir no Holyrics"}
        </button>
        <button
          onClick={() => onDescartar(sugestao.id)}
          disabled={sugestao.status === "enviando"}
          className="rh-btn rh-btn-ghost"
          style={{ borderRadius: "var(--radius-sm)" }}
        >
          Descartar
        </button>
      </footer>
    </article>
  );
}
