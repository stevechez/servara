'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "Is it hard to switch from Jobber or ServiceTitan?",
    answer: "Not at all. We offer a one-click import tool that brings over your entire customer list, job history, and open invoices in less than 5 minutes."
  },
  {
    question: "How does the AI Call Intercept actually work?",
    answer: "When you miss a call, our AI answers using a natural-sounding voice. It captures the customer's needs and checks your live calendar to book a slot. You get a text notification the second a new job is confirmed."
  },
  {
    question: "Do I need a credit card to start the trial?",
    answer: "No. You get full access to all AI features for 14 days without ever touching your wallet. We want you to see the ROI before you pay us a dime."
  },
  {
    question: "Can my field techs use this on their phones?",
    answer: "Yes! Servara is mobile-optimized for iOS and Android. Your techs can see their routes, update job statuses, and collect payments directly from the field."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Common Questions</h2>
          <p className="text-slate-500 font-medium mt-4 text-lg">Everything you need to know about the future of your field business.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-7 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {faq.question}
                </span>
                <div className={`p-2 rounded-xl transition-all ${openIndex === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                  <ChevronDown size={20} />
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-8 pb-8 text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}