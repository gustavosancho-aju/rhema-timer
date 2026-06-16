"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CultoTipo,
  GravacaoCliente,
  LegendaJson,
} from "@/features/rhema/lib/gravacoes-types";

export type { GravacaoCliente };

const LIMITE = 12;

export function useGravacoes() {
  const [historico, setHistorico] = useState<GravacaoCliente[]>([]);
  const [salvando, setSalvando] = useState(false);

  const recarregar = useCallback(async () => {
    try {
      const r = await fetch(`/api/gravacoes?limit=${LIMITE}`);
      if (!r.ok) return;
      const data = (await r.json()) as { gravacoes?: GravacaoCliente[] };
      setHistorico(data.gravacoes ?? []);
    } catch {
      /* offline / falha — mantém o estado atual */
    }
  }, []);

  // Carrega o histórico do servidor no mount (busca assíncrona; o setState
  // ocorre só após o fetch resolver, não no corpo do efeito).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void recarregar();
  }, [recarregar]);

  const salvar = useCallback(
    async (input: {
      cultoTipo: CultoTipo;
      legendas: LegendaJson[];
      escolhidaIdx: number | null;
      duracaoMs: number;
    }): Promise<boolean> => {
      setSalvando(true);
      try {
        const r = await fetch("/api/gravacoes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!r.ok) return false;
        await recarregar();
        return true;
      } catch {
        return false;
      } finally {
        setSalvando(false);
      }
    },
    [recarregar],
  );

  return { historico, salvando, salvar, recarregar };
}
