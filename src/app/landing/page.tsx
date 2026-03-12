// app/landing/page.tsx
import Link from 'next/link';
import {
  ArrowRight,
  Wrench,
  Users,
  FileText,
  DollarSign,
  CheckCircle,
  PlayCircle,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* NAVIGATION */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Wrench className="text-blue-600" size={28} />
          <span className="text-2xl font-bold tracking-tight">Zidro</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-bold text-gray-600 transition-colors hover:text-gray-900"
          >
            Log In
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl space-y-8 text-center">
            <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wide text-blue-600 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              Next-Gen Field Service
            </div>

            <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-7xl">
              Your business on <span className="text-blue-600">Autopilot.</span>
            </h1>

            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-slate-500">
              The only field service platform that uses AI to catch missed calls, optimize routes,
              and forecast revenue while you focus on the job.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <button className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-lg font-black text-white shadow-xl shadow-slate-200 transition-all hover:bg-blue-600 sm:w-auto">
                Start Free Trial{' '}
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-600 transition-all hover:bg-slate-50 sm:w-auto">
                <PlayCircle size={20} /> Watch Demo
              </button>
            </div>
          </div>

          {/* PRODUCT SNEAK PEEK */}
          <div className="relative mt-20">
            <div className="absolute inset-0 z-10 h-full w-full bg-gradient-to-t from-white via-transparent to-transparent" />
            <div className="rotate-1 transform overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-2 shadow-2xl">
              {/* This is where you'd place a high-res screenshot of the Dashboard we just built */}
              <div className="h-[500px] w-full rounded-2xl border border-slate-100 bg-white p-8 shadow-inner">
                <div className="mb-8 h-4 w-48 rounded-full bg-slate-100" />
                <div className="grid grid-cols-3 gap-6">
                  <div className="h-32 rounded-2xl border border-blue-100 bg-blue-50" />
                  <div className="h-32 rounded-2xl border border-slate-100 bg-slate-50" />
                  <div className="h-32 rounded-2xl border border-slate-100 bg-slate-50" />
                </div>
                <div className="mt-8 h-64 rounded-3xl border border-slate-100 bg-slate-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="border-t border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Everything you need to scale</h2>
            <p className="mx-auto max-w-xl text-gray-500">
              We built the exact tools you need to stop doing admin work and start growing your
              revenue.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Lead Capture</h3>
              <p className="leading-relaxed text-gray-500">
                Never lose a potential client again. Funnel all your inquiries into one clean
                pipeline and turn them into paying jobs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FileText size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Smart Estimates</h3>
              <p className="leading-relaxed text-gray-500">
                Generate professional, branded estimates in seconds. Send them directly to your
                clients and win more bids.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <DollarSign size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Instant Invoicing</h3>
              <p className="leading-relaxed text-gray-500">
                Convert completed jobs into beautiful PDF invoices with one click. Send automated
                emails and get paid directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">
          Ready to professionalize your business?
        </h2>
        <ul className="mb-10 flex flex-col items-center justify-center gap-6 text-sm font-medium text-gray-600 sm:flex-row">
          <li className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" /> Setup in 2 minutes
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" /> Cancel anytime
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" /> Premium support
          </li>
        </ul>
        <Link
          href="/login"
          className="inline-block rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-blue-700"
        >
          Create Your Account
        </Link>
      </section>
    </div>
  );
}
