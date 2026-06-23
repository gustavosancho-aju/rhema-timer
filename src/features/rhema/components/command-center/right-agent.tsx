"use client";

import { useState } from "react";
import type { Legenda } from "@/features/rhema/hooks/use-recorder";
import { Badge, Dot, Eyebrow, Ico } from "@/shared/components/ui/primitives";
import {
  CULTO_LABELS,
  CULTO_TIPOS,
  type CultoTipo,
} from "@/features/rhema/lib/gravacoes-types";

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
  escolhidaIdx,
  onEscolher,
  cultoTipo,
  onCulto,
  onSalvar,
  salvo,
  salvando,
}: {
  legendas: Legenda[] | null;
  gerando: boolean;
  onGerar: () => void;
  disabled: boolean;
  transcricaoLen: number;
  palavras: number;
  geradoEm?: string;
  escolhidaIdx: number | null;
  onEscolher: (i: number | null) => void;
  cultoTipo: CultoTipo | "";
  onCulto: (t: CultoTipo | "") => void;
  onSalvar: () => void;
  salvo: boolean;
  salvando: boolean;
}) {
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

        <div style={{ marginTop: 12 }}>
          <AgentStatusLine
            gerando={gerando}
            legendas={legendas}
            palavras={palavras}
            transcricaoLen={transcricaoLen}
          />
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
            <CaptionCard
              key={i}
              caption={caption}
              index={i}
              escolhida={escolhidaIdx === i}
              onEscolher={() => onEscolher(escolhidaIdx === i ? null : i)}
            />
          ))}

          {legendas && (
            <SalvarBlock
              cultoTipo={cultoTipo}
              onCulto={onCulto}
              onSalvar={onSalvar}
              salvo={salvo}
              salvando={salvando}
              podeSalvar={escolhidaIdx != null && !!cultoTipo}
            />
          )}

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

function AgentStatusLine({
  gerando,
  legendas,
  palavras,
  transcricaoLen,
}: {
  gerando: boolean;
  legendas: Legenda[] | null;
  palavras: number;
  transcricaoLen: number;
}) {
  const n = legendas?.length ?? 0;
  const pronto = transcricaoLen >= 40;
  const dotBase = {
    width: 16,
    height: 16,
    borderRadius: "50%",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  return (
    <div className="flex items-center gap-2.5" style={{ fontSize: 13 }}>
      {gerando ? (
        <>
          <span
            style={{
              ...dotBase,
              border: "1px solid var(--luxo-glow)",
              boxShadow: "0 0 8px rgba(176,240,240,0.5)",
              animation: "rh-breathe 2s infinite",
            }}
          />
          <span style={{ color: "var(--fg-1)" }}>
            Lendo a palavra e criando direcionamentos
            <TypingDots />
          </span>
        </>
      ) : n > 0 ? (
        <>
          <span
            style={{
              ...dotBase,
              background: "rgba(176,240,240,0.1)",
              border: "1px solid rgba(176,240,240,0.4)",
              color: "var(--luxo-glow)",
            }}
          >
            <Ico.check />
          </span>
          <span style={{ color: "var(--fg-2)" }}>
            {n} direcionamento{n === 1 ? "" : "s"} gerado{n === 1 ? "" : "s"} ·
            pronto para revisar
          </span>
        </>
      ) : (
        <>
          <span
            style={{
              ...dotBase,
              border: `1px solid ${pronto ? "var(--luxo-glow)" : "var(--border-default)"}`,
            }}
          />
          <span style={{ color: "var(--fg-3)" }}>
            {pronto
              ? `Pronto para gerar · ${palavras.toLocaleString("pt-BR")} palavras`
              : "Aguardando a transcrição da palavra…"}
          </span>
        </>
      )}
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

function CaptionCard({
  caption,
  index,
  escolhida,
  onEscolher,
}: {
  caption: Legenda;
  index: number;
  escolhida: boolean;
  onEscolher: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [aberto, setAberto] = useState(false);
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
        border: escolhida
          ? "1px solid var(--luxo-aqua)"
          : "1px solid var(--border-subtle)",
        boxShadow: escolhida
          ? "0 0 0 1px var(--luxo-aqua), inset 0 1px 0 rgba(176,240,240,0.05)"
          : "inset 0 1px 0 rgba(176,240,240,0.05)",
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

      <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
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
        onClick={() => setAberto(true)}
        title="Ler a legenda completa"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textAlign: "left",
          background: "transparent",
          border: "none",
          padding: 0,
          width: "100%",
          cursor: "pointer",
          fontSize: 13,
          lineHeight: 1.6,
          color: "var(--fg-1)",
          whiteSpace: "pre-wrap",
          marginBottom: 12,
          letterSpacing: "-0.005em",
          fontFamily: "var(--font-sans)",
        }}
      >
        {caption.texto}
      </button>

      {/* Ações em linha própria — botões sempre completos */}
      <div
        className="flex flex-wrap items-center gap-2"
        style={{ marginBottom: 12 }}
      >
        <button
          type="button"
          onClick={() => setAberto(true)}
          title="Ler a legenda completa"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            height: 32,
            padding: "0 14px",
            borderRadius: 9999,
            background: "transparent",
            border: "1px solid var(--border-subtle)",
            color: "var(--fg-2)",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            transition: "all 240ms",
          }}
        >
          Ler
        </button>
        <button
          type="button"
          onClick={onEscolher}
          style={{
            flex: 1,
            minWidth: 130,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            height: 32,
            padding: "0 14px",
            borderRadius: 9999,
            background: escolhida ? "var(--luxo-aqua)" : "transparent",
            border: escolhida
              ? "1px solid var(--luxo-aqua)"
              : "1px solid var(--border-default)",
            color: escolhida ? "var(--luxo-void)" : "var(--fg-1)",
            fontSize: 12,
            fontWeight: escolhida ? 700 : 600,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            transition: "all 240ms",
          }}
        >
          {escolhida ? (
            <>
              <Ico.check /> Escolhida
            </>
          ) : (
            "Escolher esta"
          )}
        </button>
        <button
          type="button"
          onClick={copy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            height: 32,
            padding: "0 14px",
            borderRadius: 9999,
            background: copied ? "rgba(176,240,240,0.15)" : "transparent",
            border: copied
              ? "1px solid rgba(176,240,240,0.35)"
              : "1px solid var(--border-subtle)",
            color: copied ? "var(--luxo-glow)" : "var(--fg-2)",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            transition: "all 240ms",
          }}
        >
          {copied ? (
            <>
              <Ico.check /> Copiado
            </>
          ) : (
            <>
              <Ico.copy /> Copiar
            </>
          )}
        </button>
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

      {aberto && (
        <LegendaModal
          caption={caption}
          index={index}
          escolhida={escolhida}
          onEscolher={onEscolher}
          onClose={() => setAberto(false)}
        />
      )}
    </div>
  );
}

function LegendaModal({
  caption,
  index,
  escolhida,
  onEscolher,
  onClose,
}: {
  caption: Legenda;
  index: number;
  escolhida: boolean;
  onEscolher: () => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const style = DIRECTION_STYLES[caption.direcionamento];

  function copy() {
    navigator.clipboard?.writeText(caption.texto).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(2,16,20,0.72)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="thin-scroll"
        style={{
          width: "100%",
          maxWidth: 640,
          maxHeight: "82vh",
          overflowY: "auto",
          borderRadius: 20,
          background: "var(--bg-1, #06222a)",
          border: "1px solid var(--border-default)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          padding: 24,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: 12,
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
            onClick={onClose}
            aria-label="Fechar"
            style={{
              width: 32,
              height: 32,
              borderRadius: 9999,
              background: "var(--bg-2)",
              border: "1px solid var(--border-default)",
              color: "var(--fg-2)",
              fontSize: 16,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "var(--fg-1)",
            whiteSpace: "pre-wrap",
          }}
        >
          {caption.texto}
        </div>

        {caption.justificativa && (
          <div
            style={{
              marginTop: 16,
              paddingTop: 14,
              borderTop: "1px solid var(--border-subtle)",
              fontSize: 12,
              fontStyle: "italic",
              color: "var(--fg-3)",
            }}
          >
            {caption.justificativa}
          </div>
        )}

        <div
          className="flex items-center gap-2"
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <button
            type="button"
            onClick={onEscolher}
            className="rh-btn"
            style={{
              flex: 1,
              justifyContent: "center",
              background: escolhida ? "var(--luxo-aqua)" : "var(--bg-2)",
              border: `1px solid ${escolhida ? "var(--luxo-aqua)" : "var(--border-default)"}`,
              color: escolhida ? "var(--luxo-void)" : "var(--fg-1)",
              fontWeight: escolhida ? 700 : 500,
            }}
          >
            {escolhida ? "✓ Escolhida" : "Escolher esta"}
          </button>
          <button
            type="button"
            onClick={copy}
            className="rh-btn"
            style={{
              flex: 1,
              justifyContent: "center",
              background: "var(--bg-2)",
              border: "1px solid var(--border-default)",
              color: copied ? "var(--luxo-glow)" : "var(--fg-1)",
            }}
          >
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SalvarBlock({
  cultoTipo,
  onCulto,
  onSalvar,
  salvo,
  salvando,
  podeSalvar,
}: {
  cultoTipo: CultoTipo | "";
  onCulto: (t: CultoTipo | "") => void;
  onSalvar: () => void;
  salvo: boolean;
  salvando: boolean;
  podeSalvar: boolean;
}) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 14,
        background: "rgba(4,32,40,0.5)",
        border: "1px solid var(--border-default)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div className="flex flex-col" style={{ gap: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg-1)" }}>
          Salvar no histórico
        </span>
        <span style={{ fontSize: 11, color: "var(--fg-3)", lineHeight: 1.4 }}>
          Marque a legenda definitiva acima e escolha o culto.
        </span>
      </div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--fg-3)",
        }}
      >
        Tipo de culto
      </div>
      <div className="flex flex-wrap gap-1.5">
        {CULTO_TIPOS.map((tipo) => {
          const ativo = cultoTipo === tipo;
          return (
            <button
              key={tipo}
              type="button"
              onClick={() => onCulto(ativo ? "" : tipo)}
              style={{
                fontSize: 11,
                borderRadius: 9999,
                padding: "5px 12px",
                background: ativo ? "var(--luxo-aqua)" : "transparent",
                border: `1px solid ${ativo ? "var(--luxo-aqua)" : "var(--border-subtle)"}`,
                color: ativo ? "var(--luxo-void)" : "var(--fg-2)",
                fontWeight: ativo ? 700 : 500,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              {CULTO_LABELS[tipo]}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onSalvar}
        disabled={!podeSalvar || salvo || salvando}
        className="rh-btn rh-btn-ghost"
        style={{ width: "100%", borderRadius: 10 }}
      >
        {salvo
          ? "✓ Salvo no histórico"
          : salvando
            ? "Salvando…"
            : !podeSalvar
              ? "Escolha a legenda e o culto"
              : "Salvar no histórico"}
      </button>
    </div>
  );
}
