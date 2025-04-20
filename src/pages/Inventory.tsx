
import { InventoryTable } from "@/components/inventory/InventoryTable";

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
        <p className="text-muted-foreground">
          Manage your product inventory, stock levels, and categories.
        </p>
      </div>

      <InventoryTable />
    </div>
  );
}
