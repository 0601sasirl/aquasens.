import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card } from '@/react-app/components/ui/card';
import { Droplet, MapPin, Users, AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface WaterReport {
  id: number;
  lat: number;
  lng: number;
  score: number;
  reporter: string;
  timestamp: string;
}

// Mock data for demo
const mockReports: WaterReport[] = [
  { id: 1, lat: 37.7749, lng: -122.4194, score: 85, reporter: 'Sarah M.', timestamp: '2 hours ago' },
  { id: 2, lat: 37.7849, lng: -122.4094, score: 72, reporter: 'John D.', timestamp: '5 hours ago' },
  { id: 3, lat: 37.7649, lng: -122.4294, score: 45, reporter: 'Amy L.', timestamp: '1 day ago' },
  { id: 4, lat: 37.7549, lng: -122.4394, score: 91, reporter: 'Mike R.', timestamp: '3 hours ago' },
];

function MapController() {
  const map = useMap();
  
  useEffect(() => {
    // Ensure map is properly initialized
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  
  return null;
}

function createCustomIcon(score: number) {
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">${score}</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export default function CommunityMap() {
  const [reports] = useState<WaterReport[]>(mockReports);
  const center: [number, number] = [37.7749, -122.4194];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950 pb-24 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-20 -left-20 w-60 h-60 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/50">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              AquaSens Map
            </h1>
            <p className="text-sm text-muted-foreground">Water quality reports nearby</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <div>
                <div className="text-2xl font-bold">{reports.length}</div>
                <div className="text-xs text-muted-foreground">Reports</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length)}
                </div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Map */}
        <Card className="overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-cyan-200 dark:border-cyan-800 shadow-xl">
          <div className="h-80 w-full">
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <MapController />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {reports.map((report) => (
                <Marker
                  key={report.id}
                  position={[report.lat, report.lng]}
                  icon={createCustomIcon(report.score)}
                >
                  <Popup>
                    <div className="p-2">
                      <div className={`text-lg font-bold ${getScoreColor(report.score)}`}>
                        Score: {report.score}/100
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        by {report.reporter}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {report.timestamp}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Card>

        {/* Recent Reports */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Recent Reports
          </h2>
          <div className="space-y-3">
            {reports.slice(0, 3).map((report) => (
              <Card
                key={report.id}
                className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-cyan-200 dark:border-cyan-800 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${report.score >= 80 ? 'bg-green-500/10' : report.score >= 50 ? 'bg-yellow-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                      <Droplet className={`w-6 h-6 ${getScoreColor(report.score)}`} />
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${getScoreColor(report.score)}`}>
                        {report.score}/100
                      </div>
                      <div className="text-xs text-muted-foreground">
                        by {report.reporter} • {report.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
