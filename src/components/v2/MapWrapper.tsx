'use client';

import dynamic from 'next/dynamic';

const ServiceMap = dynamic(() => import('./ServiceMap'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-[2.5rem]" />
});

export default function MapWrapper() {
  return <ServiceMap />;
}