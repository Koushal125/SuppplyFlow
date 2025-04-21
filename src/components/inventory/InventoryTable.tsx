import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, Edit, MoreHorizontal, Plus, Search, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock inventory data
export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  threshold: number;
  lastUpdated: string;
  last_updated?: string;
};

import { useInventory } from "@/hooks/useInventory";
import { InventoryAddDialog } from "./InventoryAddDialog";
import { toast } from "@/components/ui/use-toast";

// Remove mock data, get categories dynamically
const categories = [
  "All Categories",
  "Electronics",
  "Clothing",
  "Home & Living",
  "Health",
];

function getStockStatus(stock: number, threshold: number) {
  if (stock <= threshold / 2) return "low";
  if (stock <= threshold) return "medium";
  return "high";
}

export function InventoryTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof InventoryItem | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const { data, isLoading, error, deleteItem } = useInventory();

  if (isLoading) {
    return <div>Loading inventory...</div>;
  }
  if (error) {
    return <div className="text-destructive">Failed to load inventory items.</div>;
  }

  // Filter inventory data based on search query and category
  const filteredData = (data || []).filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort data based on sort configuration
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];

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

  // Handle sorting
  const handleSort = (key: keyof InventoryItem) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  // Deletion
  const handleDelete = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
      toast({ title: "Item deleted", description: "The inventory item was deleted." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed to delete", description: err.message });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search inventory..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center">
          <select
            className="border rounded px-4 py-2 h-10 w-full sm:w-auto"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <InventoryAddDialog />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1">
                  Product Name
                  {sortConfig.key === "name" && <ChevronsUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("sku")}>
                <div className="flex items-center gap-1">
                  SKU
                  {sortConfig.key === "sku" && <ChevronsUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                <div className="flex items-center gap-1">
                  Category
                  {sortConfig.key === "category" && <ChevronsUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort("price")}>
                <div className="flex items-center justify-end gap-1">
                  Price
                  {sortConfig.key === "price" && <ChevronsUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort("stock")}>
                <div className="flex items-center justify-end gap-1">
                  Stock
                  {sortConfig.key === "stock" && <ChevronsUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort("last_updated")}>
                <div className="flex items-center justify-end gap-1">
                  Last Updated
                  {sortConfig.key === "last_updated" && <ChevronsUpDown className="h-4 w-4" />}
                </div>
              </TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">${item.price?.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.stock}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      className={cn(
                        getStockStatus(item.stock, item.threshold) === "low"
                          ? "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                          : getStockStatus(item.stock, item.threshold) === "medium"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800"
                          : "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                      )}
                    >
                      {getStockStatus(item.stock, item.threshold) === "low"
                        ? "Low"
                        : getStockStatus(item.stock, item.threshold) === "medium"
                        ? "Medium"
                        : "High"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.last_updated}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDelete(item.id)}>
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  No inventory items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// This file has gotten very long! Consider asking Lovable to refactor it soon.
