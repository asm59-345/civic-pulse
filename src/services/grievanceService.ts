import { supabase } from '@/integrations/supabase/client';
import { GrievanceCategory, UrgencyLevel } from '@/types/grievance';

export interface GrievanceInput {
  description: string;
  category?: GrievanceCategory;
  citizenName: string;
  citizenPhone?: string;
  citizenEmail?: string;
  locationLat?: number;
  locationLng?: number;
  locationAddress?: string;
  locationWard?: string;
  attachments?: string[];
}

export interface DBGrievance {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  category: GrievanceCategory;
  status: 'pending' | 'active' | 'resolved' | 'urgent';
  urgency: UrgencyLevel;
  location_lat: number | null;
  location_lng: number | null;
  location_address: string | null;
  location_ward: string | null;
  citizen_name: string;
  citizen_phone: string | null;
  citizen_email: string | null;
  assigned_officer_id: string | null;
  ai_classification: any;
  ai_suggestion: any;
  similar_cases: any;
  geo_cluster_id: string | null;
  attachments: string[] | null;
  feedback: number | null;
  created_at: string;
  updated_at: string;
}

// Step 1: Submit grievance to database
export async function submitGrievance(input: GrievanceInput): Promise<{ id: string; ticketNumber: string } | null> {
  // Generate a temporary ticket number - the trigger will override this
  const tempTicket = 'SGH-' + new Date().toISOString().slice(0,10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  const { data, error } = await supabase
    .from('grievances')
    .insert({
      ticket_number: tempTicket,
      title: input.description.slice(0, 50) + (input.description.length > 50 ? '...' : ''),
      description: input.description,
      category: input.category || 'other',
      citizen_name: input.citizenName,
      citizen_phone: input.citizenPhone,
      citizen_email: input.citizenEmail,
      location_lat: input.locationLat,
      location_lng: input.locationLng,
      location_address: input.locationAddress,
      location_ward: input.locationWard,
      attachments: input.attachments,
    })
    .select('id, ticket_number')
    .single();

  if (error) {
    console.error('Failed to submit grievance:', error);
    return null;
  }

  return { id: data.id, ticketNumber: data.ticket_number };
}

// Step 2: AI Classification
export async function classifyGrievance(grievanceId: string, description: string): Promise<any> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/classify-grievance`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ grievanceId, description }),
      }
    );

    if (!response.ok) {
      throw new Error('Classification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Classification error:', error);
    return null;
  }
}

// Step 3-5: Generate Officer Insights (includes semantic search & geo-clustering)
export async function generateInsights(
  grievanceId: string,
  description: string,
  category: GrievanceCategory,
  lat?: number,
  lng?: number
): Promise<any> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-insights`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ grievanceId, description, category, lat, lng }),
      }
    );

    if (!response.ok) {
      throw new Error('Insight generation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Insight generation error:', error);
    return null;
  }
}

// Full pipeline: Submit → Classify → Generate Insights
export async function processGrievancePipeline(input: GrievanceInput): Promise<{
  grievanceId: string;
  ticketNumber: string;
  classification: any;
  insights: any;
} | null> {
  // Step 1: Submit to DB
  const submission = await submitGrievance(input);
  if (!submission) return null;

  // Step 2: AI Classification
  const classification = await classifyGrievance(submission.id, input.description);

  // Step 3-5: Generate Insights (semantic search + geo-cluster + AI copilot)
  const category = classification?.category || input.category || 'other';
  const insights = await generateInsights(
    submission.id,
    input.description,
    category,
    input.locationLat,
    input.locationLng
  );

  return {
    grievanceId: submission.id,
    ticketNumber: submission.ticketNumber,
    classification,
    insights,
  };
}

// Fetch all grievances from DB
export async function fetchGrievances(): Promise<DBGrievance[]> {
  const { data, error } = await supabase
    .from('grievances')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch grievances:', error);
    return [];
  }

  return data || [];
}

// Fetch single grievance with full details
export async function fetchGrievance(id: string): Promise<DBGrievance | null> {
  const { data, error } = await supabase
    .from('grievances')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to fetch grievance:', error);
    return null;
  }

  return data;
}

// Update grievance status
export async function updateGrievanceStatus(
  id: string,
  status: 'pending' | 'active' | 'resolved' | 'urgent'
): Promise<boolean> {
  const { error } = await supabase
    .from('grievances')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Failed to update grievance status:', error);
    return false;
  }

  return true;
}

// Convert DB grievance to UI format
export function convertToUIGrievance(db: DBGrievance) {
  return {
    id: db.id,
    ticketNumber: db.ticket_number,
    title: db.title,
    description: db.description,
    category: db.category,
    status: db.status,
    urgency: db.urgency,
    location: {
      lat: db.location_lat || 0,
      lng: db.location_lng || 0,
      address: db.location_address || 'Unknown',
      ward: db.location_ward || 'Unknown',
    },
    citizenName: db.citizen_name,
    citizenPhone: db.citizen_phone || '',
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
    assignedOfficer: db.assigned_officer_id || undefined,
    aiSuggestion: db.ai_suggestion ? {
      diagnosis: db.ai_suggestion.diagnosis || '',
      recommendedAction: db.ai_suggestion.recommendedActions || [],
      predictedTimeline: db.ai_suggestion.predictedTimeline || '',
      similarCases: (db.ai_suggestion.similarCases || []).map((c: any) => ({
        id: c.id,
        title: c.title,
        resolution: c.resolution,
        timeToResolve: c.timeToResolve,
        similarity: c.similarity,
      })),
      confidence: db.ai_suggestion.confidence || 0,
    } : undefined,
    attachments: db.attachments || [],
    feedback: db.feedback || undefined,
  };
}
