
import { ReportsList } from "@/components/reports/ReportsList";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Generate and download reports for inventory, sales, and analytics.
        </p>
      </div>

      <ReportsList />
    </div>
  );
}
