
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { category: 'Groceries', stock: 45, optimum: 60 },
  { category: 'Clothing', stock: 25, optimum: 30 },
  { category: 'Kitchen', stock: 30, optimum: 35 },
  { category: 'Health', stock: 20, optimum: 25 },
  { category: 'Beverages', stock: 15, optimum: 20 },
  { category: 'Handicrafts', stock: 10, optimum: 15 },
];

export function InventoryLevelChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Inventory Levels by Category</CardTitle>
        <CardDescription>Current stock vs. optimum levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 25, left: 10, bottom: 20 }}
            >
              <XAxis 
                dataKey="category" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }} 
              />
              <Bar 
                dataKey="stock" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
                name="Current Stock"
              />
              <Bar 
                dataKey="optimum" 
                fill="hsl(var(--accent))" 
                radius={[4, 4, 0, 0]} 
                name="Optimum Level"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
