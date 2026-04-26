import { parseTime } from "./format-time";

export interface ParsedCsvRow {
  title: string;
  presenter: string;
  type: "countdown" | "countup" | "time_of_day";
  duration: number;
  color: string;
  autoAdvance?: boolean;
  error?: string;
}

const VALID_TYPES = new Set(["countdown", "countup", "time_of_day"]);

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuote) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuote = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') inQuote = true;
      else if (ch === ",") {
        out.push(cur);
        cur = "";
      } else cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

export function parseCsv(text: string): ParsedCsvRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];
  const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase());

  const idx = {
    title: header.indexOf("title"),
    presenter: header.indexOf("presenter"),
    duration: header.indexOf("duration"),
    type: header.indexOf("type"),
    color: header.indexOf("color"),
    autoAdvance: header.indexOf("autoadvance"),
  };

  const rows: ParsedCsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const title = idx.title >= 0 ? cols[idx.title] ?? "" : "";
    const presenter = idx.presenter >= 0 ? cols[idx.presenter] ?? "" : "";
    const durationRaw = idx.duration >= 0 ? cols[idx.duration] ?? "" : "";
    const typeRaw =
      idx.type >= 0 && cols[idx.type] ? cols[idx.type].toLowerCase() : "countdown";
    const color = idx.color >= 0 && cols[idx.color] ? cols[idx.color] : "white";
    const autoAdvanceRaw =
      idx.autoAdvance >= 0 ? (cols[idx.autoAdvance] ?? "").toLowerCase() : "";

    let error: string | undefined;
    if (!title) error = "título vazio";

    const type = (VALID_TYPES.has(typeRaw) ? typeRaw : "countdown") as ParsedCsvRow["type"];

    let duration = 0;
    if (type === "countdown") {
      const n = Number(durationRaw);
      if (Number.isFinite(n) && !durationRaw.includes(":")) duration = n;
      else duration = parseTime(durationRaw);
      if (!duration) error = error ?? "duração inválida";
    }

    rows.push({
      title,
      presenter,
      type,
      duration,
      color,
      autoAdvance: autoAdvanceRaw === "true" || autoAdvanceRaw === "1" || autoAdvanceRaw === "sim",
      error,
    });
  }
  return rows;
}
