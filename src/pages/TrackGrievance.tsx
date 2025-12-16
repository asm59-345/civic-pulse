import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  FileText,
  MapPin,
  User,
  Calendar,
  MessageSquare,
  Star,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GrievanceDetails {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  category: string;
  status: string;
  urgency: string;
  citizen_name: string;
  citizen_phone: string | null;
  citizen_email: string | null;
  location_address: string | null;
  location_ward: string | null;
  created_at: string;
  updated_at: string;
  feedback: number | null;
  ai_suggestion: any;
}

const statusConfig = {
  pending: { color: 'bg-yellow-500', icon: Clock, label: 'Pending Review' },
  active: { color: 'bg-blue-500', icon: AlertCircle, label: 'Under Process' },
  resolved: { color: 'bg-green-500', icon: CheckCircle2, label: 'Resolved' },
  urgent: { color: 'bg-red-500', icon: AlertTriangle, label: 'Urgent' },
};

const TrackGrievance = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [grievance, setGrievance] = useState<GrievanceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAppeal, setShowAppeal] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!ticketNumber.trim()) {
      toast.error('Please enter a ticket number');
      return;
    }

    setIsLoading(true);
    setGrievance(null);

    try {
      const { data, error } = await supabase
        .from('grievances')
        .select('*')
        .eq('ticket_number', ticketNumber.toUpperCase())
        .single();

      if (error || !data) {
        toast.error('No grievance found with this ticket number');
        return;
      }

      setGrievance(data as GrievanceDetails);
      toast.success('Grievance found!');
    } catch (error) {
      toast.error('Error searching for grievance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (rating: number) => {
    if (!grievance) return;

    try {
      const { error } = await supabase
        .from('grievances')
        .update({ feedback: rating })
        .eq('id', grievance.id);

      if (error) throw error;

      setFeedbackRating(rating);
      setGrievance({ ...grievance, feedback: rating });
      toast.success('Thank you for your feedback!');

      if (rating <= 2) {
        setShowAppeal(true);
      }
    } catch (error) {
      toast.error('Error submitting feedback');
    }
  };

  const handleAppeal = async () => {
    if (!grievance || !appealReason.trim()) {
      toast.error('Please provide a reason for your appeal');
      return;
    }

    try {
      // Update status back to pending and add appeal reason
      const { error } = await supabase
        .from('grievances')
        .update({ 
          status: 'pending',
          description: `${grievance.description}\n\n--- APPEAL ---\n${appealReason}`
        })
        .eq('id', grievance.id);

      if (error) throw error;

      toast.success('Appeal submitted successfully! Your grievance will be reviewed again.');
      setShowAppeal(false);
      setAppealReason('');
      handleSearch(); // Refresh data
    } catch (error) {
      toast.error('Error submitting appeal');
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Submitted', completed: true },
      { key: 'active', label: 'Under Review', completed: grievance?.status !== 'pending' },
      { key: 'resolved', label: 'Resolved', completed: grievance?.status === 'resolved' },
    ];
    return steps;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <h1 className="text-xl font-bold">Track Your Grievance</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div ref={formRef} className="max-w-2xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Enter Your Ticket Number
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g., SGH-20241215-1234"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Track Status'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Your ticket number was provided when you submitted your grievance
              </p>
            </CardContent>
          </Card>

          {/* Grievance Details */}
          {grievance && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-5 left-0 right-0 h-1 bg-muted" />
                    <div 
                      className="absolute top-5 left-0 h-1 bg-primary transition-all"
                      style={{ 
                        width: grievance.status === 'resolved' ? '100%' : 
                               grievance.status === 'active' || grievance.status === 'urgent' ? '50%' : '0%' 
                      }}
                    />
                    {getStatusSteps().map((step, index) => (
                      <div key={step.key} className="relative z-10 flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {step.completed ? <CheckCircle2 className="h-5 w-5" /> : (index + 1)}
                        </div>
                        <span className="text-sm mt-2 font-medium">{step.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Grievance Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{grievance.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ticket: {grievance.ticket_number}
                      </p>
                    </div>
                    <Badge className={statusConfig[grievance.status as keyof typeof statusConfig]?.color}>
                      {statusConfig[grievance.status as keyof typeof statusConfig]?.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Category</p>
                        <p className="text-sm text-muted-foreground capitalize">{grievance.category}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Submitted By</p>
                        <p className="text-sm text-muted-foreground">{grievance.citizen_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          {grievance.location_address || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Submitted On</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(grievance.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Description</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {grievance.description}
                    </p>
                  </div>

                  {/* AI Insights */}
                  {grievance.ai_suggestion && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        AI Analysis
                      </p>
                      <div className="bg-muted/50 rounded-lg p-4 text-sm">
                        <p><strong>Diagnosis:</strong> {grievance.ai_suggestion.diagnosis}</p>
                        {grievance.ai_suggestion.predictedTimeline && (
                          <p className="mt-2">
                            <strong>Expected Resolution:</strong> {grievance.ai_suggestion.predictedTimeline}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Feedback Section - Only show for resolved grievances */}
              {grievance.status === 'resolved' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Rate Your Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {grievance.feedback ? (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">
                          You rated this resolution: {grievance.feedback}/5 stars
                        </p>
                        {grievance.feedback <= 2 && !showAppeal && (
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => setShowAppeal(true)}
                          >
                            File an Appeal
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                          How satisfied are you with the resolution?
                        </p>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Button
                              key={rating}
                              variant="outline"
                              size="lg"
                              className={`w-12 h-12 ${feedbackRating === rating ? 'bg-yellow-100 border-yellow-500' : ''}`}
                              onClick={() => handleFeedback(rating)}
                            >
                              <Star className={`h-6 w-6 ${rating <= (feedbackRating || 0) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Rating 1-2 stars will allow you to file an appeal
                        </p>
                      </div>
                    )}

                    {/* Appeal Form */}
                    {showAppeal && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 pt-6 border-t"
                      >
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-destructive" />
                          File an Appeal
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Not satisfied with the resolution? Provide details and your grievance will be reviewed again.
                        </p>
                        <Textarea
                          placeholder="Explain why you're not satisfied with the resolution..."
                          value={appealReason}
                          onChange={(e) => setAppealReason(e.target.value)}
                          rows={4}
                          className="mb-4"
                        />
                        <div className="flex gap-3">
                          <Button onClick={handleAppeal}>
                            Submit Appeal
                          </Button>
                          <Button variant="outline" onClick={() => setShowAppeal(false)}>
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrackGrievance;
