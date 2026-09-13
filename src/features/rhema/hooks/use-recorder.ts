"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Direcionamento = "emotiva" | "reflexiva" | "biblica";

export interface Legenda {
  texto: string;
  direcionamento: Direcionamento;
  justificativa: string;
}

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

export interface UseRecorderReturn {
  suportado: boolean | null;
  gravando: boolean;
  /** true enquanto o motor de fala caiu e está tentando reconectar sozinho
   * (rede instável, aba trocou de foco etc.) — usado pela UI pra avisar em
   * vez de deixar o "ao vivo" pulsando sem captar nada. */
  reconectando: boolean;
  textoFinal: string;
  textoInterim: string;
  decorrido: number;
  gerando: boolean;
  legendas: Legenda[] | null;
  erro: string | null;
  palavras: number;
  iniciar: () => void;
  parar: () => void;
  gerarLegendas: () => Promise<void>;
  limpar: () => void;
  setLegendas: (l: Legenda[] | null) => void;
}

/** Tentativas seguidas de reconexão antes de desistir e avisar o usuário. */
const MAX_TENTATIVAS_RECONEXAO = 4;

export function useRecorder(): UseRecorderReturn {
  const [suportado, setSuportado] = useState<boolean | null>(null);
  const [gravando, setGravando] = useState(false);
  const [reconectando, setReconectando] = useState(false);
  const [textoFinal, setTextoFinal] = useState("");
  const [textoInterim, setTextoInterim] = useState("");
  const [inicio, setInicio] = useState<number | null>(null);
  const [decorrido, setDecorrido] = useState(0);
  const [gerando, setGerando] = useState(false);
  const [legendas, setLegendas] = useState<Legenda[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const gravandoRef = useRef(false);
  const tentativasRef = useRef(0);

  useEffect(() => {
    queueMicrotask(() => setSuportado(!!getSpeechRecognitionCtor()));
  }, []);

  useEffect(() => {
    if (!gravando || inicio == null) return;
    const id = setInterval(() => setDecorrido(Date.now() - inicio), 1000);
    return () => clearInterval(id);
  }, [gravando, inicio]);

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
    setReconectando(false);
    tentativasRef.current = 0;
    const rec = new Ctor();
    rec.lang = "pt-BR";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      // Voltou a captar fala — a reconexão (se estava em curso) deu certo.
      tentativasRef.current = 0;
      setReconectando(false);

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
      // Erros silenciosos: sem fala / abortado pelo onend / network transitório
      if (e.error === "no-speech" || e.error === "aborted") return;

      // network: Chrome STT depende de servidor Google; geralmente intermitente.
      // O onend cuida do retry automático, então não mostramos erro ao usuário.
      if (e.error === "network") {
        console.warn("[recorder] erro de rede STT, tentando reconectar…");
        return;
      }

      const friendly: Record<string, string> = {
        "not-allowed":
          "Acesso ao microfone bloqueado. Clique no cadeado ao lado da URL e libere o microfone.",
        "service-not-allowed":
          "O navegador bloqueou a transcrição. Use HTTPS ou localhost no Chrome/Edge.",
        "audio-capture":
          "Não consegui acessar o microfone. Verifique se há um microfone conectado.",
        "language-not-supported":
          "Idioma pt-BR não suportado neste navegador. Use Chrome ou Edge atualizados.",
        "bad-grammar": "Erro interno na gramática de transcrição.",
      };
      setErro(friendly[e.error] ?? `Erro na transcrição: ${e.error}`);
    };

    // Desiste de vez: marca a gravação como parada de verdade e avisa alto —
    // nunca fica com "ao vivo" pulsando sem captar nada (auditoria UX
    // 2026-09-13: essa era a falha mais grave do app).
    function desistirDaReconexao() {
      gravandoRef.current = false;
      setGravando(false);
      setReconectando(false);
      setErro(
        "A transcrição caiu e não consegui reconectar sozinho. Clique em ▶ para tentar de novo.",
      );
    }

    rec.onend = () => {
      // Auto-restart enquanto o usuário ainda quer gravar
      if (recRef.current && gravandoRef.current) {
        tentativasRef.current += 1;
        if (tentativasRef.current > MAX_TENTATIVAS_RECONEXAO) {
          desistirDaReconexao();
          return;
        }
        setReconectando(true);
        try {
          recRef.current.start();
        } catch {
          // start() pode falhar logo após erro — tentar de novo após um tick
          setTimeout(() => {
            if (!recRef.current || !gravandoRef.current) return;
            try {
              recRef.current.start();
            } catch {
              desistirDaReconexao();
            }
          }, 250);
        }
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
    tentativasRef.current = 0;
    if (recRef.current) {
      try {
        recRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    setGravando(false);
    setReconectando(false);
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
    try {
      const r = await fetch("/api/legendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcricao: conteudo }),
      });
      const data = (await r.json()) as { legendas?: Legenda[]; erro?: string };
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

  const limpar = useCallback(() => {
    setTextoFinal("");
    setTextoInterim("");
    setLegendas(null);
    setErro(null);
    setDecorrido(0);
    setInicio(null);
  }, []);

  const palavras =
    textoFinal.trim().split(/\s+/).filter(Boolean).length +
    textoInterim.trim().split(/\s+/).filter(Boolean).length;

  return {
    suportado,
    gravando,
    reconectando,
    textoFinal,
    textoInterim,
    decorrido,
    gerando,
    legendas,
    erro,
    palavras,
    iniciar,
    parar,
    gerarLegendas,
    limpar,
    setLegendas,
  };
}
