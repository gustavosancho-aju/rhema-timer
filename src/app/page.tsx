"use client";

import { useMemo, useState } from "react";
import { useRecorder } from "@/hooks/use-recorder";
import { TopBar } from "@/components/command-center/top-bar";
import { LeftRail } from "@/components/command-center/left-rail";
import { CenterTranscript } from "@/components/command-center/center-transcript";
import { RightAgent } from "@/components/command-center/right-agent";
import { VersiculosSugeridos } from "@/components/versiculos-sugeridos";

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
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

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
    await rec.gerarLegendas();
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    setGeneratedAt(`geradas ${pad(d.getHours())}:${pad(d.getMinutes())}`);
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
      </div>
    </div>
  );
}
