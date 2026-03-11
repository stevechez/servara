'use client';

import { useState } from 'react';
import { Sparkles, Send, Loader2, CalendarCheck, Check } from 'lucide-react';
import { generateEstimate } from '@/app/actions/generateEstimate';
import { convertEstimateToJob } from '@/app/actions/convertEstimateToJob';

interface AIEstimatorProps {
  customerId: string;
  customerEmail?: string | null;
}

export default function AIEstimator({ customerId, customerEmail }: AIEstimatorProps) {
  const [isConverted, setIsConverted] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // 1. Logic to generate the AI Estimate
  async function handleMagicEstimate() {
    setLoading(true);
    try {
      const res = await generateEstimate(customerId, input);
      if (res.success) {
        setResult(res.data);
      }
    } catch (error) {
      console.error("AI Estimation failed:", error);
      alert("AI is taking a break. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // 2. Logic to convert the Estimate into a Scheduled Job
  async function handleConvertToJob() {
    if (!result) return;
    setLoading(true);
    try {
      const res = await convertEstimateToJob(customerId, result);
      if (res.success) {
        setIsConverted(true);
        setTimeout(() => {
          setResult(null);
          setIsConverted(false);
          setInput(''); // Clear input after success
        }, 2000);
      }
    } catch (error) {
      console.error("Conversion error:", error);
    } finally {
      setLoading(false);
    }
  }

  // 3. Logic to draft the email
  const handleSendEmail = () => {
    if (!result) return;
    const subject = encodeURIComponent(`Estimate: ${result.service_name}`);
    const body = encodeURIComponent(result.client_message);
    const email = customerEmail || '';
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
      <Sparkles className="absolute right-[-10px] top-[-10px] w-32 h-32 text-white/10 rotate-12" />

      <div className="relative z-10 space-y-6">
        <div>
          <h3 className="text-xl font-black italic tracking-tight flex items-center gap-2">
            AI Quoting Engine
          </h3>
          <p className="text-blue-100/80 text-xs font-medium mt-1">Shorthand to professional quote in seconds.</p>
        </div>

        {!result ? (
          <div className="space-y-4">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 3 bedroom deep clean, includes windows..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm placeholder:text-blue-200/50 outline-none focus:bg-white/20 transition-all resize-none text-white"
              rows={3}
            />
            <button 
              onClick={handleMagicEstimate}
              disabled={loading || !input}
              className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><Sparkles size={16} /> Generate Estimate</>}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-slate-900 space-y-4 animate-in fade-in zoom-in duration-300 shadow-inner">
            <div className="flex justify-between items-start">
               <h4 className="font-black text-lg text-blue-600 leading-tight">{result.service_name}</h4>
               <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-black text-sm flex-shrink-0">${result.suggested_total}</span>
            </div>
            
            <ul className="space-y-2">
              {result.items.map((item: string, i: number) => (
                <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-400 rounded-full" /> {item}
                </li>
              ))}
            </ul>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Drafted Message</p>
              <p className="text-xs leading-relaxed italic text-slate-600">"{result.client_message}"</p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button 
                onClick={handleSendEmail}
                className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all"
              >
                <Send size={14} /> Send to Client
              </button>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setResult(null)} 
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                >
                  Discard
                </button>
                
                <button 
                  onClick={handleConvertToJob}
                  disabled={loading || isConverted}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    isConverted 
                      ? 'bg-green-500 text-white shadow-green-100' 
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : 
                   isConverted ? <><Check size={14} /> Added!</> : 
                   <><CalendarCheck size={14} /> Book Job</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}