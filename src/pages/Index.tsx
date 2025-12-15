import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Brain, 
  Map, 
  Trophy,
  ChevronRight,
  Phone,
  Mail,
  Clock,
  Shield,
  Zap,
  Users,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SubmitGrievanceForm } from '@/components/citizen/SubmitGrievanceForm';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import gsap from 'gsap';

const Index = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP animations
    if (heroRef.current) {
      const heroElements = heroRef.current.querySelectorAll('.gsap-hero');
      gsap.fromTo(
        heroElements,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: 'power3.out' 
        }
      );
    }

    if (statsRef.current) {
      const statCards = statsRef.current.querySelectorAll('.stat-card-gsap');
      gsap.fromTo(
        statCards,
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.6, 
          stagger: 0.1, 
          ease: 'back.out(1.2)',
          delay: 0.5
        }
      );
    }
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Our RAG system analyzes your complaint using historical data to suggest optimal resolution strategies.',
    },
    {
      icon: Map,
      title: 'Spatial Intelligence',
      description: 'Heat-map visualizations help identify infrastructure hotspots for proactive bulk resolution.',
    },
    {
      icon: Trophy,
      title: 'Officer Karma System',
      description: 'Gamified rewards incentivize officers, ensuring faster and higher quality resolutions.',
    },
    {
      icon: Clock,
      title: 'Real-Time Tracking',
      description: 'Track your grievance status in real-time with transparent progress updates.',
    },
  ];

  const stats = [
    { value: '89%', label: 'Resolution Rate' },
    { value: '<24h', label: 'Avg Response Time' },
    { value: '50K+', label: 'Citizens Served' },
    { value: '4.8/5', label: 'Satisfaction Score' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-bold">SGH</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/ai-assistant" className="gap-2">
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">AI Assistant</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MmgtNHYtMnptMC04aDR2MmgtNHYtMnptLTggOGg0djJoLTR2LTJ6bTAtOGg0djJoLTR2LTJ6bS04IDhoNHYyaC00di0yem0wLThoNHYyaC00di0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div ref={heroRef} className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="gsap-hero inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-sm text-white/90 font-medium">AI-Powered Civic Redressal</span>
              </div>
              
              <h1 className="gsap-hero text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Smart Grievance
                <span className="block text-accent">Hub</span>
              </h1>
              
              <p className="gsap-hero text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                From complaint to resolution, powered by intelligence. 
                A next-generation civic platform that transforms how citizens interact with government.
              </p>
              
              <div className="gsap-hero flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="xl" 
                  variant="accent" 
                  className="group"
                  onClick={() => setShowSubmitForm(true)}
                >
                  Submit a Grievance
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="xl" 
                  variant="glass"
                  asChild
                >
                  <Link to="/dashboard">
                    Officer Dashboard
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Stats Bar */}
            <div
              ref={statsRef}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="stat-card-gsap bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                >
                  <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0 50L60 45.8333C120 41.6667 240 33.3333 360 37.5C480 41.6667 600 58.3333 720 62.5C840 66.6667 960 58.3333 1080 50C1200 41.6667 1320 33.3333 1380 29.1667L1440 25V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" 
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Intelligence at Every Step
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform leverages cutting-edge AI to transform the grievance redressal experience 
              for both citizens and administrators.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="gradient" className="h-full hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to get your grievance resolved
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Submit', desc: 'File your complaint via text, voice, or image in any language', icon: FileText },
              { step: '02', title: 'AI Analysis', desc: 'Our system categorizes, routes, and finds similar past cases', icon: Brain },
              { step: '03', title: 'Resolution', desc: 'Officers receive AI recommendations for faster resolution', icon: Zap },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center relative"
                >
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                  <div className="w-24 h-24 rounded-full bg-card border-4 border-accent shadow-lg flex items-center justify-center mx-auto mb-4 relative z-10">
                    <Icon className="h-10 w-10 text-accent" />
                  </div>
                  <span className="text-6xl font-bold text-muted-foreground/20 absolute top-0 left-1/2 -translate-x-1/2">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-primary rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoNHYyaC00di0yem0wLThoNHYyaC00di0yem0tOCA4aDR2MmgtNHYtMnptMC04aDR2MmgtNHYtMnptLTggOGg0djJoLTR2LTJ6bTAtOGg0djJoLTR2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to be heard?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of citizens who have successfully resolved their grievances 
                through our intelligent platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="xl" 
                  variant="accent"
                  onClick={() => setShowSubmitForm(true)}
                >
                  Submit Your Grievance
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  size="xl" 
                  variant="glass"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  Track Existing Ticket
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="text-xl font-bold text-sidebar-foreground">SGH</span>
              </div>
              <p className="text-sidebar-foreground/60 text-sm">
                Smart Grievance Hub - Transforming civic engagement through AI.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Submit Grievance</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Track Status</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Government</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Officer Portal</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Transparency Report</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">API Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/60">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  1800-XXX-XXXX
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  support@sgh.gov.in
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-sidebar-border mt-8 pt-8 text-center text-sm text-sidebar-foreground/40">
            © 2024 Smart Grievance Hub. Built for India. Powered by AI.
          </div>
        </div>
      </footer>

      {/* Submit Form Modal */}
      {showSubmitForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSubmitForm(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            <SubmitGrievanceForm onClose={() => setShowSubmitForm(false)} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
