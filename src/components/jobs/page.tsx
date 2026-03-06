// app/jobs/page.tsx
import dynamic from 'next/dynamic';

const JobCalendar = dynamic(() => import('./JobCalendar'), {
	ssr: false,
	loading: () => (
		<div className="h-[600px] animate-pulse bg-gray-100 rounded-lg" />
	),
});

export default function Page() {
	// ... fetch jobs and pass to JobCalendar
}
