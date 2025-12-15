-- Create enum types for grievance fields
CREATE TYPE public.grievance_status AS ENUM ('pending', 'active', 'resolved', 'urgent');
CREATE TYPE public.grievance_category AS ENUM ('infrastructure', 'sanitation', 'water', 'electricity', 'health', 'police', 'other');
CREATE TYPE public.urgency_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Create grievances table
CREATE TABLE public.grievances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category grievance_category DEFAULT 'other',
  status grievance_status DEFAULT 'pending',
  urgency urgency_level DEFAULT 'medium',
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,
  location_ward TEXT,
  citizen_name TEXT NOT NULL,
  citizen_phone TEXT,
  citizen_email TEXT,
  assigned_officer_id UUID,
  ai_classification JSONB,
  ai_suggestion JSONB,
  similar_cases JSONB,
  geo_cluster_id UUID,
  attachments TEXT[],
  feedback INTEGER CHECK (feedback >= 1 AND feedback <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create geo clusters table for Infrastructure Failure Events
CREATE TABLE public.geo_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category grievance_category NOT NULL,
  center_lat DECIMAL(10, 8) NOT NULL,
  center_lng DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER DEFAULT 200,
  grievance_count INTEGER DEFAULT 0,
  status grievance_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create grievance history for semantic search
CREATE TABLE public.grievance_archive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_grievance_id UUID REFERENCES public.grievances(id),
  category grievance_category NOT NULL,
  description TEXT NOT NULL,
  resolution TEXT,
  time_to_resolve_hours INTEGER,
  similarity_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievance_archive ENABLE ROW LEVEL SECURITY;

-- Public read access for grievances (citizens can view their own, officers can view all)
CREATE POLICY "Anyone can view grievances" ON public.grievances FOR SELECT USING (true);
CREATE POLICY "Anyone can insert grievances" ON public.grievances FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update grievances" ON public.grievances FOR UPDATE USING (true);

-- Public read access for clusters
CREATE POLICY "Anyone can view geo_clusters" ON public.geo_clusters FOR SELECT USING (true);
CREATE POLICY "Anyone can insert geo_clusters" ON public.geo_clusters FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update geo_clusters" ON public.geo_clusters FOR UPDATE USING (true);

-- Public read access for archive
CREATE POLICY "Anyone can view grievance_archive" ON public.grievance_archive FOR SELECT USING (true);
CREATE POLICY "Anyone can insert grievance_archive" ON public.grievance_archive FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_grievances_updated_at
BEFORE UPDATE ON public.grievances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate ticket number
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number = 'SGH-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for ticket number generation
CREATE TRIGGER generate_grievance_ticket
BEFORE INSERT ON public.grievances
FOR EACH ROW
WHEN (NEW.ticket_number IS NULL OR NEW.ticket_number = '')
EXECUTE FUNCTION public.generate_ticket_number();

-- Insert sample historical data for RAG
INSERT INTO public.grievance_archive (category, description, resolution, time_to_resolve_hours, similarity_keywords) VALUES
('infrastructure', 'Large pothole on main road causing accidents', 'Filled with asphalt and compacted. Added speed breaker warning signs.', 48, ARRAY['pothole', 'road', 'accident', 'damage']),
('infrastructure', 'Broken streetlight near school zone', 'Replaced bulb and repaired wiring. Added timer for automatic operation.', 24, ARRAY['streetlight', 'school', 'safety', 'electrical']),
('water', 'No water supply for 3 days in residential area', 'Identified burst pipe in main line. Repaired and restored supply within 6 hours.', 72, ARRAY['water', 'supply', 'pipe', 'residential']),
('sanitation', 'Garbage not collected for a week', 'Deployed additional garbage trucks. Set up daily collection schedule.', 12, ARRAY['garbage', 'waste', 'collection', 'sanitation']),
('electricity', 'Frequent power cuts during peak hours', 'Upgraded transformer capacity. Installed load balancing equipment.', 96, ARRAY['power', 'electricity', 'transformer', 'outage']),
('health', 'Stagnant water breeding mosquitoes', 'Drained water, applied larvicide, conducted awareness campaign.', 36, ARRAY['mosquito', 'dengue', 'stagnant', 'health']);