'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { Zap, Loader2, CheckCircle2, Navigation } from 'lucide-react';

const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  scrollwheel: false,
  styles: [
    { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#747474' }] },
    { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }] },
    { featureType: 'landscape', elementType: 'all', stylers: [{ color: '#f5f5f5' }] },
  ],
};

export default function NeighborhoodBlitz() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // 1. FIXED: Define mapCenter state
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // 2. Deep Link Listener
  useEffect(() => {
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    if (lat && lng) {
      setMapCenter({ lat, lng });
      if (map) map.panTo({ lat, lng });
    }
  }, [searchParams, map]);

  const handleBlitz = async () => {
    setStatus('scanning');
    try {
      const response = await fetch('/api/blitz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: mapCenter.lat, // Now this is defined!
          lng: mapCenter.lng,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Blitz failed: No leads found or Twilio error.');
      setStatus('idle');
    }
  };

  return (
    <div className="group shadow-soft hover:shadow-float relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 transition-all dark:border-white/5 dark:bg-[#12161D]">
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-600 dark:text-purple-400">
              <Radar className={status === 'scanning' ? 'animate-spin' : ''} size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight italic dark:text-white">
                Neighborhood Blitz
              </h2>
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                AI Radius Growth
              </p>
            </div>
          </div>
        </div>

        {/* 3. REAL MAP VIEWPORT (Replacing simulation) */}
        <div className="relative mb-6 h-40 w-full overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 dark:border-white/5 dark:bg-[#0B0E14]">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={14}
              options={mapOptions}
              onLoad={(map) => setMap(map)}
            >
              <Marker position={mapCenter} />
              <Circle
                center={mapCenter}
                radius={1600} // ~1 mile
                options={{
                  fillColor: '#8b5cf6',
                  fillOpacity: 0.1,
                  strokeColor: '#8b5cf6',
                  strokeOpacity: 0.5,
                  strokeWeight: 1,
                }}
              />
            </GoogleMap>
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-white/5">
              <Loader2 className="animate-spin text-slate-300" />
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm dark:bg-[#12161D]/90">
            <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
            <span className="text-[10px] font-black tracking-tighter text-slate-700 uppercase dark:text-slate-300">
              Live Radius
            </span>
          </div>
        </div>

        <p className="mb-6 text-sm leading-snug font-medium text-slate-500 dark:text-slate-400">
          Targeting high-intent neighbors near your current job. Launch a "While We're Here"
          campaign?
        </p>

        <button
          onClick={handleBlitz}
          disabled={status !== 'idle' || !isLoaded}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[10px] font-black tracking-[0.2em] uppercase shadow-xl transition-all ${
            status === 'idle'
              ? 'bg-purple-600 text-white shadow-purple-500/20 hover:bg-purple-500 active:scale-95'
              : status === 'scanning'
                ? 'bg-slate-100 text-slate-400 dark:bg-white/5'
                : 'bg-emerald-500 text-white shadow-emerald-500/20'
          }`}
        >
          {status === 'idle' && (
            <>
              <Zap size={14} fill="currentColor" /> Deploy Blitz
            </>
          )}
          {status === 'scanning' && (
            <>
              <Loader2 className="animate-spin" size={14} /> Processing...
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle2 size={14} /> Campaign Sent
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Radar({ className, size }: { className?: string; size: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 12L12 2" />
      <path d="M12 12L19 5" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
