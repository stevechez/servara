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
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Business Setup</h2>
          <p className="text-gray-500">Tell us what you do, and we'll build your service menu instantly.</p>
        </div>
      </div>

      {!generatedServices ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., I run a mobile dog grooming business in Austin..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleMagicGenerate()}
          />
          <button 
            onClick={handleMagicGenerate}
            disabled={loading || !input}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Generating...</> : 'Generate Menu'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedServices.map((svc, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-5 hover:border-purple-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{svc.name}</h3>
                  <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                    ${svc.price}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{svc.description}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-6">
            <button 
              onClick={() => setGeneratedServices(null)}
              className="text-gray-500 hover:text-gray-800 font-medium"
            >
              Start Over
            </button>
            <button 
              onClick={async () => {
                setIsSaving(true);
                const result = await saveServicesToDb(generatedServices);
                if (result.success) {
                  alert("Services successfully saved to your database! 🚀");
                  setGeneratedServices(null); // Clears the screen back to normal
                  setInput('');
                } else {
                  alert("Failed to save: " + result.error);
                }
                setIsSaving(false);
              }}
              disabled={isSaving}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save to Database'} <CheckCircle2 size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}