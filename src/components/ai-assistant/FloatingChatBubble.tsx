import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, UserCircle, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIChat } from './AIChat';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

export function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'citizen' | 'officer'>('citizen');
  const bubbleRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bubbleRef.current) {
      // Pulse animation on bubble
      gsap.to(bubbleRef.current, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setIsOpen(false),
      });
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Bubble */}
      {!isOpen && (
        <div
          ref={bubbleRef}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="w-14 h-14 rounded-full gradient-accent shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-shadow"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-6 right-6 z-50 w-[380px] h-[560px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Mode Switcher */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setMode('citizen')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                mode === 'citizen'
                  ? 'bg-info/10 text-info border-b-2 border-info'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <UserCircle className="h-4 w-4" />
              Citizen
            </button>
            <button
              onClick={() => setMode('officer')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                mode === 'officer'
                  ? 'bg-success/10 text-success border-b-2 border-success'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Briefcase className="h-4 w-4" />
              Officer
            </button>
            <button
              onClick={handleClose}
              className="px-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat */}
          <AIChat mode={mode} className="flex-1" />
        </div>
      )}
    </>
  );
}
