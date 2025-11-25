import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  Calendar, 
  User, 
  AlertOctagon, 
  ChevronRight,
  Filter,
  Plus,
  Search,
  MoreHorizontal,
  Send,
  Paperclip,
  MessageSquare,
  FileText,
  Download,
  Eye,
  X,
  Upload,
  CheckCircle,
  AlertTriangle,
  Link as LinkIcon,
  ExternalLink,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { CLIENT_TASKS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ExtendedTask {
  id: string;
  title: string;
  area: string;
  dueDate: string;
  status: 'Pending' | 'In Review' | 'Completed' | 'Overdue';
  linkedFindingId?: string;
  linkedFindingTitle?: string;
  description?: string;
  requestDate: string;
  requestedBy: string;
  priority: 'low' | 'medium' | 'high';
  attachments?: { name: string; size: string; uploadedAt: string }[];
  clientResponse?: {
    message: string;
    date: string;
    attachments?: { name: string; size: string }[];
  };
  comments: { user: string; text: string; date: string }[];
}

export const EngagementRequestsView: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  // Extended tasks with more data
  const tasks: ExtendedTask[] = [
    {
      id: 'REQ-001',
      title: 'Aclarar desviación de cut-off (H-023)',
      area: 'Proveedores (40)',
      dueDate: '20/03/2025',
      status: 'Pending',
      linkedFindingId: 'H-023',
      linkedFindingTitle: 'Diferencias en facturas de diciembre no reflejadas al cierre',
      description: 'Se han identificado facturas por importe de 27.000€ con fecha de Enero 2025 que fueron registradas en Diciembre 2024. Por favor revisar y aportar los albaranes de entrega de Logística Norte S.L. para confirmar la transferencia del riesgo.',
      requestDate: '15/03/2025',
      requestedBy: 'Alejandro R.',
      priority: 'high',
      attachments: [
        { name: 'Detalle_Facturas.xlsx', size: '45 KB', uploadedAt: '15/03/2025' }
      ],
      comments: [
        { user: 'Alejandro R.', text: 'Urge resolver antes de la reunión del viernes.', date: '16/03/2025 09:30' }
      ]
    },
    {
      id: 'REQ-002',
      title: 'Aportar extractos bancarios - Q1',
      area: 'Tesorería (57)',
      dueDate: '22/03/2025',
      status: 'In Review',
      description: 'Por favor, proporcionar los extractos bancarios de todas las cuentas corrientes correspondientes al primer trimestre de 2025.',
      requestDate: '14/03/2025',
      requestedBy: 'Sofía L.',
      priority: 'medium',
      clientResponse: {
        message: 'Adjunto los extractos de BBVA y Santander. Los de CaixaBank los enviaré mañana.',
        date: '18/03/2025 14:30',
        attachments: [
          { name: 'Extracto_BBVA_Q1.pdf', size: '1.2 MB' },
          { name: 'Extracto_Santander_Q1.pdf', size: '890 KB' }
        ]
      },
      comments: []
    },
    {
      id: 'REQ-003',
      title: 'Confirmar pago nóminas fiscales',
      area: 'RRHH / Nóminas',
      dueDate: '18/03/2025',
      status: 'Completed',
      description: 'Confirmación del pago de las retenciones de IRPF y Seguridad Social correspondientes al mes de Febrero.',
      requestDate: '10/03/2025',
      requestedBy: 'Carlos D.',
      priority: 'low',
      clientResponse: {
        message: 'Confirmado. Adjunto los justificantes de pago.',
        date: '12/03/2025 11:00',
        attachments: [
          { name: 'Justificante_IRPF_Feb.pdf', size: '234 KB' },
          { name: 'Justificante_SS_Feb.pdf', size: '198 KB' }
        ]
      },
      comments: []
    },
    {
      id: 'REQ-004',
      title: 'Facturas proveedor Construcciones Beta',
      area: 'Proveedores (40)',
      dueDate: '15/03/2025',
      status: 'Overdue',
      linkedFindingId: 'H-026',
      linkedFindingTitle: 'Duplicación de factura en sistema contable',
      description: 'Necesitamos las facturas originales de Construcciones Beta SL correspondientes a Noviembre 2024 para verificar posible duplicación.',
      requestDate: '08/03/2025',
      requestedBy: 'Carlos M.',
      priority: 'high',
      comments: [
        { user: 'Carlos M.', text: 'El cliente no ha respondido. Escalar a manager.', date: '17/03/2025 16:00' }
      ]
    },
    {
      id: 'REQ-005',
      title: 'Contrato de mantenimiento SAP',
      area: 'General',
      dueDate: '25/03/2025',
      status: 'Pending',
      description: 'Solicitar copia del contrato de mantenimiento de SAP vigente para el ejercicio 2025.',
      requestDate: '18/03/2025',
      requestedBy: 'Ana García',
      priority: 'low',
      comments: []
    }
  ];

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  const selectedTask = tasks.find(t => t.id === selectedRequest);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#F7F9F7] text-[#4A5D4A] border-[#E0E5E0]200';
      case 'In Review':
        return 'bg-[#F7F9FA] text-[#4A5D6A] border-[#E0E5E8]200';
      case 'Overdue':
        return 'bg-[#FBF8F7] text-[#8B5A50] border-[#E8E0DE]200';
      default:
        return 'bg-[#FDFAF6] text-[#8B7355] border-[#EDE5D8]200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Completed': return 'Completada';
      case 'In Review': return 'En Revisión';
      case 'Overdue': return 'Vencida';
      default: return 'Pendiente';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-0.5 bg-[#F0E8E6] text-[#8B5A50] text-[10px] font-medium rounded border border-[#E8E0DE]200">Alta</span>;
      case 'medium':
        return <span className="px-2 py-0.5 bg-[#F5EDE0] text-[#8B7355] text-[10px] font-medium rounded border border-[#EDE5D8]200">Media</span>;
      default:
        return <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-medium rounded border border-neutral-200">Baja</span>;
    }
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inReview: tasks.filter(t => t.status === 'In Review').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => t.status === 'Overdue').length,
  };

  return (
    <div className="flex-1 flex h-full bg-white animate-fade-in overflow-hidden">
       {/* Main Content */}
       <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedRequest ? 'mr-[500px]' : ''}`}>
         {/* Header */}
         <div className="px-10 pt-10 pb-6 border-b border-neutral-200 shrink-0">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h1 className="text-3xl font-serif text-neutral-900">Solicitudes al cliente</h1>
                  <p className="text-neutral-400 font-sans text-sm mt-1">Gestiona y realiza seguimiento de las peticiones de información</p>
               </div>
               <button 
                  onClick={() => setShowNewRequestModal(true)}
                  className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-800 transition-colors text-sm font-medium"
               >
                  <Plus className="w-4 h-4" />
                  Nueva solicitud
               </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-px bg-neutral-200 rounded-lg overflow-hidden mb-6">
              <div className="bg-white p-4">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Total</span>
                <span className="text-2xl font-serif text-neutral-900">{stats.total}</span>
              </div>
              <div className="bg-white p-4">
                <span className="text-[10px] text-[#8B7355] uppercase tracking-wider block mb-1">Pendientes</span>
                <span className="text-2xl font-serif text-[#8B7355]">{stats.pending}</span>
              </div>
              <div className="bg-white p-4">
                <span className="text-[10px] text-[#4A5D6A] uppercase tracking-wider block mb-1">En Revisión</span>
                <span className="text-2xl font-serif text-[#4A5D6A]">{stats.inReview}</span>
              </div>
              <div className="bg-white p-4">
                <span className="text-[10px] text-[#4A5D4A] uppercase tracking-wider block mb-1">Completadas</span>
                <span className="text-2xl font-serif text-[#4A5D4A]">{stats.completed}</span>
              </div>
              <div className="bg-white p-4">
                <span className="text-[10px] text-[#8B5A50] uppercase tracking-wider block mb-1">Vencidas</span>
                <span className="text-2xl font-serif text-[#8B5A50]">{stats.overdue}</span>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex justify-between items-center">
               <div className="flex gap-2">
                  {['All', 'Pending', 'In Review', 'Completed', 'Overdue'].map((status) => (
                     <button 
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors border ${
                           filter === status 
                           ? 'bg-neutral-900 text-white border-neutral-900' 
                           : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
                        }`}
                     >
                        {status === 'All' ? 'Todas' : 
                         status === 'Pending' ? 'Pendientes' :
                         status === 'In Review' ? 'En Revisión' :
                         status === 'Completed' ? 'Completadas' : 'Vencidas'}
                     </button>
                  ))}
               </div>
               <div className="relative group w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Buscar solicitud..." 
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 pl-10 pr-4 text-xs text-neutral-600 focus:outline-none focus:border-neutral-400 transition-colors"
                  />
               </div>
            </div>
         </div>

         {/* Task List */}
         <div className="flex-1 overflow-y-auto p-10">
            <div className="space-y-3">
               {filteredTasks.map((task) => (
                  <motion.div 
                     key={task.id} 
                     layout
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className={`bg-white border rounded-lg p-5 hover:shadow-sm transition-all cursor-pointer group ${
                       selectedRequest === task.id ? 'border-neutral-900 shadow-sm' : 'border-neutral-200'
                     }`}
                     onClick={() => setSelectedRequest(task.id)}
                  >
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start gap-3">
                           <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center ${
                              task.status === 'Completed' ? 'bg-[#F7F9F7]0 border-[#E0E5E0]500 text-white' : 
                              task.status === 'Overdue' ? 'border-[#E8E0DE]300' : 'border-neutral-300'
                           }`}>
                              {task.status === 'Completed' && <CheckSquare className="w-3.5 h-3.5" />}
                           </div>
                           <div>
                              <h3 className={`text-sm font-medium text-neutral-900 mb-1 ${task.status === 'Completed' ? 'line-through text-neutral-400' : ''}`}>
                                 {task.title}
                              </h3>
                              <div className="flex items-center gap-3 text-xs text-neutral-500">
                                 <span className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">{task.id}</span>
                                 <span>•</span>
                                 <span>{task.area}</span>
                                 {task.linkedFindingId && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1 text-[#8B7355] bg-[#FDFAF6] px-1.5 py-0.5 rounded border border-[#EDE5D8]100">
                                         <LinkIcon className="w-3 h-3" />
                                         {task.linkedFindingId}
                                      </span>
                                    </>
                                 )}
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           {getPriorityBadge(task.priority)}
                           <span className={`text-[10px] px-2.5 py-1 rounded-full border uppercase tracking-wider font-medium ${getStatusStyles(task.status)}`}>
                              {getStatusLabel(task.status)}
                           </span>
                        </div>
                     </div>

                     {task.description && (
                        <p className="text-xs text-neutral-600 pl-8 mb-3 line-clamp-2">
                           {task.description}
                        </p>
                     )}

                     <div className="flex items-center justify-between pl-8 pt-3 border-t border-neutral-50">
                        <div className="flex items-center gap-5">
                           <div className="flex items-center gap-2 text-xs text-neutral-400">
                              <Calendar className="w-3.5 h-3.5" />
                              <span className={task.status === 'Overdue' ? 'text-[#8B5A50] font-medium' : ''}>Vence: {task.dueDate}</span>
                           </div>
                           <div className="flex items-center gap-2 text-xs text-neutral-400">
                              <User className="w-3.5 h-3.5" />
                              <span>{task.requestedBy}</span>
                           </div>
                           {task.clientResponse && (
                             <div className="flex items-center gap-1.5 text-xs text-[#4A5D6A] bg-[#F7F9FA] px-2 py-0.5 rounded">
                               <MessageSquare className="w-3 h-3" />
                               <span>Cliente respondió</span>
                             </div>
                           )}
                           {task.attachments && task.attachments.length > 0 && (
                             <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                               <Paperclip className="w-3 h-3" />
                               <span>{task.attachments.length} adjuntos</span>
                             </div>
                           )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
       </div>

       {/* Detail Sidebar */}
       <AnimatePresence>
         {selectedRequest && selectedTask && (
           <motion.div
             initial={{ x: '100%' }}
             animate={{ x: 0 }}
             exit={{ x: '100%' }}
             transition={{ type: 'spring', damping: 25, stiffness: 200 }}
             className="fixed right-0 top-0 h-screen w-[500px] bg-white border-l border-neutral-200 shadow-2xl z-40 flex flex-col"
           >
             {/* Sidebar Header */}
             <div className="px-6 py-5 border-b border-neutral-200 flex justify-between items-start shrink-0">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                   <span className="font-mono text-xs bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">{selectedTask.id}</span>
                   <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getStatusStyles(selectedTask.status)}`}>
                     {getStatusLabel(selectedTask.status)}
                   </span>
                   {getPriorityBadge(selectedTask.priority)}
                 </div>
                 <h2 className="text-lg font-serif text-neutral-900">{selectedTask.title}</h2>
               </div>
               <button 
                 onClick={() => setSelectedRequest(null)}
                 className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-900"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>

             {/* Sidebar Content */}
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
               {/* Linked Finding */}
               {selectedTask.linkedFindingId && (
                 <div className="bg-[#FDFAF6] border border-[#EDE5D8]200 rounded-lg p-4">
                   <div className="flex items-center gap-2 mb-2">
                     <AlertOctagon className="w-4 h-4 text-[#8B7355]" />
                     <span className="text-xs font-medium text-[#8B7355]">Hallazgo vinculado</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <div>
                       <span className="font-mono text-sm text-[#8B7355]">{selectedTask.linkedFindingId}</span>
                       {selectedTask.linkedFindingTitle && (
                         <p className="text-xs text-[#8B7355] mt-0.5">{selectedTask.linkedFindingTitle}</p>
                       )}
                     </div>
                     <button className="text-[#8B7355] hover:text-[#6B5A45] p-1">
                       <ExternalLink className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
               )}

               {/* Description */}
               <div>
                 <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Descripción</h3>
                 <p className="text-sm text-neutral-700 leading-relaxed">{selectedTask.description}</p>
               </div>

               {/* Metadata */}
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-neutral-50 rounded-lg p-3">
                   <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Solicitado por</span>
                   <span className="text-sm text-neutral-900">{selectedTask.requestedBy}</span>
                 </div>
                 <div className="bg-neutral-50 rounded-lg p-3">
                   <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Fecha solicitud</span>
                   <span className="text-sm font-mono text-neutral-900">{selectedTask.requestDate}</span>
                 </div>
                 <div className="bg-neutral-50 rounded-lg p-3">
                   <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Área</span>
                   <span className="text-sm text-neutral-900">{selectedTask.area}</span>
                 </div>
                 <div className={`rounded-lg p-3 ${selectedTask.status === 'Overdue' ? 'bg-[#FBF8F7]' : 'bg-neutral-50'}`}>
                   <span className={`text-[10px] uppercase tracking-wider block mb-1 ${selectedTask.status === 'Overdue' ? 'text-[#8B5A50]' : 'text-neutral-400'}`}>Fecha límite</span>
                   <span className={`text-sm font-mono ${selectedTask.status === 'Overdue' ? 'text-[#8B5A50] font-medium' : 'text-neutral-900'}`}>{selectedTask.dueDate}</span>
                 </div>
               </div>

               {/* Attachments */}
               {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                 <div>
                   <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Documentos adjuntos</h3>
                   <div className="space-y-2">
                     {selectedTask.attachments.map((file, i) => (
                       <div key={i} className="flex items-center justify-between bg-neutral-50 rounded-lg p-3">
                         <div className="flex items-center gap-3">
                           <FileText className="w-4 h-4 text-neutral-400" />
                           <div>
                             <span className="text-sm text-neutral-900 block">{file.name}</span>
                             <span className="text-[10px] text-neutral-400">{file.size}</span>
                           </div>
                         </div>
                         <button className="p-2 hover:bg-neutral-200 rounded-lg transition-colors text-neutral-500">
                           <Download className="w-4 h-4" />
                         </button>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Client Response */}
               {selectedTask.clientResponse && (
                 <div className="bg-[#F7F9FA] border border-[#E0E5E8]200 rounded-lg p-4">
                   <div className="flex items-center gap-2 mb-3">
                     <MessageSquare className="w-4 h-4 text-[#4A5D6A]" />
                     <span className="text-xs font-medium text-[#4A5D6A]">Respuesta del cliente</span>
                     <span className="text-[10px] text-[#4A5D6A] ml-auto">{selectedTask.clientResponse.date}</span>
                   </div>
                   <p className="text-sm text-[#3A4D5A] mb-3">{selectedTask.clientResponse.message}</p>
                   {selectedTask.clientResponse.attachments && (
                     <div className="space-y-2">
                       {selectedTask.clientResponse.attachments.map((file, i) => (
                         <div key={i} className="flex items-center justify-between bg-white/50 rounded p-2">
                           <div className="flex items-center gap-2">
                             <FileText className="w-3.5 h-3.5 text-[#4A5D6A]" />
                             <span className="text-xs text-[#4A5D6A]">{file.name}</span>
                             <span className="text-[10px] text-[#6A7D8A]">({file.size})</span>
                           </div>
                           <button className="text-[#4A5D6A] hover:text-[#4A5D6A]">
                             <Download className="w-3.5 h-3.5" />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               )}

               {/* Comments */}
               {selectedTask.comments.length > 0 && (
                 <div>
                   <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Comentarios internos</h3>
                   <div className="space-y-3">
                     {selectedTask.comments.map((comment, i) => (
                       <div key={i} className="bg-neutral-50 rounded-lg p-3">
                         <div className="flex items-center gap-2 mb-1">
                           <span className="text-xs font-medium text-neutral-700">{comment.user}</span>
                           <span className="text-[10px] text-neutral-400">{comment.date}</span>
                         </div>
                         <p className="text-sm text-neutral-600">{comment.text}</p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
             </div>

             {/* Sidebar Actions */}
             <div className="px-6 py-4 border-t border-neutral-200 shrink-0 bg-neutral-50">
               <div className="flex gap-2">
                 {selectedTask.status !== 'Completed' && (
                   <>
                     <button className="flex-1 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2">
                       <Send className="w-4 h-4" />
                       Enviar recordatorio
                     </button>
                     <button className="px-4 py-2 border border-neutral-200 text-neutral-600 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2">
                       <CheckCircle className="w-4 h-4" />
                       Marcar completa
                     </button>
                   </>
                 )}
                 {selectedTask.status === 'Completed' && (
                   <button className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-600 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2">
                     <RefreshCw className="w-4 h-4" />
                     Reabrir solicitud
                   </button>
                 )}
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};
