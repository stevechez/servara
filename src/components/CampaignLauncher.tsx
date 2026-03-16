'use client';

import React, { useState } from 'react';
import { Send, MessageSquare, Mail, Printer, X, CheckCircle2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CampaignLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  neighborCount: number;
  neighborName: string; // The person we just finished the job for
}

export default function CampaignLauncher({
  isOpen,
  onClose,
  neighborCount,
  neighborName,
}: CampaignLauncherProps) {
  const [step, setStep] = useState<'select' | 'sending' | 'success'>('select');
  const [method, setMethod] = useState<'SMS' | 'Mail' | 'Print'>('SMS');

  const handleLaunch = () => {
    setStep('sending');
    setTimeout(() => setStep('success'), 2000); // Simulate AI processing
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
            className="fixed inset-0 z-[110] bg-[#050608]/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-[10%] z-[120] mx-auto max-w-lg overflow-hidden rounded-[3rem] border border-white/10 bg-[#12161D] shadow-2xl md:top-[20%]"
          >
            {step !== 'success' && (
              <div className="bg-blue-600 p-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/20 p-2 text-white">
                      <Zap size={20} fill="white" />
                    </div>
                    <h2 className="text-xl font-black tracking-tight uppercase italic">
                      Campaign Launcher
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full bg-black/20 p-2 hover:bg-black/40"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="mt-4 text-sm font-bold text-blue-100">
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

                  <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                    <p className="mb-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      Message Preview
                    </p>
                    <p className="text-sm leading-relaxed font-medium text-slate-300">
                      "Hi! We just finished a premium {method === 'SMS' ? 'project' : 'service'} for
                      your neighbor <span className="text-blue-400">{neighborName}</span>. Since
                      we're in the area, we have 2 openings for a free inspection this Thursday.
                      Interested?"
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
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    Syncing with local carrier networks.
                  </p>
                </div>
              )}

              {step === 'success' && (
                <div className="py-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500"
                  >
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <h3 className="text-3xl leading-none font-black text-white uppercase italic">
                    Campaign Live
                  </h3>
                  <p className="mt-4 text-sm font-bold tracking-widest text-slate-500 uppercase">
                    {neighborCount} Messages Delivered
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-10 w-full rounded-2xl bg-white/5 py-4 text-xs font-black tracking-widest text-white uppercase hover:bg-white/10"
                  >
                    Return to Dashboard
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
