"use client";

export type DataTableColumn<Key extends string> = {
  key: Key;
  label: string;
};

export function DataTable<Row extends Record<string, unknown>, Key extends string>({
  columns,
  rows,
  rowKey,
  renderCell,
  emptyContent,
  className,
}: {
  columns: Array<DataTableColumn<Key>>;
  rows: Row[];
  rowKey: (row: Row) => string | number;
  renderCell: (row: Row, columnKey: Key) => React.ReactNode;
  emptyContent?: React.ReactNode;
  className?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3 text-sm opacity-80">
        {emptyContent ?? "No data"}
      </div>
    );
  }

  return (
    <div className={["overflow-hidden rounded-md border border-zinc-800", className].filter(Boolean).join(" ")}>
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-950/40 text-zinc-300">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900">
          {rows.map((r) => (
            <tr key={rowKey(r)} className="hover:bg-zinc-950/30">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2">
                  {renderCell(r, c.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

