"use client";

export function CsvButton({
  rows,
  filename,
}: {
  rows: (string | number | null)[][];
  filename: string;
}) {
  function download() {
    const csv = rows
      .map((row) =>
        row
          .map((cell) => {
            const s = cell === null || cell === undefined ? "" : String(cell);
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(",")
      )
      .join("\n");
    const blob = new Blob(["﻿" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={download}
      className="rounded-full bg-brand px-6 py-2.5 text-sm font-extrabold text-white transition hover:bg-brand-dark cursor-pointer"
    >
      Download CSV
    </button>
  );
}
