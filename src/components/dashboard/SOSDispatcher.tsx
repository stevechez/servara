'use client';

import React, { useState } from 'react';
import { AlertCircle, Navigation, Clock, User } from 'lucide-react';
import { findEmergencyTech } from '@/app/actions/dispatch-actions';

export default function SOSDispatcher() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    // In a real app, use a Geocoding API to turn address into lat/lng
    // For now, let's simulate search at a specific coordinate
    const data = await findEmergencyTech(34.0522, -118.2437);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="rounded-[2rem] border-2 border-red-500/20 bg-red-500/5 p-8 shadow-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-black text-white uppercase italic">
            <AlertCircle className="animate-pulse text-red-500" /> Emergency SOS Dispatch
          </h2>
          <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Closest Tech Discovery
          </p>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded-xl bg-red-600 px-6 py-3 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-red-500/20 transition hover:bg-red-500"
        >
          {loading ? 'Calculating...' : 'Scan Fleet'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {results.slice(0, 3).map((tech, index) => (
          <div
            key={tech.id}
            className={`rounded-2xl border p-4 transition ${index === 0 ? 'border-amber-500/50 bg-amber-500/10' : 'border-white/5 bg-white/5'}`}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-lg bg-white/5 p-2 text-slate-300">
                <User size={16} />
              </div>
              {index === 0 && (
                <span className="rounded bg-amber-500 px-2 py-0.5 text-[8px] font-black text-black uppercase">
                  Best Match
                </span>
              )}
            </div>
            <h4 className="mb-4 text-sm font-black text-white uppercase">{tech.name}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <Navigation size={12} className="text-blue-500" /> {tech.distance} miles away
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <Clock size={12} className="text-emerald-500" /> {tech.minutesToFinish}m until clear
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
