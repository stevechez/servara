'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, User, MessageSquare } from 'lucide-react';
import { Conversation } from '@/types';

interface AIReceptionistProps {
  conversations: Conversation[];
  isLoading?: boolean;
}

export const AIReceptionist = ({ conversations, isLoading }: AIReceptionistProps) => {
  if (isLoading) {
    return <div className="space-y-4 p-4">{/* Add skeletons here */}</div>;
  }

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden border-slate-200 bg-slate-50/30">
      <div className="flex items-center justify-between border-b bg-white p-4">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-blue-600" />
          <h3 className="font-bold text-slate-900">AI Conversation Log</h3>
        </div>
        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
          Live
        </Badge>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <AnimatePresence>
          {conversations.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  {chat.customer_name} • {chat.customer_phone}
                </span>
                <span className="text-[10px] font-medium text-slate-400">Recently Active</span>
              </div>

              {chat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                      msg.sender === 'ai'
                        ? 'rounded-tl-none bg-blue-600 text-white'
                        : 'rounded-tr-none border border-slate-200 bg-white text-slate-900'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
};
