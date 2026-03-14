import { Lock } from 'lucide-react';
import Link from 'next/link';

export default function FeatureGate({
  children,
  userTier,
  requiredTier = 'growth',
}: {
  children: React.ReactNode;
  userTier: string;
  requiredTier?: string;
}) {
  const tiers = ['starter', 'growth', 'scale'];
  const hasAccess = tiers.indexOf(userTier) >= tiers.indexOf(requiredTier);

  if (hasAccess) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Lock size={20} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Premium Feature</h3>
        <p className="mt-1 mb-6 text-sm text-slate-500">
          The Neighborhood Blitz is only available on the <strong>Growth</strong> plan and above.
        </p>
        <Link
          href="/dashboard/settings/billing"
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
        >
          Upgrade Your Plan
        </Link>
      </div>
    </div>
  );
}
