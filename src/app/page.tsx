// app/jobs/page.tsx
import { createClient } from '@/lib/supabase/server';
import JobCalendar from '@/components/JobCalendar';

export default async function Page() {
	const supabase = await createClient();

	const { data: jobs } = await supabase
		.from('jobs')
		.select(
			`
      id, 
      scheduled_at, 
      status, 
      service_type,
      customers (name)
    `,
		)
		// Map the nested join for easier access in the component
		.then(res => ({
			...res,
			data: res.data?.map(j => ({ ...j, customer_name: j.customers[0].name })),
		}));

	return <JobCalendar jobs={jobs || []} />;
}
