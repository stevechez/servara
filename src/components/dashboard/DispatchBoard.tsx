'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { updateJobAssignment } from '@/app/actions/jobs';
import { ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import DispatchCell from './DispatchCell';
import DraggableJob from './DraggableJob';

// --- TYPES ---
export interface Job {
  id: string;
  status: string;
  technician_id?: string; // Unified naming
  scheduled_hour?: number; // Local tracking for the grid
  customers?: {
    name?: string;
    address?: string;
    phone?: string;
    customer_memberships?: { status: string }[];
  };
  services?: {
    name: string;
    base_price: number;
    estimated_duration_minutes: number;
  };
  technicians?: {
    id: string;
    name: string;
  };
}

export default function DispatchBoard({
  initialJobs,
  technicians,
}: {
  initialJobs: any[];
  technicians: any[];
}) {
  const [mounted, setMounted] = useState(false);

  // Prepare jobs by extracting the hour from their scheduled_time if necessary
  const preparedJobs = initialJobs.map((j) => ({
    ...j,
    // If the DB has technician_id, use it; otherwise use the nested one
    technician_id: j.technician_id || j.technicians?.id,
    scheduled_hour: j.scheduled_hour || new Date(j.scheduled_time).getHours() || 8,
  }));

  const [jobs, setJobs] = useState<Job[]>(preparedJobs);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  useEffect(() => setMounted(true), []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveJob(event.active.data.current?.job);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const jobId = active.id as string;
    const overId = over.id as string; // Format: "cell-{techId}-{hour}"

    if (!overId.startsWith('cell-')) return;

    const [_, techId, hourStr] = overId.split('-');
    const hour = parseInt(hourStr);

    // 1. OPTIMISTIC UI UPDATE
    // Ensure we update 'technician_id' and 'scheduled_hour' to match our filters
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, technician_id: techId, scheduled_hour: hour } : j))
    );

    // 2. PERSIST TO DB
    try {
      // Map the hour back to a full ISO string for the database
      const today = new Date();
      today.setHours(hour, 0, 0, 0);
      const scheduledTime = today.toISOString();

      await updateJobAssignment(jobId, techId, scheduledTime);
    } catch (error) {
      console.error('Failed to reassign job', error);
      // Revert logic here if needed
    }
  };

  if (!mounted) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen flex-col bg-[#050608] text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/5 bg-[#0B0E14] px-8 py-4">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Ops Command</h1>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-blue-600/20">
            <Navigation size={14} /> Optimize Routes
          </button>
        </div>

        {/* GRID */}
        <div className="flex-1 overflow-auto">
          <div className="inline-grid min-w-full grid-cols-[100px_repeat(3,1fr)] bg-[#050608]">
            <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0B0E14]"></div>
            {technicians.map((tech) => {
              const yieldAmount = jobs
                .filter((j) => j.technician_id === tech.id)
                .reduce((sum, j) => sum + (j.services?.base_price || 0), 0);

              return (
                <div
                  key={tech.id}
                  className="sticky top-0 z-20 border-b border-l border-white/10 bg-[#0B0E14] p-4 text-center"
                >
                  <p className="text-[10px] font-black tracking-widest text-blue-500 uppercase">
                    {tech.name}
                  </p>
                  <p className="mt-1 text-xs font-black text-emerald-500">
                    ${yieldAmount.toLocaleString()}
                  </p>
                </div>
              );
            })}

            {/* TIME SLOTS */}
            {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((hour) => (
              <React.Fragment key={hour}>
                <div className="flex items-center justify-center border-b border-white/5 bg-[#050608] py-10 text-[10px] font-black text-slate-500 uppercase">
                  {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                </div>
                {technicians.map((tech) => (
                  <DispatchCell key={`${tech.id}-${hour}`} id={`cell-${tech.id}-${hour}`}>
                    {jobs
                      .filter((j) => j.technician_id === tech.id && j.scheduled_hour === hour)
                      .map((job) => (
                        <DraggableJob key={job.id} job={job} />
                      ))}
                  </DispatchCell>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeJob ? (
          <div className="scale-105 opacity-80 transition-transform">
            <DraggableJob job={activeJob} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
