
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/hooks/useInventory";
import { toast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

export function InventoryAddDialog() {
  const { addItem } = useInventory();
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    threshold: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addItem.mutateAsync({
        name: fields.name,
        sku: fields.sku,
        category: fields.category,
        price: Number(fields.price),
        stock: Number(fields.stock),
        threshold: Number(fields.threshold),
      });
      toast({ title: "Item added", description: "The inventory item was added successfully." });
      setOpen(false);
      setFields({ name: "", sku: "", category: "", price: "", stock: "", threshold: "" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input placeholder="Product Name" required value={fields.name} onChange={e => setFields(f => ({ ...f, name: e.target.value }))} />
          <Input placeholder="SKU" required value={fields.sku} onChange={e => setFields(f => ({ ...f, sku: e.target.value }))} />
          <Input placeholder="Category" required value={fields.category} onChange={e => setFields(f => ({ ...f, category: e.target.value }))} />
          <Input type="number" step="0.01" min="0" placeholder="Price" required value={fields.price} onChange={e => setFields(f => ({ ...f, price: e.target.value }))} />
          <Input type="number" min="0" placeholder="Stock" required value={fields.stock} onChange={e => setFields(f => ({ ...f, stock: e.target.value }))} />
          <Input type="number" min="0" placeholder="Threshold" required value={fields.threshold} onChange={e => setFields(f => ({ ...f, threshold: e.target.value }))} />
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Item"}</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
