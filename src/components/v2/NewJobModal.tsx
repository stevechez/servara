'use client';

import {
  X,
  User,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  Wrench,
  DollarSign,
  AlertCircle,
  FileText,
  CheckSquare,
  Hourglass,
  Search,
  PlusCircle,
  History,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import { useState, useEffect } from 'react';

// --- MOCK DATABASE FOR DEMO ---
const mockDatabase = [
  {
    id: '1',
    name: 'John Smith',
    phone: '(831) 555-1212',
    email: 'john@smith.com',
    address: '512 Seacliff Dr, Aptos',
    lastJob: 'Drain Cleaning',
    lastVisit: 'Jan 2026',
    totalJobs: 3,
  },
  {
    id: '2',
    name: 'James Peterson',
    phone: '(831) 555-9234',
    email: 'james@peterson.com',
    address: '132 Harbor Dr, Santa Cruz',
    lastJob: 'Water Heater Repair',
    lastVisit: 'Mar 2026',
    totalJobs: 7,
  },
  {
    id: '3',
    name: 'Oakwood Café',
    phone: '(415) 555-0122',
    email: 'manager@oakwood.com',
    address: '123 Oak St, San Francisco',
    lastJob: 'Commercial Boiler Check',
    lastVisit: 'Feb 2026',
    totalJobs: 12,
  },
];

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewJobModal({ isOpen, onClose }: NewJobModalProps) {
  // --- FORM STATE ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  // --- CUSTOMER SEARCH & INLINE CREATION STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(mockDatabase);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Customer Fields
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');

  // Job Specifics
  const [jobAddress, setJobAddress] = useState('');

  if (!isOpen) return null;

  // --- HELPERS ---
  const formatPhone = (value: string) => {
    const cleaned = ('' + value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    // Auto-format if it looks like they are typing numbers
    const formattedQuery = query.replace(/\D/g, '').length > 0 ? formatPhone(query) : query;
    setSearchQuery(formattedQuery);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = mockDatabase.filter(
      (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query)
    );
    setSearchResults(filtered);
  };

  const selectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setJobAddress(customer.address); // Auto-fill job address
    setSearchQuery('');
    setSearchResults([]);
    setIsCreatingNew(false);
  };

  const resetCustomerSelection = () => {
    setSelectedCustomer(null);
    setIsCreatingNew(false);
    setSearchQuery('');
    setJobAddress('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // DEMO: Simulating the API Workflow
    // Case 1: Existing Customer -> POST /jobs
    // Case 2: New Customer -> POST /customers -> return ID -> POST /jobs

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[3rem] bg-white shadow-2xl dark:bg-[#12161D]">
        {/* HEADER */}
        <div className="flex-shrink-0 border-b border-slate-100 p-8 px-10 dark:border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white">
                New Dispatch
              </h2>
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Create and assign a new job card
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-slate-100 p-3 text-slate-400 hover:bg-slate-200 dark:bg-white/5"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* SCROLLABLE FORM CONTENT */}
        <div className="overflow-y-auto p-10">
          <form id="dispatch-form" onSubmit={handleSubmit} className="space-y-10">
            {/* =========================================
                STEP 1 & 2: CUSTOMER SEARCH / CREATION 
            ========================================= */}
            <div className="rounded-[2rem] border border-slate-100 bg-slate-50/50 p-8 dark:border-white/5 dark:bg-white/5">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-[12px] font-black tracking-[0.2em] text-blue-600 uppercase">
                  Client Details
                </h3>
                {selectedCustomer && (
                  <button
                    type="button"
                    onClick={resetCustomerSelection}
                    className="text-[10px] font-black tracking-widest text-slate-400 uppercase hover:text-blue-600"
                  >
                    Change Customer
                  </button>
                )}
              </div>

              {/* STATE: SELECTED CUSTOMER PREVIEW */}
              {selectedCustomer ? (
                <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-500/20 dark:bg-[#12161D]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white">
                          {selectedCustomer.name}
                        </h4>
                        <p className="text-sm font-bold text-slate-500">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                        <CheckCircle2 size={12} /> Verified CRM
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-100 pt-6 dark:border-white/5">
                    <div>
                      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Total Jobs
                      </p>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {selectedCustomer.totalJobs} Lifetime
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Last Visit
                      </p>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {selectedCustomer.lastVisit}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Last Job
                      </p>
                      <p className="truncate font-bold text-slate-900 dark:text-white">
                        {selectedCustomer.lastJob}
                      </p>
                    </div>
                  </div>
                </div>
              ) : isCreatingNew ? (
                /* STATE: INLINE CREATE NEW CUSTOMER */
                <div className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-500/20 dark:bg-[#12161D]">
                  <div className="mb-4 flex items-center gap-2 border-b border-emerald-50 pb-4 dark:border-emerald-500/10">
                    <PlusCircle size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                      Creating New Profile Inline
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute top-4 left-4 text-slate-300" size={18} />
                        <input
                          required
                          value={newCustName}
                          onChange={(e) => setNewCustName(e.target.value)}
                          placeholder="e.g. Amanda Cole"
                          className="w-full rounded-2xl border border-slate-200 bg-white p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute top-4 left-4 text-slate-300" size={18} />
                        <input
                          required
                          value={newCustPhone}
                          onChange={(e) => setNewCustPhone(formatPhone(e.target.value))}
                          placeholder="(555) 000-0000"
                          className="w-full rounded-2xl border border-slate-200 bg-white p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Email Address (Optional)
                      </label>
                      <div className="relative">
                        <Mail className="absolute top-4 left-4 text-slate-300" size={18} />
                        <input
                          value={newCustEmail}
                          onChange={(e) => setNewCustEmail(e.target.value)}
                          placeholder="amanda@example.com"
                          className="w-full rounded-2xl border border-slate-200 bg-white p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsCreatingNew(false)}
                      className="text-[10px] font-black tracking-widest text-slate-400 uppercase hover:text-slate-600"
                    >
                      Cancel Creation
                    </button>
                  </div>
                </div>
              ) : (
                /* STATE: SEARCH INPUT */
                <div className="relative">
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Search Existing Customer
                  </label>
                  <div className="relative">
                    <Search className="absolute top-4 left-4 text-slate-300" size={18} />
                    <input
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Type name or phone number..."
                      className="w-full rounded-2xl border-none bg-white p-5 pl-12 text-base font-bold shadow-sm focus:ring-2 focus:ring-blue-600 dark:bg-[#12161D] dark:text-white"
                    />
                  </div>

                  {/* SEARCH RESULTS DROPDOWN */}
                  {searchQuery && (
                    <div className="absolute top-full z-10 mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl dark:border-white/10 dark:bg-[#12161D]">
                      {searchResults.length > 0 ? (
                        <div className="divide-y divide-slate-50 dark:divide-white/5">
                          {searchResults.map((customer) => (
                            <div
                              key={customer.id}
                              onClick={() => selectCustomer(customer)}
                              className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                            >
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">
                                  {customer.name}
                                </p>
                                <p className="text-xs font-medium text-slate-500">
                                  {customer.phone}
                                </p>
                              </div>
                              <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">
                                Select
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <p className="mb-4 text-sm font-bold text-slate-500">
                            No customer found for "{searchQuery}"
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingNew(true);
                              setNewCustPhone(searchQuery);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-slate-800 dark:bg-white dark:text-black"
                          >
                            <PlusCircle size={14} /> Create New Customer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* =========================================
                STEP 3: JOB DETAILS SECTION
            ========================================= */}
            <div>
              <h3 className="mb-4 text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
                Job Details & Scheduling
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-3">
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Service Address (Editable)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute top-4 left-4 text-slate-300" size={18} />
                    <input
                      required
                      value={jobAddress}
                      onChange={(e) => setJobAddress(e.target.value)}
                      placeholder="Enter job location..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Service Type
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute top-4 left-4 text-slate-300" size={18} />
                    <select className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white">
                      <option>Drain Cleaning</option>
                      <option>Water Heater Repair</option>
                      <option>Leak Detection</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Technician
                  </label>
                  <div className="relative">
                    <Wrench className="absolute top-4 left-4 text-slate-300" size={18} />
                    <select className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white">
                      <option>Mike (Available)</option>
                      <option>Sarah (On Job)</option>
                      <option>David (Available)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute top-4 left-4 text-slate-300" size={18} />
                    <input
                      type="date"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute top-4 left-4 text-slate-300" size={18} />
                    <input
                      type="time"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Estimate / Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute top-4 left-4 text-slate-300" size={18} />
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Dispatch Notes
                  </label>
                  <div className="relative">
                    <FileText className="absolute top-4 left-4 text-slate-300" size={18} />
                    <textarea
                      rows={2}
                      placeholder="Gate codes, special instructions, parts needed..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AUTOMATIONS */}
            <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-6 md:flex-row md:items-center md:gap-8 dark:border-blue-500/20 dark:bg-blue-500/5">
              <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">
                Automations
              </span>
              <label className="flex cursor-pointer items-center gap-3">
                <div onClick={() => setSmsEnabled(!smsEnabled)} className="text-blue-600">
                  {smsEnabled ? (
                    <CheckSquare size={20} />
                  ) : (
                    <div className="h-5 w-5 rounded-[4px] border-2 border-slate-300 dark:border-slate-600" />
                  )}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Send Confirmation SMS
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex-shrink-0 border-t border-slate-100 p-8 px-10 dark:border-white/5">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-200 py-5 text-[12px] font-black tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-50 dark:border-white/5"
            >
              Cancel
            </button>
            <button
              form="dispatch-form"
              type="submit"
              disabled={isSubmitting || (!selectedCustomer && !isCreatingNew)}
              className="flex-1 rounded-2xl bg-blue-600 py-5 text-[12px] font-black tracking-widest text-white uppercase shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing Dispatch...' : 'Create & Dispatch Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
