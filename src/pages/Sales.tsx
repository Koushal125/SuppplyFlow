
import { SalesTable } from "@/components/sales/SalesTable";

export default function Sales() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sales Management</h2>
        <p className="text-muted-foreground">
          View and manage sales orders, transactions, and customer information.
        </p>
      </div>

      <SalesTable />
    </div>
  );
}
