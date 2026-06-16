"use client";

import { CULTO_LABELS } from "@/features/rhema/lib/gravacoes-types";
import type { GravacaoCliente } from "@/features/rhema/hooks/use-gravacoes";

type Props = {
  historico: GravacaoCliente[];
  onRestaurar: (g: GravacaoCliente) => void;
};

function formatarData(iso: string): string {
  const d = new Date(iso);
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

const CULTO_COR: Record<string, string> = {
  sozo: "rgba(143,216,220,0.35)",
  familia: "rgba(245,158,11,0.35)",
  quarta: "rgba(168,85,247,0.35)",
};

export function HistoricoGravacoes({ historico, onRestaurar }: Props) {
  if (historico.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="rh-eyebrow">Últimas gravações</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {historico.map((g) => {
          const escolhida =
            g.escolhidaIdx != null ? g.legendas[g.escolhidaIdx] : undefined;
          const previa = escolhida?.texto ?? g.legendas[0]?.texto ?? "";
          return (
            <article key={g.id} className="rh-card flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: CULTO_COR[g.cultoTipo] ?? "var(--bg-2)",
                    color: "var(--fg-1)",
                  }}
                >
                  {CULTO_LABELS[g.cultoTipo]}
                </span>
                <span
                  className="text-xs font-mono tabular-nums"
                  style={{ color: "var(--fg-3)" }}
                >
                  {formatarData(g.createdAt)}
                </span>
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
                  {escolhida ? "✓ escolhida" : `${g.legendas.length} legendas`}
                  {" · "}
                  {formatarDuracao(g.duracaoMs)}
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
