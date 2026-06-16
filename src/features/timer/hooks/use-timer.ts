"use client";

import { useEffect, useRef, useState } from "react";
import type { TimerState } from "@/features/timer/store/timer-store";

interface Tick {
  elapsed: number;
  remaining: number;
  displayTime: string;
  status: TimerState["status"];
}

export function useTimerTick(timer: TimerState | null): Tick {
  const workerRef = useRef<Worker | null>(null);
  const [tick, setTick] = useState<Tick>({
    elapsed: 0,
    remaining: 0,
    displayTime: "00:00",
    status: "idle",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = new Worker("/timer-worker.js");
    workerRef.current = w;
    w.onmessage = (ev: MessageEvent<Tick & { type: string }>) => {
      if (ev.data && ev.data.type === "tick") {
        const { elapsed, remaining, displayTime, status } = ev.data;
        setTick({ elapsed, remaining, displayTime, status });
      }
    };
    return () => {
      w.postMessage({ type: "stop" });
      w.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const w = workerRef.current;
    if (!w) return;
    if (!timer) {
      w.postMessage({ type: "stop" });
      queueMicrotask(() =>
        setTick({ elapsed: 0, remaining: 0, displayTime: "00:00", status: "idle" }),
      );
      return;
    }
    w.postMessage({
      type: "configure",
      timer: {
        id: timer.id,
        type: timer.type,
        duration: timer.duration,
        status: timer.status,
        startedAt: timer.startedAt,
        elapsedMs: timer.elapsedMs,
      },
    });
  }, [
    timer?.id,
    timer?.type,
    timer?.duration,
    timer?.status,
    timer?.startedAt,
    timer?.elapsedMs,
    timer,
  ]);

  return tick;
}
