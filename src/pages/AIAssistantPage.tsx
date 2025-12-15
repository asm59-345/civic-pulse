import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Briefcase, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIChat } from '@/components/ai-assistant/AIChat';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

const AIAssistantPage = () => {
  const [mode, setMode] = useState<'citizen' | 'officer'>('citizen');
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP entrance animations
    const tl = gsap.timeline();
    
    if (headerRef.current) {
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
    
    if (containerRef.current) {
      tl.fromTo(
        containerRef.current,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header
        ref={headerRef}
        className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold">SGH AI Assistant</h1>
                <p className="text-xs text-muted-foreground">Your intelligent civic helper</p>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setMode('citizen')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300',
                  mode === 'citizen'
                    ? 'bg-info text-info-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <UserCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Citizen</span>
              </button>
              <button
                onClick={() => setMode('officer')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300',
                  mode === 'officer'
                    ? 'bg-success text-success-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Officer</span>
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div
          ref={containerRef}
          className="h-[calc(100vh-8rem)] bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
        >
          <AIChat mode={mode} />
        </div>
      </main>
    </div>
  );
};

export default AIAssistantPage;
