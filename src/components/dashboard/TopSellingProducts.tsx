
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Package } from 'lucide-react';

type Product = {
  id: number;
  name: string;
  category: string;
  sales: number;
  maxSales: number;
};

const products: Product[] = [
  { id: 1, name: 'Masala Chai', category: 'Beverages', sales: 583, maxSales: 1000 },
  { id: 2, name: 'Basmati Rice', category: 'Groceries', sales: 429, maxSales: 1000 },
  { id: 3, name: 'Cotton Kurta', category: 'Clothing', sales: 376, maxSales: 1000 },
  { id: 4, name: 'Spice Box Set', category: 'Kitchen', sales: 298, maxSales: 1000 },
  { id: 5, name: 'Ayurvedic Oil', category: 'Health', sales: 241, maxSales: 1000 },
];

export function TopSellingProducts() {
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
