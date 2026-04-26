"use client";

import { useEffect, useState } from "react";
import type { Room } from "@/lib/timer/schema";
import { TopBar } from "@/components/command-center/top-bar";
import {
  Badge,
  Eyebrow,
  Ico,
  Pulse,
  Serif,
} from "@/components/rhema/primitives";

type RoomRow = Pick<Room, "id" | "name" | "createdAt" | "updatedAt">;

interface EnrichedRoom {
  id: string;
  name: string;
  lastActivity: string;
  timersCount: number;
  status: "live" | "idle" | "draft";
  activeTimerId: string | null;
}

interface Stats {
  roomsTotal: number;
  roomsLive: number;
  timersActive: number;
  connectionsLive: number;
}

const INTERFACES = [
  { key: "controller", label: "Controller", color: "var(--luxo-glow)" },
  { key: "viewer", label: "Viewer", color: "var(--luxo-gold)" },
  { key: "operator", label: "Operator", color: "#1B5670" },
  { key: "moderator", label: "Moderator", color: "var(--fg-2)" },
  { key: "agenda", label: "Agenda", color: "var(--fg-2)" },
] as const;

export default function RoomsClient({
  initialRooms,
}: {
  initialRooms: RoomRow[];
}) {
  const [rooms, setRooms] = useState<RoomRow[]>(initialRooms);
  const [stats, setStats] = useState<Stats>({
    roomsTotal: initialRooms.length,
    roomsLive: 0,
    timersActive: 0,
    connectionsLive: 0,
  });
  const [enriched, setEnriched] = useState<EnrichedRoom[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const res = await fetch("/api/timer/stats", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as {
          rooms: EnrichedRoom[];
          totals: Stats;
        };
        if (!cancelled) {
          setEnriched(data.rooms);
          setStats(data.totals);
        }
      } catch {
        /* ignore */
      }
    }
    fetchStats();
    const id = setInterval(fetchStats, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [rooms]);

  async function createRoom() {
    const name = newName.trim();
    if (!name || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/timer/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Falha ao criar sala");
      const data = (await res.json()) as { room: RoomRow };
      setRooms((prev) => [data.room, ...prev]);
      setNewName("");
      setShowCreate(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function deleteRoom(id: string, name: string) {
    if (!confirm(`Apagar a sala "${name}"?`)) return;
    const res = await fetch(`/api/timer/rooms/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Falha ao deletar sala");
      return;
    }
    setRooms((prev) => prev.filter((r) => r.id !== id));
  }

  async function saveEdit(id: string) {
    const name = editingName.trim();
    if (!name) {
      setEditingId(null);
      return;
    }
    const res = await fetch(`/api/timer/rooms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setRooms((prev) =>
        prev.map((r) => (r.id === id ? { ...r, name } : r)),
      );
    }
    setEditingId(null);
  }

  async function copyLink(roomId: string, iface: string) {
    const url = `${window.location.origin}/timer/${roomId}/${iface}`;
    await navigator.clipboard.writeText(url);
    const key = `${roomId}-${iface}`;
    setCopied(key);
    setTimeout(() => setCopied((k) => (k === key ? null : k)), 1500);
  }

  // Merge enriched (from stats) with rooms to keep the display responsive even
  // before the first stats fetch returns.
  const mergedRooms: EnrichedRoom[] = rooms.map((r) => {
    const found = enriched.find((e) => e.id === r.id);
    return (
      found ?? {
        id: r.id,
        name: r.name,
        lastActivity: "—",
        timersCount: 0,
        status: "idle",
        activeTimerId: null,
      }
    );
  });

  return (
    <>
      <TopBar active="live" extraLinks={[{ label: "Transcrição", href: "/" }]} />

      <section style={{ padding: "40px 60px" }}>
        <div
          className="flex items-end justify-between flex-wrap gap-6"
          style={{ marginBottom: 32 }}
        >
          <div>
            <Eyebrow>Timer · salas</Eyebrow>
            <h1
              style={{
                fontSize: 44,
                fontWeight: 700,
                margin: "10px 0 6px",
                letterSpacing: "-0.02em",
                color: "var(--fg-1)",
              }}
            >
              Palco sob{" "}
              <Serif style={{ color: "var(--luxo-gold)", fontWeight: 400 }}>
                controle
              </Serif>
              .
            </h1>
            <p style={{ fontSize: 15, color: "var(--fg-3)", maxWidth: 560 }}>
              Crie uma sala e compartilhe 5 interfaces sincronizadas em tempo
              real — palco, operador, moderador e agenda.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            style={{
              height: 48,
              padding: "0 24px",
              borderRadius: 9999,
              background: "var(--luxo-glow)",
              color: "var(--luxo-void)",
              fontWeight: 600,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 0 24px rgba(176,240,240,0.35)",
            }}
          >
            + Nova sala
          </button>
        </div>

        {/* Stats */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 28 }}
        >
          <RoomStat label="Salas ativas" value={stats.roomsLive} tone="live" />
          <RoomStat label="Total de salas" value={stats.roomsTotal} />
          <RoomStat label="Conexões agora" value={stats.connectionsLive} mono />
          <RoomStat label="Timers ativos" value={stats.timersActive} tone="ok" />
        </div>

        {/* Rooms table */}
        <div
          style={{
            borderRadius: 20,
            background: "rgba(4,32,40,0.55)",
            border: "1px solid var(--border-subtle)",
            overflow: "hidden",
          }}
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1.8fr 1fr 1fr 0.8fr 2fr 50px",
              padding: "14px 24px",
              borderBottom: "1px solid var(--border-subtle)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--fg-3)",
            }}
          >
            <span>Sala</span>
            <span>Status</span>
            <span>Conexões</span>
            <span>Timers</span>
            <span>Links (5 interfaces)</span>
            <span />
          </div>
          {mergedRooms.length === 0 ? (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
                color: "var(--fg-3)",
                fontSize: 14,
              }}
            >
              Nenhuma sala ainda. Clique em{" "}
              <strong style={{ color: "var(--fg-2)" }}>+ Nova sala</strong> para
              criar a primeira.
            </div>
          ) : (
            mergedRooms.map((room, i) => (
              <RoomRow
                key={room.id}
                room={room}
                first={i === 0}
                isEditing={editingId === room.id}
                editingName={editingName}
                onStartEdit={() => {
                  setEditingId(room.id);
                  setEditingName(room.name);
                }}
                onEditChange={setEditingName}
                onSaveEdit={() => saveEdit(room.id)}
                onCancelEdit={() => setEditingId(null)}
                onDelete={() => deleteRoom(room.id, room.name)}
                onCopy={copyLink}
                copiedKey={copied}
              />
            ))
          )}
        </div>
      </section>

      {showCreate && (
        <div
          onClick={() => !busy && setShowCreate(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 50,
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              createRoom();
            }}
            style={{
              background: "var(--bg-1)",
              border: "1px solid var(--border-default)",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 460,
              boxShadow: "var(--shadow-modal)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Nova sala</h2>
            <input
              type="text"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: Culto Domingo · 26/abr"
              className="rh-input"
              style={{ padding: "10px 14px", fontSize: 14 }}
              disabled={busy}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rh-btn rh-btn-ghost"
                disabled={busy}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rh-btn rh-btn-primary"
                disabled={busy || !newName.trim()}
              >
                Criar sala
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function RoomStat({
  label,
  value,
  tone,
  mono,
}: {
  label: string;
  value: number;
  tone?: "live" | "ok";
  mono?: boolean;
}) {
  const color =
    tone === "live" || tone === "ok" ? "var(--luxo-glow)" : "var(--fg-1)";
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 14,
        background: "rgba(4,32,40,0.5)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--fg-3)",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div className="flex items-center gap-2.5">
        {tone === "live" && value > 0 && <Pulse size={7} />}
        <span
          style={{
            fontSize: 28,
            fontWeight: 600,
            color,
            fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function RoomRow({
  room,
  first,
  isEditing,
  editingName,
  onStartEdit,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onCopy,
  copiedKey,
}: {
  room: EnrichedRoom;
  first: boolean;
  isEditing: boolean;
  editingName: string;
  onStartEdit: () => void;
  onEditChange: (v: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onCopy: (roomId: string, iface: string) => void;
  copiedKey: string | null;
}) {
  const active = room.status === "live";

  return (
    <div
      className="grid items-center"
      style={{
        gridTemplateColumns: "1.8fr 1fr 1fr 0.8fr 2fr 50px",
        padding: "18px 24px",
        borderTop: first ? "none" : "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex items-center gap-3">
        {active && <Pulse size={6} />}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editingName}
              autoFocus
              onChange={(e) => onEditChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveEdit();
                if (e.key === "Escape") onCancelEdit();
              }}
              onBlur={onSaveEdit}
              className="rh-input"
              style={{ padding: "6px 10px", fontSize: 14, width: "100%" }}
            />
          ) : (
            <button
              type="button"
              onClick={onStartEdit}
              style={{
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "-0.005em",
                color: "var(--fg-1)",
                background: "transparent",
                border: "none",
                padding: 0,
                textAlign: "left",
                cursor: "text",
              }}
            >
              {room.name}
            </button>
          )}
          <div
            style={{
              fontSize: 11,
              color: "var(--fg-3)",
              fontFamily: "var(--font-mono)",
              marginTop: 2,
            }}
          >
            id: {room.id} · {room.lastActivity}
          </div>
        </div>
      </div>

      <div>
        {room.status === "live" && <Badge variant="live">ao vivo</Badge>}
        {room.status === "idle" && <Badge variant="neutral">idle</Badge>}
        {room.status === "draft" && <Badge variant="gold">rascunho</Badge>}
      </div>

      <div
        style={{
          fontSize: 14,
          color: "var(--fg-3)",
          fontFamily: "var(--font-mono)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        0{" "}
        <span style={{ color: "var(--fg-4)", fontSize: 11 }}>dispositivos</span>
      </div>

      <div
        style={{
          fontSize: 14,
          color: "var(--fg-2)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {room.timersCount}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {INTERFACES.map((iface) => {
          const key = `${room.id}-${iface.key}`;
          const isCopied = copiedKey === key;
          return (
            <a
              key={iface.key}
              href={`/timer/${room.id}/${iface.key}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                height: 26,
                padding: "0 10px",
                borderRadius: 9999,
                background: "rgba(176,240,240,0.04)",
                border: "1px solid var(--border-subtle)",
                color: iface.color,
                fontSize: 10,
                fontWeight: 500,
                fontFamily: "var(--font-sans)",
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              {iface.label}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCopy(room.id, iface.key);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  padding: 0,
                  display: "inline-flex",
                  alignItems: "center",
                }}
                title={isCopied ? "copiado" : "copiar link"}
              >
                {isCopied ? <Ico.check /> : <Ico.copy />}
              </button>
            </a>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onDelete}
        title="Deletar sala"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--fg-4)",
          cursor: "pointer",
          fontSize: 18,
          lineHeight: 1,
          padding: 4,
        }}
      >
        ×
      </button>
    </div>
  );
}
