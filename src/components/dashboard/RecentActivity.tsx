
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Package, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type Activity = {
  id: number;
  description: string;
  type: 'sale' | 'inventory' | 'user' | 'report';
  timestamp: string;
};

const activities: Activity[] = [
  { id: 1, description: 'New sale: Order #1089', type: 'sale', timestamp: '10 minutes ago' },
  { id: 2, description: 'Inventory updated: +50 Smart Watches', type: 'inventory', timestamp: '45 minutes ago' },
  { id: 3, description: 'User Alex logged in', type: 'user', timestamp: '1 hour ago' },
  { id: 4, description: 'Monthly sales report generated', type: 'report', timestamp: '2 hours ago' },
  { id: 5, description: 'Inventory low alert: Wireless Earbuds', type: 'inventory', timestamp: '3 hours ago' },
  { id: 6, description: 'New sale: Order #1088', type: 'sale', timestamp: '5 hours ago' },
];

const getIcon = (type: Activity['type']) => {
  switch (type) {
    case 'sale':
      return <ShoppingCart className="h-4 w-4" />;
    case 'inventory':
      return <Package className="h-4 w-4" />;
    case 'user':
      return <User className="h-4 w-4" />;
    case 'report':
      return <FileText className="h-4 w-4" />;
  }
};

const getIconColor = (type: Activity['type']) => {
  switch (type) {
    case 'sale':
      return 'bg-green-100 text-green-600';
    case 'inventory':
      return 'bg-blue-100 text-blue-600';
    case 'user':
      return 'bg-purple-100 text-purple-600';
    case 'report':
      return 'bg-amber-100 text-amber-600';
  }
};

export function RecentActivity() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={cn('p-2 rounded-full', getIconColor(activity.type))}>
                {getIcon(activity.type)}
              </div>
              <div>
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
