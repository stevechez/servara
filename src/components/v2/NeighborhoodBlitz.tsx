'use client';

import { useState } from 'react';
import { Zap, MapPin, Target, Crosshair, X, Loader2, Printer } from 'lucide-react';

export default function NeighborhoodBlitz() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleLaunch = () => {
    setIsOpen(true);
    setIsScanning(true);
    setShowResults(false);

    // Simulate AI scanning the neighborhood
    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
    }, 2500);
  };

  const closeBlitz = () => {
    setIsOpen(false);
    setTimeout(() => setShowResults(false), 300); // Reset after close animation
  };

  // Fake data for the demo
  const targetLeads = [
    { address: '127 Oak St.', match: '98%', reason: 'Identical build year (1984)' },
    { address: '131 Oak St.', match: '92%', reason: 'No permit history in 15 yrs' },
    { address: '118 Oak St.', match: '88%', reason: 'Similar square footage' },
    { address: '142 Oak St.', match: '85%', reason: 'High-value property' },
  ];

  return (
    <>
      {/* THE TRIGGER CARD (From your screenshot) */}
      <div className="flex h-full flex-col justify-between rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-700 p-8 text-white shadow-xl shadow-blue-600/20">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <Zap size={24} className="fill-white text-white" />
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-100 uppercase">
              Growth Engine
            </span>
          </div>
          <h2 className="mb-2 text-3xl font-black tracking-tighter uppercase italic">
            AI Neighborhood
            <br />
            Blitz
          </h2>
          <p className="text-sm font-medium text-blue-100">
            Identify the top 5 high-probability targets near your last job site.
          </p>
        </div>

        <button
          onClick={handleLaunch}
          className="mt-8 w-full rounded-2xl bg-white py-4 text-[12px] font-black tracking-widest text-blue-600 uppercase shadow-lg transition-all hover:bg-slate-50 active:scale-95"
        >
          Launch AI Blitz
        </button>
      </div>

      {/* THE BLITZ MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-[3rem] bg-white shadow-2xl dark:bg-[#12161D]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-8 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="font-black tracking-tight text-slate-900 uppercase italic dark:text-white">
                    Target Intelligence
                  </h3>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Radius: Oakwood Café (0.5 Miles)
                  </p>
                </div>
              </div>
              <button
                onClick={closeBlitz}
                className="rounded-full bg-slate-100 p-2 text-slate-400 hover:bg-slate-200 dark:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-8">
              {isScanning ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-24 w-24 animate-ping rounded-full bg-blue-500/20"></div>
                    <div
                      className="absolute h-16 w-16 animate-ping rounded-full bg-blue-500/40"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <Crosshair size={32} className="text-blue-600" />
                  </div>
                  <h4 className="mt-8 text-lg font-black tracking-tighter text-slate-900 uppercase dark:text-white">
                    Scanning Property Records...
                  </h4>
                  <p className="mt-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
                    Cross-referencing build years and permit data
                  </p>
                </div>
              ) : showResults ? (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-500/10 dark:bg-blue-500/5">
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-300">
                      We found <strong className="font-black text-blue-600">4 properties</strong> on
                      the same block with high probability for service needs.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {targetLeads.map((lead, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 dark:border-white/5 dark:bg-white/5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-[#12161D]">
                            <MapPin size={14} />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white">
                              {lead.address}
                            </p>
                            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                              {lead.reason}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-500">{lead.match}</span>
                          <p className="text-[8px] font-black tracking-widest text-slate-400 uppercase">
                            Match
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={closeBlitz}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-[12px] font-black tracking-widest text-white uppercase transition-all hover:bg-slate-800 dark:bg-white dark:text-black"
                  >
                    <Printer size={16} /> Print Door Hanger Route
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
