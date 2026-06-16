import { NextRequest, NextResponse } from "next/server";
import { testarConexao, type HolyricsConfig } from "@/features/rhema/lib/holyrics-client";

export const runtime = "nodejs";
export const maxDuration = 10;

/**
 * POST /api/holyrics/testar
 * Body: { token: string, host?: string, port?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      token?: string;
      host?: string;
      port?: number;
    };

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

    const resultado = await testarConexao(cfg);
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
