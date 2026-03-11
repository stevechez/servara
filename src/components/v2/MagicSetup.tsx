'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { generateBusinessServices } from '@/app/actions/generateServices';
import { saveServicesToDb } from '@/app/actions/saveServices';

export default function MagicSetup() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedServices, setGeneratedServices] = useState<any[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleMagicGenerate() {
    if (!input) return;
    setLoading(true);
    
    // Call our new Server Action!
    const result = await generateBusinessServices(input);
    
    if (result.success) {
      setGeneratedServices(result.services);
    } else {
      alert("Oops, the AI hiccuped: " + result.error);
    }
    
    setLoading(false);
  }

  return (
    <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm p-6 md:p-8 mt-8">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight italic">AI Business Setup</h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tell us what you do, and we'll build your service menu instantly.</p>
        </div>
      </div>

      {!generatedServices ? (
        
        /* SLEEK INPUT FORM */
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., I run a mobile dog grooming business in Austin..."
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleMagicGenerate()}
          />
          <button 
            onClick={handleMagicGenerate}
            disabled={loading || !input}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-slate-900 dark:hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : 'Generate Menu'}
          </button>
        </div>

      ) : (

        /* GENERATED RESULTS */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedServices.map((svc, idx) => (
              <div key={idx} className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{svc.name}</h3>
                  <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-black px-2 py-1 rounded-lg text-[10px] tracking-widest uppercase shrink-0">
                    ${svc.price}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">{svc.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6 gap-4">
            <button 
              onClick={() => setGeneratedServices(null)}
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
            >
              Start Over
            </button>
            <button 
              onClick={async () => {
                setIsSaving(true);
                const result = await saveServicesToDb(generatedServices);
                if (result.success) {
                  alert("Services successfully saved to your database! 🚀");
                  setGeneratedServices(null); 
                  setInput('');
                } else {
                  alert("Failed to save: " + result.error);
                }
                setIsSaving(false);
              }}
              disabled={isSaving}
              className="w-full sm:w-auto bg-slate-900 dark:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-slate-800 dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-blue-500/20"
            >
              {isSaving ? 'Saving...' : 'Save to Database'} <CheckCircle2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}