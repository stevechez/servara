'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Phone, User, Calendar, MapPin, Send, Zap } from 'lucide-react';

const messages = [
  {
    sender: 'customer',
    text: 'Hi, I have a massive leak under my kitchen sink. Water is everywhere.',
    time: '2:01 PM',
  },
  {
    sender: 'ai',
    text: "I'm sorry to hear that! I can certainly help you get a technician out there. Are you able to shut off the main water valve for now?",
    time: '2:01 PM',
  },
  { sender: 'customer', text: 'Yes, just did that. How soon can someone come?', time: '2:02 PM' },
  {
    sender: 'ai',
    text: 'Great. Based on your location in San Francisco, I have a slot available at 4:00 PM today with our lead tech, Marcus. Does that work?',
    time: '2:02 PM',
  },
  { sender: 'customer', text: 'Yes, please book it. My address is 123 Maple St.', time: '2:03 PM' },
];

export default function AITranscript() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex h-[700px] flex-col overflow-hidden rounded-[2.5rem] border border-[var(--card-border)] bg-[var(--card)] shadow-sm lg:flex-row">
      {/* SIDEBAR: CALL DETAILS */}
      <div className="w-full space-y-8 border-r border-[var(--card-border)] bg-slate-50/50 p-8 lg:w-80 dark:bg-slate-900/50">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-2 text-white">
              <Phone size={16} />
            </div>
            <h3 className="text-lg font-black tracking-tight">Call Info</h3>
          </div>
          <div className="space-y-4">
            <DetailItem icon={<User size={14} />} label="Caller" value="John Doe" />
            <DetailItem icon={<MapPin size={14} />} label="Location" value="San Francisco, CA" />
            <DetailItem icon={<Calendar size={14} />} label="Intent" value="Emergency Repair" />
          </div>
        </div>

        <div className="rounded-3xl bg-blue-600 p-5 text-white shadow-lg shadow-blue-500/20">
          <div className="mb-2 flex items-center gap-2">
            <Zap size={16} fill="white" />
            <span className="text-[10px] font-black tracking-widest uppercase">AI Status</span>
          </div>
          <p className="text-xs leading-relaxed font-bold">
            AI has successfully identified the issue and is finalizing the booking.
          </p>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="relative flex flex-1 flex-col bg-white dark:bg-[#0B0E14]">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-[var(--card-border)] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <Sparkles size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-black italic">Zidro AI Assistant</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase">
                Live Intercepting...
              </p>
            </div>
          </div>
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white transition-all hover:bg-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-blue-600 dark:hover:text-white">
            Take Over Call
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto p-8">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.sender === 'ai'
                    ? 'rounded-bl-none bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                    : 'rounded-br-none bg-blue-600 text-white shadow-lg shadow-blue-500/10'
                }`}
              >
                <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                <p
                  className={`mt-2 text-[9px] font-bold uppercase opacity-50 ${msg.sender === 'ai' ? 'text-slate-500' : 'text-blue-100'}`}
                >
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area (Takeover Mode) */}
        <div className="border-t border-[var(--card-border)] bg-slate-50/50 p-6 dark:bg-slate-900/50">
          <div className="relative">
            <input
              type="text"
              placeholder="Type to take over from AI..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full rounded-2xl border border-[var(--card-border)] bg-white py-4 pr-14 pl-6 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800"
            />
            <button className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-blue-600 text-white transition-all hover:bg-slate-900">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="mb-1 text-[10px] leading-none font-black tracking-widest text-slate-400 uppercase">
          {label}
        </p>
        <p className="text-xs font-bold dark:text-white">{value}</p>
      </div>
    </div>
  );
}
