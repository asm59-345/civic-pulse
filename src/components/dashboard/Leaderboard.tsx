import { motion } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp, Clock, Award } from 'lucide-react';
import { Officer } from '@/types/grievance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  officers: Officer[];
  currentUserId?: string;
}

const rankStyles = [
  { bg: 'bg-gradient-to-br from-amber-400 to-amber-600', text: 'text-amber-900', icon: Trophy },
  { bg: 'bg-gradient-to-br from-slate-300 to-slate-500', text: 'text-slate-800', icon: Medal },
  { bg: 'bg-gradient-to-br from-orange-400 to-orange-600', text: 'text-orange-900', icon: Award },
];

export function Leaderboard({ officers, currentUserId }: LeaderboardProps) {
  return (
    <Card variant="elevated">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-karma-gold/20">
              <Trophy className="h-5 w-5 text-amber-600" />
            </div>
            <CardTitle className="text-lg">Karma Leaderboard</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground font-medium">This Month</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {officers.slice(0, 5).map((officer, index) => {
          const isCurrentUser = officer.id === currentUserId;
          const rankStyle = rankStyles[index] || { bg: 'bg-muted', text: 'text-muted-foreground', icon: Star };
          const RankIcon = rankStyle.icon;
          
          return (
            <motion.div
              key={officer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-all',
                isCurrentUser 
                  ? 'bg-accent/10 ring-1 ring-accent' 
                  : 'hover:bg-muted/50'
              )}
            >
              {/* Rank Badge */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                index < 3 ? rankStyle.bg : 'bg-muted'
              )}>
                {index < 3 ? (
                  <RankIcon className={cn('h-4 w-4', rankStyle.text)} />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                )}
              </div>
              
              {/* Officer Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground truncate">
                    {officer.name}
                  </p>
                  {isCurrentUser && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent text-accent-foreground font-semibold">
                      YOU
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{officer.department}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {officer.avgResolutionTime}h avg
                  </span>
                </div>
              </div>
              
              {/* Karma Score */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-lg text-foreground">
                  {officer.karmaScore.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-success text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{Math.floor(Math.random() * 50 + 10)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Badges Preview */}
        <div className="pt-3 mt-3 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Your Badges
          </p>
          <div className="flex gap-2 flex-wrap">
            {officers[0]?.badges.slice(0, 4).map((badge) => (
              <span
                key={badge.id}
                className="px-2 py-1 rounded-md bg-muted text-sm"
                title={badge.description}
              >
                {badge.icon} {badge.name}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
