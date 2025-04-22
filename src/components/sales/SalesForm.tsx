
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

export function SalesForm() {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState({
    customer: "",
    items: "",
    total: "",
    payment_method: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderId = Math.random().toString(36).substring(7).toUpperCase();
      
      const { error } = await supabase
        .from('sales')
        .insert([{
          order_id: orderId,
          customer: fields.customer,
          items: parseInt(fields.items),
          total: parseFloat(fields.total),
          payment_method: fields.payment_method,
          status: fields.status
        }]);

      if (error) throw error;
      
      toast({ title: "Sale recorded", description: "The sale has been successfully recorded." });
      setOpen(false);
      setFields({ customer: "", items: "", total: "", payment_method: "", status: "pending" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Record Sale
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record New Sale</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Customer Name"
            required
            value={fields.customer}
            onChange={e => setFields(f => ({ ...f, customer: e.target.value }))}
          />
          <Input
            type="number"
            min="1"
            placeholder="Number of Items"
            required
            value={fields.items}
            onChange={e => setFields(f => ({ ...f, items: e.target.value }))}
          />
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="Total Amount"
            required
            value={fields.total}
            onChange={e => setFields(f => ({ ...f, total: e.target.value }))}
          />
          <Select
            value={fields.payment_method}
            onValueChange={value => setFields(f => ({ ...f, payment_method: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Recording..." : "Record Sale"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
