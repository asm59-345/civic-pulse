import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  User, 
  ChevronRight,
  AlertTriangle,
  Wrench,
  Droplets,
  Zap,
  Heart,
  Shield,
  HelpCircle
} from 'lucide-react';
import { Grievance, GrievanceCategory, GrievanceStatus } from '@/types/grievance';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface GrievanceListProps {
  grievances: Grievance[];
  onSelect: (grievance: Grievance) => void;
  selectedId?: string;
}

const categoryIcons: Record<GrievanceCategory, typeof MapPin> = {
  infrastructure: Wrench,
  sanitation: AlertTriangle,
  water: Droplets,
  electricity: Zap,
  health: Heart,
  police: Shield,
  other: HelpCircle,
};

const statusStyles: Record<GrievanceStatus, string> = {
  pending: 'status-badge bg-warning/15 text-warning border border-warning/30',
  active: 'status-badge bg-info/15 text-info border border-info/30',
  resolved: 'status-badge bg-success/15 text-success border border-success/30',
  urgent: 'status-badge bg-destructive/15 text-destructive border border-destructive/30 animate-pulse',
};

const urgencyIndicator: Record<string, string> = {
  low: 'bg-success',
  medium: 'bg-warning',
  high: 'bg-accent',
  critical: 'bg-destructive animate-pulse',
};

export function GrievanceList({ grievances, onSelect, selectedId }: GrievanceListProps) {
  return (
    <div className="space-y-3">
      {grievances.map((grievance, index) => {
        const CategoryIcon = categoryIcons[grievance.category];
        const isSelected = selectedId === grievance.id;
        
        return (
          <motion.div
            key={grievance.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                'p-4 cursor-pointer transition-all duration-200 hover:shadow-lg group',
                isSelected 
                  ? 'ring-2 ring-accent shadow-lg bg-accent/5' 
                  : 'hover:bg-muted/50'
              )}
              onClick={() => onSelect(grievance)}
            >
              <div className="flex items-start gap-3">
                {/* Urgency Indicator */}
                <div className={cn(
                  'w-1 h-full min-h-[60px] rounded-full flex-shrink-0',
                  urgencyIndicator[grievance.urgency]
                )} />
                
                {/* Category Icon */}
                <div className={cn(
                  'p-2 rounded-lg flex-shrink-0',
                  grievance.status === 'urgent' ? 'bg-destructive/10' : 'bg-muted'
                )}>
                  <CategoryIcon className={cn(
                    'h-5 w-5',
                    grievance.status === 'urgent' ? 'text-destructive' : 'text-muted-foreground'
                  )} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-foreground truncate">
                      {grievance.title}
                    </h4>
                    <span className={statusStyles[grievance.status]}>
                      {grievance.status === 'urgent' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
                      )}
                      {grievance.status.charAt(0).toUpperCase() + grievance.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                    {grievance.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {grievance.location.ward}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(grievance.createdAt, { addSuffix: true })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {grievance.citizenName}
                    </span>
                  </div>
                  
                  <p className="text-xs font-mono text-muted-foreground/70 mt-2">
                    {grievance.ticketNumber}
                  </p>
                </div>
                
                {/* Arrow */}
                <ChevronRight className={cn(
                  'h-5 w-5 text-muted-foreground transition-transform flex-shrink-0',
                  'group-hover:translate-x-1',
                  isSelected && 'text-accent'
                )} />
              </div>
              
              {/* AI Badge */}
              {grievance.aiSuggestion && (
                <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium">
                    ✨ AI Insights Available
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(grievance.aiSuggestion.confidence * 100)}% confidence
                  </span>
                </div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
