import { NextRequest, NextResponse } from "next/server";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { CURADOR_SYSTEM_PROMPT } from "@/lib/prompts/curador";

export const runtime = "nodejs";
export const maxDuration = 120;

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
        { status: 400 }
      );
    }

    const userPrompt = `Transcrição da palavra da pastora (pode conter ruído/erros da transcrição automática — interprete o sentido):\n\n"""\n${transcricao}\n"""\n\nGere as 2 legendas conforme instruído. Responda apenas com o JSON.`;

    // Usa a assinatura local do Claude Code (sem API key)
    const iterator = query({
      prompt: userPrompt,
      options: {
        systemPrompt: {
          type: "preset",
          preset: "claude_code",
          append: CURADOR_SYSTEM_PROMPT,
        },
        allowedTools: [],
        settingSources: [],
      },
    });

    let textoResultado = "";
    for await (const message of iterator) {
      if (message.type === "result") {
        if (message.subtype === "success") {
          textoResultado = message.result;
        } else {
          return NextResponse.json(
            { erro: `Falha na execução: ${message.subtype}` },
            { status: 502 }
          );
        }
      }
    }

    if (!textoResultado) {
      return NextResponse.json(
        { erro: "SDK não retornou resultado." },
        { status: 502 }
      );
    }

    const jsonMatch = textoResultado.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        {
          erro: "Modelo não retornou JSON estruturado.",
          raw: textoResultado.slice(0, 500),
        },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]) as RespostaCurador;
    return NextResponse.json(parsed);
  } catch (err) {
    const mensagem = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: mensagem }, { status: 500 });
  }
}
