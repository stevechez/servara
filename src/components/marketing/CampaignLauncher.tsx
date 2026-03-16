'use client';

import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Mail, Printer, X, CheckCircle2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CampaignLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  neighborCount: number;
  neighborName: string;
}

export default function CampaignLauncher({
  isOpen,
  onClose,
  neighborCount,
  neighborName,
}: CampaignLauncherProps) {
  const [step, setStep] = useState<'select' | 'sending' | 'success'>('select');
  const [method, setMethod] = useState<'SMS' | 'Mail' | 'Print'>('SMS');

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep('select'), 500);
    }
  }, [isOpen]);

  const handleLaunch = () => {
    setStep('sending');
    setTimeout(() => setStep('success'), 2000); // Demo delay
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-[#050608]/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-[10%] z-[120] mx-auto max-w-lg overflow-hidden rounded-[3rem] border border-white/10 bg-[#12161D] shadow-[0_0_50px_rgba(37,99,235,0.2)] md:top-[20%]"
          >
            {/* Header Section */}
            {step !== 'success' && (
              <div className="bg-blue-600 p-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/20 p-2">
                      <Zap size={20} fill="white" />
                    </div>
                    <h2 className="text-xl font-black tracking-tight uppercase italic">
                      Neighborhood Blitz
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full bg-black/20 p-2 hover:bg-black/40"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="mt-4 text-sm font-bold tracking-widest text-blue-100 uppercase">
                  Targeting {neighborCount} high-probability homes near {neighborName}.
                </p>
              </div>
            )}

            <div className="p-8">
              {step === 'select' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'SMS', icon: <MessageSquare size={18} />, label: 'SMS' },
                      { id: 'Mail', icon: <Mail size={18} />, label: 'Mail' },
                      { id: 'Print', icon: <Printer size={18} />, label: 'Print' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setMethod(t.id as any)}
                        className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                          method === t.id
                            ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                            : 'border-white/5 bg-white/5 text-slate-400'
                        }`}
                      >
                        {t.icon}
                        <span className="text-[10px] font-black tracking-widest uppercase">
                          {t.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/5 p-6 font-mono">
                    <p className="mb-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      Auto-Generated Content
                    </p>
                    <p className="text-sm leading-relaxed text-slate-300 italic">
                      "Hi! We just finished a project for your neighbor{' '}
                      <span className="font-bold text-blue-400">{neighborName}</span>. Since we're
                      in the area, we're offering free inspections this Thursday. Interested?"
                    </p>
                  </div>

                  <button
                    onClick={handleLaunch}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-5 text-xs font-black tracking-[0.2em] text-white uppercase shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
                  >
                    <Send size={18} />
                    Launch Campaign
                  </button>
                </div>
              )}

              {step === 'sending' && (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                  <h3 className="text-xl font-black text-white uppercase italic">
                    Deploying Blitz...
                  </h3>
                  <p className="mt-2 text-sm font-bold tracking-widest text-slate-500 uppercase">
                    Syncing carrier networks
                  </p>
                </div>
              )}

              {step === 'success' && (
                <div className="py-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                  >
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <h3 className="text-3xl leading-none font-black tracking-tighter text-white uppercase italic">
                    Campaign Live
                  </h3>
                  <p className="mt-4 text-sm font-bold tracking-widest text-slate-500 uppercase">
                    {neighborCount} Targets Dispatched
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-10 w-full rounded-2xl bg-white/5 py-4 text-xs font-black tracking-widest text-white uppercase hover:bg-white/10"
                  >
                    Return to Project
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
