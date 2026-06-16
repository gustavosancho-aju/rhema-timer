"use client";

import { useMemo, useState } from "react";
import { useRecorder } from "@/features/rhema/hooks/use-recorder";
import { useGravacoes } from "@/features/rhema/hooks/use-gravacoes";
import { TopBar } from "@/features/rhema/components/command-center/top-bar";
import { LeftRail } from "@/features/rhema/components/command-center/left-rail";
import { CenterTranscript } from "@/features/rhema/components/command-center/center-transcript";
import { RightAgent } from "@/features/rhema/components/command-center/right-agent";
import { VersiculosSugeridos } from "@/features/rhema/components/versiculos-sugeridos";
import { HistoricoGravacoes } from "@/features/rhema/components/historico-gravacoes";
import type {
  CultoTipo,
  GravacaoCliente,
} from "@/features/rhema/lib/gravacoes-types";

const STOP_WORDS = new Set([
  "a","o","as","os","e","é","de","do","da","dos","das","em","um","uma","uns","umas",
  "para","por","com","sem","que","qual","quais","se","ao","à","às","aos","mas",
  "ou","não","sim","já","mais","menos","muito","muita","muitos","muitas","este",
  "esta","estes","estas","esse","essa","esses","essas","isso","aquilo","ele","ela",
  "eles","elas","eu","tu","nós","vós","você","vocês","seu","sua","seus","suas",
  "meu","minha","nosso","nossa","foi","ser","são","está","estão","tem","tinha",
  "ter","quando","onde","como","porque","então","assim","até","sobre",
]);

function extractKeywords(texto: string, limit = 5): string[] {
  if (!texto) return [];
  const counts = new Map<string, number>();
  for (const raw of texto.toLowerCase().split(/[^a-záàâãéèêíïóôõöúçñ]+/i)) {
    const w = raw.trim();
    if (!w || w.length < 4 || STOP_WORDS.has(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

export default function Home() {
  const rec = useRecorder();
  const { historico, salvando, salvar } = useGravacoes();
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [cultoTipo, setCultoTipo] = useState<CultoTipo | "">("");
  const [escolhidaIdx, setEscolhidaIdx] = useState<number | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [postFinal, setPostFinal] = useState<{
    texto: string;
    justificativa?: string;
  } | null>(null);
  const [gerandoPost, setGerandoPost] = useState(false);
  const [erroPost, setErroPost] = useState<string | null>(null);

  const transcricao = useMemo(
    () => (rec.textoFinal + " " + rec.textoInterim).trim(),
    [rec.textoFinal, rec.textoInterim],
  );

  const keywords = useMemo(() => extractKeywords(transcricao), [transcricao]);

  function handleToggle() {
    if (rec.gravando) {
      rec.parar();
    } else {
      setStartedAt(Date.now());
      rec.iniciar();
    }
  }

  async function handleGerar() {
    setEscolhidaIdx(null);
    setSalvo(false);
    await rec.gerarLegendas();
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    setGeneratedAt(`geradas ${pad(d.getHours())}:${pad(d.getMinutes())}`);
  }

  async function salvarNoHistorico() {
    if (!rec.legendas || !cultoTipo || escolhidaIdx == null) return;
    const ok = await salvar({
      cultoTipo,
      legendas: rec.legendas,
      escolhidaIdx,
      duracaoMs: rec.decorrido,
    });
    if (ok) setSalvo(true);
  }

  function restaurar(g: GravacaoCliente) {
    rec.setLegendas(g.legendas);
    setCultoTipo(g.cultoTipo);
    setEscolhidaIdx(g.escolhidaIdx);
    setSalvo(false);
  }

  async function gerarPostDomingo() {
    setGerandoPost(true);
    setErroPost(null);
    setPostFinal(null);
    try {
      const r = await fetch("/api/legendas/combinar", { method: "POST" });
      const data = (await r.json()) as {
        texto?: string;
        justificativa?: string;
        erro?: string;
      };
      if (!r.ok || data.erro || !data.texto) {
        setErroPost(data.erro ?? `Erro ${r.status}`);
      } else {
        setPostFinal({ texto: data.texto, justificativa: data.justificativa });
      }
    } catch (e) {
      setErroPost(e instanceof Error ? e.message : String(e));
    } finally {
      setGerandoPost(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-0)",
        color: "var(--fg-1)",
        fontFamily: "var(--font-sans)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="rh-atmo" />
      <div className="rh-atmo-noise" />

      <div style={{ position: "relative", zIndex: 1 }}>
        <TopBar active="live" extraLinks={[{ label: "Timer", href: "/timer" }]} />

        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: "260px 1fr 420px",
            padding: "20px 28px 28px",
            height: "calc(100vh - 72px)",
            minHeight: 700,
          }}
        >
          <LeftRail
            gravando={rec.gravando}
            decorridoMs={rec.decorrido}
            palavras={rec.palavras}
            titulo={rec.gravando || transcricao ? "Sessão atual" : "Nenhuma sessão ativa"}
            subtitulo={
              rec.gravando || transcricao
                ? { texto: "Palavra ao vivo", autor: "pt-BR · Web Speech" }
                : undefined
            }
          />

          <CenterTranscript
            gravando={rec.gravando}
            decorridoMs={rec.decorrido}
            textoFinal={rec.textoFinal}
            textoInterim={rec.textoInterim}
            startedAt={startedAt}
            onToggle={handleToggle}
            keywords={keywords}
          />

          <RightAgent
            legendas={rec.legendas}
            gerando={rec.gerando}
            onGerar={handleGerar}
            disabled={rec.gravando || transcricao.length < 40}
            transcricaoLen={transcricao.length}
            palavras={rec.palavras}
            geradoEm={rec.legendas ? generatedAt ?? undefined : undefined}
            escolhidaIdx={escolhidaIdx}
            onEscolher={setEscolhidaIdx}
            cultoTipo={cultoTipo}
            onCulto={setCultoTipo}
            onSalvar={salvarNoHistorico}
            salvo={salvo}
            salvando={salvando}
          />
        </div>

        {rec.erro && (
          <div
            className="rh-card"
            style={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "12px 20px",
              maxWidth: 560,
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.35)",
              color: "#fca5a5",
              fontSize: 13,
              zIndex: 10,
            }}
          >
            {rec.erro}
          </div>
        )}

        {rec.suportado === false && (
          <div
            className="rh-card"
            style={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "12px 20px",
              maxWidth: 560,
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.3)",
              color: "#fcd34d",
              fontSize: 13,
              zIndex: 10,
            }}
          >
            Seu navegador não suporta a Web Speech API. Use <strong>Chrome</strong> ou{" "}
            <strong>Edge</strong> no desktop.
          </div>
        )}

        {(rec.gravando || transcricao) && (
          <div style={{ padding: "0 28px 28px", position: "relative" }}>
            <VersiculosSugeridos transcricao={transcricao} gravando={rec.gravando} />
          </div>
        )}

        <div
          style={{ padding: "0 28px 36px", position: "relative" }}
          className="flex flex-col gap-6"
        >
          {/* Post do domingo: combina a última escolhida do Sozo + do Culto da Família */}
          <section className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="rh-eyebrow">Post do domingo</h2>
              <button
                onClick={gerarPostDomingo}
                disabled={gerandoPost}
                className="rh-btn rh-btn-primary"
              >
                {gerandoPost ? "Combinando…" : "✦ Gerar post do domingo"}
              </button>
            </div>
            {erroPost && (
              <div
                className="rounded-xl p-4 text-sm"
                style={{
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  color: "#fcd34d",
                }}
              >
                {erroPost}
              </div>
            )}
            {postFinal && (
              <article className="rh-card flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(143,216,220,0.12)",
                      color: "var(--luxo-aqua)",
                      border: "1px solid rgba(143,216,220,0.35)",
                    }}
                  >
                    Legenda final
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard?.writeText(postFinal.texto).catch(() => {})
                    }
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
                  {postFinal.texto}
                </p>
                {postFinal.justificativa && (
                  <p
                    className="text-xs italic pt-2"
                    style={{
                      color: "var(--fg-3)",
                      borderTop: "1px solid var(--border-subtle)",
                    }}
                  >
                    {postFinal.justificativa}
                  </p>
                )}
              </article>
            )}
          </section>

          <HistoricoGravacoes historico={historico} onRestaurar={restaurar} />
        </div>
      </div>
    </div>
  );
}
