'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Fetches all jobs assigned to a specific technician for a given date.
 */
export async function fetchJobsForTech(techId: string, date: string) {
  const supabase = await createClient();

  // Using a date range to capture the full 24 hours of the requested day
  const startOfDay = `${date}T00:00:00Z`;
  const endOfDay = `${date}T23:59:59Z`;

  const { data, error } = await supabase
    .from('jobs')
    .select(
      `
      id,
      service_type,
      latitude,
      longitude,
      scheduled_start_time,
      job_assignments!inner(technician_id)
    `
    )
    .eq('job_assignments.technician_id', techId)
    .gte('scheduled_start_time', startOfDay)
    .lte('scheduled_start_time', endOfDay)
    .order('scheduled_start_time', { ascending: true });

  if (error) {
    console.error('Error fetching jobs for tech:', error);
    return [];
  }

  return data || [];
}

/**
 * Calls Mapbox Optimization API to reorder jobs for maximum efficiency.
 */
export async function optimizeRoute(techId: string, date: string) {
  const jobs = await fetchJobsForTech(techId, date);

  // We need at least 2 points to "optimize" a route
  if (!jobs || jobs.length < 2) {
    return jobs;
  }

  const token = process.env.MAPBOX_TOKEN;

  if (!token) {
    console.warn('Mapbox Token missing. Returning jobs in original order.');
    return jobs;
  }

  // Mapbox expects coordinates as "longitude,latitude;longitude,latitude"
  const coordinates = jobs.map((j) => `${j.longitude},${j.latitude}`).join(';');

  try {
    const response = await fetch(
      `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?access_token=${token}&geometries=geojson`
    );

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }

    const data = await response.json();

    // The API returns 'waypoints' which tells us the new optimal order
    // We map our original jobs to this new order
    const optimizedJobs = data.waypoints
      .sort((a: any, b: any) => a.waypoint_index - b.waypoint_index)
      .map((waypoint: any) => jobs[waypoint.location_index]);

    return optimizedJobs;
  } catch (error) {
    console.error('Failed to optimize route:', error);
    return jobs; // Fallback to original order on failure
  }
}
