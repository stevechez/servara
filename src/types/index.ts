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
