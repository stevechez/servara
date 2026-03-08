'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Sparkles, Info } from 'lucide-react';

const data = [
  { day: 'Mon', confirmed: 1200, projected: 1400 },
  { day: 'Tue', confirmed: 2100, projected: 2400 },
  { day: 'Wed', confirmed: 1800, projected: 2800 },
  { day: 'Thu', confirmed: 2400, projected: 3200 },
  { day: 'Fri', confirmed: 1900, projected: 3900 },
  { day: 'Sat', confirmed: 0, projected: 2100 },
  { day: 'Sun', confirmed: 0, projected: 1500 },
];

export default function RevenueForecast() {
  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Forecast</h3>
            <div className="p-1 bg-blue-50 text-blue-600 rounded-md">
              <Sparkles size={14} />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium italic">AI-driven cash flow projection for this week.</p>
        </div>
        
        <div className="flex items-center gap-6 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Projected Total</p>
            <p className="text-xl font-black text-slate-900">$17,300</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
            <TrendingUp size={16} /> +12%
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              hide 
              domain={[0, 'auto']} 
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
            />
            {/* Projected Line (Dashed) */}
            <Area 
              type="monotone" 
              dataKey="projected" 
              stroke="#94a3b8" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorProjected)" 
            />
            {/* Confirmed Line (Solid) */}
            <Area 
              type="monotone" 
              dataKey="confirmed" 
              stroke="#3b82f6" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorConfirmed)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600" />
          <span className="text-xs font-bold text-slate-600">Confirmed Jobs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-dashed border-slate-400" />
          <span className="text-xs font-bold text-slate-600">AI Projected (from Leads)</span>
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 p-4 rounded-2xl shadow-xl border border-white/10">
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">{payload[0].payload.day}</p>
        <div className="space-y-1">
          <p className="text-sm font-bold text-white flex justify-between gap-8">
            Confirmed: <span className="text-blue-400">${payload[0].value}</span>
          </p>
          <p className="text-sm font-bold text-slate-400 flex justify-between gap-8">
            Projected: <span>${payload[1].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}