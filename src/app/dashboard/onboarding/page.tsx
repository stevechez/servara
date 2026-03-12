'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Building2, MapPin, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MagicOnboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    businessName: '',
    industry: 'Plumbing',
    teamSize: '1-3',
    location: '',
  });

  const handleFinish = async () => {
    setLoading(true);
    // Simulate AI "Building" the dashboard
    await new Promise((resolve) => setTimeout(resolve, 3000));
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* PROGRESS BAR */}
        <div className="mb-12 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-600' : 'bg-slate-100'}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!loading ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="w-fit rounded-2xl bg-blue-50 p-3 text-blue-600">
                    <Building2 size={24} />
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900">
                    What's your business called?
                  </h1>
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. Thorne Plumbing & Heating"
                    className="w-full border-none p-0 text-2xl font-bold text-slate-900 placeholder:text-slate-200 focus:ring-0"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="w-fit rounded-2xl bg-purple-50 p-3 text-purple-600">
                    <MapPin size={24} />
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900">
                    Where do you operate?
                  </h1>
                  <input
                    autoFocus
                    type="text"
                    placeholder="City, State"
                    className="w-full border-none p-0 text-2xl font-bold text-slate-900 placeholder:text-slate-200 focus:ring-0"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="w-fit rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                    <Users size={24} />
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900">
                    How big is your team?
                  </h1>
                  <div className="grid grid-cols-2 gap-4">
                    {['Just me', '2-5 people', '6-15 people', '16+ people'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setFormData({ ...formData, teamSize: option })}
                        className={`rounded-2xl border-2 p-4 text-left font-bold transition-all ${formData.teamSize === option ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-600 hover:border-slate-200'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-8">
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && !formData.businessName}
                    className="flex w-full items-center justify-center gap-2 rounded-[2rem] bg-slate-900 py-5 text-lg font-black text-white transition-all hover:bg-blue-600 disabled:opacity-50"
                  >
                    Next Step <ArrowRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="flex w-full items-center justify-center gap-2 rounded-[2rem] bg-blue-600 py-5 text-lg font-black text-white transition-all hover:bg-blue-700"
                  >
                    Finish Setup <Sparkles size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            /* AI GENERATING STATE */
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8 text-center"
            >
              <div className="relative mx-auto h-24 w-24">
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-20" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-100 bg-white shadow-xl">
                  <Sparkles className="animate-pulse text-blue-600" size={40} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Magically configuring Zidro...
                </h2>
                <div className="mt-4 space-y-2">
                  <p className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Connecting AI to{' '}
                    {formData.businessName}
                  </p>
                  <p className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Optimizing{' '}
                    {formData.location} service area
                  </p>
                  <p className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400">
                    <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity }}>
                      ⏳
                    </motion.span>{' '}
                    Preparing custom dashboard
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
