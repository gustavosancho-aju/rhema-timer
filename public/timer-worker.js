// Timer Web Worker
// Keeps ticking independently of the main thread / WebSocket connection.
//
// Main thread → Worker messages:
//   { type: 'configure', timer: { id, type, duration, status, startedAt, elapsedMs } }
//   { type: 'stop' }
//
// Worker → Main thread messages:
//   { type: 'tick', elapsed, remaining, displayTime, status }

let state = null;
let intervalId = null;

function pad(n, size = 2) {
  const s = Math.floor(Math.abs(n)).toString();
  return s.length >= size ? s : "0".repeat(size - s.length) + s;
}

function formatTime(totalSeconds) {
  const sign = totalSeconds < 0 ? "-" : "";
  const abs = Math.abs(totalSeconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = Math.floor(abs % 60);
  if (h > 0) return `${sign}${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${sign}${pad(m)}:${pad(s)}`;
}

function formatClock() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function computeTick() {
  if (!state) return null;
  const { type, duration, status, startedAt, elapsedMs } = state;

  if (type === "time_of_day") {
    return {
      type: "tick",
      elapsed: 0,
      remaining: 0,
      displayTime: formatClock(),
      status,
    };
  }

  const liveElapsedMs =
    status === "running" && startedAt
      ? elapsedMs + (Date.now() - startedAt)
      : elapsedMs;
  const elapsed = liveElapsedMs / 1000;

  if (type === "countup") {
    return {
      type: "tick",
      elapsed,
      remaining: 0,
      displayTime: formatTime(elapsed),
      status,
    };
  }

  // countdown
  const remaining = duration - elapsed;
  return {
    type: "tick",
    elapsed,
    remaining,
    displayTime: formatTime(remaining),
    status,
  };
}

function startLoop() {
  stopLoop();
  intervalId = setInterval(() => {
    const tick = computeTick();
    if (tick) self.postMessage(tick);
  }, 100);
  const tick = computeTick();
  if (tick) self.postMessage(tick);
}

function stopLoop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

self.onmessage = (event) => {
  const msg = event.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "configure") {
    state = msg.timer ?? null;
    if (!state) {
      stopLoop();
      return;
    }
    startLoop();
    return;
  }

  if (msg.type === "stop") {
    stopLoop();
    state = null;
    return;
  }
};
