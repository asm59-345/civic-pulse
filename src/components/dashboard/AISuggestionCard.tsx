import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AISuggestion } from '@/types/grievance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  ticketNumber: string;
  onApply?: () => void;
}

export function AISuggestionCard({ suggestion, ticketNumber, onApply }: AISuggestionCardProps) {
  const confidenceColor = suggestion.confidence >= 0.9 
    ? 'text-success' 
    : suggestion.confidence >= 0.7 
      ? 'text-warning' 
      : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card variant="gradient" className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent/20">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <CardTitle className="text-lg">AI Decision Support</CardTitle>
            </div>
            <span className={cn('text-sm font-mono font-semibold', confidenceColor)}>
              {Math.round(suggestion.confidence * 100)}% confidence
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Analysis for {ticketNumber}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Diagnosis */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertCircle className="h-4 w-4 text-info" />
              Diagnosis
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
              {suggestion.diagnosis}
            </p>
          </div>

          {/* Recommended Actions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Recommended Actions
            </div>
            <ul className="space-y-1.5 pl-6">
              {suggestion.recommendedAction.map((action, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {idx + 1}
                  </span>
                  {action}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="h-4 w-4 text-warning" />
              Predicted Timeline
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              {suggestion.predictedTimeline}
            </p>
          </div>

          {/* Similar Cases */}
          {suggestion.similarCases && suggestion.similarCases.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Similar Historical Cases
              </p>
              <div className="space-y-2">
                {suggestion.similarCases.map((caseItem, idx) => (
                  <div
                    key={caseItem.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{caseItem.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Resolved in {caseItem.timeToResolve}h • {caseItem.similarity}% similar
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button 
            variant="accent" 
            className="w-full mt-4" 
            onClick={onApply}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Apply AI Recommendations
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
