'use server';

import { createClient } from '@/lib/supabase/server';
import { calculateJobPrediction } from '@/lib/utils/prediction';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

/**
 * Finds the best technician for an emergency based on location and current workload
 */
export async function findEmergencyTech(lat: number, lng: number) {
  const supabase = await createClient();

  const { data: techs, error } = await supabase
    .from('technicians')
    .select(
      `
      id, name, last_lat, last_lng,
      jobs (
        id, status, actual_start_time,
        services (estimated_duration_minutes)
      )
    `
    )
    .eq('jobs.status', 'in_progress');

  if (error || !techs) return [];

  const candidates = techs.map((tech) => {
    const distance = Math.sqrt(
      Math.pow((tech.last_lat || 0) - lat, 2) + Math.pow((tech.last_lng || 0) - lng, 2)
    );
    const activeJob = tech.jobs?.[0];
    const prediction = activeJob ? calculateJobPrediction(activeJob) : { remaining: 0 };

    return {
      id: tech.id,
      name: tech.name,
      distance: (distance * 69).toFixed(1),
      minutesToFinish: prediction?.remaining || 0,
      rescueScore: distance * 69 + (prediction?.remaining || 0) / 10,
    };
  });

  return candidates.sort((a, b) => a.rescueScore - b.rescueScore);
}

/**
 * Pauses current work and dispatches tech to emergency
 */
export async function reassignToEmergency(
  techId: string,
  currentJobId: string,
  emergencyDetails: { name: string; address: string; phone: string }
) {
  const supabase = await createClient();

  // 1. Fetch Technician Phone Number first (needed for Twilio)
  const { data: tech } = await supabase
    .from('technicians')
    .select('phone, name')
    .eq('id', techId)
    .single();

  if (!tech?.phone) return { success: false, error: 'Tech phone not found' };

  // 2. Pause the current job
  await supabase
    .from('jobs')
    .update({ status: 'paused', notes: 'Paused for emergency dispatch' })
    .eq('id', currentJobId);

  // 3. Create the New Emergency Job
  const { data: newJob, error: jobError } = await supabase
    .from('jobs')
    .insert({
      technician_id: techId,
      status: 'en_route',
      is_emergency: true,
      customer_name: emergencyDetails.name,
      address: emergencyDetails.address,
    })
    .select()
    .single();

  if (jobError) return { success: false, error: jobError.message };

  // 4. Trigger High-Priority SMS
  try {
    await client.messages.create({
      body: `🚨 EMERGENCY DISPATCH: ${emergencyDetails.name}. Address: ${emergencyDetails.address}. Current job paused. Head there immediately!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: tech.phone,
    });
  } catch (smsError) {
    console.error('Emergency SMS failed but job created:', smsError);
  }

  return { success: true, newJobId: newJob.id };
}

export async function resumePausedJob(jobId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('jobs')
    .update({
      status: 'in_progress',
      actual_start_time: new Date().toISOString(), // Optional: reset start time for fresh prediction
      notes: 'Job resumed after emergency',
    })
    .eq('id', jobId)
    .select()
    .single();

  if (error) return { success: false };
  return { success: true, job: data };
}
