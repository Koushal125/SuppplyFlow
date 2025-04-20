
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
};

const inventoryData: InventoryItem[] = [
  {
    id: "INV001",
    name: "Wireless Earbuds",
    sku: "ELEC-001",
    category: "Electronics",
    price: 89.99,
    stock: 45,
    threshold: 20,
    lastUpdated: "2023-10-15",
  },
  {
    id: "INV002",
    name: "Smart Watch",
    sku: "ELEC-002",
    category: "Electronics",
    price: 199.99,
    stock: 12,
    threshold: 15,
    lastUpdated: "2023-10-10",
  },
  {
    id: "INV003",
    name: "Running Shoes",
    sku: "SHOE-001",
    category: "Clothing",
    price: 129.99,
    stock: 56,
    threshold: 25,
    lastUpdated: "2023-10-18",
  },
  {
    id: "INV004",
    name: "Desk Lamp",
    sku: "HOME-001",
    category: "Home & Living",
    price: 49.99,
    stock: 78,
    threshold: 30,
    lastUpdated: "2023-10-05",
  },
  {
    id: "INV005",
    name: "Protein Powder",
    sku: "HEALTH-001",
    category: "Health",
    price: 59.99,
    stock: 25,
    threshold: 20,
    lastUpdated: "2023-10-12",
  },
  {
    id: "INV006",
    name: "Coffee Maker",
    sku: "HOME-002",
    category: "Home & Living",
    price: 129.99,
    stock: 18,
    threshold: 15,
    lastUpdated: "2023-10-08",
  },
  {
    id: "INV007",
    name: "Yoga Mat",
    sku: "HEALTH-002",
    category: "Health",
    price: 35.99,
    stock: 42,
    threshold: 20,
    lastUpdated: "2023-10-14",
  },
  {
    id: "INV008",
    name: "Bluetooth Speaker",
    sku: "ELEC-003",
    category: "Electronics",
    price: 149.99,
    stock: 5,
    threshold: 10,
    lastUpdated: "2023-10-16",
  },
  {
    id: "INV009",
    name: "Denim Jeans",
    sku: "CLOTH-001",
    category: "Clothing",
    price: 79.99,
    stock: 65,
    threshold: 30,
    lastUpdated: "2023-10-11",
  },
  {
    id: "INV010",
    name: "Gaming Mouse",
    sku: "ELEC-004",
    category: "Electronics",
    price: 69.99,
    stock: 28,
    threshold: 15,
    lastUpdated: "2023-10-09",
  }
];

function getStockStatus(stock: number, threshold: number) {
  if (stock <= threshold / 2) return "low";
  if (stock <= threshold) return "medium";
  return "high";
}

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
  const [sortConfig, setSortConfig] = useState<{
    key: keyof InventoryItem | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  // Filter inventory data based on search query and category
  const filteredData = inventoryData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort data based on sort configuration
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });

  // Handle sorting
  const handleSort = (key: keyof InventoryItem) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search inventory..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Product Name
                  {sortConfig.key === "name" && (
                    <ChevronsUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("sku")}
              >
                <div className="flex items-center gap-1">
                  SKU
                  {sortConfig.key === "sku" && (
                    <ChevronsUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center gap-1">
                  Category
                  {sortConfig.key === "category" && (
                    <ChevronsUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center justify-end gap-1">
                  Price
                  {sortConfig.key === "price" && (
                    <ChevronsUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("stock")}
              >
                <div className="flex items-center justify-end gap-1">
                  Stock
                  {sortConfig.key === "stock" && (
                    <ChevronsUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("lastUpdated")}
              >
                <div className="flex items-center justify-end gap-1">
                  Last Updated
                  {sortConfig.key === "lastUpdated" && (
                    <ChevronsUpDown className="h-4 w-4" />
                  )}
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
                  <TableCell className="text-right">
                    ${item.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">{item.stock}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      className={cn(
                        getStockStatus(item.stock, item.threshold) === "low"
                          ? "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                          : getStockStatus(item.stock, item.threshold) ===
                            "medium"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800"
                          : "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                      )}
                    >
                      {getStockStatus(item.stock, item.threshold) === "low"
                        ? "Low"
                        : getStockStatus(item.stock, item.threshold) ===
                          "medium"
                        ? "Medium"
                        : "High"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.lastUpdated}</TableCell>
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
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Check className="mr-2 h-4 w-4" /> Update Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive">
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
