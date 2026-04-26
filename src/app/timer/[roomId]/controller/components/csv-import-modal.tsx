"use client";

import { useState } from "react";
import { parseCsv, type ParsedCsvRow } from "@/lib/timer/csv-parser";
import { formatTime } from "@/lib/timer/format-time";

export default function CsvImportModal({
  roomId,
  sendCommand,
  onClose,
}: {
  roomId: string;
  sendCommand: (p: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<ParsedCsvRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setRows(parseCsv(text));
    };
    reader.readAsText(file);
  }

  async function doImport() {
    const valid = rows.filter((r) => !r.error);
    if (valid.length === 0) return;
    setImporting(true);
    try {
      const res = await fetch(`/api/timer/rooms/${roomId}/timers/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: valid }),
      });
      if (res.ok) sendCommand({ type: "room:sync-all" });
      onClose();
    } finally {
      setImporting(false);
    }
  }

  const validCount = rows.filter((r) => !r.error).length;
  const errorCount = rows.length - validCount;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
      >
        <div className="p-5 border-b border-zinc-800">
          <h2 className="text-lg font-semibold">Importar CSV</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Colunas esperadas:{" "}
            <code className="text-xs bg-zinc-950 px-1 py-0.5 rounded">title</code>,{" "}
            <code className="text-xs bg-zinc-950 px-1 py-0.5 rounded">presenter</code>,{" "}
            <code className="text-xs bg-zinc-950 px-1 py-0.5 rounded">duration</code>,{" "}
            <code className="text-xs bg-zinc-950 px-1 py-0.5 rounded">type</code>,{" "}
            <code className="text-xs bg-zinc-950 px-1 py-0.5 rounded">color</code>.{" "}
            <a
              href="/timer-template.csv"
              download
              className="text-emerald-400 hover:text-emerald-300"
            >
              Baixar template
            </a>
          </p>
        </div>

        <div className="p-5 border-b border-zinc-800">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={onFile}
            className="text-sm file:mr-3 file:bg-zinc-800 file:hover:bg-zinc-700 file:text-zinc-100 file:border-0 file:rounded file:px-3 file:py-1.5 file:cursor-pointer"
          />
          {fileName && (
            <div className="text-xs text-zinc-500 mt-2">
              {fileName} — {validCount} OK, {errorCount} com erro
            </div>
          )}
        </div>

        {rows.length > 0 && (
          <div className="overflow-auto flex-1 p-5">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-zinc-500 text-left">
                <tr>
                  <th className="py-2">Título</th>
                  <th className="py-2">Apresentador</th>
                  <th className="py-2">Duração</th>
                  <th className="py-2">Tipo</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={i}
                    className={`border-t border-zinc-800 ${
                      r.error ? "bg-red-950/20" : ""
                    }`}
                  >
                    <td className="py-2 font-medium">{r.title || "—"}</td>
                    <td className="py-2 text-zinc-400">{r.presenter || "—"}</td>
                    <td className="py-2 font-mono text-zinc-400">
                      {r.type === "countdown" ? formatTime(r.duration) : "—"}
                    </td>
                    <td className="py-2 text-zinc-400">{r.type}</td>
                    <td className="py-2 text-red-400 text-xs">{r.error ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-5 border-t border-zinc-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-sm text-zinc-400 hover:text-zinc-200 px-3 py-2"
          >
            Cancelar
          </button>
          <button
            onClick={doImport}
            disabled={validCount === 0 || importing}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded"
          >
            {importing ? "Importando…" : `Importar ${validCount} timers`}
          </button>
        </div>
      </div>
    </div>
  );
}
