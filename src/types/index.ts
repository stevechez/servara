// src/types/index.ts

export interface Message {
  id: string;
  sender: 'ai' | 'customer';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customer_name: string;
  customer_phone: string;
  last_message: string;
  status: 'active' | 'booked' | 'completed';
  messages: Message[];
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  type: 'material' | 'labor';
}

export interface Job {
  id: string;
  customer_name: string;
  service_type: string;
  status: 'pending' | 'completed' | 'paid';
  amount: number;
  location: string;
  created_at: string;
  line_items?: LineItem[];
  tax_rate?: number;
  deposit_amount?: number;
  signature_url?: string;
}

export interface CatalogItem {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  default_unit_price: number;
  category: 'material' | 'labor' | 'fee';
  unit_type: 'sq_ft' | 'linear_ft' | 'hour' | 'flat_rate';
  created_at?: string;
}
