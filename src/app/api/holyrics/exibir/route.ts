import { NextRequest, NextResponse } from "next/server";
import { exibirVersiculo, type HolyricsConfig } from "@/lib/holyrics-client";

export const runtime = "nodejs";
export const maxDuration = 10;

/**
 * POST /api/holyrics/exibir
 * Body: { referencia: string, token: string, host?: string, port?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      referencia?: string;
      token?: string;
      host?: string;
      port?: number;
    };

    if (!body.referencia || body.referencia.trim().length === 0) {
      return NextResponse.json(
        { status: "error", error: "Campo obrigatório: referencia" },
        { status: 400 }
      );
    }
    if (!body.token || body.token.trim().length === 0) {
      return NextResponse.json(
        { status: "error", error: "Campo obrigatório: token" },
        { status: 400 }
      );
    }

    const cfg: HolyricsConfig = {
      token: body.token,
      host: body.host,
      port: body.port,
    };

    const resultado = await exibirVersiculo(body.referencia, cfg);
    const httpStatus = resultado.status === "ok" ? 200 : 502;
    return NextResponse.json(resultado, { status: httpStatus });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { status: "error", error: msg },
      { status: 500 }
    );
  }
}
