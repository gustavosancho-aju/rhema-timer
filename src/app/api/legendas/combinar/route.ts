import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { COMBINADOR_SYSTEM_PROMPT } from "@/features/rhema/lib/prompts/combinador";
import { montarBlocoFewShot } from "@/features/rhema/lib/prompts/few-shot";
import {
  getLegendasEscolhidas,
  getUltimaEscolhida,
  textoEscolhido,
} from "@/features/rhema/lib/gravacoes";
import { CULTO_LABELS } from "@/features/rhema/lib/gravacoes-types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6";

// POST /api/legendas/combinar
// Junta a última legenda escolhida do Sozo + a do Culto da Família e sintetiza
// uma legenda final de post (com few-shot das legendas já aprovadas).
export async function POST() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { erro: "ANTHROPIC_API_KEY não configurada no servidor." },
        { status: 500 },
      );
    }

    const [sozo, familia] = await Promise.all([
      getUltimaEscolhida("sozo"),
      getUltimaEscolhida("familia"),
    ]);
    const textoSozo = sozo ? textoEscolhido(sozo) : undefined;
    const textoFamilia = familia ? textoEscolhido(familia) : undefined;

    const faltando: string[] = [];
    if (!textoSozo) faltando.push(CULTO_LABELS.sozo);
    if (!textoFamilia) faltando.push(CULTO_LABELS.familia);
    if (faltando.length > 0) {
      return NextResponse.json(
        {
          erro: `Falta legenda escolhida de: ${faltando.join(" e ")}. Salve uma legenda escolhida de cada culto primeiro.`,
        },
        { status: 400 },
      );
    }

    const exemplos = await getLegendasEscolhidas(6);
    const systemPrompt = COMBINADOR_SYSTEM_PROMPT + montarBlocoFewShot(exemplos);

    const userPrompt = `Legenda escolhida do Sozo:\n"""\n${textoSozo}\n"""\n\nLegenda escolhida do Culto da Família:\n"""\n${textoFamilia}\n"""\n\nSintetize a legenda final do post. Responda apenas com o JSON.`;

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textoResultado = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const jsonMatch = textoResultado.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { erro: "Modelo não retornou JSON.", raw: textoResultado.slice(0, 300) },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      texto: string;
      justificativa?: string;
    };
    return NextResponse.json(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
