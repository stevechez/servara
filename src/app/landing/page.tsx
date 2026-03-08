// app/landing/page.tsx
import Link from 'next/link'
import { ArrowRight, Wrench, Users, FileText, DollarSign, CheckCircle, PlayCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* NAVIGATION */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Wrench className="text-blue-600" size={28} />
          <span className="text-2xl font-bold tracking-tight">Servara</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
            Log In
          </Link>
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wide uppercase animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Next-Gen Field Service
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900">
              Your business on <span className="text-blue-600">Autopilot.</span>
            </h1>
            
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              The only field service platform that uses AI to catch missed calls, optimize routes, and forecast revenue while you focus on the job.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group">
                Start Free Trial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <PlayCircle size={20} /> Watch Demo
              </button>
            </div>
          </div>

          {/* PRODUCT SNEAK PEEK */}
          <div className="mt-20 relative">
             <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-full w-full" />
             <div className="rounded-3xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-50 p-2 transform rotate-1">
                {/* This is where you'd place a high-res screenshot of the Dashboard we just built */}
                <div className="rounded-2xl bg-white h-[500px] w-full border border-slate-100 shadow-inner p-8">
                   <div className="w-48 h-4 bg-slate-100 rounded-full mb-8" />
                   <div className="grid grid-cols-3 gap-6">
                      <div className="h-32 bg-blue-50 rounded-2xl border border-blue-100" />
                      <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100" />
                      <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100" />
                   </div>
                   <div className="mt-8 h-64 bg-slate-50 rounded-3xl border border-slate-100" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to scale</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We built the exact tools you need to stop doing admin work and start growing your revenue.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lead Capture</h3>
              <p className="text-gray-500 leading-relaxed">
                Never lose a potential client again. Funnel all your inquiries into one clean pipeline and turn them into paying jobs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Estimates</h3>
              <p className="text-gray-500 leading-relaxed">
                Generate professional, branded estimates in seconds. Send them directly to your clients and win more bids.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Invoicing</h3>
              <p className="text-gray-500 leading-relaxed">
                Convert completed jobs into beautiful PDF invoices with one click. Send automated emails and get paid directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to professionalize your business?</h2>
        <ul className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10 text-gray-600 font-medium text-sm">
          <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Setup in 2 minutes</li>
          <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Cancel anytime</li>
          <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Premium support</li>
        </ul>
        <Link href="/login" className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 transition-colors shadow-lg inline-block">
          Create Your Account
        </Link>
      </section>

    </div>
  )
}