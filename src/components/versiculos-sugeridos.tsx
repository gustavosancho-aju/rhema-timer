"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { VersiculoCard } from "@/components/versiculo-card";
import { useDetectorVersiculos } from "@/hooks/use-detector-versiculos";
import type { HolyricsConfigLocal, SugestaoVersiculo } from "@/lib/types";

type Props = {
  transcricao: string;
  gravando: boolean;
};

const STORAGE_KEY_HOLYRICS = "rhema.holyrics.config";
const STORAGE_KEY_DETECTOR  = "rhema.detector.ativo";

function lerConfigHolyrics(): HolyricsConfigLocal | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HOLYRICS);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<HolyricsConfigLocal>;
    if (!parsed.token) return null;
    return {
      token: parsed.token,
      host: parsed.host || "localhost",
      port: parsed.port || "8091",
    };
  } catch {
    return null;
  }
}

export function VersiculosSugeridos({ transcricao, gravando }: Props) {
  const [detectorAtivo, setDetectorAtivo]     = useState(false);
  const [carregado, setCarregado]             = useState(false);
  const [holyricsConfigurado, setHolyricsConfigurado] = useState(false);
  const [agora, setAgora]                     = useState(Date.now());

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY_DETECTOR);
      setDetectorAtivo(salvo === "true");
    } catch { /* ignore */ }
    setHolyricsConfigurado(!!lerConfigHolyrics());
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (carregado) {
      localStorage.setItem(STORAGE_KEY_DETECTOR, detectorAtivo ? "true" : "false");
    }
  }, [detectorAtivo, carregado]);

  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const detectorRodando = detectorAtivo && gravando;

  const { sugestoes, analisando, ultimoErro, atualizarStatus, descartar } =
    useDetectorVersiculos(transcricao, detectorRodando);

  const exibirNoHolyrics = useCallback(
    async (s: SugestaoVersiculo) => {
      const cfg = lerConfigHolyrics();
      if (!cfg) {
        atualizarStatus(s.id, {
          status: "erro",
          erroMensagem: "Configure o Holyrics primeiro.",
        });
        return;
      }
      atualizarStatus(s.id, { status: "enviando", erroMensagem: undefined });
      try {
        const referencia = `${s.livro} ${s.capitulo}:${s.versiculo_inicio}${
          s.versiculo_fim !== s.versiculo_inicio ? `-${s.versiculo_fim}` : ""
        }`;
        const res = await fetch("/api/holyrics/exibir", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            referencia,
            token: cfg.token,
            host: cfg.host,
            port: Number(cfg.port) || 8091,
          }),
        });
        const data = (await res.json()) as { status: string; error?: string };
        if (data.status === "ok") {
          atualizarStatus(s.id, { status: "exibido" });
        } else {
          atualizarStatus(s.id, {
            status: "erro",
            erroMensagem: data.error || "Falha ao exibir",
          });
        }
      } catch (err) {
        atualizarStatus(s.id, {
          status: "erro",
          erroMensagem: err instanceof Error ? err.message : String(err),
        });
      }
    },
    [atualizarStatus],
  );

  const total   = sugestoes.length;
  const exibidos = sugestoes.filter((s) => s.status === "exibido").length;

  if (!carregado) return null;

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="rh-eyebrow">Versículos detectados</h2>
          {total > 0 && (
            <span className="text-xs" style={{ color: "var(--fg-3)" }}>
              {total} sugeridos · {exibidos} exibidos
            </span>
          )}
          {analisando && (
            <span
              className="text-xs"
              style={{
                color: "var(--luxo-aqua)",
                animation: "rh-breathe 2s ease infinite",
              }}
            >
              analisando…
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {!holyricsConfigurado && (
            <Link
              href="/config/holyrics"
              className="text-xs px-2.5 py-1 rounded-lg transition"
              style={{
                background: "rgba(245,158,11,0.08)",
                color: "#fcd34d",
                border: "1px solid rgba(245,158,11,0.3)",
              }}
            >
              ⚠ configurar Holyrics
            </Link>
          )}

          <label
            className="flex items-center gap-2 text-xs cursor-pointer select-none"
            style={{ color: "var(--fg-3)" }}
          >
            <input
              type="checkbox"
              checked={detectorAtivo}
              onChange={(e) => setDetectorAtivo(e.target.checked)}
              style={{ accentColor: "var(--luxo-aqua)" }}
            />
            Ativar detector
          </label>
        </div>
      </header>

      {detectorAtivo && !gravando && (
        <p className="text-xs italic" style={{ color: "var(--fg-3)" }}>
          O detector começa quando você iniciar a gravação.
        </p>
      )}

      {ultimoErro && (
        <div
          className="rounded-xl p-3 text-xs"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5",
          }}
        >
          Erro no detector: {ultimoErro}
        </div>
      )}

      {total === 0 && (
        <div
          className="rounded-xl p-6 text-center text-sm"
          style={{
            border: "1px dashed var(--border-default)",
            color: "var(--fg-3)",
          }}
        >
          {detectorAtivo
            ? "Nenhum versículo detectado ainda. Continue falando — a cada 20s o detector analisa a transcrição."
            : "Ative o detector para receber sugestões de versículos em tempo real."}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {sugestoes.slice(0, 5).map((s) => (
          <VersiculoCard
            key={s.id}
            sugestao={s}
            agora={agora}
            onExibir={exibirNoHolyrics}
            onDescartar={descartar}
          />
        ))}
      </div>
    </section>
  );
}
