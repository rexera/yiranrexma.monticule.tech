type TableProps = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

/**
 * Minimal table for listing courses or skills. Hairlines only — no filled
 * header, no outer card.
 */
export function Table({ caption, headers, rows }: TableProps) {
  return (
    <div className="overflow-x-auto border-y border-line/15">
      <table className="min-w-full text-sm">
        {caption ? <caption className="py-2 text-left text-xs text-muted">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-line/15">
            {headers.map((header) => (
              <th key={header} scope="col" className="px-3 py-2 text-left font-mono text-[0.68rem] font-medium uppercase tracking-[0.1em] text-muted">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-line/10 last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-2 text-ink/80">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
