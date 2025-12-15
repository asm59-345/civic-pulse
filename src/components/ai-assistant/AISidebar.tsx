import { useState, useRef, useEffect } from 'react';
import { X, UserCircle, Briefcase, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIChat } from './AIChat';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function AISidebar({ isOpen, onClose, onToggle }: AISidebarProps) {
  const [mode, setMode] = useState<'citizen' | 'officer'>('citizen');
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        x: isOpen ? 0 : 400,
        duration: 0.4,
        ease: isOpen ? 'power3.out' : 'power3.in',
      });
    }
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        variant="ghost"
        size="icon"
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 bg-card border border-border shadow-lg"
      >
        {isOpen ? (
          <PanelRightClose className="h-5 w-5" />
        ) : (
          <PanelRightOpen className="h-5 w-5" />
        )}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed right-0 top-0 bottom-0 w-[400px] max-w-full bg-card border-l border-border shadow-2xl z-50 flex flex-col translate-x-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

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
            Citizen Mode
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
            Officer Mode
          </button>
        </div>

        {/* Chat */}
        <AIChat mode={mode} className="flex-1" />
      </div>
    </>
  );
}
