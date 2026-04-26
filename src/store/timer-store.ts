"use client";

import { create } from "zustand";

export interface TimerState {
  id: string;
  roomId: string;
  title: string;
  presenter: string;
  type: "countdown" | "countup" | "time_of_day";
  duration: number;
  color: string;
  order: number;
  status: "idle" | "running" | "paused" | "finished";
  startedAt: number | null;
  elapsedMs: number;
  autoAdvance: boolean;
  wrapupAt: string;
  scheduledStart: number | null;
  createdAt: number;
  updatedAt: number;
}

interface TimerStore {
  timers: TimerState[];
  activeTimerId: string | null;
  connectionCount: number;
  wsConnected: boolean;
  blackout: boolean;
  focusMode: boolean;
  currentMessage: { id: string; text: string; color: string } | null;

  setRoomState: (timers: TimerState[], activeTimerId: string | null) => void;
  upsertTimer: (timer: TimerState) => void;
  removeTimer: (id: string) => void;
  setConnectionCount: (n: number) => void;
  setWsConnected: (connected: boolean) => void;
  setBlackout: (v: boolean) => void;
  setFocusMode: (v: boolean) => void;
  setMessage: (
    msg: { id: string; text: string; color: string } | null,
  ) => void;
  reset: () => void;
}

const initial = {
  timers: [] as TimerState[],
  activeTimerId: null,
  connectionCount: 0,
  wsConnected: false,
  blackout: false,
  focusMode: false,
  currentMessage: null,
};

export const useTimerStore = create<TimerStore>((set) => ({
  ...initial,

  setRoomState: (timers, activeTimerId) => set({ timers, activeTimerId }),

  upsertTimer: (timer) =>
    set((state) => {
      const exists = state.timers.some((t) => t.id === timer.id);
      const nextTimers = exists
        ? state.timers.map((t) => (t.id === timer.id ? timer : t))
        : [...state.timers, timer];
      nextTimers.sort((a, b) => a.order - b.order);
      const isActive =
        timer.status === "running" || timer.status === "paused";
      const nextActive = isActive
        ? timer.id
        : state.activeTimerId === timer.id
          ? null
          : state.activeTimerId;
      return { timers: nextTimers, activeTimerId: nextActive };
    }),

  removeTimer: (id) =>
    set((state) => ({
      timers: state.timers.filter((t) => t.id !== id),
      activeTimerId: state.activeTimerId === id ? null : state.activeTimerId,
    })),

  setConnectionCount: (n) => set({ connectionCount: n }),
  setWsConnected: (connected) => set({ wsConnected: connected }),
  setBlackout: (v) => set({ blackout: v }),
  setFocusMode: (v) => set({ focusMode: v }),
  setMessage: (msg) => set({ currentMessage: msg }),
  reset: () => set(initial),
}));

export function selectActiveTimer(
  state: ReturnType<typeof useTimerStore.getState>,
): TimerState | null {
  if (!state.activeTimerId) return null;
  return state.timers.find((t) => t.id === state.activeTimerId) ?? null;
}
