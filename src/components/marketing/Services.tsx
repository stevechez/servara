import {
  Phone,
  Map,
  DollarSign,
  FileText,
  Repeat,
  Users,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function Services() {
  // SaaS Pro-Tip: Keep features in an array so you can easily add more later without breaking the layout
  const features = [
    {
      title: 'Smart Dispatching',
      description:
        'Eliminate windshield time. Auto-arrange your day to save gas, reduce deadhead, and maximize billed hours.',
      icon: Map,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      title: '1-Click PDF Reports',
      description:
        'Snap before & after photos in the field. Instantly generate professional, branded PDF reports to justify your pricing.',
      icon: FileText,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
    },
    {
      title: 'Recurring Care Plans',
      description:
        'Turn one-off jobs into guaranteed monthly MRR. Sell maintenance memberships directly from the field.',
      icon: Repeat,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-500/10',
    },
    {
      title: 'Client Portals',
      description:
        'Give customers a frictionless, zero-login link to view service history, download reports, and pay invoices instantly.',
      icon: Users,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-500/10',
    },
    {
      title: 'Field Payments',
      description:
        'Collect credit cards right from your phone. Cash hits your bank account the next business day. Zero hardware required.',
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      title: 'AI Call Intercept',
      description:
        'Our human-sounding AI answers missed calls, quotes standard prices, and books the job directly onto your calendar.',
      icon: Phone,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      {/* SECTION HEADER */}
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h2 className="mb-4 text-[10px] font-black tracking-widest text-blue-600 uppercase">
          The Platform
        </h2>
        <h3 className="text-4xl leading-tight font-black tracking-tight text-slate-900 md:text-5xl dark:text-white">
          Everything you need.
          <br />
          Zero clutter.
        </h3>
        <p className="mt-6 text-lg font-medium text-slate-500 dark:text-slate-400">
          We stripped out the bloated menus and confusing tabs. Zidro gives your crew exactly what
          they need to close the job and move to the next.
        </p>
      </div>

      {/* FEATURE GRID (The SaaS "Bento Box") */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group rounded-3xl border border-slate-200 bg-slate-50 p-8 transition-all duration-300 hover:shadow-lg dark:border-white/5 dark:bg-[#0B0E14]"
          >
            <div
              className={`h-12 w-12 ${feature.bg} mb-6 flex items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110`}
            >
              <feature.icon className={feature.color} size={20} />
            </div>
            <h4 className="mb-3 text-xl font-black tracking-tight text-slate-900 dark:text-white">
              {feature.title}
            </h4>
            <p className="text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
              {feature.description}
            </p>
          </div>
        ))}

        {/* BOTTOM MEGA-CARD: Built for the truck */}
        <div className="group relative mt-2 flex flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl bg-blue-600 p-8 text-white md:col-span-2 md:flex-row lg:col-span-3 lg:p-12 dark:bg-blue-600">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl transition-colors group-hover:bg-white/20" />

          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h3 className="mb-4 flex items-center justify-center gap-3 text-3xl font-black tracking-tight md:justify-start">
              <Smartphone size={28} className="text-blue-200" /> Built for the Truck.
            </h3>
            <p className="text-sm leading-relaxed font-medium text-blue-100 lg:text-base">
              The Zidro mobile interface is designed with massive buttons, high contrast, and zero
              distractions. Made specifically for work gloves, sun glare, and fast thumbs.
            </p>
          </div>

          <div className="relative z-10 w-full flex-shrink-0 md:w-auto">
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-xs font-black tracking-widest text-blue-600 uppercase shadow-xl transition-colors hover:bg-slate-50 active:scale-95 md:w-auto"
            >
              Start Free Trial <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
