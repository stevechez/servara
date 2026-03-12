'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { completeJob } from '@/lib/services/job-workflow';

export default function JobCalendar({ jobs }: { jobs: any[] }) {
  const router = useRouter();

  // Map Supabase 'jobs' to FullCalendar 'events' format
  const events = jobs.map((job) => ({
    id: job.id,
    title: `${job.customer_name} - ${job.service_type}`,
    start: job.scheduled_at,
    backgroundColor: job.status === 'completed' ? '#10b981' : '#3b82f6',
  }));

  return (
    <div className="h-full w-full rounded-lg bg-white p-4 shadow-sm">
      <FullCalendar
        plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,listWeek', // Switch between Month and List
        }}
        events={events}
        eventClick={(info) => {
          // Navigate to the job detail page
          router.push(`/dashboard/jobs/${info.event.id}`);
        }}
        height="auto"
        // Force mobile-friendly view on small screens
        windowResize={(arg) => {
          if (window.innerWidth < 768) {
            arg.view.calendar.changeView('listDay');
          } else {
            arg.view.calendar.changeView('dayGridMonth');
          }
        }}
      />
    </div>
  );
}
