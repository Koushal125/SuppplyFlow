
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Package, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

type Activity = {
  id: string;
  description: string;
  type: string; // Changed from 'sale' | 'inventory' to string to match DB response
  created_at: string;
};

const getIcon = (type: Activity['type']) => {
  switch (type) {
    case 'sale':
      return <ShoppingCart className="h-4 w-4" />;
    case 'inventory':
      return <Package className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getIconColor = (type: Activity['type']) => {
  switch (type) {
    case 'sale':
      return 'bg-green-100 text-green-600';
    case 'inventory':
      return 'bg-blue-100 text-blue-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Initial fetch
    fetchActivities();

    // Subscribe to changes
    const channel = supabase
      .channel('recent-activities')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'recent_activities'
      }, () => {
        fetchActivities();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('recent_activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching activities:', error);
      return;
    }

    setActivities(data as Activity[]);
  };

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
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.created_at).toLocaleDateString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
