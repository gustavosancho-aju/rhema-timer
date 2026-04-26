"use client";

import { useState } from "react";
import { useTimerStore, type TimerState } from "@/store/timer-store";
import { parseTime, formatTime } from "@/lib/timer/format-time";
import { COLOR_LIST, COLOR_MAP } from "@/lib/timer/colors";

export default function TimerForm({
  roomId,
  timer,
  sendCommand,
  onClose,
}: {
  roomId: string;
  timer: TimerState | null;
  sendCommand: (p: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const upsertTimer = useTimerStore((s) => s.upsertTimer);
  const [title, setTitle] = useState(timer?.title ?? "");
  const [presenter, setPresenter] = useState(timer?.presenter ?? "");
  const [type, setType] = useState<TimerState["type"]>(
    timer?.type ?? "countdown",
  );
  const [durationStr, setDurationStr] = useState(
    timer ? formatTime(timer.duration) : "00:10:00",
  );
  const [color, setColor] = useState(timer?.color ?? "white");
  const [autoAdvance, setAutoAdvance] = useState(timer?.autoAdvance ?? false);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const duration = type === "countdown" ? parseTime(durationStr) : 0;
    const body = { title, presenter, type, duration, color, autoAdvance };
    try {
      const res = timer
        ? await fetch(`/api/timer/rooms/${roomId}/timers/${timer.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch(`/api/timer/rooms/${roomId}/timers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
      if (!res.ok) {
        const msg = await res.text();
        alert(`Falha ao salvar timer: ${msg}`);
        return;
      }
      const data = (await res.json()) as {
        timer?: { id: string; [k: string]: unknown };
      };
      if (data.timer) {
        const t = data.timer as unknown as {
          id: string;
          roomId: string;
          title: string;
          presenter: string;
          type: TimerState["type"];
          duration: number;
          color: string;
          order: number;
          status: TimerState["status"];
          startedAt: string | number | null;
          elapsedMs: number;
          autoAdvance: boolean;
          wrapupAt: string;
          scheduledStart: string | number | null;
          createdAt: string | number;
          updatedAt: string | number;
        };
        const toMs = (v: string | number | null) =>
          v === null ? null : typeof v === "number" ? v : new Date(v).getTime();
        upsertTimer({
          id: t.id,
          roomId: t.roomId,
          title: t.title,
          presenter: t.presenter,
          type: t.type,
          duration: t.duration,
          color: t.color,
          order: t.order,
          status: t.status,
          startedAt: toMs(t.startedAt),
          elapsedMs: t.elapsedMs,
          autoAdvance: t.autoAdvance,
          wrapupAt: t.wrapupAt,
          scheduledStart: toMs(t.scheduledStart),
          createdAt: toMs(t.createdAt) ?? Date.now(),
          updatedAt: toMs(t.updatedAt) ?? Date.now(),
        });
      }
      sendCommand({ type: "room:sync-all" });
      onClose();
    } catch (err) {
      alert(`Erro: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-md p-5 flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold">
          {timer ? "Editar Timer" : "Novo Timer"}
        </h2>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400 text-xs uppercase tracking-wider">
            Título
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2"
            placeholder="ex: Abertura"
            autoFocus
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400 text-xs uppercase tracking-wider">
            Apresentador
          </span>
          <input
            type="text"
            value={presenter}
            onChange={(e) => setPresenter(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2"
            placeholder="opcional"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-400 text-xs uppercase tracking-wider">
              Tipo
            </span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TimerState["type"])}
              className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2"
            >
              <option value="countdown">Contagem regressiva</option>
              <option value="countup">Contagem progressiva</option>
              <option value="time_of_day">Relógio</option>
            </select>
          </label>

          {type === "countdown" && (
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-400 text-xs uppercase tracking-wider">
                Duração (HH:MM:SS)
              </span>
              <input
                type="text"
                value={durationStr}
                onChange={(e) => setDurationStr(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2 font-mono"
                placeholder="00:10:00"
              />
            </label>
          )}
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-400 text-xs uppercase tracking-wider">
            Cor
          </span>
          <div className="flex flex-wrap gap-2">
            {COLOR_LIST.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full ${COLOR_MAP[c].dot} ${
                  color === c
                    ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                    : ""
                }`}
                title={COLOR_MAP[c].label}
              />
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={(e) => setAutoAdvance(e.target.checked)}
          />
          Auto-avançar ao terminar
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-zinc-400 hover:text-zinc-200 px-3 py-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded"
          >
            {saving ? "Salvando…" : timer ? "Salvar" : "Criar"}
          </button>
        </div>
      </form>
    </div>
  );
}
