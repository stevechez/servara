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

export default function ForecastChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full rounded-[2rem] border border-white/5 bg-[#0B0E14] p-8 shadow-2xl">
      <h3 className="mb-6 text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase italic">
        30-Day Revenue Projection
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#475569"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              backgroundColor: '#0B0E14',
              border: '1px solid #1e293b',
              borderRadius: '1rem',
            }}
          />
          <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#064e3b'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
