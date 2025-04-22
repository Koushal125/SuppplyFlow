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
import { ChevronsUpDown, Eye, MoreHorizontal, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Updated mock sales data
export type SaleItem = {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentMethod: "credit_card" | "paypal" | "bank_transfer" | "cash";
};

const salesData: SaleItem[] = [
  {
    id: "1",
    orderId: "ORD-001",
    customer: "Rajesh Kumar",
    date: "2024-04-15",
    items: 3,
    total: 1499.97,
    status: "completed",
    paymentMethod: "credit_card",
  },
  {
    id: "2",
    orderId: "ORD-002",
    customer: "Priya Sharma",
    date: "2024-04-14",
    items: 1,
    total: 899.99,
    status: "processing",
    paymentMethod: "upi",
  },
  {
    id: "3",
    orderId: "ORD-003",
    customer: "Amit Patel",
    date: "2024-04-13",
    items: 2,
    total: 1049.98,
    status: "pending",
    paymentMethod: "bank_transfer",
  },
  {
    id: "4",
    orderId: "ORD-004",
    customer: "Meera Singh",
    date: "2024-04-12",
    items: 5,
    total: 2999.95,
    status: "completed",
    paymentMethod: "credit_card",
  },
  {
    id: "5",
    orderId: "ORD-005",
    customer: "Vikram Malhotra",
    date: "2024-04-11",
    items: 2,
    total: 1599.98,
    status: "cancelled",
    paymentMethod: "upi",
  },
  {
    id: "6",
    orderId: "ORD-006",
    customer: "Anjali Desai",
    date: "2024-04-10",
    items: 4,
    total: 2199.96,
    status: "completed",
    paymentMethod: "credit_card",
  },
  {
    id: "7",
    orderId: "ORD-007",
    customer: "Rahul Verma",
    date: "2024-04-09",
    items: 1,
    total: 499.99,
    status: "processing",
    paymentMethod: "cash",
  },
  {
    id: "8",
    orderId: "ORD-008",
    customer: "Neha Gupta",
    date: "2024-04-08",
    items: 3,
    total: 1299.97,
    status: "completed",
    paymentMethod: "credit_card",
  },
  {
    id: "9",
    orderId: "ORD-009",
    customer: "Suresh Reddy",
    date: "2024-04-07",
    items: 2,
    total: 1199.98,
    status: "pending",
    paymentMethod: "bank_transfer",
  },
  {
    id: "10",
    orderId: "ORD-010",
    customer: "Pooja Iyer",
    date: "2024-04-06",
    items: 6,
    total: 3499.94,
    status: "completed",
    paymentMethod: "upi",
  },
];

const statusOptions = ["All Statuses", "pending", "processing", "completed", "cancelled"];
const paymentOptions = ["All Payment Methods", "credit_card", "upi", "bank_transfer", "cash"];

function getStatusBadgeStyles(status: SaleItem["status"]) {
  switch (status) {
    case "pending":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800";
    case "processing":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800";
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
  }
}

function getStatusLabel(status: SaleItem["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getPaymentMethodLabel(method: SaleItem["paymentMethod"]) {
  switch (method) {
    case "credit_card":
      return "Credit Card";
    case "paypal":
      return "PayPal";
    case "bank_transfer":
      return "Bank Transfer";
    case "cash":
      return "Cash";
  }
}

export function SalesTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [paymentFilter, setPaymentFilter] = useState("All Payment Methods");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof SaleItem | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const filteredData = salesData.filter((item) => {
    const matchesSearch =
      item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Statuses" || item.status === statusFilter;
    const matchesPayment =
      paymentFilter === "All Payment Methods" ||
      item.paymentMethod === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

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

  const handleSort = (key: keyof SaleItem) => {
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "All Statuses"
                    ? status
                    : getStatusLabel(status as SaleItem["status"])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Payment Methods" />
            </SelectTrigger>
            <SelectContent>
              {paymentOptions.map((method) => (
                <SelectItem key={method} value={method}>
                  {method === "All Payment Methods"
                    ? method
                    : getPaymentMethodLabel(method as SaleItem["paymentMethod"])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("orderId")}
              >
                <div className="flex items-center gap-1">
                  Order ID
                  {sortConfig.key === "orderId" && (
                    <ChevronsUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("customer")}
              >
                <div className="flex items-center gap-1">
                  Customer
                  {sortConfig.key === "customer" && (
                    <ChevronsUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-1">
                  Date
                  {sortConfig.key === "date" && (
                    <ChevronsUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("items")}
              >
                <div className="flex items-center justify-end gap-1">
                  Items
                  {sortConfig.key === "items" && (
                    <ChevronsUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("total")}
              >
                <div className="flex items-center justify-end gap-1">
                  Total
                  {sortConfig.key === "total" && (
                    <ChevronsUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.orderId}</TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="text-right">{item.items}</TableCell>
                  <TableCell className="text-right">
                    ${item.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(getStatusBadgeStyles(item.status))}
                    >
                      {getStatusLabel(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodLabel(item.paymentMethod)}
                  </TableCell>
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
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  No sales records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
