
import { TableHead, TableRow } from "@/components/ui/table";

export function InventoryTableHead({ columns, onSort, sortConfig }: {
  columns: { key: string; label: string; sortable?: boolean; alignRight?: boolean; }[]
  onSort: (key: string) => void
  sortConfig: { key: string | null; direction: "asc" | "desc" }
}) {
  return (
    <TableRow>
      {columns.map(col => (
        <TableHead
          key={col.key}
          className={`${col.sortable ? "cursor-pointer" : ""} ${col.alignRight ? "text-right" : ""}`}
          onClick={col.sortable ? () => onSort(col.key as any) : undefined}
        >
          <div className={`flex items-center${col.alignRight ? " justify-end" : ""} gap-1`}>
            {col.label}
            {sortConfig.key === col.key && (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"><path d="M7 15.5l5 5 5-5" stroke="currentColor" strokeWidth={2} /><path d="M7 8.5l5-5 5 5" stroke="currentColor" strokeWidth={2} /></svg>
            )}
          </div>
        </TableHead>
      ))}
      <TableHead className="w-[80px]" />
    </TableRow>
  );
}
