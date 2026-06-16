import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CURADOR_SYSTEM_PROMPT } from "@/features/rhema/lib/prompts/curador";
import { montarBlocoFewShot } from "@/features/rhema/lib/prompts/few-shot";
import { getLegendasEscolhidas } from "@/features/rhema/lib/gravacoes";

export const runtime = "nodejs";
export const maxDuration = 60;

// Sonnet 4.6: boa qualidade editorial com custo menor que Opus. A geração de
// legendas roda poucas vezes por culto.
const MODEL = "claude-sonnet-4-6";

type LegendaSaida = {
  texto: string;
  direcionamento: "emotiva" | "reflexiva" | "biblica";
  justificativa: string;
};

type RespostaCurador = {
  legendas: LegendaSaida[];
  erro?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { transcricao } = (await req.json()) as { transcricao?: string };

    if (!transcricao || transcricao.trim().length < 40) {
      return NextResponse.json(
        { erro: "Transcrição muito curta. Capture mais áudio antes de gerar." },
        { status: 400 },
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { erro: "ANTHROPIC_API_KEY não configurada no servidor." },
        { status: 500 },
      );
    }

    const userPrompt = `Transcrição da palavra da pastora (pode conter ruído/erros da transcrição automática — interprete o sentido):\n\n"""\n${transcricao}\n"""\n\nGere as 2 legendas conforme instruído. Responda apenas com o JSON.`;

    // Few-shot: o curador aprende com as legendas já escolhidas pelo líder.
    const exemplos = await getLegendasEscolhidas(6);
    const systemPrompt = CURADOR_SYSTEM_PROMPT + montarBlocoFewShot(exemplos);

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textoResultado = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    if (!textoResultado) {
      return NextResponse.json(
        { erro: "Modelo não retornou conteúdo." },
        { status: 502 },
      );
    }

    // O prompt instrui JSON-only, mas extraímos o objeto por segurança
    // (caso venha envolto em cercas de código).
    const jsonMatch = textoResultado.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        {
          erro: "Modelo não retornou JSON estruturado.",
          raw: textoResultado.slice(0, 500),
        },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(jsonMatch[0]) as RespostaCurador;
    return NextResponse.json(parsed);
  } catch (err) {
    const mensagem = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: mensagem }, { status: 500 });
  }
}
