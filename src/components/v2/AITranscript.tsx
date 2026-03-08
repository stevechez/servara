'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Phone, User, Calendar, MapPin, Send, Zap } from 'lucide-react';

const messages = [
  { sender: 'customer', text: "Hi, I have a massive leak under my kitchen sink. Water is everywhere.", time: "2:01 PM" },
  { sender: 'ai', text: "I'm sorry to hear that! I can certainly help you get a technician out there. Are you able to shut off the main water valve for now?", time: "2:01 PM" },
  { sender: 'customer', text: "Yes, just did that. How soon can someone come?", time: "2:02 PM" },
  { sender: 'ai', text: "Great. Based on your location in San Francisco, I have a slot available at 4:00 PM today with our lead tech, Marcus. Does that work?", time: "2:02 PM" },
  { sender: 'customer', text: "Yes, please book it. My address is 123 Maple St.", time: "2:03 PM" },
];

export default function AITranscript() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex flex-col lg:flex-row bg-[var(--card)] border border-[var(--card-border)] rounded-[2.5rem] overflow-hidden shadow-sm h-[700px]">
      
      {/* SIDEBAR: CALL DETAILS */}
      <div className="w-full lg:w-80 border-r border-[var(--card-border)] bg-slate-50/50 dark:bg-slate-900/50 p-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Phone size={16} />
            </div>
            <h3 className="text-lg font-black tracking-tight">Call Info</h3>
          </div>
          <div className="space-y-4">
            <DetailItem icon={<User size={14}/>} label="Caller" value="John Doe" />
            <DetailItem icon={<MapPin size={14}/>} label="Location" value="San Francisco, CA" />
            <DetailItem icon={<Calendar size={14}/>} label="Intent" value="Emergency Repair" />
          </div>
        </div>

        <div className="p-5 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} fill="white" />
            <span className="text-[10px] font-black uppercase tracking-widest">AI Status</span>
          </div>
          <p className="text-xs font-bold leading-relaxed">
            AI has successfully identified the issue and is finalizing the booking.
          </p>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col relative bg-white dark:bg-[#0B0E14]">
        {/* Chat Header */}
        <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-black italic">Servara AI Assistant</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase">Live Intercepting...</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-xs font-black hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all">
            Take Over Call
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.sender === 'ai' 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none' 
                : 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-500/10'
              }`}>
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                <p className={`text-[9px] mt-2 font-bold uppercase opacity-50 ${msg.sender === 'ai' ? 'text-slate-500' : 'text-blue-100'}`}>
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area (Takeover Mode) */}
        <div className="p-6 border-t border-[var(--card-border)] bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative">
            <input 
              type="text"
              placeholder="Type to take over from AI..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full pl-6 pr-14 py-4 bg-white dark:bg-slate-800 border border-[var(--card-border)] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-slate-900 transition-all">
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
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-xs font-bold dark:text-white">{value}</p>
      </div>
    </div>
  );
}
