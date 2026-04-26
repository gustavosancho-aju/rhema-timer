/**
 * RHEMA — Cliente Holyrics API
 *
 * Cliente HTTP server-side para a API oficial do Holyrics (v2.19+).
 * Documentação: https://github.com/holyrics/API-Server
 *
 * Usado pelos handlers em `/api/holyrics/*`. Não chamar do browser diretamente
 * — CORS não é garantido pela API do Holyrics.
 */

export type HolyricsConfig = {
  /** Host do Holyrics. Default: localhost */
  host?: string;
  /** Porta do API Server. Default: 8091 */
  port?: number;
  /** Token gerado em Holyrics → Configurações → API Server → manage permissions */
  token: string;
};

export type HolyricsResposta<T = Record<string, unknown>> = {
  status: "ok" | "error";
  data?: T;
  error?: string;
};

const TIMEOUT_MS = 3000;
const DEFAULT_HOST = "localhost";
const DEFAULT_PORT = 8091;

function buildUrl(acao: string, cfg: HolyricsConfig): string {
  const host = cfg.host || DEFAULT_HOST;
  const port = cfg.port || DEFAULT_PORT;
  const tokenEncoded = encodeURIComponent(cfg.token);
  return `http://${host}:${port}/api/${acao}?token=${tokenEncoded}`;
}

/**
 * Helper interno — faz POST autenticado e parseia resposta padrão do Holyrics.
 */
async function chamarAction<T = Record<string, unknown>>(
  acao: string,
  payload: Record<string, unknown>,
  cfg: HolyricsConfig
): Promise<HolyricsResposta<T>> {
  if (!cfg.token || cfg.token.trim().length === 0) {
    return { status: "error", error: "Token não configurado" };
  }

  const url = buildUrl(acao, cfg);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      return {
        status: "error",
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data = (await res.json()) as HolyricsResposta<T>;
    return data;
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        return {
          status: "error",
          error: "Timeout — Holyrics não respondeu em 3s. Está rodando?",
        };
      }
      if (err.message.includes("ECONNREFUSED") || err.message.includes("fetch failed")) {
        return {
          status: "error",
          error: "Conexão recusada. Holyrics offline ou porta errada?",
        };
      }
      return { status: "error", error: err.message };
    }
    return { status: "error", error: "Erro desconhecido" };
  }
}

/**
 * Exibe um versículo bíblico na tela do Holyrics.
 *
 * @param referencia Referência textual. Ex: "Is 43:19" ou "Isaías 43:19".
 * @param cfg Configuração (token + host/porta opcionais).
 */
export async function exibirVersiculo(
  referencia: string,
  cfg: HolyricsConfig
): Promise<HolyricsResposta> {
  return chamarAction("ShowVerse", { references: referencia }, cfg);
}

/**
 * Oculta o texto/apresentação atual no Holyrics.
 */
export async function ocultarTexto(
  cfg: HolyricsConfig
): Promise<HolyricsResposta> {
  return chamarAction("CloseCurrentPresentation", {}, cfg);
}

/**
 * Testa se o Holyrics está respondendo e se o token é válido.
 * Usa GetBibleVersionsV2 como chamada leve (apenas leitura).
 */
export async function testarConexao(
  cfg: HolyricsConfig
): Promise<HolyricsResposta> {
  return chamarAction("GetBibleVersionsV2", {}, cfg);
}
