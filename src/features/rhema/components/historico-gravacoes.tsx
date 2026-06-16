"use client";

import type { GravacaoSalva } from "@/features/rhema/lib/historico-gravacoes";

type Props = {
  historico: GravacaoSalva[];
  onRestaurar: (g: GravacaoSalva) => void;
  onLimpar: () => void;
};

function formatarData(ts: number): string {
  // new Date(ts) é determinístico (ts vem salvo), seguro no render.
  const d = new Date(ts);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatarDuracao(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m.toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

export function HistoricoGravacoes({ historico, onRestaurar, onLimpar }: Props) {
  if (historico.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="rh-eyebrow">Últimas gravações</h2>
        <button
          onClick={onLimpar}
          className="text-xs rounded-lg px-3 py-1.5 transition"
          style={{
            background: "var(--bg-2)",
            border: "1px solid var(--border-default)",
            color: "var(--fg-3)",
          }}
        >
          Limpar histórico
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {historico.map((g) => {
          const previa = g.legendas[0]?.texto ?? "";
          return (
            <article key={g.id} className="rh-card flex flex-col gap-3 p-4">
              <div
                className="flex items-center justify-between text-xs font-mono tabular-nums"
                style={{ color: "var(--fg-3)" }}
              >
                <span>{formatarData(g.salvaEm)}</span>
                <span>{formatarDuracao(g.duracaoMs)}</span>
              </div>

              <p
                className="text-sm leading-relaxed line-clamp-3"
                style={{ color: "var(--fg-2)" }}
              >
                {previa || "(sem legendas)"}
              </p>

              <div
                className="flex items-center justify-between mt-auto pt-2"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                <span className="text-xs" style={{ color: "var(--fg-4)" }}>
                  {g.legendas.length} legenda{g.legendas.length === 1 ? "" : "s"}
                </span>
                <button
                  onClick={() => onRestaurar(g)}
                  className="text-xs rounded-lg px-3 py-1.5 transition"
                  style={{
                    background: "var(--bg-2)",
                    border: "1px solid var(--border-default)",
                    color: "var(--fg-1)",
                  }}
                >
                  Restaurar
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
