'use client';

import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { Zap, Loader2, CheckCircle2, Radar } from 'lucide-react';

// Map styling to match your dark/clean dashboard aesthetic
const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  scrollwheel: false,
  styles: [
    { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#747474' }] },
    { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }] },
    { featureType: 'landscape', elementType: 'all', stylers: [{ color: '#f5f5f5' }] },
    { featureType: 'water', elementType: 'all', stylers: [{ color: '#e9e9e9' }] },
    // Dark mode styles can be added here if needed
  ],
};

export default function NeighborhoodBlitz() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  // Mock center (Tomorrow we'll pull this from your active job's lat/lng)
  const center = { lat: 37.7749, lng: -122.4194 };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const handleBlitz = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 4000);
    }, 3000);
  };

  return (
    <div className="group shadow-soft hover:shadow-float relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 transition-all dark:border-white/5 dark:bg-[#12161D]">
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-600 dark:text-purple-400">
              <Zap className={status === 'scanning' ? 'animate-pulse' : ''} size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight italic dark:text-white">
                Neighborhood Blitz
              </h2>
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                AI Growth Engine
              </p>
            </div>
          </div>
        </div>

        {/* REAL GOOGLE MAP VIEWPORT */}
        <div className="relative mb-6 h-48 w-full overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 dark:border-white/5 dark:bg-[#0B0E14]">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={center}
              zoom={14}
              options={mapOptions}
            >
              {/* Main Job Site Marker */}
              <Marker
                position={center}
                icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
              />

              {/* Marketing Radius Circle */}
              <Circle
                center={center}
                radius={1000} // 1km radius
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
            <div className="flex h-full items-center justify-center">
              <Loader2 className="animate-spin text-slate-300" />
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm dark:bg-[#12161D]/90">
            <div className="h-2 w-2 animate-ping rounded-full bg-purple-500" />
            <span className="text-[10px] font-black tracking-tighter text-slate-700 uppercase dark:text-slate-300">
              Live Radius
            </span>
          </div>
        </div>

        <p className="mb-6 text-sm leading-snug font-medium text-slate-500 dark:text-slate-400">
          We found **12 high-intent neighbors** within 1.5 miles of your active job site.
        </p>

        <button
          onClick={handleBlitz}
          disabled={status !== 'idle'}
          className={`mt-auto flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
            status === 'idle'
              ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20 hover:bg-purple-500'
              : status === 'scanning'
                ? 'bg-slate-100 text-slate-400'
                : 'bg-emerald-500 text-white'
          }`}
        >
          {status === 'idle' && 'Deploy Blitz'}
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
