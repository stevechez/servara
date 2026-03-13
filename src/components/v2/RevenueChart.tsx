'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function RevenueChart({
  collected,
  pending,
}: {
  collected: number;
  pending: number;
}) {
  const data = [
    { name: 'Collected', value: collected, color: '#10b981' }, // Emerald
    { name: 'Pending', value: pending, color: '#3b82f6' }, // Blue
  ];

  return (
    <div className="shadow-soft rounded-[2.5rem] border border-slate-200 bg-white p-8 dark:border-white/5 dark:bg-[#12161D]">
      <div className="mb-6">
        <h2 className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
          Financial Forecast
        </h2>
        <p className="mt-1 text-2xl font-black tracking-tighter italic dark:text-white">
          Pipeline Value
        </p>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.1} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                borderRadius: '16px',
                border: 'none',
                fontWeight: 900,
                fontSize: '12px',
              }}
            />
            <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-between border-t border-slate-50 pt-6 dark:border-white/5">
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase">Total Potential</p>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            ${(collected + pending).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-right text-[9px] font-black text-emerald-500 uppercase">
            Conversion Target
          </p>
          <p className="text-xl font-black text-emerald-500">85%</p>
        </div>
      </div>
    </div>
  );
}
