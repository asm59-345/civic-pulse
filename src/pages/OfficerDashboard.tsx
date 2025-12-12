import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { GrievanceList } from '@/components/dashboard/GrievanceList';
import { AISuggestionCard } from '@/components/dashboard/AISuggestionCard';
import { Leaderboard } from '@/components/dashboard/Leaderboard';
import { GrievanceMap } from '@/components/map/GrievanceMap';
import { SubmitGrievanceForm } from '@/components/citizen/SubmitGrievanceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  mockGrievances, 
  mockOfficers, 
  mockDashboardStats, 
  mockHeatmapPoints 
} from '@/data/mockData';
import { Grievance } from '@/types/grievance';
import { Plus, Filter, TrendingUp, Users, Target, Brain } from 'lucide-react';
import { toast } from 'sonner';

const OfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const handleApplyAI = () => {
    toast.success('AI recommendations applied', {
      description: 'Task has been assigned and stakeholders notified.',
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats */}
            <StatsGrid stats={mockDashboardStats} />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Grievance List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Recent Grievances</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                    <Button variant="accent" size="sm" onClick={() => setShowSubmitForm(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      New
                    </Button>
                  </div>
                </div>
                <GrievanceList
                  grievances={mockGrievances}
                  onSelect={setSelectedGrievance}
                  selectedId={selectedGrievance?.id}
                />
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* AI Card or Empty State */}
                {selectedGrievance?.aiSuggestion ? (
                  <AISuggestionCard
                    suggestion={selectedGrievance.aiSuggestion}
                    ticketNumber={selectedGrievance.ticketNumber}
                    onApply={handleApplyAI}
                  />
                ) : (
                  <Card variant="gradient">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                        <Brain className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-semibold mb-1">AI Insights</h3>
                      <p className="text-sm text-muted-foreground">
                        Select a grievance to view AI-powered recommendations
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-success mb-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-medium">Resolution Rate</span>
                    </div>
                    <p className="text-2xl font-bold">87%</p>
                    <p className="text-xs text-muted-foreground">+5% this week</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-info mb-2">
                      <Users className="h-4 w-4" />
                      <span className="text-xs font-medium">Active Officers</span>
                    </div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-xs text-muted-foreground">Across 8 wards</p>
                  </Card>
                </div>

                {/* Mini Leaderboard */}
                <Leaderboard officers={mockOfficers} currentUserId="1" />
              </div>
            </div>
          </div>
        );

      case 'grievances':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">All Grievances</h2>
              <Button variant="accent" onClick={() => setShowSubmitForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Submit New Grievance
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GrievanceList
                grievances={mockGrievances}
                onSelect={setSelectedGrievance}
                selectedId={selectedGrievance?.id}
              />
              {selectedGrievance?.aiSuggestion && (
                <AISuggestionCard
                  suggestion={selectedGrievance.aiSuggestion}
                  ticketNumber={selectedGrievance.ticketNumber}
                  onApply={handleApplyAI}
                />
              )}
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Spatial Intelligence</h2>
                <p className="text-muted-foreground">
                  Heatmap visualization of grievance hotspots
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="heatmap-indicator heat-low" />
                  <span className="text-muted-foreground">Low</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="heatmap-indicator heat-medium" />
                  <span className="text-muted-foreground">Medium</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="heatmap-indicator heat-high" />
                  <span className="text-muted-foreground">High</span>
                </div>
              </div>
            </div>
            <div className="h-[600px]">
              <GrievanceMap
                grievances={mockGrievances}
                heatmapPoints={mockHeatmapPoints}
                selectedGrievance={selectedGrievance}
                onMarkerClick={setSelectedGrievance}
                showHeatmap={true}
              />
            </div>
            {selectedGrievance && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedGrievance.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedGrievance.location.address}
                      </p>
                    </div>
                    <Button variant="accent" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        );

      case 'leaderboard':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Karma Leaderboard</h2>
                <p className="text-muted-foreground">
                  Recognizing excellence in civic service
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">This Month</Button>
                <Button variant="ghost" size="sm">All Time</Button>
              </div>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {mockOfficers.slice(0, 3).map((officer, index) => {
                const positions = [1, 0, 2]; // Reorder for visual podium effect
                const actualIndex = positions[index];
                const heights = ['h-32', 'h-40', 'h-28'];
                const colors = ['bg-gradient-to-t from-slate-400 to-slate-300', 'bg-gradient-to-t from-amber-400 to-amber-300', 'bg-gradient-to-t from-orange-400 to-orange-300'];
                const medals = ['🥈', '🥇', '🥉'];
                
                return (
                  <motion.div
                    key={officer.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: actualIndex * 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-2">
                        {officer.name.charAt(0)}
                      </div>
                      <h3 className="font-semibold">{officer.name}</h3>
                      <p className="text-sm text-muted-foreground">{officer.department}</p>
                      <p className="text-lg font-bold text-accent">{officer.karmaScore.toLocaleString()} pts</p>
                    </div>
                    <div className={`w-full ${heights[index]} ${colors[actualIndex]} rounded-t-lg flex items-start justify-center pt-4`}>
                      <span className="text-4xl">{medals[actualIndex]}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Full Leaderboard */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Full Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockOfficers.map((officer, index) => (
                    <div
                      key={officer.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="w-8 text-center font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {officer.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{officer.name}</p>
                        <p className="text-sm text-muted-foreground">{officer.department} • {officer.ward}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{officer.karmaScore.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{officer.ticketsResolved} resolved</p>
                      </div>
                      <div className="flex gap-1">
                        {officer.badges.slice(0, 3).map((badge) => (
                          <span key={badge.id} title={badge.name} className="text-lg">
                            {badge.icon}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </DashboardLayout>

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
    </>
  );
};

export default OfficerDashboard;
