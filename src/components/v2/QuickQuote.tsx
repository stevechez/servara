'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation'; // <-- 1. Import Router
import { generateQuoteFromPhoto, createJobFromQuote } from '@/lib/actions/ai-quote';
import { Camera, Sparkles, Check, Loader2, ArrowRight } from 'lucide-react';

export default function QuickQuote() {
  const router = useRouter(); // <-- 2. Initialize Router
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setIsAnalyzing(true);
    setResult(null);
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const aiResponse = await generateQuoteFromPhoto(formData);
      setResult(aiResponse);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze image. Ensure it's a valid photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetQuote = () => {
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConvert = async () => {
    if (!result) return;
    setIsConverting(true);
    try {
      // 3. Get the ID from the server (Now passing all 4 required fields!)
      const newJobId = await createJobFromQuote({
        price: result.price_range,
        sqft: result.estimated_square_feet,
        condition: result.surface_condition,
        reasoning: result.reasoning // <--- This was the missing piece!
      });
      
      // 4. Safely teleport the user on the client side
      if (newJobId) {
        router.push(`/dashboard/jobs/${newJobId}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to convert job.");
      setIsConverting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-blue-500" size={18} />
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Photo Quote</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        
        {!imagePreview && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 hover:border-blue-500/50 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Camera size={24} />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Upload a photo</p>
            <p className="text-xs text-slate-500 font-medium">Driveway, roof, or siding</p>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>
        )}

        {imagePreview && isAnalyzing && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover opacity-50 grayscale" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
              <Loader2 size={32} className="text-white animate-spin mb-3" />
              <p className="text-xs font-black uppercase tracking-widest text-white animate-pulse">Gemini Vision is analyzing...</p>
            </div>
          </div>
        )}

        {imagePreview && result && !isAnalyzing && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 h-32">
              <img src={imagePreview} alt="Analyzed Surface" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 shadow-lg">
                <Check size={12} /> {result.confidence_score}% Match
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#0B0E14] rounded-2xl p-4 border border-slate-100 dark:border-white/5">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Estimated Value</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{result.price_range}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Surface Area</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">~{result.estimated_square_feet} sqft</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white">Condition:</span> {result.surface_condition}
                </p>
                <p className="text-[10px] text-slate-500 mt-2 italic leading-relaxed">
                  "{result.reasoning}"
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={resetQuote} disabled={isConverting} className="flex-1 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50">
                New Photo
              </button>
              <button onClick={handleConvert} disabled={isConverting} className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-blue-500/20 disabled:opacity-50">
                {isConverting ? <Loader2 size={14} className="animate-spin" /> : <><Check size={14} /> Convert to Job</>}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}