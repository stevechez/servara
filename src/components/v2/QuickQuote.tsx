'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { sendQuoteSms } from '@/app/actions/sendQuote';
import { Zap, Send, Loader2, CheckCircle2 } from 'lucide-react';

// Initialize Supabase client for fetching dropdown data
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function QuickQuote() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  const [selectedPhone, setSelectedPhone] = useState('');
  const [selectedService, setSelectedService] = useState('');
  
  const [isSending, setIsSending] = useState(false);
  const [sentStatus, setSentStatus] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // Fetch customers who actually have a phone number
      const { data: custData } = await supabase
        .from('customers')
        .select('name, phone')
        .not('phone', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);
        
      // Fetch your newly generated services
      const { data: servData } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: true });

      if (custData) setCustomers(custData);
      if (servData) setServices(servData);
    }
    fetchData();
  }, []);

  async function handleSendQuote() {
    if (!selectedPhone || !selectedService) return;
    setIsSending(true);

    // Find the exact service object to get the name and price
    const serviceObj = services.find(s => s.id.toString() === selectedService);
    
    if (serviceObj) {
      const result = await sendQuoteSms(selectedPhone, serviceObj.name, serviceObj.price);
      
      if (result.success) {
        setSentStatus(true);
        setTimeout(() => setSentStatus(false), 3000); // Reset success message after 3 seconds
        setSelectedPhone('');
        setSelectedService('');
      } else {
        alert("Failed to send quote: " + result.error);
      }
    }
    
    setIsSending(false);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mt-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
          <Zap size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Lightning Quote Engine</h2>
          <p className="text-sm text-gray-500">Text an estimate instantly to close the deal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* CUSTOMER DROPDOWN */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Select Lead</label>
          <select 
            value={selectedPhone}
            onChange={(e) => setSelectedPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Choose a customer --</option>
            {customers.map((c, idx) => (
              <option key={idx} value={c.phone}>
                {c.name} ({c.phone})
              </option>
            ))}
          </select>
        </div>

        {/* SERVICE DROPDOWN */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Select Service</label>
          <select 
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Choose a service --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} - ${s.price}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button 
        onClick={handleSendQuote}
        disabled={isSending || !selectedPhone || !selectedService}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSending ? (
          <><Loader2 size={18} className="animate-spin" /> Sending Quote...</>
        ) : sentStatus ? (
          <><CheckCircle2 size={18} /> Quote Sent!</>
        ) : (
          <><Send size={18} /> Send SMS Quote</>
        )}
      </button>
    </div>
  );
}