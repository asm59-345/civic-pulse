import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Camera, 
  MapPin, 
  Send, 
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Brain,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { GrievanceCategory } from '@/types/grievance';
import { categoryLabels } from '@/data/mockData';
import { toast } from 'sonner';
import { processGrievancePipeline } from '@/services/grievanceService';

interface SubmitGrievanceFormProps {
  onClose?: () => void;
  onSubmit?: (data: any) => void;
}

const categories: { id: GrievanceCategory; label: string; icon: string }[] = [
  { id: 'infrastructure', label: 'Roads & Infrastructure', icon: '🛤️' },
  { id: 'sanitation', label: 'Sanitation & Drainage', icon: '🧹' },
  { id: 'water', label: 'Water Supply', icon: '💧' },
  { id: 'electricity', label: 'Electricity', icon: '⚡' },
  { id: 'health', label: 'Health & Hygiene', icon: '🏥' },
  { id: 'police', label: 'Safety & Security', icon: '🛡️' },
  { id: 'other', label: 'Other Issues', icon: '📋' },
];

export function SubmitGrievanceForm({ onClose, onSubmit }: SubmitGrievanceFormProps) {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GrievanceCategory | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [aiClassification, setAiClassification] = useState<any>(null);
  const [processingStage, setProcessingStage] = useState('');

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setDescription('Mere ghar ke samne paani bhara hai. Drain block hai aur paani nikal nahi raha hai. Please help.');
        setIsRecording(false);
        toast.success('Voice transcribed successfully', {
          description: 'AI detected Hindi language and transcribed your complaint.',
        });
      }, 3000);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: '45, Main Street, Sector 5, Ward 4',
          });
          toast.success('Location captured', {
            description: 'Your location has been added to the complaint.',
          });
        },
        () => {
          setLocation({
            lat: 28.6139,
            lng: 77.2090,
            address: '45, Main Street, Sector 5, Ward 4',
          });
          toast.info('Using approximate location');
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!description || !category || !location || !citizenName) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Stage 1: Submitting
      setProcessingStage('Submitting grievance...');
      
      // Stage 2: AI Classification
      setTimeout(() => setProcessingStage('AI classifying intent...'), 1000);
      
      // Stage 3: Semantic Search
      setTimeout(() => setProcessingStage('Searching historical cases...'), 2500);
      
      // Stage 4: Geo-cluster Analysis
      setTimeout(() => setProcessingStage('Analyzing geo-clusters...'), 4000);
      
      // Stage 5: Generating Insights
      setTimeout(() => setProcessingStage('Generating AI insights...'), 5500);

      const result = await processGrievancePipeline({
        description,
        category,
        citizenName,
        citizenPhone,
        locationLat: location.lat,
        locationLng: location.lng,
        locationAddress: location.address,
        locationWard: 'Ward 4',
      });

      if (result) {
        setTicketNumber(result.ticketNumber);
        setAiClassification(result.classification);
        
        toast.success('Grievance submitted successfully!', {
          description: `Ticket ${result.ticketNumber} has been created. AI is analyzing your complaint.`,
        });
        
        setStep(4);
        
        if (onSubmit) {
          onSubmit(result);
        }
      } else {
        toast.error('Failed to submit grievance', {
          description: 'Please try again.',
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
      setProcessingStage('');
    }
  };

  return (
    <Card variant="elevated" className="w-full max-w-2xl mx-auto">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Submit New Grievance</CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon-sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                  step >= s
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
              </div>
              {s < 3 && (
                <div className={cn(
                  'w-12 h-1 rounded-full transition-all',
                  step > s ? 'bg-accent' : 'bg-muted'
                )} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Step 1: Describe Issue */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full p-3 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full p-3 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Describe your issue *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your problem in any language (Hindi, English, etc.)..."
                className="w-full h-32 p-3 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-accent resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Or use:</span>
              <Button
                variant={isRecording ? 'destructive' : 'outline'}
                size="sm"
                onClick={handleVoiceRecord}
                className="gap-2"
              >
                <Mic className={cn('h-4 w-4', isRecording && 'animate-pulse')} />
                {isRecording ? 'Recording...' : 'Voice Input'}
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Camera className="h-4 w-4" />
                Add Photo
              </Button>
            </div>

            {isRecording && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm">Listening... Speak in any language</span>
              </div>
            )}

            <Button
              className="w-full"
              variant="accent"
              disabled={!description || !citizenName}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </motion.div>
        )}

        {/* Step 2: Category & Location */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-3">
                Select Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      'p-3 rounded-lg border-2 text-left transition-all',
                      category === cat.id
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    )}
                  >
                    <span className="text-lg mr-2">{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Location
              </label>
              {location ? (
                <div className="p-3 rounded-lg bg-success/10 border border-success/20 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-medium">{location.address}</p>
                    <p className="text-xs text-muted-foreground">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleGetLocation}
                >
                  <MapPin className="h-4 w-4" />
                  Capture My Location
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                variant="accent"
                disabled={!category || !location}
                onClick={() => setStep(3)}
              >
                Review & Submit
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-lg bg-muted space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Name</p>
                <p className="text-sm mt-1">{citizenName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Description</p>
                <p className="text-sm mt-1">{description}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Category</p>
                <p className="text-sm mt-1">{category && categoryLabels[category]}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                <p className="text-sm mt-1">{location?.address}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 flex items-start gap-3">
              <Brain className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">AI Pipeline Ready</p>
                <p className="text-xs text-muted-foreground">
                  Once submitted, our AI will: classify intent → search historical cases → 
                  analyze geo-clusters → generate officer insights
                </p>
              </div>
            </div>

            {isSubmitting && processingStage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg bg-info/10 border border-info/20 flex items-center gap-3"
              >
                <Sparkles className="h-5 w-5 text-info animate-pulse" />
                <span className="text-sm font-medium">{processingStage}</span>
              </motion.div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} disabled={isSubmitting}>
                Back
              </Button>
              <Button
                className="flex-1"
                variant="accent"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Grievance
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-2">Grievance Submitted!</h3>
            <p className="text-muted-foreground mb-4">
              Your ticket has been created and AI analysis is complete.
            </p>
            <div className="p-4 rounded-lg bg-muted inline-block mb-4">
              <p className="text-sm text-muted-foreground">Ticket Number</p>
              <p className="text-xl font-mono font-bold">{ticketNumber}</p>
            </div>

            {aiClassification && (
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 text-left mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold">AI Classification</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Category:</span> {aiClassification.title || aiClassification.category}</p>
                  <p><span className="text-muted-foreground">Urgency:</span> {aiClassification.urgency}</p>
                  <p><span className="text-muted-foreground">Confidence:</span> {Math.round((aiClassification.confidence || 0) * 100)}%</p>
                </div>
              </div>
            )}

            <Button variant="accent" onClick={() => {
              setStep(1);
              setDescription('');
              setCategory(null);
              setLocation(null);
              setCitizenName('');
              setCitizenPhone('');
              setTicketNumber('');
              setAiClassification(null);
            }}>
              Submit Another Grievance
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
