"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  RespostaDetector,
  SugestaoVersiculo,
  VersiculoDetectado,
} from "@/lib/types";

/**
 * Hook que periodicamente analisa a transcrição em busca de versículos bíblicos.
 *
 * Comportamento:
 * - A cada 20 segundos, envia uma janela dos últimos ~800 chars para /api/detectar-versiculo
 * - Dedupe: se mesma referência (livro/cap/versículo) foi detectada nos últimos 60s, ignora
 * - Retorna a lista de sugestões e funções para atualizar status (exibido, erro, descartado)
 *
 * @param transcricao texto completo da transcrição
 * @param ativo se true, roda o polling; se false, pausa
 */

const INTERVALO_POLLING_MS = 20_000;
const JANELA_CHARS = 800;
const DEDUPE_TTL_MS = 60_000;
const TRANSCRICAO_MINIMA_CHARS = 40;

function refId(v: VersiculoDetectado): string {
  return `${v.livro}-${v.capitulo}-${v.versiculo_inicio}-${v.versiculo_fim}`;
}

export function useDetectorVersiculos(
  transcricao: string,
  ativo: boolean
) {
  const [sugestoes, setSugestoes] = useState<SugestaoVersiculo[]>([]);
  const [analisando, setAnalisando] = useState(false);
  const [ultimoErro, setUltimoErro] = useState<string | null>(null);

  const transcricaoRef = useRef(transcricao);
  const ativoRef = useRef(ativo);
  const analisandoRef = useRef(false);

  useEffect(() => {
    transcricaoRef.current = transcricao;
  }, [transcricao]);
  useEffect(() => {
    ativoRef.current = ativo;
  }, [ativo]);

  const analisarAgora = useCallback(async () => {
    if (analisandoRef.current) return;
    const textoAtual = transcricaoRef.current;
    const janela = textoAtual.slice(-JANELA_CHARS).trim();
    if (janela.length < TRANSCRICAO_MINIMA_CHARS) return;

    analisandoRef.current = true;
    setAnalisando(true);
    setUltimoErro(null);

    try {
      const res = await fetch("/api/detectar-versiculo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcricao: janela }),
      });
      const data = (await res.json()) as RespostaDetector;

      if (data.detectou === true) {
        const id = refId(data);
        const agora = Date.now();

        setSugestoes((prev) => {
          // Dedupe: mesma ref nos últimos 60s → ignora
          const recenteMesmaRef = prev.find(
            (s) => refId(s) === id && agora - s.detectadoEm < DEDUPE_TTL_MS
          );
          if (recenteMesmaRef) return prev;

          const nova: SugestaoVersiculo = {
            ...data,
            id: `${id}-${agora}`,
            detectadoEm: agora,
            status: "pendente",
          };
          return [nova, ...prev].slice(0, 20); // limita histórico em memória
        });
      }
    } catch (err) {
      setUltimoErro(err instanceof Error ? err.message : String(err));
    } finally {
      analisandoRef.current = false;
      setAnalisando(false);
    }
  }, []);

  // Polling
  useEffect(() => {
    if (!ativo) return;
    const id = setInterval(() => {
      if (ativoRef.current) void analisarAgora();
    }, INTERVALO_POLLING_MS);
    return () => clearInterval(id);
  }, [ativo, analisarAgora]);

  const atualizarStatus = useCallback(
    (
      sugestaoId: string,
      patch: Partial<Pick<SugestaoVersiculo, "status" | "erroMensagem">>
    ) => {
      setSugestoes((prev) =>
        prev.map((s) => (s.id === sugestaoId ? { ...s, ...patch } : s))
      );
    },
    []
  );

  const descartar = useCallback((sugestaoId: string) => {
    setSugestoes((prev) => prev.filter((s) => s.id !== sugestaoId));
  }, []);

  const limpar = useCallback(() => {
    setSugestoes([]);
    setUltimoErro(null);
  }, []);

  return {
    sugestoes,
    analisando,
    ultimoErro,
    atualizarStatus,
    descartar,
    limpar,
    analisarAgora,
  };
}
