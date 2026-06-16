import { NextRequest, NextResponse } from "next/server";
import {
  createGravacao,
  isCultoTipo,
  listGravacoes,
} from "@/features/rhema/lib/gravacoes";
import type {
  CultoTipo,
  LegendaJson,
} from "@/features/rhema/lib/gravacoes-types";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cultoParam = searchParams.get("cultoTipo");
    const limitParam = searchParams.get("limit");

    const cultoTipo =
      cultoParam && isCultoTipo(cultoParam) ? cultoParam : undefined;
    const limit = limitParam ? Number(limitParam) : undefined;

    const gravacoes = await listGravacoes({
      cultoTipo,
      limit: Number.isFinite(limit) ? limit : undefined,
    });
    return NextResponse.json({ gravacoes });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      cultoTipo?: string;
      legendas?: LegendaJson[];
      duracaoMs?: number;
      escolhidaIdx?: number | null;
    };

    if (!isCultoTipo(body.cultoTipo)) {
      return NextResponse.json(
        { erro: "cultoTipo inválido (use sozo | familia | quarta)." },
        { status: 400 },
      );
    }
    if (!Array.isArray(body.legendas) || body.legendas.length === 0) {
      return NextResponse.json(
        { erro: "legendas é obrigatório e não pode ser vazio." },
        { status: 400 },
      );
    }

    const gravacao = await createGravacao({
      cultoTipo: body.cultoTipo as CultoTipo,
      legendas: body.legendas,
      duracaoMs: body.duracaoMs,
      escolhidaIdx: body.escolhidaIdx ?? null,
    });
    return NextResponse.json({ gravacao }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
