
import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "@/components/ui/use-toast";
import { InventoryTableAdmin } from "./InventoryTableAdmin";
import { InventoryTableManager } from "./InventoryTableManager";
import { InventoryTableEmployee } from "./InventoryTableEmployee";
import { InventoryTableFilters } from "./InventoryTableFilters";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

const categories = [
  "All Categories",
  "Electronics",
  "Clothing",
  "Home & Living",
  "Health",
];

export function InventoryTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: "asc" | "desc" }>({ key: null, direction: "asc" });

  const { data, isLoading, error, deleteItem } = useInventory();
  const { data: userRole, isLoading: loadingRole, error: roleError } = useUserRole();

  if (isLoading || loadingRole) return <div>Loading inventory...</div>;
  if (error || roleError) return <div className="text-destructive">Failed to load inventory or user role.</div>;

  // Filter and sort
  const filteredData = (data || []).filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc"
        ? aValue - bValue
        : bValue - aValue;
    }
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
      toast({ title: "Item deleted", description: "The inventory item was deleted." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed to delete", description: err.message });
    }
  };

  // "Generate Report" mock (can be replaced with actual implementation)
  const handleGenerateReport = () => {
    // Simulate report generation with inventory data
    toast({ title: "Report Generated", description: "A CSV with current inventory would be generated." });
  };

  // Responsive: all nested components use responsive classes
  return (
    <div className="space-y-4">
      <InventoryTableFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        showAddBtn={userRole === "admin" || userRole === "store_manager"}
      />

      {(userRole === "admin" || userRole === "store_manager") &&
        <div className="flex flex-row flex-wrap gap-4 justify-end">
          <Button variant="outline" onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </div>
      }

      <div>
        {userRole === "admin" &&
          <InventoryTableAdmin
            data={sortedData}
            onDelete={handleDelete}
            sortConfig={sortConfig}
            onSort={handleSort}
          />}
        {userRole === "store_manager" &&
          <InventoryTableManager
            data={sortedData}
            onDelete={handleDelete}
            sortConfig={sortConfig}
            onSort={handleSort}
          />}
        {userRole === "store_employee" &&
          <InventoryTableEmployee
            data={sortedData}
            sortConfig={sortConfig}
            onSort={handleSort}
          />}
      </div>
    </div>
  );
}
