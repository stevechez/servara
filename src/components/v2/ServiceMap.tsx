'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation, Zap, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

// 1. FIX: Move Leaflet default icon logic OUTSIDE the component
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

const jobs = [
  { id: 1, pos: [37.7749, -122.4194], client: "John Doe", task: "HVAC Repair" },
  { id: 2, pos: [37.7849, -122.4094], client: "Sarah Smith", task: "Leaking Pipe" },
  { id: 3, pos: [37.7649, -122.4294], client: "Thorne Bistro", task: "Annual Checkup" },
];

const routePositions: [number, number][] = jobs.map(j => j.pos as [number, number]);

export default function ServiceMap() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use a custom icon that doesn't rely on images to prevent the 404/missing icon bug
  const customIcon = typeof window !== 'undefined' ? new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_10px_#3b82f6] animate-pulse"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  }) : null;

  if (!isMounted) return <div className="h-[450px] w-full bg-slate-100 animate-pulse rounded-[2.5rem]" />;

  return (
    <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm relative group">
      
      {/* MAP HEADER OVERLAY - Ensure z-index is lower than Leaflet Popups but higher than tiles */}
      <div className="absolute top-6 left-6 z-[1000] flex gap-3">
        <div className="bg-slate-900/90 dark:bg-black/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10 shadow-xl">
          <Navigation size={14} className="text-blue-400" />
          <span className="text-xs font-black tracking-tight uppercase">3 Jobs Today</span>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl shadow-blue-500/20">
          <Zap size={14} fill="currentColor" />
          <span className="text-xs font-black tracking-tight uppercase">Optimized</span>
        </div>
      </div>

      {/* THE MAP CONTAINER */}
      <div className="h-[450px] w-full z-0 grayscale-[0.2] contrast-[1.1]">
        <MapContainer 
          center={[37.7749, -122.4194]} 
          zoom={13} 
          scrollWheelZoom={false} 
          className="h-full w-full"
        >
          {/* High-End Dark Map Tiles */}
          <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* Glowing Route Line */}
          <Polyline 
            positions={routePositions} 
            pathOptions={{ 
                color: '#3b82f6', 
                weight: 4, 
                opacity: 0.6,
                dashArray: '10, 10'
            }} 
          />

          {/* Job Markers */}
          {jobs.map((job) => (
            <Marker 
              key={job.id} 
              position={job.pos as [number, number]} 
              icon={customIcon || new L.Icon.Default()}
            >
              <Popup>
                <div className="p-2 min-w-[120px]">
                  <p className="font-black text-slate-900 leading-none">{job.client}</p>
                  <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-widest">{job.task}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* FOOTER INFO */}
      <div className="p-6 bg-white dark:bg-[#0B0E14] border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <MapPin className="text-slate-400" size={18} />
            </div>
            <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Route</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight italic">San Francisco Metro Area</p>
            </div>
        </div>
        <button className="text-blue-600 font-black text-xs hover:underline uppercase tracking-widest">
            Adjust Route
        </button>
      </div>
    </div>
  );
}