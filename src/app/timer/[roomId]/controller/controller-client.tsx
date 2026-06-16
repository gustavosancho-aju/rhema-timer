"use client";

import { useState } from "react";
import { useTimerStore } from "@/features/timer/store/timer-store";
import { useRealtimeTimer } from "@/features/timer/hooks/use-realtime-timer";
import { useTimerTick } from "@/features/timer/hooks/use-timer";
import { RoleTopBar } from "@/features/rhema/components/command-center/role-top-bar";
import TimerList from "./components/timer-list";
import TimerForm from "./components/timer-form";
import MessagePanel from "./components/message-panel";
import DisplayControls from "./components/display-controls";
import ActiveTimerBanner from "./components/active-timer-banner";
import CsvImportModal from "./components/csv-import-modal";

export default function ControllerClient({
  roomId,
  roomName,
}: {
  roomId: string;
  roomName: string;
}) {
  const { sendCommand } = useRealtimeTimer(roomId, "controller");
  const timers = useTimerStore((s) => s.timers);
  const activeTimerId = useTimerStore((s) => s.activeTimerId);
  const connections = useTimerStore((s) => s.connectionCount);
  const wsConnected = useTimerStore((s) => s.wsConnected);
  const active = timers.find((t) => t.id === activeTimerId) ?? null;
  const tick = useTimerTick(active);
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingTimer = editingId
    ? timers.find((t) => t.id === editingId) ?? null
    : null;

  return (
    <>
      <RoleTopBar
        role="Controller"
        wsConnected={wsConnected}
        statusLabel={
          wsConnected
            ? `${connections} ${connections === 1 ? "dispositivo" : "dispositivos"}`
            : "desconectado"
        }
      >
        <span style={{ color: "var(--fg-4)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500 }}>
          {roomName}
        </span>
        <span
          style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--font-mono)" }}
        >
          {roomId}
        </span>
      </RoleTopBar>

      <ActiveTimerBanner timer={active} tick={tick} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 p-4 sm:p-6">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="rh-eyebrow">Timers</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowImport(true)}
                className="rh-btn rh-btn-ghost rh-btn-sm"
              >
                Importar CSV
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setShowForm(true);
                }}
                className="rh-btn rh-btn-primary rh-btn-sm"
              >
                + Timer
              </button>
            </div>
          </div>

          <TimerList
            timers={timers}
            activeTimerId={activeTimerId}
            sendCommand={sendCommand}
            onEdit={(id) => {
              setEditingId(id);
              setShowForm(true);
            }}
            roomId={roomId}
          />

          <DisplayControls sendCommand={sendCommand} />
        </section>

        <aside>
          <MessagePanel sendCommand={sendCommand} />
        </aside>
      </div>

      {showForm && (
        <TimerForm
          roomId={roomId}
          timer={editingTimer}
          sendCommand={sendCommand}
          onClose={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />
      )}

      {showImport && (
        <CsvImportModal
          roomId={roomId}
          sendCommand={sendCommand}
          onClose={() => setShowImport(false)}
        />
      )}
    </>
  );
}
