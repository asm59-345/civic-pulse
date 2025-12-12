import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Grievance, HeatmapPoint } from '@/types/grievance';
import { categoryLabels } from '@/data/mockData';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons by urgency
const createCustomIcon = (urgency: string) => {
  const colors: Record<string, string> = {
    low: '#14b8a6',
    medium: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444',
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: ${colors[urgency] || '#6b7280'};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ${urgency === 'critical' ? 'animation: pulse 1.5s infinite;' : ''}
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Heatmap Layer Component
function HeatmapLayer({ points }: { points: HeatmapPoint[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (!points.length) return;
    
    // Create heatmap data
    const heatData = points.map(p => [p.lat, p.lng, p.intensity * 0.5] as [number, number, number]);
    
    // @ts-ignore - leaflet.heat types
    const heat = L.heatLayer(heatData, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
      gradient: {
        0.2: '#14b8a6',
        0.4: '#22c55e',
        0.6: '#f59e0b',
        0.8: '#f97316',
        1.0: '#ef4444',
      },
    }).addTo(map);
    
    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);
  
  return null;
}

interface GrievanceMapProps {
  grievances: Grievance[];
  heatmapPoints?: HeatmapPoint[];
  selectedGrievance?: Grievance | null;
  onMarkerClick?: (grievance: Grievance) => void;
  showHeatmap?: boolean;
  center?: [number, number];
  zoom?: number;
}

export function GrievanceMap({
  grievances,
  heatmapPoints = [],
  selectedGrievance,
  onMarkerClick,
  showHeatmap = true,
  center = [28.6139, 77.2090],
  zoom = 13,
}: GrievanceMapProps) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-border shadow-lg">
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        .leaflet-container {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
      
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {showHeatmap && <HeatmapLayer points={heatmapPoints} />}
        
        {grievances.map((grievance) => (
          <Marker
            key={grievance.id}
            position={[grievance.location.lat, grievance.location.lng]}
            icon={createCustomIcon(grievance.urgency)}
            eventHandlers={{
              click: () => onMarkerClick?.(grievance),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-3 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`
                    px-2 py-0.5 rounded text-xs font-medium
                    ${grievance.urgency === 'critical' ? 'bg-red-100 text-red-700' : ''}
                    ${grievance.urgency === 'high' ? 'bg-orange-100 text-orange-700' : ''}
                    ${grievance.urgency === 'medium' ? 'bg-amber-100 text-amber-700' : ''}
                    ${grievance.urgency === 'low' ? 'bg-teal-100 text-teal-700' : ''}
                  `}>
                    {grievance.urgency.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {categoryLabels[grievance.category]}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {grievance.title}
                </h4>
                <p className="text-xs text-gray-500 mb-2">
                  {grievance.location.address}
                </p>
                <p className="text-xs font-mono text-gray-400">
                  {grievance.ticketNumber}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
