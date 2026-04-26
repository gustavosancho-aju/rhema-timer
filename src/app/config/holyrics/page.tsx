"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type TesteStatus = "idle" | "testando" | "ok" | "erro";

const STORAGE_KEY = "rhema.holyrics.config";

type ConfigSalva = {
  token: string;
  host: string;
  port: string;
};

const CONFIG_PADRAO: ConfigSalva = {
  token: "",
  host: "localhost",
  port: "8091",
};

export default function HolyricsConfigPage() {
  const [cfg, setCfg] = useState<ConfigSalva>(CONFIG_PADRAO);
  const [carregado, setCarregado] = useState(false);
  const [status, setStatus] = useState<TesteStatus>("idle");
  const [mensagem, setMensagem] = useState<string>("");

  // Carrega config do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ConfigSalva>;
        setCfg({ ...CONFIG_PADRAO, ...parsed });
      }
    } catch {
      // ignora
    }
    setCarregado(true);
  }, []);

  // Salva config no localStorage
  function salvar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    setStatus("idle");
    setMensagem("Configuração salva no navegador.");
  }

  async function testar() {
    setStatus("testando");
    setMensagem("");
    try {
      const res = await fetch("/api/holyrics/testar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: cfg.token,
          host: cfg.host || undefined,
          port: cfg.port ? Number(cfg.port) : undefined,
        }),
      });
      const data = (await res.json()) as { status: string; error?: string };
      if (data.status === "ok") {
        setStatus("ok");
        setMensagem("Conexão OK! Holyrics está respondendo e o token é válido.");
      } else {
        setStatus("erro");
        setMensagem(data.error || "Erro desconhecido");
      }
    } catch (err) {
      setStatus("erro");
      setMensagem(err instanceof Error ? err.message : String(err));
    }
  }

  async function exibirTeste() {
    setStatus("testando");
    setMensagem("Enviando Isaías 43:19 para o Holyrics...");
    try {
      const res = await fetch("/api/holyrics/exibir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referencia: "Is 43:19",
          token: cfg.token,
          host: cfg.host || undefined,
          port: cfg.port ? Number(cfg.port) : undefined,
        }),
      });
      const data = (await res.json()) as { status: string; error?: string };
      if (data.status === "ok") {
        setStatus("ok");
        setMensagem("Versículo enviado. Confira a projeção do Holyrics.");
      } else {
        setStatus("erro");
        setMensagem(data.error || "Erro desconhecido");
      }
    } catch (err) {
      setStatus("erro");
      setMensagem(err instanceof Error ? err.message : String(err));
    }
  }

  const corStatus =
    status === "ok"
      ? "text-emerald-400"
      : status === "erro"
      ? "text-red-400"
      : status === "testando"
      ? "text-zinc-400"
      : "text-zinc-500";

  return (
    <main className="flex flex-col flex-1 w-full max-w-3xl mx-auto p-4 sm:p-8 gap-6">
      <header className="flex items-baseline justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Configuração Holyrics
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Conecte o RHEMA ao Holyrics para exibir versículos na projeção.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition"
        >
          ← voltar
        </Link>
      </header>

      <section className="flex flex-col gap-4 bg-zinc-900/40 border border-zinc-800 rounded-lg p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Credenciais
        </h2>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-zinc-400">
            Token (gerado no Holyrics em File → Settings → API Server → manage permissions)
          </span>
          <input
            type="password"
            value={cfg.token}
            onChange={(e) => setCfg({ ...cfg, token: e.target.value })}
            placeholder="Cole o token aqui"
            className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono focus:border-zinc-600 focus:outline-none"
            disabled={!carregado}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-400">Host</span>
            <input
              type="text"
              value={cfg.host}
              onChange={(e) => setCfg({ ...cfg, host: e.target.value })}
              placeholder="localhost"
              className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono focus:border-zinc-600 focus:outline-none"
              disabled={!carregado}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-400">Porta</span>
            <input
              type="text"
              value={cfg.port}
              onChange={(e) => setCfg({ ...cfg, port: e.target.value })}
              placeholder="8091"
              className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono focus:border-zinc-600 focus:outline-none"
              disabled={!carregado}
            />
          </label>
        </div>

        <div className="flex gap-2 flex-wrap pt-2">
          <button
            onClick={salvar}
            disabled={!carregado}
            className="bg-zinc-100 text-zinc-900 font-medium px-4 py-2 rounded text-sm hover:bg-white transition disabled:opacity-50"
          >
            Salvar
          </button>
          <button
            onClick={testar}
            disabled={!carregado || !cfg.token || status === "testando"}
            className="bg-zinc-800 text-zinc-100 font-medium px-4 py-2 rounded text-sm hover:bg-zinc-700 transition disabled:opacity-40"
          >
            {status === "testando" ? "Testando..." : "Testar conexão"}
          </button>
          <button
            onClick={exibirTeste}
            disabled={!carregado || !cfg.token || status === "testando"}
            className="bg-zinc-800 text-zinc-100 font-medium px-4 py-2 rounded text-sm hover:bg-zinc-700 transition disabled:opacity-40"
          >
            Exibir Is 43:19 (teste)
          </button>
        </div>

        {mensagem && (
          <p className={`text-sm ${corStatus} mt-2`}>{mensagem}</p>
        )}
      </section>

      <section className="flex flex-col gap-3 text-sm text-zinc-400 bg-zinc-900/20 border border-zinc-800/50 rounded-lg p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Setup rápido
        </h2>
        <ol className="list-decimal list-inside space-y-2 leading-relaxed">
          <li>
            Abra o Holyrics → <strong>File → Settings → API Server</strong>
          </li>
          <li>
            Ative o servidor e confirme a porta (padrão <code className="text-zinc-200">8091</code>)
          </li>
          <li>
            Clique em <strong>manage permissions</strong> e gere um novo token
          </li>
          <li>
            Habilite pelo menos as permissões: <code className="text-zinc-200">ShowVerse</code>,{" "}
            <code className="text-zinc-200">CloseCurrentPresentation</code> e{" "}
            <code className="text-zinc-200">GetBibleVersionsV2</code>
          </li>
          <li>Cole o token acima e clique em <strong>Testar conexão</strong></li>
          <li>
            Se passar, clique em <strong>Exibir Is 43:19</strong> e veja se o versículo aparece
            na projeção do Holyrics
          </li>
        </ol>
      </section>
    </main>
  );
}
