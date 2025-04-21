
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { InventoryTableHead } from "./InventoryTableHead";
import { InventoryTableRow } from "./InventoryTableRow";

export function InventoryTableAdmin({ data, onDelete, sortConfig, onSort }) {
  const columns = [
    { key: "name", label: "Product Name", sortable: true },
    { key: "sku", label: "SKU", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "price", label: "Price", sortable: true, alignRight: true },
    { key: "stock", label: "Stock", sortable: true, alignRight: true },
    { key: "status", label: "Status", sortable: false, alignRight: true },
    { key: "last_updated", label: "Last Updated", sortable: true, alignRight: true },
  ];

  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <Table>
        <TableHeader>
          <InventoryTableHead columns={columns} onSort={onSort} sortConfig={sortConfig} />
        </TableHeader>
        <TableBody>
          {data.length > 0 ? data.map(item => (
            <InventoryTableRow
              key={item.id}
              item={item}
              onDelete={() => onDelete(item.id)}
              showActions
            />
          )) : (
            <tr>
              <td colSpan={8} className="text-center h-24">No inventory items found.</td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
