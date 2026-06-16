import { NextRequest, NextResponse } from "next/server";
import { setEscolhida } from "@/features/rhema/lib/gravacoes";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/gravacoes/[id] — marca a legenda escolhida (escolhidaIdx) ou limpa (null).
export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = (await req.json()) as { escolhidaIdx?: number | null };

    if (
      body.escolhidaIdx !== null &&
      (typeof body.escolhidaIdx !== "number" || body.escolhidaIdx < 0)
    ) {
      return NextResponse.json(
        { erro: "escolhidaIdx deve ser um índice >= 0 ou null." },
        { status: 400 },
      );
    }

    const gravacao = await setEscolhida(id, body.escolhidaIdx ?? null);
    if (!gravacao) {
      return NextResponse.json(
        { erro: "Gravação não encontrada." },
        { status: 404 },
      );
    }
    return NextResponse.json({ gravacao });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
