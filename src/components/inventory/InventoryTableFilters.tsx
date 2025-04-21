
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { InventoryAddDialog } from "./InventoryAddDialog";

export function InventoryTableFilters({ searchQuery, setSearchQuery, categories, selectedCategory, setSelectedCategory, showAddBtn = true }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search inventory..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      <div className={cn("flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center", showAddBtn && "justify-end")}>
        <select
          className="border rounded px-4 py-2 h-10 w-full sm:w-auto"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category}>{category}</option>
          ))}
        </select>
        {showAddBtn && <InventoryAddDialog />}
      </div>
    </div>
  );
}
