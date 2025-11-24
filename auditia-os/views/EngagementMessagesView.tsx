import React from 'react';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Search,
  Phone,
  Video,
  Info
} from 'lucide-react';
import { CURRENT_USER, CLIENT_USER } from '../constants';

export const EngagementMessagesView: React.FC = () => {
  // Mock Messages
  const messages = [
    {
      id: 1,
      sender: CLIENT_USER,
      text: "Hola Alejandro, te acabo de subir los extractos bancarios que faltaban en la carpeta de Tesorería.",
      time: "10:30 AM",
      isMe: false
    },
    {
      id: 2,
      sender: CURRENT_USER,
      text: "¡Gracias Marta! Los reviso ahora mismo.",
      time: "10:32 AM",
      isMe: true
    },
    {
      id: 3,
      sender: CURRENT_USER,
      text: "Una pregunta rápida sobre el hallazgo H-023 en Proveedores. ¿Tienes un momento para comentarlo?",
      time: "11:15 AM",
      isMe: true
    },
    {
      id: 4,
      sender: CLIENT_USER,
      text: "Sí, claro. ¿Te va bien una llamada a las 12:00?",
      time: "11:20 AM",
      isMe: false
    },
    {
        id: 5,
        sender: CURRENT_USER,
        text: "Perfecto, hablamos entonces. Te envío invitación.",
        time: "11:22 AM",
        isMe: true
    }
  ];

  return (
    <div className="flex-1 flex h-full bg-white animate-fade-in overflow-hidden">
       {/* Chat List (Sidebar) */}
       <div className="w-80 border-r border-stone-200 flex flex-col bg-stone-50/30">
          <div className="p-4 border-b border-stone-200">
             <h2 className="text-lg font-serif font-bold text-stone-900 mb-4">Mensajes</h2>
             <div className="relative group">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="w-full bg-white border border-stone-200 rounded-md py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-stone-400 transition-colors"
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
             {/* Active Chat */}
             <div className="p-4 border-b border-stone-100 bg-white border-l-2 border-l-stone-900 cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                   <span className="font-medium text-sm text-stone-900">Grupo Alfa - General</span>
                   <span className="text-[10px] text-stone-400">11:22 AM</span>
                </div>
                <p className="text-xs text-stone-500 truncate">Perfecto, hablamos entonces. Te env...</p>
             </div>
             {/* Other Chats */}
             <div className="p-4 border-b border-stone-100 hover:bg-white cursor-pointer transition-colors">
                <div className="flex justify-between items-start mb-1">
                   <span className="font-medium text-sm text-stone-700">Proveedores (Internal)</span>
                   <span className="text-[10px] text-stone-400">Yesterday</span>
                </div>
                <p className="text-xs text-stone-400 truncate">Elena: Revisad los ajustes de cut-off...</p>
             </div>
          </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="h-16 border-b border-stone-200 flex items-center justify-between px-6 bg-white">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
                   GA
                </div>
                <div>
                   <h3 className="text-sm font-bold text-stone-900">Grupo Alfa - General</h3>
                   <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Online
                   </span>
                </div>
             </div>
             <div className="flex items-center gap-4 text-stone-400">
                <button className="hover:text-stone-900 transition-colors"><Phone className="w-4 h-4" /></button>
                <button className="hover:text-stone-900 transition-colors"><Video className="w-4 h-4" /></button>
                <button className="hover:text-stone-900 transition-colors"><Info className="w-4 h-4" /></button>
                <div className="w-px h-6 bg-stone-200"></div>
                <button className="hover:text-stone-900 transition-colors"><MoreVertical className="w-4 h-4" /></button>
             </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/30">
             {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                   <div className={`flex flex-col max-w-lg ${msg.isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`px-5 py-3 rounded-2xl shadow-sm text-sm ${
                         msg.isMe 
                         ? 'bg-stone-900 text-white rounded-tr-sm' 
                         : 'bg-white border border-stone-100 text-stone-800 rounded-tl-sm'
                      }`}>
                         {msg.text}
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 px-1">
                         {msg.time}
                      </span>
                   </div>
                </div>
             ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-stone-200">
             <div className="relative flex items-center gap-3 max-w-4xl mx-auto">
                <button className="p-2 text-stone-400 hover:text-stone-600 transition-colors rounded-full hover:bg-stone-100">
                   <Paperclip className="w-5 h-5" />
                </button>
                <input 
                   type="text" 
                   placeholder="Escribe un mensaje..." 
                   className="flex-1 bg-stone-50 border-stone-200 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-stone-400 focus:bg-white transition-all shadow-inner"
                />
                <button className="p-3 bg-stone-900 text-white rounded-full hover:bg-black transition-colors shadow-md transform hover:scale-105 active:scale-95">
                   <Send className="w-4 h-4 ml-0.5" />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

