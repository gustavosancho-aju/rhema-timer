import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { DETECTOR_BIBLICO_SYSTEM_PROMPT } from "@/features/rhema/lib/prompts/detector-biblico";

export const runtime = "nodejs";
export const maxDuration = 30;

// Endpoint de alta frequência (a cada ~20s durante o culto). Haiku é rápido e
// barato — ideal para esta classificação em tempo real.
const MODEL = "claude-haiku-4-5";

/**
 * POST /api/detectar-versiculo
 *
 * Recebe uma janela de transcrição (~10-20s de fala) e retorna:
 * - { detectou: true, livro, capitulo, versiculo_inicio, versiculo_fim, texto_sugerido, confianca, tipo, justificativa }
 * - { detectou: false } quando não há versículo reconhecível
 *
 * Threshold mínimo de confiança: 0.70 (abaixo disso força detectou=false)
 */

type DeteccaoPositiva = {
  detectou: true;
  livro: string;
  capitulo: number;
  versiculo_inicio: number;
  versiculo_fim: number;
  texto_sugerido: string;
  confianca: number;
  tipo: "citacao_direta" | "alusao";
  justificativa: string;
};

type DeteccaoNegativa = {
  detectou: false;
};

type Deteccao = DeteccaoPositiva | DeteccaoNegativa;

const CONFIANCA_MINIMA = 0.7;
const TRANSCRICAO_MINIMA_CHARS = 20;

export async function POST(req: NextRequest) {
  try {
    const { transcricao } = (await req.json()) as { transcricao?: string };

    if (!transcricao || transcricao.trim().length < TRANSCRICAO_MINIMA_CHARS) {
      return NextResponse.json(
        { detectou: false, erro: "Trecho muito curto para análise." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { detectou: false, erro: "ANTHROPIC_API_KEY não configurada no servidor." },
        { status: 500 }
      );
    }

    const userPrompt = `Janela de transcrição (últimos ~20s de fala):\n\n"""\n${transcricao.trim()}\n"""\n\nAnalise e responda apenas com o JSON conforme instruído.`;

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1000,
      system: DETECTOR_BIBLICO_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textoResultado = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    if (!textoResultado) {
      return NextResponse.json(
        { detectou: false, erro: "Modelo não retornou conteúdo." },
        { status: 502 }
      );
    }

    const jsonMatch = textoResultado.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        {
          detectou: false,
          erro: "Modelo não retornou JSON estruturado.",
          raw: textoResultado.slice(0, 300),
        },
        { status: 502 }
      );
    }

    let parsed: Deteccao;
    try {
      parsed = JSON.parse(jsonMatch[0]) as Deteccao;
    } catch {
      return NextResponse.json(
        { detectou: false, erro: "JSON inválido do modelo." },
        { status: 502 }
      );
    }

    // Se detectou mas confiança abaixo do threshold, converte em negativa
    if (parsed.detectou === true && parsed.confianca < CONFIANCA_MINIMA) {
      return NextResponse.json({ detectou: false });
    }

    // Validação mínima da estrutura positiva
    if (parsed.detectou === true) {
      const camposObrigatorios = [
        "livro",
        "capitulo",
        "versiculo_inicio",
        "versiculo_fim",
        "texto_sugerido",
        "confianca",
        "tipo",
      ] as const;
      for (const campo of camposObrigatorios) {
        if (parsed[campo] === undefined || parsed[campo] === null) {
          return NextResponse.json(
            { detectou: false, erro: `Campo obrigatório ausente: ${campo}` },
            { status: 502 }
          );
        }
      }
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const mensagem = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { detectou: false, erro: mensagem },
      { status: 500 }
    );
  }
}
