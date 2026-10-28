import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  CURADOR_SYSTEM_PROMPT,
  montarUserPrompt,
} from "@/features/rhema/lib/prompts/curador";
import {
  NUCLEO_SYSTEM_PROMPT,
  parseJsonObjeto,
  sanitizarNucleo,
  type NucleoPregacao,
} from "@/features/rhema/lib/prompts/nucleo";
import { sanitizarVersiculos } from "@/features/rhema/lib/prompts/versiculos-contexto";
import { montarBlocoFewShot } from "@/features/rhema/lib/prompts/few-shot";
import { getExemplosFewShot } from "@/features/rhema/lib/gravacoes";

export const runtime = "nodejs";
export const maxDuration = 60;

// Opus 5: melhor qualidade editorial (líder em escrita criativa/tom). A
// geração de legendas roda poucas vezes por culto, então o custo extra
// frente ao Sonnet é irrelevante no volume desse uso.
const MODEL = "claude-opus-5";

// Etapa 1 (núcleo da pregação): leitura de texto longo e ruidoso, 1x por
// geração. Sonnet dá bom custo/qualidade e responde rápido.
const MODEL_NUCLEO = "claude-sonnet-5-5";

// Limite para a etapa de núcleo: se demorar, seguimos sem ela para não
// estourar o maxDuration da rota (a etapa é um reforço, não requisito).
const NUCLEO_TIMEOUT_MS = 20_000;

type LegendaSaida = {
  texto: string;
  direcionamento: "emotiva" | "reflexiva" | "biblica";
  justificativa: string;
};

type RespostaCurador = {
  legendas: LegendaSaida[];
  erro?: string;
};

/** Destila a pregação em tema/ideia central/frases fortes. null = segue sem. */
async function extrairNucleo(
  client: Anthropic,
  transcricao: string,
): Promise<NucleoPregacao | null> {
  try {
    const message = await client.messages.create(
      {
        model: MODEL_NUCLEO,
        max_tokens: 1200,
        system: NUCLEO_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Transcrição da pregação:\n\n"""\n${transcricao}\n"""\n\nExtraia o núcleo. Responda apenas com o JSON.`,
          },
        ],
      },
      { timeout: NUCLEO_TIMEOUT_MS, maxRetries: 0 },
    );
    const texto = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    return sanitizarNucleo(parseJsonObjeto(texto));
  } catch (err) {
    console.warn(
      "[legendas] etapa de núcleo falhou, seguindo sem ela:",
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { transcricao, versiculos } = (await req.json()) as {
      transcricao?: string;
      versiculos?: unknown;
    };

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

    const client = new Anthropic({ apiKey });

    // Núcleo da pregação e exemplos do líder são independentes: em paralelo.
    const [nucleo, exemplos] = await Promise.all([
      extrairNucleo(client, transcricao),
      getExemplosFewShot(6),
    ]);

    const userPrompt = montarUserPrompt({
      transcricao,
      nucleo,
      versiculos: sanitizarVersiculos(versiculos),
    });

    // Few-shot: o curador aprende com o que o líder escolheu (e contrasta com
    // o que ele deixou de lado no mesmo par).
    const systemPrompt =
      CURADOR_SYSTEM_PROMPT +
      montarBlocoFewShot(exemplos.aprovadas, exemplos.preteridas);

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 3072,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    // Se a resposta foi cortada por limite de tokens, o JSON vem incompleto.
    if (message.stop_reason === "max_tokens") {
      return NextResponse.json(
        { erro: "A resposta da IA veio longa demais e foi cortada. Tente gerar novamente." },
        { status: 502 },
      );
    }

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

    let parsed: RespostaCurador;
    try {
      parsed = JSON.parse(jsonMatch[0]) as RespostaCurador;
    } catch {
      return NextResponse.json(
        { erro: "A IA respondeu num formato inesperado. Tente gerar novamente." },
        { status: 502 },
      );
    }
    return NextResponse.json(parsed);
  } catch (err) {
    const mensagem = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { erro: `Falha ao gerar legendas: ${mensagem}. Tente novamente.` },
      { status: 500 },
    );
  }
}
