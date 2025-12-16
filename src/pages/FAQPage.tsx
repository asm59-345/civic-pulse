import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle, FileQuestion, Clock, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const faqs = [
  {
    category: 'Filing Grievances',
    icon: FileQuestion,
    questions: [
      {
        q: 'How do I file a grievance?',
        a: 'Click on "Submit a Grievance" on the homepage, fill in your details, describe your complaint, and submit. You will receive a unique ticket number for tracking.'
      },
      {
        q: 'What information do I need to provide?',
        a: 'You need to provide your name, contact details (phone/email), category of complaint, location, and a detailed description of your grievance. You can also attach images or documents.'
      },
      {
        q: 'Can I file a grievance in my regional language?',
        a: 'Yes! Our AI-powered system supports multiple Indian languages including Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, and more.'
      },
      {
        q: 'Is there any fee for filing a grievance?',
        a: 'No, filing a grievance is completely free. The government does not charge any fee for public grievance redressal.'
      },
    ]
  },
  {
    category: 'Tracking & Status',
    icon: Clock,
    questions: [
      {
        q: 'How can I track my grievance status?',
        a: 'Go to "Track Grievance" page and enter your ticket number (e.g., SGH-20241215-1234) to view the current status and progress of your complaint.'
      },
      {
        q: 'What do different status types mean?',
        a: 'Pending - Awaiting review, Active - Under investigation, Urgent - High priority handling, Resolved - Action taken and closed.'
      },
      {
        q: 'How long does resolution typically take?',
        a: 'Resolution time varies by category. Simple issues may be resolved in 24-48 hours, while complex infrastructure problems may take 7-15 days. You can see estimated timelines in your grievance status.'
      },
    ]
  },
  {
    category: 'Appeals & Feedback',
    icon: AlertCircle,
    questions: [
      {
        q: 'What if I am not satisfied with the resolution?',
        a: 'After your grievance is resolved, you can rate your experience. If you give a rating of 1-2 stars, you will have the option to file an appeal for reconsideration.'
      },
      {
        q: 'How does the appeal process work?',
        a: 'When filing an appeal, provide details about why you\'re unsatisfied. Your grievance will be escalated to a senior officer for review. Appeals are typically reviewed within 7 days.'
      },
      {
        q: 'Can I reopen a closed grievance?',
        a: 'Yes, through the appeal process. If the same issue recurs within 30 days of resolution, you can also reference your original ticket number when filing a new complaint.'
      },
    ]
  },
  {
    category: 'Privacy & Security',
    icon: Shield,
    questions: [
      {
        q: 'Is my personal information safe?',
        a: 'Yes, all personal data is encrypted and stored securely. Your information is only accessible to authorized government officials handling your grievance.'
      },
      {
        q: 'Can I file an anonymous grievance?',
        a: 'While you can file with minimal details, providing contact information helps officers reach you for clarifications and updates. Anonymous complaints may have limited follow-up.'
      },
      {
        q: 'Who can see my grievance details?',
        a: 'Only the assigned officer, their supervisors, and system administrators can view your grievance details. Your information is not shared with third parties.'
      },
    ]
  },
];

const excludedCategories = [
  'RTI (Right to Information) matters',
  'Court-related / Sub-judice matters',
  'Religious matters',
  'Service matters of government employees (unless internal channels exhausted)',
  'Matters related to private disputes between individuals',
  'Commercial/contractual disputes with private parties',
];

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <h1 className="text-xl font-bold">FAQs & Help</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find answers to common questions about filing, tracking, and resolving your grievances.
          </p>
        </motion.div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="h-5 w-5 text-primary" />
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {section.questions.map((faq, index) => (
                        <AccordionItem key={index} value={`${sectionIndex}-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Excluded Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                <AlertCircle className="h-5 w-5" />
                Issues NOT Handled Through This Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {excludedCategories.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-destructive mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="bg-muted/50">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-4">
                Our support team is here to help you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button asChild>
                  <Link to="/ai-assistant">Ask AI Assistant</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default FAQPage;
