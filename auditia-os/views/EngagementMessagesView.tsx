import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Search,
  Phone,
  Video,
  Info,
  AlertOctagon,
  FileText,
  CheckSquare,
  Link as LinkIcon,
  ExternalLink,
  Image,
  File,
  Download,
  X,
  Users,
  Building2,
  ChevronDown
} from 'lucide-react';
import { CURRENT_USER, CLIENT_USER } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  sender: typeof CURRENT_USER | typeof CLIENT_USER | { name: string; role: string; isInternal?: boolean };
  text: string;
  time: string;
  isMe: boolean;
  linkedItem?: {
    type: 'finding' | 'request';
    id: string;
    title: string;
  };
  attachments?: {
    name: string;
    size: string;
    type: 'pdf' | 'xlsx' | 'image' | 'other';
  }[];
}

interface Conversation {
  id: string;
  name: string;
  type: 'client' | 'internal';
  participants: string[];
  lastMessage: string;
  lastTime: string;
  unread: number;
  isOnline?: boolean;
}

export const EngagementMessagesView: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState('conv-1');
  const [newMessage, setNewMessage] = useState('');
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const conversations: Conversation[] = [
    {
      id: 'conv-1',
      name: 'Grupo Alfa - General',
      type: 'client',
      participants: ['Marta García (CFO)', 'Laura Sánchez (Controller)'],
      lastMessage: 'Perfecto, hablamos entonces. Te envío invitación.',
      lastTime: '11:22 AM',
      unread: 0,
      isOnline: true
    },
    {
      id: 'conv-2',
      name: 'Proveedores - Hallazgos',
      type: 'client',
      participants: ['Laura Sánchez (Controller)'],
      lastMessage: 'Os envío los albaranes solicitados para H-023.',
      lastTime: 'Ayer 16:45',
      unread: 2,
      isOnline: false
    },
    {
      id: 'conv-3',
      name: 'Equipo Auditor (Interno)',
      type: 'internal',
      participants: ['Elena M. (Socio)', 'Carlos D. (Manager)', 'María G. (Staff)'],
      lastMessage: 'Elena: Revisad los ajustes de cut-off antes del viernes.',
      lastTime: 'Ayer 09:30',
      unread: 0,
      isOnline: false
    },
    {
      id: 'conv-4',
      name: 'Tesorería - Extractos',
      type: 'client',
      participants: ['Pedro López (Tesorero)'],
      lastMessage: 'Ya he subido los extractos de CaixaBank.',
      lastTime: '18/03',
      unread: 1,
      isOnline: false
    }
  ];

  const messagesByConversation: { [key: string]: Message[] } = {
    'conv-1': [
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
        isMe: true,
        linkedItem: {
          type: 'finding',
          id: 'H-023',
          title: 'Diferencias en facturas de diciembre'
        }
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
    ],
    'conv-2': [
      {
        id: 1,
        sender: CURRENT_USER,
        text: "Hola Laura, hemos detectado estas diferencias en las facturas de diciembre que necesitan aclaración.",
        time: "Ayer 10:00",
        isMe: true,
        linkedItem: {
          type: 'finding',
          id: 'H-023',
          title: 'Diferencias en facturas de diciembre'
        }
      },
      {
        id: 2,
        sender: { name: 'Laura Sánchez', role: 'Controller' },
        text: "Entendido. Estoy revisando la documentación. Os confirmo en breve.",
        time: "Ayer 11:30",
        isMe: false
      },
      {
        id: 3,
        sender: { name: 'Laura Sánchez', role: 'Controller' },
        text: "Os envío los albaranes solicitados para H-023. Adjunto los documentos de Logística Norte.",
        time: "Ayer 16:45",
        isMe: false,
        linkedItem: {
          type: 'request',
          id: 'REQ-001',
          title: 'Aclarar desviación de cut-off'
        },
        attachments: [
          { name: 'Albaran_LN_001.pdf', size: '1.2 MB', type: 'pdf' },
          { name: 'Albaran_LN_002.pdf', size: '890 KB', type: 'pdf' },
          { name: 'Albaran_LN_003.pdf', size: '756 KB', type: 'pdf' }
        ]
      }
    ],
    'conv-3': [
      {
        id: 1,
        sender: { name: 'Carlos D.', role: 'Manager', isInternal: true },
        text: "¿Cómo vamos con los hallazgos de Proveedores? Necesito el status para la reunión con el socio.",
        time: "Ayer 08:45",
        isMe: false
      },
      {
        id: 2,
        sender: CURRENT_USER,
        text: "Tenemos 3 pendientes de respuesta del cliente. El más crítico es H-023 sobre cut-off.",
        time: "Ayer 09:00",
        isMe: true,
        linkedItem: {
          type: 'finding',
          id: 'H-023',
          title: 'Diferencias en facturas de diciembre'
        }
      },
      {
        id: 3,
        sender: { name: 'Elena M.', role: 'Socio', isInternal: true },
        text: "Revisad los ajustes de cut-off antes del viernes. Si el cliente no responde, escalamos.",
        time: "Ayer 09:30",
        isMe: false
      }
    ],
    'conv-4': [
      {
        id: 1,
        sender: CURRENT_USER,
        text: "Buenos días Pedro, necesitamos los extractos de CaixaBank para completar el circuito.",
        time: "17/03 10:00",
        isMe: true,
        linkedItem: {
          type: 'request',
          id: 'REQ-002',
          title: 'Extractos bancarios Q1'
        }
      },
      {
        id: 2,
        sender: { name: 'Pedro López', role: 'Tesorero' },
        text: "Ya he subido los extractos de CaixaBank.",
        time: "18/03 09:30",
        isMe: false,
        attachments: [
          { name: 'Extracto_CaixaBank_Q1.pdf', size: '2.1 MB', type: 'pdf' }
        ]
      }
    ]
  };

  const messages = messagesByConversation[selectedConversation] || [];
  const currentConversation = conversations.find(c => c.id === selectedConversation);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4 text-rose-500" />;
      case 'xlsx': return <File className="w-4 h-4 text-emerald-500" />;
      case 'image': return <Image className="w-4 h-4 text-blue-500" />;
      default: return <File className="w-4 h-4 text-stone-400" />;
    }
  };

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
          
          {/* Conversation Filters */}
          <div className="px-4 py-2 border-b border-stone-100 flex gap-2">
            <button className="text-[10px] font-medium px-2 py-1 rounded-full bg-stone-900 text-white">Todos</button>
            <button className="text-[10px] font-medium px-2 py-1 rounded-full bg-white text-stone-500 border border-stone-200 hover:border-stone-400 transition-colors">
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                Cliente
              </span>
            </button>
            <button className="text-[10px] font-medium px-2 py-1 rounded-full bg-white text-stone-500 border border-stone-200 hover:border-stone-400 transition-colors">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Interno
              </span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
             {conversations.map((conv) => (
               <div 
                 key={conv.id}
                 onClick={() => setSelectedConversation(conv.id)}
                 className={`p-4 border-b border-stone-100 cursor-pointer transition-colors ${
                   selectedConversation === conv.id 
                     ? 'bg-white border-l-2 border-l-stone-900' 
                     : 'hover:bg-white'
                 }`}
               >
                  <div className="flex justify-between items-start mb-1">
                     <div className="flex items-center gap-2">
                       <span className="font-medium text-sm text-stone-900">{conv.name}</span>
                       {conv.type === 'internal' && (
                         <span className="text-[9px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">Interno</span>
                       )}
                     </div>
                     <div className="flex items-center gap-2">
                       {conv.unread > 0 && (
                         <span className="w-5 h-5 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                           {conv.unread}
                         </span>
                       )}
                       <span className="text-[10px] text-stone-400">{conv.lastTime}</span>
                     </div>
                  </div>
                  <p className="text-xs text-stone-500 truncate">{conv.lastMessage}</p>
               </div>
             ))}
          </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="h-16 border-b border-stone-200 flex items-center justify-between px-6 bg-white shrink-0">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${
                  currentConversation?.type === 'internal' 
                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                    : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}>
                   {currentConversation?.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                   <h3 className="text-sm font-bold text-stone-900">{currentConversation?.name}</h3>
                   <div className="flex items-center gap-2">
                     {currentConversation?.isOnline && (
                       <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                         Online
                       </span>
                     )}
                     <span className="text-[10px] text-stone-400">
                       {currentConversation?.participants.join(', ')}
                     </span>
                   </div>
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
                      {/* Linked Item Badge */}
                      {msg.linkedItem && (
                        <div className={`mb-2 flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-t-lg ${
                          msg.linkedItem.type === 'finding' 
                            ? 'bg-amber-100 text-amber-700 border border-amber-200 border-b-0' 
                            : 'bg-blue-100 text-blue-700 border border-blue-200 border-b-0'
                        }`}>
                          {msg.linkedItem.type === 'finding' ? (
                            <AlertOctagon className="w-3 h-3" />
                          ) : (
                            <CheckSquare className="w-3 h-3" />
                          )}
                          <span className="font-medium">{msg.linkedItem.id}</span>
                          <span className="opacity-75">•</span>
                          <span className="truncate max-w-[150px]">{msg.linkedItem.title}</span>
                          <ExternalLink className="w-3 h-3 ml-1 cursor-pointer hover:opacity-75" />
                        </div>
                      )}
                      
                      <div className={`px-5 py-3 rounded-2xl shadow-sm text-sm ${
                         msg.isMe 
                         ? 'bg-stone-900 text-white rounded-tr-sm' 
                         : msg.sender && 'isInternal' in msg.sender && msg.sender.isInternal
                           ? 'bg-purple-50 border border-purple-100 text-stone-800 rounded-tl-sm'
                           : 'bg-white border border-stone-100 text-stone-800 rounded-tl-sm'
                      }`}>
                         {!msg.isMe && (
                           <div className="text-[10px] font-medium text-stone-500 mb-1">
                             {typeof msg.sender === 'object' && 'name' in msg.sender ? msg.sender.name : (msg.sender as typeof CLIENT_USER).name}
                           </div>
                         )}
                         {msg.text}
                      </div>
                      
                      {/* Attachments */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className={`mt-2 space-y-1.5 ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                          {msg.attachments.map((file, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3 py-2 shadow-sm hover:border-stone-300 cursor-pointer transition-colors">
                              {getFileIcon(file.type)}
                              <div className="flex flex-col">
                                <span className="text-xs text-stone-900">{file.name}</span>
                                <span className="text-[10px] text-stone-400">{file.size}</span>
                              </div>
                              <Download className="w-3.5 h-3.5 text-stone-400 ml-2" />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <span className="text-[10px] text-stone-400 mt-1 px-1">
                         {msg.time}
                      </span>
                   </div>
                </div>
             ))}
             <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-stone-200 shrink-0">
             <div className="relative flex items-center gap-3 max-w-4xl mx-auto">
                {/* Link Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setShowLinkMenu(!showLinkMenu)}
                    className={`p-2 rounded-full transition-colors ${
                      showLinkMenu ? 'bg-stone-100 text-stone-900' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>
                  
                  <AnimatePresence>
                    {showLinkMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-0 mb-2 bg-white border border-stone-200 rounded-lg shadow-lg p-2 w-48"
                      >
                        <div className="text-[10px] text-stone-400 uppercase tracking-wider px-2 py-1 mb-1">Vincular a:</div>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-md transition-colors">
                          <AlertOctagon className="w-4 h-4 text-amber-500" />
                          Hallazgo
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-md transition-colors">
                          <CheckSquare className="w-4 h-4 text-blue-500" />
                          Solicitud
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <button className="p-2 text-stone-400 hover:text-stone-600 transition-colors rounded-full hover:bg-stone-100">
                   <Paperclip className="w-5 h-5" />
                </button>
                <input 
                   type="text"
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}
                   placeholder="Escribe un mensaje..." 
                   className="flex-1 bg-stone-50 border border-stone-200 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-stone-400 focus:bg-white transition-all shadow-inner"
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
