import React from 'react';
import { Trophy, Award, Medal } from 'lucide-react';

export default function TechLeaderboard({ data }: { data: any[] }) {
  const maxRevenue = Math.max(...data.map((t) => t.revenue), 1);

  return (
    <div className="h-full rounded-[2rem] border border-white/5 bg-[#0B0E14] p-8 shadow-2xl">
      <h3 className="mb-6 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase italic">
        Weekly Top Performers
      </h3>

      <div className="space-y-6">
        {data.map((tech, index) => (
          <div key={tech.name} className="relative">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-4 text-xs font-black text-slate-700">{index + 1}</span>
                <p className="text-xs font-black text-white uppercase italic">{tech.name}</p>
                {index === 0 && <Trophy size={14} className="text-amber-500" />}
              </div>
              <p className="font-mono text-[10px] font-black text-blue-400">
                ${tech.revenue.toLocaleString()}
              </p>
            </div>

            {/* Progress Bar showing relative performance */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full transition-all duration-1000 ${
                  index === 0 ? 'bg-amber-500' : 'bg-slate-700'
                }`}
                style={{ width: `${(tech.revenue / maxRevenue) * 100}%` }}
              />
            </div>

            <div className="mt-1 flex justify-end">
              <p className="text-[8px] font-bold tracking-widest text-slate-600 uppercase">
                {tech.jobs} Jobs Finished
              </p>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <p className="py-10 text-center text-[10px] font-bold text-slate-600 uppercase italic">
            No data for current period
          </p>
        )}
      </div>
    </div>
  );
}
