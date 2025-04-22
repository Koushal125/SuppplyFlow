
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import React, { useState, useEffect } from 'react';

type Product = {
  id: number;
  name: string;
  category: string;
  sales: number;
  maxSales: number;
};

export function TopSellingProducts() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Masala Chai', category: 'Beverages', sales: 0, maxSales: 1000 },
    { id: 2, name: 'Basmati Rice', category: 'Groceries', sales: 0, maxSales: 1000 },
    { id: 3, name: 'Cotton Kurta', category: 'Clothing', sales: 0, maxSales: 1000 },
    { id: 4, name: 'Spice Box Set', category: 'Kitchen', sales: 0, maxSales: 1000 },
    { id: 5, name: 'Ayurvedic Oil', category: 'Health', sales: 0, maxSales: 1000 },
  ]);

  useEffect(() => {
    const fetchProductSales = async () => {
      const { data: salesData, error } = await supabase
        .from('sales')
        .select('*');

      if (error) {
        console.error('Error fetching sales:', error);
        return;
      }

      const updatedProducts = products.map(product => {
        const productSales = salesData
          .filter(sale => 
            sale.items > 0 && 
            (
              product.name.toLowerCase().includes(sale.customer.toLowerCase()) ||
              sale.customer.toLowerCase().includes(product.name.toLowerCase())
            )
          )
          .reduce((total, sale) => total + sale.items, 0);

        return {
          ...product,
          sales: productSales
        };
      });

      setProducts(updatedProducts);
    };

    fetchProductSales();

    // Real-time subscription
    const channel = supabase
      .channel('sales-changes')
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'sales' },
        () => fetchProductSales()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Products with highest sales this month</CardDescription>
          </div>
          <Package className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {products.map((product) => (
            <div key={product.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <p className="font-medium">{product.sales} units</p>
              </div>
              <Progress value={(product.sales / product.maxSales) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
