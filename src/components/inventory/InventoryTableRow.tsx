
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

function getStockStatus(stock: number, threshold: number) {
  if (stock <= threshold / 2) return "low";
  if (stock <= threshold) return "medium";
  return "high";
}

export function InventoryTableRow({ item, onDelete, showActions }) {
  return (
    <TableRow>
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
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white z-50">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive" onClick={onDelete}>
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}
