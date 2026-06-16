"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VersiculosSugeridos } from "@/features/rhema/components/versiculos-sugeridos";
import { HistoricoGravacoes } from "@/features/rhema/components/historico-gravacoes";
import { useHistoricoGravacoes } from "@/features/rhema/hooks/use-historico-gravacoes";
import type {
  Direcionamento,
  Legenda,
} from "@/features/rhema/lib/historico-gravacoes";

type RespostaApi = {
  legendas?: Legenda[];
  erro?: string;
};

type SpeechRecognitionAlternative = { transcript: string; confidence: number };
type SpeechRecognitionResult = {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
  length: number;
};
type SpeechRecognitionResultList = {
  length: number;
  item: (i: number) => SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
};
type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};
type SpeechRecognitionErrorEventLike = { error: string; message?: string };

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const direcionamentoStyles: Record<
  Direcionamento,
  { bg: string; text: string; border: string; label: string }
> = {
  emotiva: {
    bg: "rgba(239,68,68,0.1)",
    text: "#fca5a5",
    border: "rgba(239,68,68,0.3)",
    label: "Emotiva",
  },
  reflexiva: {
    bg: "rgba(245,158,11,0.1)",
    text: "#fcd34d",
    border: "rgba(245,158,11,0.3)",
    label: "Reflexiva",
  },
  biblica: {
    bg: "rgba(143,216,220,0.12)",
    text: "var(--luxo-aqua)",
    border: "rgba(143,216,220,0.35)",
    label: "Bíblica",
  },
};

export default function Recorder() {
  const [suportado, setSuportado] = useState<boolean | null>(null);
  const [gravando, setGravando] = useState(false);
  const [textoFinal, setTextoFinal] = useState("");
  const [textoInterim, setTextoInterim] = useState("");
  const [inicio, setInicio] = useState<number | null>(null);
  const [decorrido, setDecorrido] = useState(0);
  const [gerando, setGerando] = useState(false);
  const [legendas, setLegendas] = useState<Legenda[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const transcritoRef = useRef<HTMLDivElement | null>(null);
  const gravandoRef = useRef(false);

  const { historico, salvar: salvarGravacao, limparHistorico } =
    useHistoricoGravacoes();
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    // Detecção de capacidade do browser (SpeechRecognition) só existe no
    // cliente; precisa rodar no mount para não divergir do HTML do servidor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuportado(!!getSpeechRecognitionCtor());
  }, []);

  useEffect(() => {
    if (!gravando || inicio == null) return;
    const id = setInterval(() => setDecorrido(Date.now() - inicio), 1000);
    return () => clearInterval(id);
  }, [gravando, inicio]);

  useEffect(() => {
    if (transcritoRef.current) {
      transcritoRef.current.scrollTop = transcritoRef.current.scrollHeight;
    }
  }, [textoFinal, textoInterim]);

  useEffect(() => {
    gravandoRef.current = gravando;
  }, [gravando]);

  const iniciar = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setErro("Navegador não suporta Web Speech API. Use Chrome ou Edge.");
      return;
    }
    setErro(null);
    setLegendas(null);
    const rec = new Ctor();
    rec.lang = "pt-BR";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let interim = "";
      let finalAdd = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const t = r[0]?.transcript ?? "";
        if (r.isFinal) finalAdd += t + " ";
        else interim += t;
      }
      if (finalAdd) setTextoFinal((prev) => (prev + finalAdd).trimStart());
      setTextoInterim(interim);
    };

    rec.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      setErro(`Erro na transcrição: ${e.error}`);
    };

    rec.onend = () => {
      if (recRef.current && gravandoRef.current) {
        try { recRef.current.start(); } catch { /* ignore */ }
      }
    };

    recRef.current = rec;
    gravandoRef.current = true;
    rec.start();
    setGravando(true);
    setInicio(Date.now());
    setDecorrido(0);
  }, []);

  const parar = useCallback(() => {
    gravandoRef.current = false;
    if (recRef.current) {
      try { recRef.current.stop(); } catch { /* ignore */ }
    }
    setGravando(false);
  }, []);

  const gerarLegendas = useCallback(async () => {
    const conteudo = (textoFinal + " " + textoInterim).trim();
    if (conteudo.length < 40) {
      setErro("Transcrição muito curta pra gerar legendas.");
      return;
    }
    setErro(null);
    setGerando(true);
    setLegendas(null);
    setSalvo(false);
    try {
      const r = await fetch("/api/legendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcricao: conteudo }),
      });
      const data = (await r.json()) as RespostaApi;
      if (!r.ok || data.erro) {
        setErro(data.erro ?? `Erro ${r.status}`);
      } else if (data.legendas) {
        setLegendas(data.legendas);
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setGerando(false);
    }
  }, [textoFinal, textoInterim]);

  const copiar = (texto: string) => {
    navigator.clipboard.writeText(texto).catch(() => {});
  };

  const salvarNoHistorico = useCallback(() => {
    if (!legendas || legendas.length === 0) return;
    salvarGravacao(legendas, decorrido);
    setSalvo(true);
  }, [legendas, decorrido, salvarGravacao]);

  const restaurar = useCallback((legendasSalvas: Legenda[]) => {
    setLegendas(legendasSalvas);
    setErro(null);
  }, []);

  const limpar = () => {
    setTextoFinal("");
    setTextoInterim("");
    setLegendas(null);
    setErro(null);
    setDecorrido(0);
    setInicio(null);
    setSalvo(false);
  };

  const formatarTempo = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controles */}
      <section className="flex flex-wrap items-center gap-3">
        {!gravando ? (
          <button
            onClick={iniciar}
            disabled={suportado === false}
            className="rh-btn rh-btn-danger"
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#fff",
                display: "inline-block",
              }}
            />
            Iniciar gravação
          </button>
        ) : (
          <button
            onClick={parar}
            className="rh-btn"
            style={{
              background: "var(--fg-1)",
              color: "var(--luxo-void)",
              padding: "0.625rem 1.25rem",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: "#dc2626",
                display: "inline-block",
                animation: "rh-pulse 1.2s ease infinite",
              }}
            />
            Parar
          </button>
        )}

        <button
          onClick={gerarLegendas}
          disabled={gerando || gravando || textoFinal.trim().length < 40}
          className="rh-btn rh-btn-primary"
        >
          {gerando ? "Gerando legendas…" : "✦ Gerar legendas"}
        </button>

        <button
          onClick={salvarNoHistorico}
          disabled={!legendas || legendas.length === 0 || salvo}
          className="rh-btn rh-btn-ghost"
        >
          {salvo ? "✓ Salvo" : "Salvar no histórico"}
        </button>

        <button
          onClick={limpar}
          disabled={gravando}
          className="rh-btn rh-btn-ghost"
        >
          Limpar
        </button>

        <div
          className="ml-auto flex items-center gap-3 text-sm tabular-nums font-mono"
          style={{ color: "var(--fg-3)" }}
        >
          {gravando && (
            <span className="flex items-center gap-2" style={{ color: "var(--luxo-glow)" }}>
              <span className="rh-live-dot" />
              ao vivo
            </span>
          )}
          <span>{formatarTempo(decorrido)}</span>
        </div>
      </section>

      {suportado === false && (
        <div
          className="rounded-xl p-4 text-sm"
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.3)",
            color: "#fcd34d",
          }}
        >
          Seu navegador não suporta a Web Speech API. Use{" "}
          <strong>Chrome</strong> ou <strong>Edge</strong> no desktop.
        </div>
      )}

      {erro && (
        <div
          className="rounded-xl p-4 text-sm"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5",
          }}
        >
          {erro}
        </div>
      )}

      {/* Layout em 2 colunas: transcrição + legendas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transcrição */}
        <section className="flex flex-col gap-3">
          <h2 className="rh-eyebrow">Transcrição ao vivo</h2>
          <div
            ref={transcritoRef}
            className="thin-scroll overflow-y-auto leading-relaxed"
            style={{
              height: "60vh",
              background: "var(--bg-glass)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              color: "var(--fg-2)",
            }}
          >
            <p className="whitespace-pre-wrap">
              {textoFinal}
              <span style={{ color: "var(--fg-4)" }}>{textoInterim}</span>
              {!textoFinal && !textoInterim && (
                <span style={{ color: "var(--fg-4)" }}>
                  Clique em &ldquo;Iniciar gravação&rdquo; e permita o acesso ao microfone.
                </span>
              )}
            </p>
          </div>
        </section>

        {/* Legendas */}
        <section className="flex flex-col gap-3">
          <h2 className="rh-eyebrow">Legendas geradas</h2>
          <div className="flex flex-col gap-4">
            {!legendas && !gerando && (
              <div
                className="rounded-xl p-8 text-center text-sm"
                style={{
                  border: "1px dashed var(--border-default)",
                  color: "var(--fg-3)",
                }}
              >
                Quando parar a gravação, clique em{" "}
                <strong style={{ color: "var(--fg-2)" }}>✦ Gerar legendas</strong>.
              </div>
            )}
            {gerando && (
              <div
                className="rounded-xl p-8 text-center text-sm"
                style={{
                  background: "var(--bg-glass)",
                  border: "1px solid var(--border-default)",
                  color: "var(--luxo-aqua)",
                  animation: "rh-breathe 2s ease infinite",
                }}
              >
                Curador analisando a palavra…
              </div>
            )}
            {legendas?.map((l, i) => {
              const style = direcionamentoStyles[l.direcionamento];
              return (
                <article
                  key={i}
                  className="rh-card flex flex-col gap-3 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: style.bg,
                        color: style.text,
                        border: `1px solid ${style.border}`,
                      }}
                    >
                      {style.label}
                    </span>
                    <button
                      onClick={() => copiar(l.texto)}
                      className="text-xs rounded-lg px-3 py-1.5 transition"
                      style={{
                        background: "var(--bg-2)",
                        border: "1px solid var(--border-default)",
                        color: "var(--fg-2)",
                      }}
                    >
                      Copiar
                    </button>
                  </div>
                  <p
                    className="whitespace-pre-wrap leading-relaxed"
                    style={{ color: "var(--fg-1)" }}
                  >
                    {l.texto}
                  </p>
                  {l.justificativa && (
                    <p
                      className="text-xs italic pt-2"
                      style={{
                        color: "var(--fg-3)",
                        borderTop: "1px solid var(--border-subtle)",
                      }}
                    >
                      {l.justificativa}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* Detector de versículos */}
      <VersiculosSugeridos
        transcricao={(textoFinal + " " + textoInterim).trim()}
        gravando={gravando}
      />

      {/* Histórico das últimas gravações */}
      <HistoricoGravacoes
        historico={historico}
        onRestaurar={(g) => restaurar(g.legendas)}
        onLimpar={limparHistorico}
      />
    </div>
  );
}
