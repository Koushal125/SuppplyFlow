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

export type SaleItem = {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentMethod: "credit_card" | "cash" | "bank_transfer";
};

const salesData: SaleItem[] = [];

const statusOptions = ["All Statuses", "pending", "processing", "completed", "cancelled"];
const paymentOptions = ["All Payment Methods", "credit_card", "cash", "bank_transfer"];

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
    case "cash":
      return "Cash";
    case "bank_transfer":
      return "Bank Transfer";
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

  const [salesData, setSalesData] = useState<SaleItem[]>([]);

  React.useEffect(() => {
    const fetchSales = async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sales:', error);
        return;
      }

      const formattedSales: SaleItem[] = data.map(sale => ({
        id: sale.id,
        orderId: sale.order_id,
        customer: sale.customer,
        date: new Date(sale.created_at).toISOString().split('T')[0],
        items: sale.items,
        total: sale.total,
        status: sale.status as SaleItem['status'],
        paymentMethod: sale.payment_method as SaleItem['paymentMethod']
      }));

      setSalesData(formattedSales);
    };

    fetchSales();

    // Set up real-time subscription
    const channel = supabase
      .channel('sales-changes')
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'sales' },
        (payload) => {
          const newSale = payload.new;
          const formattedSale: SaleItem = {
            id: newSale.id,
            orderId: newSale.order_id,
            customer: newSale.customer,
            date: new Date(newSale.created_at).toISOString().split('T')[0],
            items: newSale.items,
            total: newSale.total,
            status: newSale.status as SaleItem['status'],
            paymentMethod: newSale.payment_method as SaleItem['paymentMethod']
          };
          
          setSalesData(prev => [formattedSale, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
