'use server';

import { createClient } from '@/lib/supabase/server';

export async function getRevenueForecast() {
  const supabase = await createClient();

  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const { data, error } = await supabase
    .from('jobs')
    .select(
      `
      scheduled_time,
      services (base_price)
    `
    )
    .eq('status', 'scheduled')
    .gte('scheduled_time', today.toISOString())
    .lte('scheduled_time', thirtyDaysFromNow.toISOString());

  if (error || !data) return [];

  // Group by week to keep the chart clean
  const weeklyForecast: Record<string, number> = {};

  data.forEach((job: any) => {
    const date = new Date(job.scheduled_time);
    const weekLabel = `Week of ${date.getMonth() + 1}/${date.getDate()}`;

    const price = job.services?.[0]?.base_price || 0;
    weeklyForecast[weekLabel] = (weeklyForecast[weekLabel] || 0) + price;
  });

  return Object.entries(weeklyForecast).map(([name, revenue]) => ({
    name,
    revenue,
  }));
}

/**
 * 1. TODAY'S SNAPSHOT STATS
 */
export async function getDailyStats(date: string = new Date().toISOString().split('T')[0]) {
  const supabase = await createClient();

  const startOfDay = `${date}T00:00:00.000Z`;
  const endOfDay = `${date}T23:59:59.999Z`;

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select(
      `
      status,
      services (base_price),
      review_sms_sent
    `
    )
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay);

  if (error || !jobs) return null;

  const completedJobs = jobs.filter((j) => j.status === 'completed');

  const totalRevenue = completedJobs.reduce((acc, j: any) => {
    // Handle the array return from the join
    const price = j.services?.[0]?.base_price || 0;
    return acc + price;
  }, 0);

  const reviewsTriggered = jobs.filter((j) => j.review_sms_sent).length;

  return {
    totalJobs: jobs.length,
    completedCount: completedJobs.length,
    revenue: totalRevenue,
    reviewsSent: reviewsTriggered,
    completionRate: jobs.length > 0 ? Math.round((completedJobs.length / jobs.length) * 100) : 0,
  };
}

/**
 * 2. WEEKLY REVENUE TREND (Using SQL View)
 */
export async function getWeeklyRevenueTrend() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('daily_revenue_summary').select('*').limit(7);

  if (error || !data) {
    console.error('Trend Fetch Error:', error);
    return [];
  }

  return data
    .map((row) => ({
      name: new Date(row.work_date).toLocaleDateString([], { weekday: 'short' }),
      revenue: row.total_revenue,
    }))
    .reverse();
}

/**
 * 3. TECHNICIAN LEADERBOARD
 */
export async function getTechLeaderboard() {
  const supabase = await createClient();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('jobs')
    .select(
      `
      technicians (id, name),
      services (base_price)
    `
    )
    .eq('status', 'completed')
    .gte('created_at', sevenDaysAgo.toISOString());

  if (error || !data) return [];

  const stats: Record<string, { name: string; jobs: number; revenue: number }> = {};

  data.forEach((job: any) => {
    const tech = job.technicians;
    if (!tech) return;

    if (!stats[tech.id]) {
      stats[tech.id] = { name: tech.name, jobs: 0, revenue: 0 };
    }

    stats[tech.id].jobs += 1;
    stats[tech.id].revenue += job.services?.[0]?.base_price || 0;
  });

  return Object.values(stats).sort((a, b) => b.revenue - a.revenue);
}
