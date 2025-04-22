
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { month: 'Jan', sales: 120000 },
  { month: 'Feb', sales: 150000 },
  { month: 'Mar', sales: 180000 },
  { month: 'Apr', sales: 140000 },
  { month: 'May', sales: 190000 },
  { month: 'Jun', sales: 220000 },
  { month: 'Jul', sales: 250000 },
  { month: 'Aug', sales: 270000 },
  { month: 'Sep', sales: 300000 },
  { month: 'Oct', sales: 290000 },
  { month: 'Nov', sales: 320000 },
  { month: 'Dec', sales: 380000 },
];

export function SalesChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly sales performance for the current year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 25, left: 10, bottom: 20 }}
            >
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
                dot={{ stroke: 'hsl(var(--primary))', fill: 'white', strokeWidth: 2, r: 4 }}
                activeDot={{ stroke: 'hsl(var(--primary))', fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
