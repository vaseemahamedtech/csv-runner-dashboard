import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Run, TrendingUp, Award, Target } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  metrics: {
    totalRuns: number;
    totalMiles: number;
    averageMiles: number;
    minMiles: number;
    maxMiles: number;
  };
}

export function MetricsCard({ title, metrics }: MetricsCardProps) {
  const statCards = [
    {
      label: 'Total Runs',
      value: metrics.totalRuns,
      icon: Run,
      color: 'text-blue-600'
    },
    {
      label: 'Total Miles',
      value: metrics.totalMiles.toFixed(1),
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'Average Miles',
      value: metrics.averageMiles.toFixed(1),
      icon: Target,
      color: 'text-purple-600'
    },
    {
      label: 'Min/Max Miles',
      value: `${metrics.minMiles.toFixed(1)} / ${metrics.maxMiles.toFixed(1)}`,
      icon: Award,
      color: 'text-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}