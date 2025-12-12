export type GrievanceStatus = 'pending' | 'active' | 'resolved' | 'urgent';
export type GrievanceCategory = 'infrastructure' | 'sanitation' | 'water' | 'electricity' | 'health' | 'police' | 'other';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Grievance {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: GrievanceCategory;
  status: GrievanceStatus;
  urgency: UrgencyLevel;
  location: {
    lat: number;
    lng: number;
    address: string;
    ward: string;
  };
  citizenName: string;
  citizenPhone: string;
  createdAt: Date;
  updatedAt: Date;
  assignedOfficer?: string;
  aiSuggestion?: AISuggestion;
  attachments?: string[];
  feedback?: number;
}

export interface AISuggestion {
  diagnosis: string;
  recommendedAction: string[];
  predictedTimeline: string;
  similarCases: SimilarCase[];
  confidence: number;
}

export interface SimilarCase {
  id: string;
  title: string;
  resolution: string;
  timeToResolve: number;
  similarity: number;
}

export interface Officer {
  id: string;
  name: string;
  department: string;
  ward: string;
  avatar?: string;
  karmaScore: number;
  ticketsResolved: number;
  avgResolutionTime: number;
  badges: Badge[];
  rank: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: Date;
}

export interface DashboardStats {
  totalGrievances: number;
  pendingGrievances: number;
  resolvedToday: number;
  avgResolutionTime: number;
  citizenSatisfaction: number;
  hotspots: number;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  category: GrievanceCategory;
  count: number;
}
