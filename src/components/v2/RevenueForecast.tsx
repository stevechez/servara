'use client';

import { TrendingUp, DollarSign, Calendar, Target, CheckCircle } from 'lucide-react';

interface ForecastProps {
  earned?: number;    // Changed to optional
  scheduled?: number; // Changed to optional
  goal?: number;
}

// Add = 0 to the destructuring here
export default function RevenueForecast({ 
  earned = 0, 
  scheduled = 0, 
  goal = 10000 
}: ForecastProps) {
  
  const total = earned + scheduled;
  const progress = Math.min((total / goal) * 100, 100);
  const earnedProgress = Math.min((earned / goal) * 100, 100);

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
      {/* ... header code ... */}

      {/* Progress Bar Stack */}
      <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-8">
        <div 
          className="absolute h-full bg-blue-400 opacity-30 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute h-full bg-blue-600 transition-all duration-700 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          style={{ width: `${earnedProgress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-widest">Collected</span>
          </div>
          {/* Added the || 0 just to be extra safe */}
          <p className="text-2xl font-black text-slate-900">${(earned || 0).toLocaleString()}</p>
        </div>
        
        <div className="space-y-1 border-l border-slate-100 pl-8">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-widest">Scheduled</span>
          </div>
          <p className="text-2xl font-black text-blue-600">${(scheduled || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 italic">Total Projected:</span>
        <span className="text-lg font-black text-slate-900">${(total || 0).toLocaleString()}</span>
      </div>
    </div>
  );
}