import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  FileText,
  MessageSquare,
  Paperclip,
  Send,
  X,
  Plus,
  ArrowRight,
  User,
  Scale,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  Edit3,
  Eye,
  Tag,
  Calendar,
  DollarSign,
  Users,
  FileCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  Upload,
  Link as LinkIcon
} from 'lucide-react';

/**
 * ========================================================================
 * DESIGN SYSTEM v2.0 - Hallazgos & ajustes
 * Legora + Devin inspired: Sobrio, Profesional, Regulado
 * ========================================================================
 */
const DS = {
  // Base colors
  bg: {
    primary: 'bg-white',
    secondary: 'bg-neutral-50',
    tertiary: 'bg-neutral-100',
  },
  text: {
    primary: 'text-neutral-900',
    secondary: 'text-neutral-700',
    tertiary: 'text-neutral-500',
    muted: 'text-neutral-400',
  },
  border: {
    default: 'border-neutral-200',
    subtle: 'border-neutral-100',
    strong: 'border-neutral-300',
  },
  // Finding types - Subtle, professional colors
  findingType: {
    error: {
      bg: 'bg-[#FBF8F7]',
      text: 'text-[#8B5A50]',
      border: 'border-[#E8E0DE]',
      icon: 'text-[#8B5A50]',
    },
    control: {
      bg: 'bg-[#FDFAF6]',
      text: 'text-[#8B7355]',
      border: 'border-[#EDE5D8]',
      icon: 'text-[#8B7355]',
    },
    info: {
      bg: 'bg-[#F7F9FA]',
      text: 'text-[#4A5D6A]',
      border: 'border-[#E0E5E8]',
      icon: 'text-[#4A5D6A]',
    },
  },
  // Status colors - Very muted
  status: {
    draft: {
      bg: 'bg-neutral-100',
      text: 'text-neutral-600',
      border: 'border-neutral-200',
    },
    open: {
      bg: 'bg-neutral-50',
      text: 'text-neutral-700',
      border: 'border-neutral-200',
    },
    pending_client: {
      bg: 'bg-[#FDFAF6]',
      text: 'text-[#8B7355]',
      border: 'border-[#EDE5D8]',
    },
    client_replied: {
      bg: 'bg-[#F7F9F7]',
      text: 'text-[#4A5D4A]',
      border: 'border-[#E0E5E0]',
    },
    closed: {
      bg: 'bg-neutral-50',
      text: 'text-neutral-500',
      border: 'border-neutral-200',
    },
  },
  // Priority
  priority: {
    low: {
      bg: 'bg-neutral-50',
      text: 'text-neutral-600',
      border: 'border-neutral-200',
    },
    medium: {
      bg: 'bg-neutral-100',
      text: 'text-neutral-700',
      border: 'border-neutral-300',
    },
    high: {
      bg: 'bg-neutral-900',
      text: 'text-white',
      border: 'border-neutral-900',
    },
  },
  // Messages
  message: {
    auditor: {
      bg: 'bg-neutral-900',
      text: 'text-white',
    },
    client: {
      bg: 'bg-neutral-100',
      text: 'text-neutral-800',
    },
  },
};

// --- Types ---

type FindingStatus = 'draft' | 'open' | 'pending_client' | 'client_replied' | 'closed';
type FindingType = 'error' | 'control' | 'info';

interface AdjustmentProposal {
  debitAccount: string;
  creditAccount: string;
  amount: number;
  description: string;
}

interface Message {
  id: string;
  sender: 'auditor' | 'client';
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: { name: string; size: string; type: string }[];
  isRead?: boolean;
}

interface AffectedRow {
  id: string;
  invoiceNo: string;
  supplier: string;
  date: string;
  amount: number;
  discrepancy: string;
  status?: 'pending' | 'resolved' | 'explained';
}

interface PendingTask {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  relatedFindingId: string;
}

interface Finding {
  id: string;
  code: string;
  title: string;
  amount: number | null;
  type: FindingType;
  status: FindingStatus;
  responsible: string;
  description: string;
  area?: string;
  affectedRows: AffectedRow[];
  complianceTags: string[];
  documents: { name: string; type: string; date: string; size?: string }[];
  adjustment?: AdjustmentProposal;
  internalComments: { user: string; text: string; date: string; id: string }[];
  messages: Message[];
  pendingTasks: PendingTask[];
  createdAt: string;
  updatedAt: string;
  priority?: 'low' | 'medium' | 'high';
}

// --- Mock Data ---

const INITIAL_FINDINGS: Finding[] = [
  {
    id: 'f1',
    code: 'H-023',
    title: 'Diferencias en facturas de diciembre no reflejadas al cierre',
    amount: 12500.00,
    type: 'error',
    status: 'pending_client',
    responsible: 'Ana García',
    priority: 'high',
    area: 'Proveedores',
    description: 'Se han identificado 8 facturas con fecha de devengo en diciembre 2024 que no han sido registradas en el libro diario antes del cierre del ejercicio. Esto provoca una infravaloración de los gastos y del pasivo corriente.\n\nLas facturas afectadas pertenecen principalmente a proveedores de servicios logísticos y tecnológicos, con fechas de facturación entre el 28 y el 31 de diciembre.',
    affectedRows: [
      { id: 'r1', invoiceNo: 'F-2024-001', supplier: 'Servicios Logísticos SA', date: '28/12/2024', amount: 4500.00, discrepancy: 'No registrada', status: 'pending' },
      { id: 'r2', invoiceNo: 'F-2024-089', supplier: 'Tech Solutions SL', date: '30/12/2024', amount: 8000.00, discrepancy: 'No registrada', status: 'pending' },
      { id: 'r3', invoiceNo: 'F-2024-092', supplier: 'Servicios Logísticos SA', date: '31/12/2024', amount: 2500.00, discrepancy: 'Registrada con fecha incorrecta', status: 'pending' },
    ],
    complianceTags: ['NIA-ES 505', 'PGC Norma 11'],
    documents: [
      { name: 'Extracto_Bancario_Dic.pdf', type: 'pdf', date: '15/01/2025', size: '2.4 MB' },
      { name: 'Muestra_Facturas.xlsx', type: 'xlsx', date: '20/01/2025', size: '156 KB' },
      { name: 'Libro_Diario_Dic.xlsx', type: 'xlsx', date: '18/01/2025', size: '890 KB' }
    ],
    internalComments: [
      { id: 'c1', user: 'Carlos M.', text: 'Parece que es un tema recurrente con Logísticos SA. Revisar si hay algún acuerdo especial de pago.', date: '22/01/2025 10:30' },
      { id: 'c2', user: 'Ana García', text: 'He contactado con el cliente. Esperando respuesta sobre la documentación de entrega.', date: '23/01/2025 14:15' }
    ],
    messages: [
      {
        id: 'm1',
        sender: 'auditor',
        senderName: 'Ana García',
        content: 'Hemos detectado estas 8 facturas de diciembre que no están en el saldo de cierre. ¿Podéis confirmarnos si se trata de un error o si hay algún acuerdo especial con el proveedor?',
        timestamp: '23/01/2025 14:20',
        attachments: [{ name: 'Facturas_No_Registradas.xlsx', size: '156 KB', type: 'xlsx' }],
        isRead: true
      },
      {
        id: 'm2',
        sender: 'client',
        senderName: 'Laura (Cliente)',
        content: 'Hola Ana, estamos revisando la documentación. Parece que algunas facturas llegaron después del cierre. Os enviaremos los albaranes de entrega en breve.',
        timestamp: '24/01/2025 09:45',
        isRead: true
      }
    ],
    pendingTasks: [
      {
        id: 't1',
        title: 'Solicitar albaranes de entrega a Logísticos SA',
        description: 'Pedir los albaranes correspondientes a las facturas F-2024-001 y F-2024-092',
        assignee: 'Ana García',
        dueDate: '28/01/2025',
        priority: 'high',
        status: 'in_progress',
        createdAt: '23/01/2025',
        relatedFindingId: 'f1'
      },
      {
        id: 't2',
        title: 'Verificar registro contable de Tech Solutions',
        description: 'Confirmar que la factura F-2024-089 se registró correctamente en enero',
        assignee: 'Carlos M.',
        dueDate: '30/01/2025',
        priority: 'medium',
        status: 'pending',
        createdAt: '24/01/2025',
        relatedFindingId: 'f1'
      }
    ],
    createdAt: '22/01/2025',
    updatedAt: '24/01/2025',
    adjustment: {
      debitAccount: '600.000 Compras de mercaderías',
      creditAccount: '400.000 Proveedores',
      amount: 12500.00,
      description: 'Ajuste por facturas no registradas al cierre'
    }
  },
  {
    id: 'f2',
    code: 'H-024',
    title: 'Falta de aprobación en órdenes de compra > 50k',
    amount: null,
    type: 'control',
    status: 'pending_client',
    responsible: 'Pablo S.',
    priority: 'medium',
    description: 'Según la política de compras, cualquier pedido superior a 50k debe llevar doble firma. Hemos detectado 3 pedidos sin la firma del Director Financiero.',
    affectedRows: [],
    complianceTags: ['Control Interno', 'ISO 9001'],
    documents: [],
    internalComments: [],
    messages: [
      {
        id: 'm3',
        sender: 'auditor',
        senderName: 'Pablo S.',
        content: 'Hola Laura, hemos detectados estos pedidos sin doble firma. ¿Existe alguna autorización por correo que no estemos viendo?',
        timestamp: '24/01/2025 09:15',
        attachments: [{ name: 'Pedidos_Sin_Firma.xlsx', size: '12 KB', type: 'xlsx' }],
        isRead: false
      }
    ],
    pendingTasks: [
      {
        id: 't3',
        title: 'Revisar emails de autorización de pedidos',
        description: 'Buscar si existe autorización por correo del Director Financiero',
        assignee: 'Pablo S.',
        dueDate: '26/01/2025',
        priority: 'medium',
        status: 'pending',
        createdAt: '24/01/2025',
        relatedFindingId: 'f2'
      }
    ],
    createdAt: '24/01/2025',
    updatedAt: '24/01/2025'
  },
  {
    id: 'f3',
    code: 'H-025',
    title: 'Saldo de proveedor negativo sin justificación',
    amount: -2300.50,
    type: 'info',
    status: 'client_replied',
    responsible: 'Ana García',
    priority: 'low',
    description: 'El proveedor "Limpiezas Norte" presenta un saldo deudor. Podría ser un anticipo mal clasificado o una nota de crédito no aplicada.',
    affectedRows: [],
    complianceTags: [],
    documents: [],
    internalComments: [
      { id: 'c3', user: 'Ana García', text: 'Cliente confirmó que es un rappel. Cerrar como no material.', date: '25/01/2025 15:00' }
    ],
    messages: [
      {
        id: 'm4',
        sender: 'auditor',
        senderName: 'Ana García',
        content: 'Por favor aclarad el saldo deudor de Limpiezas Norte.',
        timestamp: '23/01/2025 11:00',
        isRead: true
      },
      {
        id: 'm5',
        sender: 'client',
        senderName: 'Laura (Cliente)',
        content: 'Es un rappel por volumen que nos abonaron en diciembre. Os adjunto la nota de abono.',
        timestamp: '25/01/2025 14:20',
        attachments: [{ name: 'Abono_Rappel_2024.pdf', size: '450 KB', type: 'pdf' }],
        isRead: true
      }
    ],
    pendingTasks: [
      {
        id: 't4',
        title: 'Documentar cierre como no material',
        description: 'Cliente confirmó que es un rappel. Preparar documentación de cierre.',
        assignee: 'Ana García',
        dueDate: '27/01/2025',
        priority: 'low',
        status: 'completed',
        createdAt: '25/01/2025',
        relatedFindingId: 'f3'
      }
    ],
    createdAt: '23/01/2025',
    updatedAt: '25/01/2025'
  },
  {
    id: 'f4',
    code: 'H-026',
    title: 'Duplicación de factura en sistema contable',
    amount: 8500.00,
    type: 'error',
    status: 'open',
    responsible: 'Carlos M.',
    priority: 'high',
    description: 'La factura F-2024-156 aparece duplicada en el sistema contable con dos números de asiento diferentes. Esto genera una sobrevaloración del pasivo.',
    affectedRows: [
      { id: 'r4', invoiceNo: 'F-2024-156', supplier: 'Construcciones Beta SL', date: '15/11/2024', amount: 8500.00, discrepancy: 'Duplicada', status: 'pending' }
    ],
    complianceTags: ['NIA-ES 505'],
    documents: [
      { name: 'Asientos_Duplicados.pdf', type: 'pdf', date: '26/01/2025', size: '1.2 MB' }
    ],
    internalComments: [],
    messages: [],
    pendingTasks: [
      {
        id: 't5',
        title: 'Identificar asiento duplicado para eliminar',
        description: 'Determinar cuál de los dos asientos es el correcto y solicitar la anulación del duplicado',
        assignee: 'Carlos M.',
        dueDate: '29/01/2025',
        priority: 'high',
        status: 'pending',
        createdAt: '26/01/2025',
        relatedFindingId: 'f4'
      },
      {
        id: 't6',
        title: 'Contactar a Construcciones Beta para confirmación',
        description: 'Solicitar confirmación de saldo y verificar que solo hay una factura pendiente',
        assignee: 'Carlos M.',
        dueDate: '30/01/2025',
        priority: 'medium',
        status: 'pending',
        createdAt: '26/01/2025',
        relatedFindingId: 'f4'
      }
    ],
    createdAt: '26/01/2025',
    updatedAt: '26/01/2025'
  }
];

// --- Components (Design System Compliant) ---

const StatusBadge = ({ status }: { status: FindingStatus }) => {
  const style = DS.status[status];

  const labels = {
    draft: 'Borrador',
    open: 'Abierto',
    pending_client: 'Pendiente Cliente',
    client_replied: 'Cliente Respondió',
    closed: 'Cerrado',
  };

  return (
    <span className={`px-2.5 py-1 rounded text-[11px] font-medium border ${style.bg} ${style.text} ${style.border}`}>
      {labels[status]}
    </span>
  );
};

const TypeIcon = ({ type, size = 'sm' }: { type: FindingType; size?: 'sm' | 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const iconColor = DS.findingType[type].icon;
  
  switch (type) {
    case 'error': return <AlertCircle className={`${sizeClass} ${iconColor}`} />;
    case 'control': return <ShieldAlert className={`${sizeClass} ${iconColor}`} />;
    case 'info': return <Info className={`${sizeClass} ${iconColor}`} />;
  }
};

const TypeBadge = ({ type }: { type: FindingType }) => {
  const style = DS.findingType[type];
  const labels = {
    error: 'Error',
    control: 'Control',
    info: 'Información',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium ${style.bg} ${style.text} ${style.border} border`}>
      <TypeIcon type={type} size="sm" />
      {labels[type]}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority?: 'low' | 'medium' | 'high' }) => {
  if (!priority) return null;
  
  const style = DS.priority[priority];
  const labels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${style.bg} ${style.text} ${style.border}`}>
      {labels[priority]}
    </span>
  );
};

interface EngagementFindingsProps {
  onSidebarToggle?: (isOpen: boolean) => void;
}

export const EngagementFindings: React.FC<EngagementFindingsProps> = ({ onSidebarToggle }) => {
  const [findings, setFindings] = useState<Finding[]>(INITIAL_FINDINGS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Notify parent when sidebar state changes
  useEffect(() => {
    onSidebarToggle?.(selectedId !== null);
  }, [selectedId, onSidebarToggle]);
  
  // Chat State
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; type: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detail View State
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'adjustment' | 'messages' | 'comments'>('overview');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

  const selectedFinding = findings.find(f => f.id === selectedId);
  
  // Debug logging
  console.log('selectedId:', selectedId);
  console.log('selectedFinding:', selectedFinding);

  // Initialize edited description when finding is selected
  useEffect(() => {
    if (selectedFinding) {
      setEditedDescription(selectedFinding.description);
    }
  }, [selectedFinding]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedFinding?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedFinding) return;

    setIsSending(true);
    
    // Simulate network delay
    setTimeout(() => {
      const msg: Message = {
        id: Date.now().toString(),
        sender: 'auditor',
        senderName: 'Yo (Auditor)',
        content: newMessage,
        timestamp: new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
        isRead: false
      };

      const updatedFindings = findings.map(f => {
        if (f.id === selectedId) {
          return {
            ...f,
            status: f.status === 'open' ? 'pending_client' as FindingStatus : f.status,
            messages: [...f.messages, msg],
            updatedAt: new Date().toLocaleDateString('es-ES')
          };
        }
        return f;
      });

      setFindings(updatedFindings);
      setNewMessage('');
      setAttachedFiles([]);
      setIsSending(false);
    }, 600);
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file: File) => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        type: file.name.split('.').pop() || 'file'
      }));
      setAttachedFiles([...attachedFiles, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleSaveDescription = () => {
    if (!selectedFinding) return;
    
    const updatedFindings = findings.map(f => {
      if (f.id === selectedId) {
        return {
          ...f,
          description: editedDescription,
          updatedAt: new Date().toLocaleDateString('es-ES')
        };
      }
      return f;
    });
    
    setFindings(updatedFindings);
    setIsEditingDescription(false);
  };

  const handleAddInternalComment = (comment: string) => {
    if (!comment.trim() || !selectedFinding) return;
    
    const newComment = {
      id: Date.now().toString(),
      user: 'Yo (Auditor)',
      text: comment,
      date: new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    const updatedFindings = findings.map(f => {
      if (f.id === selectedId) {
        return {
          ...f,
          internalComments: [...f.internalComments, newComment]
        };
      }
      return f;
    });
    
    setFindings(updatedFindings);
  };

  const filteredFindings = findings.filter(f => {
    const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
    const matchesType = filterType === 'all' || f.type === filterType;
    const matchesSearch = searchQuery === '' || 
      f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const unreadMessagesCount = selectedFinding?.messages.filter(m => m.sender === 'client' && !m.isRead).length || 0;

  return (
    <div className="flex h-full bg-white relative">
      
      {/* --- Main Content: List --- */}
      <div 
        className="w-full flex flex-col bg-white overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-4 border-b border-neutral-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif text-neutral-900">Hallazgos & ajustes</h2>
            <button 
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
              title="Nuevo hallazgo"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Buscar por código, título..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-300 focus:bg-white transition-all"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              Filtros
              {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <span className="text-xs text-neutral-500 font-medium">{filteredFindings.length} hallazgos</span>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 space-y-4 overflow-hidden border-t border-neutral-100 pt-4"
              >
                {/* Status Filter */}
                <div>
                  <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Estado</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'open', 'pending_client', 'client_replied', 'closed'].map(st => (
                      <button 
                        key={st}
                        onClick={() => setFilterStatus(st)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                          filterStatus === st 
                          ? 'bg-neutral-900 text-white shadow-sm' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {st === 'all' ? 'Todos' : st === 'open' ? 'Abierto' : st === 'pending_client' ? 'Pendiente' : st === 'client_replied' ? 'Respondido' : 'Cerrado'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Tipo</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'error', 'control', 'info'].map(tp => (
                      <button 
                        key={tp}
                        onClick={() => setFilterType(tp)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          filterType === tp 
                          ? 'bg-neutral-900 text-white shadow-sm' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {tp !== 'all' && <TypeIcon type={tp as FindingType} />}
                        {tp === 'all' ? 'Todos' : tp === 'error' ? 'Error' : tp === 'control' ? 'Control' : 'Info'}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredFindings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-neutral-400 py-12">
                <AlertCircle className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">No se encontraron hallazgos</p>
              </div>
            ) : (
              filteredFindings.map(finding => (
                <motion.div
                  key={finding.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Clicked on finding:', finding.id);
                    setSelectedId(finding.id);
                  }}
                  className={`group p-4 rounded-lg cursor-pointer border transition-all ${
                    selectedId === finding.id 
                    ? 'bg-white border-neutral-900 shadow-sm' 
                    : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono text-neutral-700 bg-neutral-50 px-2 py-1 rounded font-semibold border border-neutral-200">{finding.code}</span>
                      <PriorityBadge priority={finding.priority} />
                    </div>
                    <StatusBadge status={finding.status} />
                  </div>
                  
                  {finding.area && (
                    <div className="text-xs font-medium text-neutral-500 mb-2">
                      Área: {finding.area}
                    </div>
                  )}
                  
                  <h3 className="text-lg font-serif font-semibold text-neutral-900 mb-3 leading-relaxed line-clamp-2">{finding.title}</h3>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-2.5 text-xs text-neutral-500">
                      <TypeIcon type={finding.type} />
                      <span className="truncate max-w-[140px] font-medium">{finding.responsible}</span>
                      {finding.messages.length > 0 && (
                        <div className="flex items-center gap-1 text-neutral-400">
                          <span className="text-neutral-300">•</span>
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="font-medium">{finding.messages.length}</span>
                        </div>
                      )}
                    </div>
                    {finding.amount && (
                      <span className="text-sm font-semibold text-neutral-900 font-mono">
                        {finding.amount > 0 ? '+' : ''}{finding.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>

                  {/* Compliance Tags Preview */}
                  {finding.complianceTags.length > 0 && (
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {finding.complianceTags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-neutral-50 text-neutral-600 text-[10px] font-medium rounded border border-neutral-200">
                          {tag}
                        </span>
                      ))}
                      {finding.complianceTags.length > 2 && (
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-medium rounded">
                          +{finding.complianceTags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- Sidebar: Detail (Slides in from right) --- */}
      {createPortal(
        <AnimatePresence>
          {selectedFinding && (
            <>
              {/* Backdrop - Solo en móvil */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
                className="fixed inset-0 top-16 bg-black/20 z-[55] lg:hidden"
              />
              
              {/* Sidebar */}
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                key={selectedFinding.id}
                className="fixed right-0 top-16 h-[calc(100vh-64px)] w-full lg:w-[600px] flex flex-col bg-white border-l border-neutral-200 shadow-xl z-[60] overflow-hidden"
              >
              {/* Detail Header */}
              <div className="border-b border-neutral-200 bg-white shrink-0">
                <div className="px-8 pt-4 pb-4 lg:pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <button 
                          onClick={() => setSelectedId(null)}
                          className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <ArrowLeft className="w-5 h-5 text-neutral-600" />
                        </button>
                        <span className="text-2xl font-serif font-bold text-neutral-900 font-mono tracking-tight">{selectedFinding.code}</span>
                        <StatusBadge status={selectedFinding.status} />
                        <PriorityBadge priority={selectedFinding.priority} />
                      </div>
                      <h1 className="text-3xl font-serif text-neutral-900 leading-tight">{selectedFinding.title}</h1>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-6">
                      <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-6 pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <User className="w-4 h-4 text-neutral-400" />
                        <span className="font-medium">{selectedFinding.responsible}</span>
                      </div>
                      {selectedFinding.complianceTags.length > 0 && (
                        <>
                          <div className="h-4 w-px bg-neutral-200" />
                          <div className="flex gap-2">
                            {selectedFinding.complianceTags.map(tag => (
                              <span key={tag} className="px-2.5 py-1 bg-neutral-50 text-neutral-600 text-[10px] font-medium rounded border border-neutral-200">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                      {unreadMessagesCount > 0 && (
                        <>
                          <div className="h-4 w-px bg-neutral-200" />
                          <span className="px-2.5 py-1 bg-[#F7F9F7] text-[#4A5D4A] text-xs font-medium rounded border border-[#E0E5E0]">
                            {unreadMessagesCount} nuevo{unreadMessagesCount > 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                    </div>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-all shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      Marcar Revisado
                    </button>
                  </div>
                </div>
              </div>

              {/* Detail Tabs */}
              <div className="border-b border-neutral-200 bg-white px-8 shrink-0">
                <div className="flex gap-1">
                  {[
                    { id: 'overview', label: 'Resumen', icon: Eye },
                    { id: 'adjustment', label: 'Ajuste', icon: Scale },
                    { id: 'messages', label: `Mensajes${unreadMessagesCount > 0 ? ` (${unreadMessagesCount})` : ''}`, icon: MessageSquare },
                    { id: 'comments', label: 'Tareas', icon: CheckCircle }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveDetailTab(tab.id as any)}
                        className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                          activeDetailTab === tab.id
                            ? 'border-neutral-900 text-neutral-900'
                            : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detail Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto bg-neutral-50">
              <AnimatePresence mode="wait">
                {/* Overview Tab */}
                {activeDetailTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-8 space-y-8"
                  >
                    {/* Description Section */}
                    <div className="bg-white rounded-lg border border-neutral-200 p-8">
                      <div className="flex justify-between items-start mb-6">
                        <h4 className="text-base font-serif font-semibold text-neutral-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-neutral-400" />
                          Descripción del hallazgo
                        </h4>
                        {!isEditingDescription ? (
                          <button 
                            onClick={() => setIsEditingDescription(true)}
                            className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3 h-3" /> Editar
                          </button>
                        ) : (
                          <div className="flex gap-2">
                          <button 
                            onClick={handleSaveDescription}
                            className="text-xs text-[#4A5D4A] hover:text-[#3D4D3D] flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" /> Guardar
                          </button>
                            <button 
                              onClick={() => {
                                setIsEditingDescription(false);
                                setEditedDescription(selectedFinding.description);
                              }}
                              className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1 transition-colors"
                            >
                              <XCircle className="w-3 h-3" /> Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {isEditingDescription ? (
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          className="w-full min-h-[140px] p-4 text-sm text-neutral-700 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-400 resize-none leading-relaxed"
                          placeholder="Describe el hallazgo..."
                        />
                      ) : (
                        <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                          {selectedFinding.description}
                        </p>
                      )}

                      {/* Key Metrics */}
                      <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-neutral-100">
                        <div>
                          <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Importe</div>
                          <div className="text-xl font-bold text-neutral-900 font-mono">
                            {selectedFinding.amount ? (
                              (selectedFinding.amount > 0 ? '+' : '') + selectedFinding.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                            ) : (
                              <span className="text-neutral-400 font-normal">N/A</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Filas afectadas</div>
                          <div className="text-xl font-bold text-neutral-900">
                            {selectedFinding.affectedRows.length}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Documentos</div>
                          <div className="text-xl font-bold text-neutral-900">
                            {selectedFinding.documents.length}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Affected Data Table */}
                    {selectedFinding.affectedRows.length > 0 && (
                      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
                          <h5 className="text-sm font-serif font-semibold text-neutral-900 flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-neutral-400" />
                            Datos afectados
                          </h5>
                          <button className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-2 transition-colors">
                            <Download className="w-4 h-4" />
                            Exportar
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                              <tr>
                                <th className="px-4 py-3 font-medium">Factura</th>
                                <th className="px-4 py-3 font-medium">Proveedor</th>
                                <th className="px-4 py-3 font-medium">Fecha</th>
                                <th className="px-4 py-3 font-medium text-right">Importe</th>
                                <th className="px-4 py-3 font-medium">Discrepancia</th>
                                <th className="px-4 py-3 font-medium text-center">Estado</th>
                                <th className="px-4 py-3 font-medium text-center">Acciones</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                              {selectedFinding.affectedRows.map(row => (
                                <tr key={row.id} className="hover:bg-neutral-50/50 transition-colors">
                                  <td className="px-4 py-3 font-medium text-neutral-900 font-mono">{row.invoiceNo}</td>
                                  <td className="px-4 py-3 text-neutral-600">{row.supplier}</td>
                                  <td className="px-4 py-3 text-neutral-500">{row.date}</td>
                                  <td className="px-4 py-3 text-neutral-900 font-mono text-right">{row.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</td>
                                  <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 bg-[#FBF8F7] text-[#8B5A50] rounded text-[10px] font-medium border border-[#E8E0DE]">
                                      {row.discrepancy}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {row.status === 'pending' && (
                                      <span className="px-2 py-0.5 bg-[#FDFAF6] text-[#8B7355] rounded text-[10px] font-medium border border-[#EDE5D8]">
                                        Pendiente
                                      </span>
                                    )}
                                    {row.status === 'resolved' && (
                                      <span className="px-2 py-0.5 bg-[#F7F9F7] text-[#4A5D4A] rounded text-[10px] font-medium border border-[#E0E5E0]">
                                        Resuelto
                                      </span>
                                    )}
                                    {row.status === 'explained' && (
                                      <span className="px-2 py-0.5 bg-[#F7F9FA] text-[#4A5D6A] rounded text-[10px] font-medium border border-[#E0E5E8]">
                                        Explicado
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <button 
                                      onClick={() => alert(`Conectando con SAP para obtener factura ${row.invoiceNo}...`)}
                                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#4A5D6A] text-white rounded text-[10px] font-medium hover:bg-[#3A4D5A] transition-colors"
                                    >
                                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                        <path d="M9 12h6M12 9v6"/>
                                      </svg>
                                      Obtener de SAP
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {/* Linked Documents */}
                    {selectedFinding.documents.length > 0 && (
                      <div className="bg-white rounded-lg border border-neutral-200 p-8">
                        <h5 className="text-sm font-serif font-semibold text-neutral-900 mb-6 flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-neutral-400" />
                          Documentos vinculados
                        </h5>
                        <div className="grid grid-cols-1 gap-3">
                          {selectedFinding.documents.map((doc, i) => (
                            <div 
                              key={i} 
                              className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-white cursor-pointer transition-all group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center border border-neutral-200">
                                  <FileText className="w-5 h-5 text-neutral-500" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-neutral-900 mb-1">{doc.name}</div>
                                  <div className="text-xs text-neutral-500 flex items-center gap-2">
                                    <span>{doc.size || 'N/A'}</span>
                                    <span className="text-neutral-300">•</span>
                                    <span>{doc.date}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                                  <Eye className="w-4 h-4 text-neutral-600" />
                                </button>
                                <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                                  <Download className="w-4 h-4 text-neutral-600" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Adjustment Tab */}
                {activeDetailTab === 'adjustment' && (
                  <motion.div
                    key="adjustment"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-8"
                  >
                    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden max-w-4xl">
                      <div className="px-8 py-6 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-serif font-semibold text-neutral-900 flex items-center gap-2 mb-1">
                            <Scale className="w-4 h-4 text-neutral-400" />
                            Propuesta de ajuste contable
                          </h4>
                          <p className="text-xs text-neutral-500 mt-1">Asiento sugerido para corregir el hallazgo</p>
                        </div>
                        <button className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors">
                          Guardar ajuste
                        </button>
                      </div>
                      
                      <div className="p-8">
                        {/* Description */}
                        <div className="mb-8">
                          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 block">Descripción del ajuste</label>
                          <input 
                            type="text" 
                            defaultValue={selectedFinding.adjustment?.description || 'Ajuste por ' + selectedFinding.title.toLowerCase()}
                            className="w-full text-sm border-neutral-200 rounded-lg bg-neutral-50 p-4 focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-300 focus:bg-white transition-all"
                            placeholder="Descripción del ajuste..."
                          />
                        </div>

                        {/* Accounting Entry Header */}
                        <div className="grid grid-cols-12 gap-4 mb-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-200 pb-3">
                          <div className="col-span-6">Cuenta / Descripción</div>
                          <div className="col-span-3 text-right">Debe</div>
                          <div className="col-span-3 text-right">Haber</div>
                        </div>
                        
                        {/* Debit Line */}
                        <div className="grid grid-cols-12 gap-4 mb-3 items-center">
                          <div className="col-span-6">
                            <input 
                              type="text" 
                              defaultValue={selectedFinding.adjustment?.debitAccount || '600.000 Compras de mercaderías'} 
                              className="w-full text-sm border-neutral-200 rounded-lg bg-neutral-50 p-2.5 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 focus:bg-white transition-all font-medium"
                            />
                          </div>
                          <div className="col-span-3">
                            <input 
                              type="text" 
                              defaultValue={selectedFinding.amount ? selectedFinding.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'} 
                              className="w-full text-sm text-right font-mono border-neutral-200 rounded-lg bg-neutral-50 p-2.5 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 focus:bg-white transition-all"
                              placeholder="0,00"
                            />
                          </div>
                          <div className="col-span-3">
                            <div className="w-full h-10 bg-neutral-50 rounded-lg border border-neutral-200 border-dashed flex items-center justify-center">
                              <span className="text-neutral-300 text-xs">-</span>
                            </div>
                          </div>
                        </div>

                        {/* Credit Line */}
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-6">
                            <input 
                              type="text" 
                              defaultValue={selectedFinding.adjustment?.creditAccount || '400.000 Proveedores'} 
                              className="w-full text-sm border-neutral-200 rounded-lg bg-neutral-50 p-2.5 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 focus:bg-white transition-all font-medium"
                            />
                          </div>
                          <div className="col-span-3">
                            <div className="w-full h-10 bg-neutral-50 rounded-lg border border-neutral-200 border-dashed flex items-center justify-center">
                              <span className="text-neutral-300 text-xs">-</span>
                            </div>
                          </div>
                          <div className="col-span-3">
                            <input 
                              type="text" 
                              defaultValue={selectedFinding.amount ? selectedFinding.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'} 
                              className="w-full text-sm text-right font-mono border-neutral-200 rounded-lg bg-neutral-50 p-2.5 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 focus:bg-white transition-all"
                              placeholder="0,00"
                            />
                          </div>
                        </div>

                        {/* Balance Check */}
                        <div className="mt-8 pt-6 border-t border-neutral-200">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600 font-medium">Balance del asiento:</span>
                            <span className="font-mono font-semibold text-neutral-900">
                              {selectedFinding.amount ? (
                                selectedFinding.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) + ' = ' +
                                selectedFinding.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                              ) : '0,00 € = 0,00 €'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Messages Tab */}
                {activeDetailTab === 'messages' && (
                  <motion.div
                    key="messages"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex-1 overflow-y-auto p-8">
                      <div className="max-w-4xl mx-auto">
                        {/* Messages Header */}
                        <div className="mb-8 flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-serif font-semibold text-neutral-900 flex items-center gap-2 mb-1">
                              <MessageSquare className="w-4 h-4 text-neutral-400" />
                              Comunicación con Cliente
                            </h4>
                            <p className="text-xs text-neutral-500 mt-1">Los mensajes se sincronizan con el Portal del Cliente</p>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-neutral-400" />
                            <span className="text-xs font-medium text-neutral-600">Portal Activo</span>
                          </div>
                        </div>

                        {/* Messages List */}
                        <div className="space-y-4 mb-6">
                          {selectedFinding.messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                              <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                              <p className="text-sm mb-1">No hay mensajes aún</p>
                              <p className="text-xs">Inicia la conversación para solicitar evidencias al cliente</p>
                            </div>
                          ) : (
                            selectedFinding.messages.map(msg => (
                              <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex flex-col max-w-[75%] ${msg.sender === 'auditor' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                              >
                                <div className="flex items-baseline gap-2 mb-1.5">
                                  <span className="text-xs font-semibold text-neutral-900">{msg.senderName}</span>
                                  <span className="text-[10px] text-neutral-400">{msg.timestamp}</span>
                                  {msg.sender === 'client' && !msg.isRead && (
                                    <span className="px-1.5 py-0.5 bg-neutral-900 text-white text-[9px] font-medium rounded">Nuevo</span>
                                  )}
                                </div>
                                <div className={`p-4 rounded-2xl shadow-sm ${
                                  msg.sender === 'auditor' 
                                  ? 'bg-neutral-900 text-white rounded-tr-sm' 
                                  : 'bg-white border border-neutral-200 text-neutral-700 rounded-tl-sm'
                                }`}>
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                  {msg.attachments && msg.attachments.length > 0 && (
                                    <div className={`mt-3 pt-3 flex flex-wrap gap-2 ${
                                      msg.sender === 'auditor' ? 'border-t border-white/20' : 'border-t border-neutral-100'
                                    }`}>
                                      {msg.attachments.map((att, i) => (
                                        <div 
                                          key={i} 
                                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                                            msg.sender === 'auditor' 
                                            ? 'bg-white/10 text-white hover:bg-white/20' 
                                            : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                                          } cursor-pointer transition-colors`}
                                        >
                                          <Paperclip className="w-3.5 h-3.5" />
                                          <span className="font-medium">{att.name}</span>
                                          <span className="opacity-70">({att.size})</span>
                                          <Download className="w-3 h-3 opacity-70" />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))
                          )}
                          <div ref={chatEndRef} />
                        </div>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-neutral-200 bg-white p-8">
                      <div className="max-w-4xl mx-auto">
                        {/* Attached Files Preview */}
                        {attachedFiles.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {attachedFiles.map((file, index) => (
                              <div 
                                key={index}
                                className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-lg text-xs"
                              >
                                <Paperclip className="w-3 h-3 text-neutral-500" />
                                <span className="text-neutral-700">{file.name}</span>
                                <span className="text-neutral-400">({file.size})</span>
                                <button 
                                  onClick={() => removeAttachment(index)}
                                  className="ml-1 p-0.5 hover:bg-neutral-200 rounded"
                                >
                                  <X className="w-3 h-3 text-neutral-500" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="relative">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            placeholder="Escribe una pregunta para el cliente..."
                            className="w-full pl-4 pr-24 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all resize-none text-sm min-h-[80px] focus:bg-white"
                            rows={3}
                          />
                          <div className="absolute right-3 bottom-3 flex items-center gap-1">
                            <input
                              ref={fileInputRef}
                              type="file"
                              multiple
                              onChange={handleFileAttach}
                              className="hidden"
                            />
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                              title="Adjuntar archivo"
                            >
                              <Paperclip className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={handleSendMessage}
                              disabled={!newMessage.trim() || isSending}
                              className={`p-2 rounded-lg transition-all ${
                                newMessage.trim() && !isSending
                                ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm' 
                                : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                              }`}
                            >
                              {isSending ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-2 text-center">
                          Al enviar, se creará una tarea en el Portal del Cliente vinculada a este hallazgo
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Pending Tasks Tab */}
                {activeDetailTab === 'comments' && (
                  <motion.div
                    key="comments"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-8"
                  >
                    <div className="max-w-4xl mx-auto space-y-8">
                      <div className="bg-white rounded-lg border border-neutral-200 p-8">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-base font-serif font-semibold text-neutral-900 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-neutral-400" />
                            Tareas Pendientes
                          </h4>
                          <span className="text-xs text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full font-medium">
                            {selectedFinding.pendingTasks.filter(t => t.status !== 'completed').length} pendiente{selectedFinding.pendingTasks.filter(t => t.status !== 'completed').length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        {/* Tasks List */}
                        <div className="space-y-4 mb-8">
                          {selectedFinding.pendingTasks.length === 0 ? (
                            <div className="text-center py-12 text-neutral-400">
                              <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                              <p className="text-sm mb-1">No hay tareas pendientes</p>
                              <p className="text-xs">Añade tareas para hacer seguimiento de este hallazgo</p>
                            </div>
                          ) : (
                            selectedFinding.pendingTasks.map(task => (
                              <div 
                                key={task.id} 
                                className={`p-5 border rounded-lg transition-all ${
                                  task.status === 'completed' 
                                    ? 'bg-neutral-50 border-neutral-200 opacity-60' 
                                    : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-start gap-3">
                                    <button 
                                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        task.status === 'completed'
                                          ? 'bg-neutral-900 border-neutral-900 text-white'
                                          : task.status === 'in_progress'
                                          ? 'border-[#8B7355] bg-[#FDFAF6]'
                                          : 'border-neutral-300 hover:border-neutral-400'
                                      }`}
                                    >
                                      {task.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                      {task.status === 'in_progress' && <Clock className="w-3 h-3 text-[#8B7355]" />}
                                    </button>
                                    <div className="flex-1">
                                      <h5 className={`text-sm font-semibold mb-1 ${task.status === 'completed' ? 'text-neutral-500 line-through' : 'text-neutral-900'}`}>
                                        {task.title}
                                      </h5>
                                      {task.description && (
                                        <p className="text-xs text-neutral-500 leading-relaxed">{task.description}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                      task.priority === 'high' 
                                        ? 'bg-neutral-900 text-white border-neutral-900'
                                        : task.priority === 'medium'
                                        ? 'bg-neutral-100 text-neutral-700 border-neutral-300'
                                        : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                                    }`}>
                                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                                    <div className="flex items-center gap-1.5">
                                      <User className="w-3.5 h-3.5" />
                                      <span className="font-medium">{task.assignee}</span>
                                    </div>
                                    {task.dueDate && (
                                      <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{task.dueDate}</span>
                                      </div>
                                    )}
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                    task.status === 'completed'
                                      ? 'bg-[#F7F9F7] text-[#4A5D4A] border border-[#E0E5E0]'
                                      : task.status === 'in_progress'
                                      ? 'bg-[#FDFAF6] text-[#8B7355] border border-[#EDE5D8]'
                                      : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                                  }`}>
                                    {task.status === 'completed' ? 'Completada' : task.status === 'in_progress' ? 'En progreso' : 'Pendiente'}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Task */}
                        <AddTaskInput 
                          onAdd={(title, assignee, priority) => {
                            const newTask: PendingTask = {
                              id: Date.now().toString(),
                              title,
                              assignee,
                              priority,
                              status: 'pending',
                              createdAt: new Date().toLocaleDateString('es-ES'),
                              relatedFindingId: selectedFinding.id
                            };
                            
                            const updatedFindings = findings.map(f => {
                              if (f.id === selectedId) {
                                return {
                                  ...f,
                                  pendingTasks: [...f.pendingTasks, newTask]
                                };
                              }
                              return f;
                            });
                            
                            setFindings(updatedFindings);
                          }} 
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

// Internal Comment Input Component
const InternalCommentInput = ({ onAdd }: { onAdd: (comment: string) => void }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment.trim()) {
      onAdd(comment);
      setComment('');
    }
  };

  return (
    <div className="border-t border-neutral-200 pt-4">
      <div className="flex gap-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Añade un comentario interno..."
          className="flex-1 text-sm border-neutral-200 rounded-lg bg-white p-3 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 resize-none min-h-[60px]"
          rows={2}
        />
        <button
          onClick={handleSubmit}
          disabled={!comment.trim()}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            comment.trim()
              ? 'bg-neutral-900 text-white hover:bg-neutral-800'
              : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Add Task Input Component
const AddTaskInput = ({ onAdd }: { onAdd: (title: string, assignee: string, priority: 'low' | 'medium' | 'high') => void }) => {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = () => {
    if (title.trim() && assignee.trim()) {
      onAdd(title.trim(), assignee.trim(), priority);
      setTitle('');
      setAssignee('');
      setPriority('medium');
    }
  };

  return (
    <div className="border-t border-neutral-200 pt-4 mt-4">
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la tarea..."
          className="w-full text-sm border-neutral-200 rounded-lg bg-white p-3 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Asignado a..."
            className="flex-1 text-sm border-neutral-200 rounded-lg bg-white p-3 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="text-sm border-neutral-200 rounded-lg bg-white px-3 py-2 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !assignee.trim()}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              title.trim() && assignee.trim()
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
