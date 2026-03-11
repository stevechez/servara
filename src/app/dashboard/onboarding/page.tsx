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
    location: ''
  });

  const handleFinish = async () => {
    setLoading(true);
    // Simulate AI "Building" the dashboard
    await new Promise(resolve => setTimeout(resolve, 3000));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        
        {/* PROGRESS BAR */}
        <div className="flex gap-2 mb-12">
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
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit">
                    <Building2 size={24} />
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">What's your business called?</h1>
                  <input 
                    autoFocus
                    type="text"
                    placeholder="e.g. Thorne Plumbing & Heating"
                    className="w-full text-2xl font-bold p-0 border-none focus:ring-0 placeholder:text-slate-200 text-slate-900"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit">
                    <MapPin size={24} />
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">Where do you operate?</h1>
                  <input 
                    autoFocus
                    type="text"
                    placeholder="City, State"
                    className="w-full text-2xl font-bold p-0 border-none focus:ring-0 placeholder:text-slate-200 text-slate-900"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
                    <Users size={24} />
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">How big is your team?</h1>
                  <div className="grid grid-cols-2 gap-4">
                    {['Just me', '2-5 people', '6-15 people', '16+ people'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setFormData({...formData, teamSize: option})}
                        className={`p-4 rounded-2xl border-2 text-left font-bold transition-all ${formData.teamSize === option ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
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
                    className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50"
                  >
                    Next Step <ArrowRight size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={handleFinish}
                    className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
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
              className="text-center space-y-8"
            >
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
                <div className="relative bg-white border border-slate-100 shadow-xl rounded-3xl w-24 h-24 flex items-center justify-center">
                  <Sparkles className="text-blue-600 animate-pulse" size={40} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Magically configuring Servara...</h2>
                <div className="mt-4 space-y-2">
                  <p className="text-slate-400 font-bold text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Connecting AI to {formData.businessName}
                  </p>
                  <p className="text-slate-400 font-bold text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Optimizing {formData.location} service area
                  </p>
                  <p className="text-slate-400 font-bold text-sm flex items-center justify-center gap-2">
                    <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity }}>⏳</motion.span> Preparing custom dashboard
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