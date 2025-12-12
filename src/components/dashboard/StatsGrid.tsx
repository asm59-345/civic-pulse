import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  MapPin 
} from 'lucide-react';
import { DashboardStats } from '@/types/grievance';
import { cn } from '@/lib/utils';

interface StatsGridProps {
  stats: DashboardStats;
}

const statItems = [
  {
    key: 'totalGrievances',
    label: 'Total Grievances',
    icon: FileText,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'pendingGrievances',
    label: 'Pending Review',
    icon: Clock,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    format: (v: number) => v.toString(),
  },
  {
    key: 'resolvedToday',
    label: 'Resolved Today',
    icon: CheckCircle2,
    color: 'text-success',
    bgColor: 'bg-success/10',
    format: (v: number) => v.toString(),
  },
  {
    key: 'avgResolutionTime',
    label: 'Avg. Resolution Time',
    icon: AlertTriangle,
    color: 'text-info',
    bgColor: 'bg-info/10',
    format: (v: number) => `${v}h`,
  },
  {
    key: 'citizenSatisfaction',
    label: 'Citizen Satisfaction',
    icon: Star,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    format: (v: number) => `${v}/5`,
  },
  {
    key: 'hotspots',
    label: 'Active Hotspots',
    icon: MapPin,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    format: (v: number) => v.toString(),
  },
];

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        const value = stats[item.key as keyof DashboardStats];
        
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="stat-card bg-card border border-border"
          >
            <div className={cn('p-2.5 rounded-lg w-fit mb-3', item.bgColor)}>
              <Icon className={cn('h-5 w-5', item.color)} />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight">
                {item.format(value as number)}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {item.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
