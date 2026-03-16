import {
  getDailyStats,
  getWeeklyRevenueTrend,
  getTechLeaderboard,
  getRevenueForecast,
} from '@/app/actions/report-actions';
import DailyReport from '@/components/dashboard/DailyReport';
import RevenueChart from '@/components/dashboard/RevenueChart';
import LiveDispatchBoard from '@/components/dashboard/LiveDispatchBoard';
import TechLeaderboard from '@/components/dashboard/TechLeaderboard';
import ForecastChart from '@/components/dashboard/ForecastChart';
import { createClient } from '@/lib/supabase/server';

export default async function DispatchBoardPage() {
  const supabase = await createClient();

  // FIXED: Added 'forecast' to the destructuring array (5 items total)
  const [stats, trendData, leaderboard, forecast, jobsResponse] = await Promise.all([
    getDailyStats(),
    getWeeklyRevenueTrend(),
    getTechLeaderboard(),
    getRevenueForecast(),
    supabase
      .from('jobs')
      .select(
        `
      id, status, actual_start_time, arrival_sms_sent, review_sms_sent,
      customers (name, address, phone),
      technicians (id, name),
      services (name, base_price, estimated_duration_minutes) -- ADDED THIS
    `
      )
      .not('status', 'eq', 'completed')
      .order('status'),
  ]);

  const jobs = jobsResponse.data || [];

  return (
    <div className="min-h-screen bg-[#050608] p-8 text-white">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Command Center</h1>
        <p className="font-mono text-[10px] font-medium tracking-[0.2em] text-slate-500 uppercase">
          Strategic Fleet Intelligence
        </p>
      </div>

      {/* ROW 1: TODAY'S STATS */}
      <div className="mb-8">{stats && <DailyReport stats={stats} />}</div>

      {/* ROW 2: ANALYTICS & LEADERBOARD */}
      <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-8">
            {/* Historical Trend */}
            {trendData && <RevenueChart data={trendData} />}
            {/* Future Forecast */}
            {forecast && <ForecastChart data={forecast} />}
          </div>
        </div>
        <div className="lg:col-span-1">{leaderboard && <TechLeaderboard data={leaderboard} />}</div>
      </div>

      {/* ROW 3: LIVE OPERATIONS */}
      <div className="border-t border-white/5 pt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase italic">
            Live Operations Oversight
          </h2>
          <div className="ml-4 h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent" />
        </div>
        <LiveDispatchBoard initialJobs={(jobsResponse.data as any) || []} />{' '}
      </div>
    </div>
  );
}
