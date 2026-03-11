import { Phone, Map, DollarSign, FileText, Repeat, Users, Smartphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Services() {
  // SaaS Pro-Tip: Keep features in an array so you can easily add more later without breaking the layout
  const features = [
    {
      title: "Smart Dispatching",
      description: "Eliminate windshield time. Auto-arrange your day to save gas, reduce deadhead, and maximize billed hours.",
      icon: Map,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10"
    },
    {
      title: "1-Click PDF Reports",
      description: "Snap before & after photos in the field. Instantly generate professional, branded PDF reports to justify your pricing.",
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-500/10"
    },
    {
      title: "Recurring Care Plans",
      description: "Turn one-off jobs into guaranteed monthly MRR. Sell maintenance memberships directly from the field.",
      icon: Repeat,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-500/10"
    },
    {
      title: "Client Portals",
      description: "Give customers a frictionless, zero-login link to view service history, download reports, and pay invoices instantly.",
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-500/10"
    },
    {
      title: "Field Payments",
      description: "Collect credit cards right from your phone. Cash hits your bank account the next business day. Zero hardware required.",
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10"
    },
    {
      title: "AI Call Intercept",
      description: "Our human-sounding AI answers missed calls, quotes standard prices, and books the job directly onto your calendar.",
      icon: Phone,
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-500/10"
    }
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24">
      {/* SECTION HEADER */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">The Platform</h2>
        <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Everything you need.<br />Zero clutter.
        </h3>
        <p className="mt-6 text-slate-500 dark:text-slate-400 font-medium text-lg">
          We stripped out the bloated menus and confusing tabs. Servara gives your crew exactly what they need to close the job and move to the next.
        </p>
      </div>

      {/* FEATURE GRID (The SaaS "Bento Box") */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <div 
            key={i} 
            className="bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-3xl p-8 hover:shadow-lg transition-all duration-300 group"
          >
            <div className={`h-12 w-12 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className={feature.color} size={20} />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
              {feature.title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}

        {/* BOTTOM MEGA-CARD: Built for the truck */}
        <div className="md:col-span-2 lg:col-span-3 bg-blue-600 dark:bg-blue-600 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 mt-2 group">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
          
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h3 className="text-3xl font-black mb-4 tracking-tight flex items-center justify-center md:justify-start gap-3">
              <Smartphone size={28} className="text-blue-200" /> Built for the Truck.
            </h3>
            <p className="text-blue-100 font-medium text-sm lg:text-base leading-relaxed">
              The Servara mobile interface is designed with massive buttons, high contrast, and zero distractions. Made specifically for work gloves, sun glare, and fast thumbs.
            </p>
          </div>
          
          <div className="relative z-10 w-full md:w-auto flex-shrink-0">
            <Link 
              href="/login" 
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-slate-50 transition-colors active:scale-95"
            >
              Start Free Trial <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}