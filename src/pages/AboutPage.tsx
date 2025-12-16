import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Building2, 
  Target, 
  Users, 
  Brain, 
  Map, 
  Trophy,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const AboutPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Classification',
      description: 'IndicBERT-based NLP automatically categorizes grievances across 12 Indian languages, ensuring accurate routing to the right department.'
    },
    {
      icon: Map,
      title: 'Geospatial Intelligence',
      description: 'DBSCAN clustering detects infrastructure failure patterns, enabling bulk resolution of related complaints in the same area.'
    },
    {
      icon: Trophy,
      title: 'Officer Gamification',
      description: 'Karma scoring system with badges and leaderboards motivates officers through non-monetary rewards aligned with performance appraisals.'
    },
    {
      icon: Clock,
      title: 'RAG Decision Support',
      description: 'Retrieval-Augmented Generation provides officers with historical case analysis and AI-recommended resolution strategies.'
    },
    {
      icon: Shield,
      title: 'Data Sovereignty',
      description: 'Built on open-source technologies with self-hosted infrastructure, ensuring complete government data sovereignty.'
    },
    {
      icon: Users,
      title: 'Citizen-Centric Design',
      description: 'Multi-modal input (text, voice, image), vernacular language support, and real-time tracking for seamless citizen experience.'
    },
  ];

  const stats = [
    { value: '24/7', label: 'Availability' },
    { value: '12+', label: 'Languages Supported' },
    { value: '<48h', label: 'Target Resolution' },
    { value: '100%', label: 'Transparent Tracking' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <h1 className="text-xl font-bold">About Smart Grievance Hub</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-10 w-10 text-accent-foreground" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Smart Grievance Hub
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            A next-generation AI-powered civic redressal platform transforming how citizens interact with government services.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-muted/50 rounded-xl p-4">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                To create a transparent, efficient, and citizen-centric grievance redressal system that leverages cutting-edge AI technology while maintaining complete data sovereignty.
              </p>
              <p className="text-muted-foreground">
                We believe every citizen deserves to be heard, and every grievance deserves timely resolution. Our platform bridges the gap between citizens and government, making public service delivery more accountable and responsive.
              </p>
            </div>
            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <Building2 className="h-12 w-12 text-primary mb-4" />
                <h4 className="text-lg font-semibold mb-2">Government of India Initiative</h4>
                <p className="text-sm text-muted-foreground">
                  Aligned with Digital India, Bhashini Mission, and the Government's vision for transparent and accountable public service delivery through indigenous technology solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Key Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">The SGH Process Flow</h3>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
              
              {[
                { step: '1', title: 'Citizen Submits Grievance', desc: 'Via text, voice, or image in any supported language' },
                { step: '2', title: 'AI Classification', desc: 'IndicBERT categorizes and routes to appropriate department' },
                { step: '3', title: 'Semantic Search', desc: 'RAG retrieves similar historical cases for context' },
                { step: '4', title: 'Geo-Cluster Analysis', desc: 'DBSCAN detects infrastructure failure patterns' },
                { step: '5', title: 'AI Copilot Insights', desc: 'Decision support memo generated for officers' },
                { step: '6', title: 'Officer Resolution', desc: 'Informed action with performance tracking' },
              ].map((item, index) => (
                <div key={item.step} className="flex gap-6 mb-6 last:mb-0">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shrink-0 relative z-10">
                    {item.step}
                  </div>
                  <div className="pt-3">
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Card className="gradient-primary text-white">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Whether you're a citizen with a grievance or an officer seeking to make a difference, 
                we're here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="accent" size="lg" asChild>
                  <Link to="/">Submit Grievance</Link>
                </Button>
                <Button variant="glass" size="lg" className="text-white border-white/30" asChild>
                  <Link to="/dashboard">Officer Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  );
};

export default AboutPage;
