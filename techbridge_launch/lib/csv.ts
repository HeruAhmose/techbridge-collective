export function toCsv(rows: Array<Record<string, string | number | null | undefined>>) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);

  const esc = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };

  const lines: string[] = [headers.map(esc).join(",")];
  for (const r of rows) lines.push(headers.map((h) => esc((r as any)[h])).join(","));
  return lines.join("\n");
}
