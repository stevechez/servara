'use client';

import React, { useMemo, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, Polyline } from '@react-google-maps/api';
import { getOptimizedRoute } from '@/app/actions/route-actions';
import { Navigation, User } from 'lucide-react';

const center = { lat: 37.7749, lng: -122.4194 };

export default function FleetMap({ jobs }: { jobs: any[] }) {
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
  const [isRouting, setIsRouting] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // 1. Group jobs by tech for the sidebar
  const techGroup = useMemo(() => {
    const groups: Record<string, any[]> = {};
    jobs.forEach((job) => {
      const tId = job.technicians?.id || job.assigned_technician_id;
      if (tId) {
        if (!groups[tId]) groups[tId] = [];
        groups[tId].push(job);
      }
    });
    return groups;
  }, [jobs]);

  // 2. Decode Helper (Defined once inside component)
  const decodePolyline = (encoded: string) => {
    if (!encoded) return [];
    let poly = [],
      index = 0,
      len = encoded.length,
      lat = 0,
      lng = 0;
    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      lat += result & 1 ? ~(result >> 1) : result >> 1;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      lng += result & 1 ? ~(result >> 1) : result >> 1;
      poly.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return poly;
  };

  // 3. Routing Logic
  const showRouteForTech = async (techId: string) => {
    setSelectedTechId(techId);
    setIsRouting(true);

    const techJobs = jobs.filter((j) => (j.technicians?.id || j.assigned_technician_id) === techId);
    const coords = techJobs
      .filter((j) => j.customers?.latitude)
      .map((j) => ({ lat: j.customers.latitude, lng: j.customers.longitude }));

    if (coords.length > 0) {
      const result = await getOptimizedRoute(center, coords);
      if (result?.polyline) {
        setPath(decodePolyline(result.polyline));
      }
    } else {
      setPath([]);
    }
    setIsRouting(false);
  };

  const markers = useMemo(() => {
    return jobs
      .filter((job) => job.customers?.latitude && job.customers?.longitude)
      .map((job) => ({
        id: job.id,
        name: job.customers?.name,
        status: job.status,
        position: { lat: job.customers.latitude, lng: job.customers.longitude },
      }));
  }, [jobs]);

  if (!isLoaded)
    return <div className="h-[600px] w-full animate-pulse rounded-[2rem] bg-white/5" />;

  return (
    <div className="flex h-[600px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B0E14] shadow-2xl">
      {/* SIDEBAR */}
      <div className="w-80 space-y-4 overflow-y-auto border-r border-white/10 p-6">
        <h3 className="mb-4 text-[10px] font-black tracking-widest text-slate-500 uppercase italic">
          Personnel Tracking
        </h3>
        {Object.entries(techGroup).map(([id, tJobs]) => (
          <button
            key={id}
            onClick={() => showRouteForTech(id)}
            className={`w-full rounded-2xl border p-4 text-left transition-all ${
              selectedTechId === id
                ? 'border-blue-400 bg-blue-600'
                : 'border-white/5 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-black">
                {tJobs[0].technicians?.name?.charAt(0) || 'T'}
              </div>
              <div>
                <p className="text-xs font-black text-white">
                  {tJobs[0].technicians?.name || 'Tech'}
                </p>
                <p className="text-[9px] font-bold text-white/50 uppercase">
                  {tJobs.length} Jobs Active
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* MAP */}
      <div className="relative flex-1">
        {isRouting && (
          <div className="absolute top-4 left-4 z-10 animate-pulse rounded-full bg-blue-500 px-4 py-2 text-[10px] font-black uppercase italic shadow-xl">
            Optimizing Fleet Path...
          </div>
        )}
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={12}
          options={{ styles: darkMapStyle, disableDefaultUI: true }}
        >
          {markers.map((marker) => (
            <MarkerF
              key={marker.id}
              position={marker.position}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: marker.status === 'in_progress' ? '#f59e0b' : '#3b82f6',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#ffffff',
                scale: 8,
              }}
            />
          ))}
          {path.length > 0 && (
            <Polyline
              path={path}
              options={{ strokeColor: '#3b82f6', strokeOpacity: 0.8, strokeWeight: 4 }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a1c23' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d2f39' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#747a8a' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
];
