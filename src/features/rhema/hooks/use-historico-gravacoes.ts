"use client";

import { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import {
  adicionarGravacao,
  carregarHistorico,
  salvarHistorico,
  type GravacaoSalva,
  type Legenda,
} from "@/features/rhema/lib/historico-gravacoes";

export function useHistoricoGravacoes() {
  const [historico, setHistorico] = useState<GravacaoSalva[]>([]);

  // Carrega do localStorage no mount (client-only — evita mismatch de SSR).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setHistorico(carregarHistorico()), []);

  const salvar = useCallback((legendas: Legenda[], duracaoMs: number) => {
    const nova: GravacaoSalva = {
      id: nanoid(),
      salvaEm: Date.now(),
      duracaoMs,
      legendas,
    };
    setHistorico((prev) => {
      const proximo = adicionarGravacao(prev, nova);
      salvarHistorico(proximo);
      return proximo;
    });
  }, []);

  const limparHistorico = useCallback(() => {
    setHistorico([]);
    salvarHistorico([]);
  }, []);

  return { historico, salvar, limparHistorico };
}
