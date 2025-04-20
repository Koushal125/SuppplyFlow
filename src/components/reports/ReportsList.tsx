
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DownloadCloud, FileText, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock reports data
type Report = {
  id: string;
  name: string;
  type: "inventory" | "sales" | "financial" | "analytics";
  format: "pdf" | "xlsx" | "csv";
  generatedBy: string;
  date: string;
  size: string;
};

const reportsData: Report[] = [
  {
    id: "REP001",
    name: "Monthly Inventory Report - October 2023",
    type: "inventory",
    format: "pdf",
    generatedBy: "System",
    date: "2023-10-31",
    size: "1.2 MB",
  },
  {
    id: "REP002",
    name: "Q3 Sales Analysis",
    type: "sales",
    format: "xlsx",
    generatedBy: "John Smith",
    date: "2023-10-15",
    size: "3.4 MB",
  },
  {
    id: "REP003",
    name: "Financial Statement - September 2023",
    type: "financial",
    format: "pdf",
    generatedBy: "System",
    date: "2023-10-05",
    size: "2.1 MB",
  },
  {
    id: "REP004",
    name: "Top Selling Products - Q3 2023",
    type: "analytics",
    format: "xlsx",
    generatedBy: "Sarah Johnson",
    date: "2023-10-12",
    size: "1.8 MB",
  },
  {
    id: "REP005",
    name: "Low Stock Alerts - October 2023",
    type: "inventory",
    format: "csv",
    generatedBy: "System",
    date: "2023-10-20",
    size: "0.8 MB",
  },
  {
    id: "REP006",
    name: "Sales by Region - September 2023",
    type: "sales",
    format: "xlsx",
    generatedBy: "David Wilson",
    date: "2023-10-08",
    size: "2.3 MB",
  },
  {
    id: "REP007",
    name: "Customer Purchasing Patterns",
    type: "analytics",
    format: "pdf",
    generatedBy: "System",
    date: "2023-10-17",
    size: "1.5 MB",
  },
  {
    id: "REP008",
    name: "Monthly Expense Report - October 2023",
    type: "financial",
    format: "csv",
    generatedBy: "System",
    date: "2023-10-31",
    size: "1.1 MB",
  },
];

const reportTypeOptions = [
  "All Types",
  "inventory",
  "sales",
  "financial",
  "analytics",
];

const reportFormatOptions = ["All Formats", "pdf", "xlsx", "csv"];

function getTypeBadgeStyles(type: Report["type"]) {
  switch (type) {
    case "inventory":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800";
    case "sales":
      return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
    case "financial":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800";
    case "analytics":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800";
  }
}

function getTypeLabel(type: Report["type"]) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function getFormatBadgeStyles(format: Report["format"]) {
  switch (format) {
    case "pdf":
      return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
    case "xlsx":
      return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
    case "csv":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800";
  }
}

export function ReportsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [formatFilter, setFormatFilter] = useState("All Formats");

  // Filter reports data based on search, type, and format
  const filteredData = reportsData.filter((report) => {
    const matchesSearch = report.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "All Types" || report.type === typeFilter;
    const matchesFormat =
      formatFilter === "All Formats" || report.format === formatFilter;
    return matchesSearch && matchesType && matchesFormat;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reports..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {reportTypeOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "All Types"
                    ? type
                    : getTypeLabel(type as Report["type"])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Formats" />
            </SelectTrigger>
            <SelectContent>
              {reportFormatOptions.map((format) => (
                <SelectItem key={format} value={format}>
                  {format === "All Formats" ? format : format.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-1">
            <FileText className="h-4 w-4" /> Generate Report
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Generated By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    <Badge className={cn(getTypeBadgeStyles(report.type))}>
                      {getTypeLabel(report.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(getFormatBadgeStyles(report.format))}
                    >
                      {report.format.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.generatedBy}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.size}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary"
                    >
                      <DownloadCloud className="h-4 w-4 mr-1" /> Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
