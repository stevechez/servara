'use client';

import { X, Phone, Mail, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CustomerDrawer({ customer, isOpen, onClose }: any) {
  if (!customer) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">{customer.name}</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Customer Profile</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <a href={`tel:${customer.phone}`} className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all">
                <Phone size={16} /> Call
              </a>
              <a href={`mailto:${customer.email}`} className="flex items-center justify-center gap-2 bg-slate-50 text-slate-600 py-3 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all">
                <Mail size={16} /> Email
              </a>
            </div>

            {/* Contact Details */}
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><MapPin size={16}/></div>
                  <p className="text-sm text-slate-600 font-medium">{customer.address || 'No address on file'}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Mail size={16}/></div>
                  <p className="text-sm text-slate-600 font-medium">{customer.email}</p>
                </div>
              </div>
            </section>

            {/* Lifetime Stats */}
            <section className="p-5 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-200">
              <div className="flex items-center gap-2 mb-4 opacity-80">
                <DollarSign size={16} />
                <p className="text-[10px] font-black uppercase tracking-widest">Financial Summary</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-black">$4,250</p>
                  <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider">Lifetime Value</p>
                </div>
                <div>
                  <p className="text-2xl font-black">12</p>
                  <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider">Total Jobs</p>
                </div>
              </div>
            </section>

            {/* Recent Jobs */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Activity</h3>
                <button className="text-[10px] font-bold text-blue-600 uppercase">View All</button>
              </div>
              <div className="space-y-3">
                <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Calendar size={14}/></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">HVAC Maintenance</p>
                      <p className="text-[10px] text-slate-400 font-medium">Completed Mar 1, 2026</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-slate-900">$185</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-white">
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all">
              Schedule New Job
            </button>
          </div>
        </div>
      </div>
    </>
  );
}