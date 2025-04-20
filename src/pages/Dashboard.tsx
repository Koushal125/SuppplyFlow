
import { ShoppingCart, Package, BarChart, DollarSign } from "lucide-react";
import { CardStat } from "@/components/ui/card-stat";
import { InventoryLevelChart } from "@/components/dashboard/InventoryLevelChart";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopSellingProducts } from "@/components/dashboard/TopSellingProducts";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your inventory management system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CardStat
          title="Total Revenue"
          value="$45,231.89"
          icon={<DollarSign className="h-4 w-4" />}
          description="Monthly revenue"
          trend={{ value: 12, isPositive: true }}
        />
        <CardStat
          title="Sales"
          value="124"
          icon={<ShoppingCart className="h-4 w-4" />}
          description="Monthly sales count"
          trend={{ value: 8, isPositive: true }}
        />
        <CardStat
          title="Inventory Items"
          value="346"
          icon={<Package className="h-4 w-4" />}
          description="Products in stock"
          trend={{ value: 3, isPositive: true }}
        />
        <CardStat
          title="Low Stock Items"
          value="12"
          icon={<BarChart className="h-4 w-4" />}
          description="Items below threshold"
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <SalesChart />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <InventoryLevelChart />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <TopSellingProducts />
        <RecentActivity />
      </div>
    </div>
  );
}
