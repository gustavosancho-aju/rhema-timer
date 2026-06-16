"use client";

import { useState } from "react";
import type { Legenda } from "@/features/rhema/hooks/use-recorder";
import { Badge, Dot, Eyebrow, Ico } from "@/shared/components/ui/primitives";

type AgentStepStatus = "done" | "active" | "pending";

interface AgentStep {
  label: string;
  status: AgentStepStatus;
  detail: string;
}

const DIRECTION_STYLES: Record<
  Legenda["direcionamento"],
  { color: string; icon: "heart" | "brain"; label: string }
> = {
  emotiva: { color: "#8FD8DC", icon: "heart", label: "emotiva" },
  reflexiva: { color: "#1B5670", icon: "brain", label: "reflexiva" },
  biblica: { color: "#B0F0F0", icon: "brain", label: "bíblica" },
};

export function RightAgent({
  legendas,
  gerando,
  onGerar,
  disabled,
  transcricaoLen,
  palavras,
  geradoEm,
}: {
  legendas: Legenda[] | null;
  gerando: boolean;
  onGerar: () => void;
  disabled: boolean;
  transcricaoLen: number;
  palavras: number;
  geradoEm?: string;
}) {
  const steps: AgentStep[] = buildSteps({ gerando, legendas, transcricaoLen, palavras });

  return (
    <div className="flex flex-col gap-3.5" style={{ minHeight: 0 }}>
      <div
        style={{
          padding: "16px 18px",
          borderRadius: 16,
          background:
            "radial-gradient(240px 120px at 100% 0%, rgba(176,240,240,0.12), transparent 70%), rgba(4,32,40,0.6)",
          border: "1px solid var(--border-default)",
          boxShadow: "inset 0 1px 0 rgba(176,240,240,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, var(--luxo-glow), rgba(176,240,240,0.2))",
              boxShadow: "0 0 18px rgba(176,240,240,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "var(--luxo-void)",
              fontSize: 15,
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
            }}
          >
            C
          </div>
          <div className="flex-1">
            <div
              className="flex items-center gap-2"
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              Agente Curador
              {gerando ? (
                <Badge variant="live">pensando</Badge>
              ) : legendas ? (
                <Badge variant="gold">pronto</Badge>
              ) : (
                <Badge variant="neutral">em espera</Badge>
              )}
            </div>
            <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>
              Claude Sonnet 4.6 · treinado na linguagem da casa
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2" style={{ marginTop: 14 }}>
          {steps.map((s, i) => (
            <AgentStepRow key={i} {...s} />
          ))}
        </div>

        <button
          type="button"
          onClick={onGerar}
          disabled={disabled || gerando}
          className="rh-btn rh-btn-primary"
          style={{
            marginTop: 14,
            width: "100%",
            borderRadius: 12,
            padding: "0.75rem 1rem",
          }}
        >
          <Ico.sparkle />
          {gerando ? "Gerando legendas…" : "Gerar legendas"}
        </button>
      </div>

      <div
        className="flex flex-col gap-3"
        style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: "0 4px" }}
        >
          <Eyebrow>
            Legendas{legendas ? ` · ${legendas.length} direcionamentos` : ""}
          </Eyebrow>
          {geradoEm && (
            <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{geradoEm}</span>
          )}
        </div>
        <div
          className="thin-scroll flex flex-col gap-3"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            paddingRight: 2,
          }}
        >
          {!legendas && !gerando && (
            <div
              style={{
                height: 120,
                borderRadius: 12,
                border: "1px dashed var(--border-default)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--fg-3)",
                fontSize: 13,
                textAlign: "center",
                padding: 16,
              }}
            >
              Quando tiver transcrição suficiente, clique em{" "}
              <strong style={{ color: "var(--fg-2)", margin: "0 4px" }}>
                ✦ Gerar legendas
              </strong>{" "}
              para o curador ler a palavra.
            </div>
          )}

          {legendas?.map((caption, i) => (
            <CaptionCard key={i} caption={caption} index={i} />
          ))}

          {legendas && (
            <button
              type="button"
              onClick={onGerar}
              disabled={gerando || disabled}
              style={{
                height: 40,
                borderRadius: 12,
                background: "transparent",
                border: "1px dashed var(--border-default)",
                color: "var(--fg-3)",
                fontSize: 12,
                fontFamily: "var(--font-sans)",
                cursor: disabled || gerando ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: disabled || gerando ? 0.4 : 1,
              }}
            >
              <Ico.sparkle /> Gerar outra rodada
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function buildSteps({
  gerando,
  legendas,
  transcricaoLen,
  palavras,
}: {
  gerando: boolean;
  legendas: Legenda[] | null;
  transcricaoLen: number;
  palavras: number;
}): AgentStep[] {
  const hasText = transcricaoLen >= 40;

  if (!gerando && !legendas) {
    return [
      {
        label: hasText ? "Transcrição pronta para análise" : "Aguardando transcrição",
        status: hasText ? "done" : "pending",
        detail: `${palavras.toLocaleString("pt-BR")} palavras · ${transcricaoLen} caracteres`,
      },
      {
        label: "Identificar temas centrais",
        status: "pending",
        detail: "após primeira leitura",
      },
      {
        label: "Cruzar com linguagem da casa",
        status: "pending",
        detail: "referências internas",
      },
      {
        label: "Gerar direcionamentos",
        status: "pending",
        detail: "emotiva · reflexiva · bíblica",
      },
    ];
  }

  if (gerando) {
    return [
      { label: "Lendo a transcrição", status: "done", detail: `${palavras.toLocaleString("pt-BR")} palavras` },
      { label: "Identificando temas centrais", status: "done", detail: "análise semântica" },
      { label: "Cruzando com linguagem da casa", status: "active", detail: "tom e voz do ministério" },
      { label: "Gerando direcionamentos", status: "pending", detail: "emotiva · reflexiva" },
    ];
  }

  const n = legendas?.length ?? 0;
  return [
    { label: "Lendo a transcrição", status: "done", detail: `${palavras.toLocaleString("pt-BR")} palavras` },
    { label: "Identificando temas centrais", status: "done", detail: "temas extraídos" },
    { label: "Cruzando com linguagem da casa", status: "done", detail: "alinhamento concluído" },
    {
      label: "Direcionamentos gerados",
      status: "done",
      detail: `${n} opção${n === 1 ? "" : "es"} · pronto para revisar`,
    },
  ];
}

function AgentStepRow({ label, status, detail }: AgentStep) {
  const isDone = status === "done";
  const isActive = status === "active";
  return (
    <div className="flex items-start gap-2.5">
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          marginTop: 2,
          flexShrink: 0,
          background: isDone ? "rgba(176,240,240,0.1)" : "transparent",
          border: isDone
            ? "1px solid rgba(176,240,240,0.4)"
            : isActive
              ? "1px solid var(--luxo-glow)"
              : "1px solid var(--border-default)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--luxo-glow)",
          animation: isActive ? "rh-breathe 2s infinite" : "none",
          boxShadow: isActive ? "0 0 8px rgba(176,240,240,0.5)" : "none",
        }}
      >
        {isDone && <Ico.check />}
      </span>
      <div className="flex-1">
        <div
          style={{
            fontSize: 13,
            color: isActive ? "var(--fg-1)" : isDone ? "var(--fg-2)" : "var(--fg-3)",
            fontWeight: isActive ? 500 : 400,
          }}
        >
          {label}
          {isActive && <TypingDots />}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--fg-3)",
            marginTop: 2,
            fontFamily: "var(--font-mono)",
          }}
        >
          {detail}
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span
      className="inline-flex"
      style={{ gap: 3, marginLeft: 8, verticalAlign: "middle" }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "var(--luxo-glow)",
            boxShadow: "0 0 4px var(--luxo-glow)",
            animation: `rh-typing 1.2s ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function CaptionCard({ caption, index }: { caption: Legenda; index: number }) {
  const [copied, setCopied] = useState(false);
  const style = DIRECTION_STYLES[caption.direcionamento];
  const IconEl = style.icon === "heart" ? Ico.heart : Ico.brain;

  const chars = caption.texto.length;
  const words = caption.texto.trim().split(/\s+/).filter(Boolean).length;
  const hashtags = (caption.texto.match(/#\w+/g) ?? []).length;

  function copy() {
    navigator.clipboard?.writeText(caption.texto).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        background: "rgba(4,32,40,0.65)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "inset 0 1px 0 rgba(176,240,240,0.05)",
        transition: "all 240ms var(--ease-out-expo)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${style.color}, transparent 70%)`,
        }}
      />

      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 10 }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              borderRadius: 6,
              background: `${style.color}22`,
              color: style.color,
            }}
          >
            <IconEl />
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: style.color,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
            }}
          >
            {style.label}
          </span>
          <Badge variant="neutral" style={{ height: 20, fontSize: 10 }}>
            opção {index + 1}
          </Badge>
        </div>
        <button
          type="button"
          onClick={copy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: 28,
            padding: "0 10px",
            borderRadius: 9999,
            background: copied ? "rgba(176,240,240,0.15)" : "transparent",
            border: copied
              ? "1px solid rgba(176,240,240,0.35)"
              : "1px solid var(--border-subtle)",
            color: copied ? "var(--luxo-glow)" : "var(--fg-2)",
            fontSize: 11,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            transition: "all 240ms",
          }}
        >
          {copied ? (
            <>
              <Ico.check /> copiado
            </>
          ) : (
            <>
              <Ico.copy /> copiar
            </>
          )}
        </button>
      </div>

      <div
        style={{
          fontSize: 13,
          lineHeight: 1.6,
          color: "var(--fg-1)",
          whiteSpace: "pre-wrap",
          marginBottom: 12,
          letterSpacing: "-0.005em",
        }}
      >
        {caption.texto}
      </div>

      {caption.justificativa && (
        <div
          style={{
            fontSize: 11,
            fontStyle: "italic",
            color: "var(--fg-3)",
            padding: "10px 0 0",
            borderTop: "1px solid var(--border-subtle)",
            marginBottom: 10,
          }}
        >
          {caption.justificativa}
        </div>
      )}

      <div
        className="flex gap-2.5"
        style={{
          paddingTop: 10,
          borderTop: "1px solid var(--border-subtle)",
          fontSize: 10,
          color: "var(--fg-3)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.05em",
        }}
      >
        <span>{chars} car.</span>
        <Dot size={3} color="var(--fg-4)" />
        <span>{words} palavras</span>
        <Dot size={3} color="var(--fg-4)" />
        <span>hashtags: {hashtags}</span>
      </div>
    </div>
  );
}
