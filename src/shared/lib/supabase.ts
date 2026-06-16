"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente Supabase para o browser — usado pelo Realtime do timer.
// Inicialização preguiçosa: só cria o client quando realmente usado, e lança
// erro claro se as variáveis não estiverem configuradas.
let client: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Novo formato (sb_publishable_...) com fallback para a anon key legada (JWT).
  const publicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publicKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (.env.local / Vercel).",
    );
  }

  client = createClient(url, publicKey, {
    realtime: { params: { eventsPerSecond: 10 } },
  });
  return client;
}

/** True se as variáveis públicas do Supabase estão presentes. */
export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (!!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}
