import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, Paperclip } from 'lucide-react';
import { sendMessageToAssistant } from '../services/geminiService';
import { CHAT_HISTORY_MOCK } from '../constants';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState(CHAT_HISTORY_MOCK);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = await sendMessageToAssistant(input, "Context: Audit Engagement Grupo Alfa 2025, Suppliers Area.");
    
    setIsTyping(false);
    setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: responseText }]);
  };

  if (!isOpen) return null;

  return (
    <div className="w-[420px] h-screen bg-white border-l border-stone-200 flex flex-col fixed right-0 top-0 z-50 paper-shadow animate-fade-in">
      {/* Header */}
      <div className="h-20 px-8 flex items-center justify-between border-b border-stone-100">
         <div>
            <span className="font-serif text-lg text-stone-900 italic">Auditia assistant</span>
            <span className="block text-[11px] font-sans text-stone-400 tracking-wide mt-1">Confidential context</span>
         </div>
         <button onClick={onClose} className="text-stone-400 hover:text-stone-900 transition-colors">
            <X className="w-4 h-4" />
         </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] font-sans text-stone-300 tracking-wide mb-2">
               {msg.sender === 'user' ? 'Auditor' : 'System response'}
            </span>
            <div className={`max-w-[90%] text-sm font-light leading-relaxed p-4 border ${
               msg.sender === 'user' 
               ? 'bg-stone-50 border-stone-200 text-stone-900' 
               : 'bg-white border-stone-100 text-stone-600'
            }`}>
               <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex items-center gap-2 text-stone-300 text-xs font-sans pl-4">
              <Bot className="w-3 h-3" />
              Processing query...
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-8 border-t border-stone-100">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Query the audit evidence..."
            className="w-full min-h-[80px] p-0 text-sm text-stone-900 placeholder:text-stone-300 bg-transparent border-none focus:ring-0 resize-none font-serif italic"
          />
          <div className="flex justify-between items-center mt-4 border-t border-stone-100 pt-4">
             <button className="text-stone-300 hover:text-stone-600">
               <Paperclip className="w-4 h-4" />
             </button>
             <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className={`text-xs font-sans tracking-wide font-medium transition-colors ${input.trim() ? 'text-stone-900' : 'text-stone-300'}`}
             >
                Submit return ⏎
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};