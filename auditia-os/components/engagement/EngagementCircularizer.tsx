import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronDown, Mail, FileText, ArrowRight, CheckCircle2, Eye, Send, Clock, AlertCircle, CheckCircle, XCircle, FileSignature, Users, BarChart3, X, Loader2, Search, Filter, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EngagementCircularizerProps {
  onBack: () => void;
}

type CircularizationStatus = 'pending' | 'pending_signature' | 'sent' | 'responded' | 'matched' | 'unmatched';

interface Circularization {
  id: string;
  vendor: string;
  balance: number;
  status: CircularizationStatus;
  sentDate: string | null;
  responseDate: string | null;
  confirmedBalance: number | null;
  difference: number | null;
  contact: string;
  address: string;
}

// Template options organized by category
const templateOptions = [
  { 
    group: 'Confirmación de saldos', 
    options: [
      { value: 'standard', label: 'Estándar (Confirmación saldos)', description: 'Solicita confirmación del saldo total' },
      { value: 'detailed', label: 'Detallada (Desglose facturas)', description: 'Incluye listado de facturas pendientes' },
      { value: 'simplified', label: 'Simplificada (Solo totales)', description: 'Formato breve solo con importe' },
    ]
  },
  { 
    group: 'Formato ICAC', 
    options: [
      { value: 'icac_positive', label: 'ICAC - Confirmación positiva', description: 'Requiere respuesta obligatoria' },
      { value: 'icac_negative', label: 'ICAC - Confirmación negativa', description: 'Solo responde si hay diferencias' },
      { value: 'icac_blank', label: 'ICAC - Confirmación en blanco', description: 'El tercero informa su saldo' },
    ]
  },
  { 
    group: 'Por tipo de tercero', 
    options: [
      { value: 'banks', label: 'Entidades financieras', description: 'Formato específico para bancos' },
      { value: 'lawyers', label: 'Abogados y asesores', description: 'Consulta litigios y contingencias' },
      { value: 'related_parties', label: 'Partes vinculadas', description: 'Operaciones con empresas del grupo' },
      { value: 'public_admin', label: 'Administraciones públicas', description: 'Formato AEAT, Seg. Social' },
    ]
  },
  { 
    group: 'Específicas', 
    options: [
      { value: 'cutoff', label: 'Corte de operaciones', description: 'Verifica transacciones al cierre' },
      { value: 'contingencies', label: 'Contingencias y litigios', description: 'Estado de procedimientos legales' },
      { value: 'guarantees', label: 'Avales y garantías', description: 'Compromisos y avales emitidos' },
      { value: 'leasing', label: 'Arrendamientos', description: 'Contratos de leasing activos' },
    ]
  },
];

export const EngagementCircularizer: React.FC<EngagementCircularizerProps> = ({ onBack }) => {
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [circularizerTemplate, setCircularizerTemplate] = useState('standard');
  const [circularizerDeadline, setCircularizerDeadline] = useState('2025-03-30');
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'tracking'>('tracking');
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  
  // Filters for tracking table
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLetterPreview, setShowLetterPreview] = useState(false);
  const [selectedCircularization, setSelectedCircularization] = useState<Circularization | null>(null);

  // Get current template info
  const getCurrentTemplate = () => {
    for (const group of templateOptions) {
      const found = group.options.find(opt => opt.value === circularizerTemplate);
      if (found) return found;
    }
    return templateOptions[0].options[0];
  };

  // Generate letter content based on template
  const getLetterContent = (vendor: string, address: string, contact: string, balance: number) => {
    const templateType = circularizerTemplate;
    const balanceFormatted = balance.toLocaleString('es-ES', { minimumFractionDigits: 2 });
    
    // Different letter bodies based on template
    const templates: Record<string, { reference: string; intro: string; body: string; balanceLabel: string; closing: string }> = {
      standard: {
        reference: 'Confirmación de saldos - Auditoría ejercicio 2024',
        intro: 'Con motivo de la auditoría de nuestras cuentas anuales correspondientes al ejercicio 2024, les rogamos tengan a bien confirmar directamente a nuestros auditores, Auditia Partners, S.L., el saldo que, según sus registros, mantenemos con ustedes a fecha 31 de diciembre de 2024.',
        body: 'Les agradeceríamos que, en caso de conformidad o discrepancia con el saldo indicado, cumplimenten el formulario adjunto y lo remitan directamente a nuestros auditores.',
        balanceLabel: 'Según nuestros registros:',
        closing: 'Agradeciéndoles de antemano su colaboración, les saludamos muy atentamente,'
      },
      detailed: {
        reference: 'Confirmación detallada de saldos - Auditoría ejercicio 2024',
        intro: 'En relación con la auditoría de nuestras cuentas anuales, les solicitamos confirmación del saldo pendiente a 31 de diciembre de 2024, incluyendo el detalle de las facturas que componen dicho saldo.',
        body: 'Les adjuntamos el listado de facturas registradas en nuestros libros. Rogamos nos confirmen si están conformes con el mismo o, en su defecto, nos indiquen las diferencias existentes con sus registros.',
        balanceLabel: 'Saldo según nuestros registros:',
        closing: 'Quedamos a su disposición para cualquier aclaración.'
      },
      simplified: {
        reference: 'Confirmación de saldo - Auditoría 2024',
        intro: 'Solicitamos confirmación del saldo a 31/12/2024.',
        body: 'Por favor, confirmen conformidad o diferencias.',
        balanceLabel: 'Importe:',
        closing: 'Atentamente,'
      },
      icac_positive: {
        reference: 'CONFIRMACIÓN POSITIVA DE SALDOS (ICAC)',
        intro: 'De conformidad con las Normas Técnicas de Auditoría del ICAC, les solicitamos confirmación OBLIGATORIA del saldo que mantienen con nuestra empresa a fecha 31 de diciembre de 2024.',
        body: 'ES IMPRESCINDIBLE que respondan a esta carta, tanto si están conformes como si existen diferencias con el saldo indicado. La ausencia de respuesta será considerada como una limitación al alcance de la auditoría.',
        balanceLabel: 'Saldo a confirmar:',
        closing: 'Rogamos cumplimenten el talón adjunto y lo remitan directamente a los auditores.'
      },
      icac_negative: {
        reference: 'CONFIRMACIÓN NEGATIVA DE SALDOS (ICAC)',
        intro: 'De conformidad con las Normas Técnicas de Auditoría del ICAC, les comunicamos el saldo que, según nuestros registros, mantenemos con ustedes a fecha 31 de diciembre de 2024.',
        body: 'ÚNICAMENTE deberán responder a esta carta si NO están conformes con el saldo indicado. Si no recibimos respuesta en el plazo de 15 días, entenderemos que están de acuerdo con el mismo.',
        balanceLabel: 'Saldo registrado:',
        closing: 'En caso de disconformidad, rogamos contacten directamente con los auditores.'
      },
      icac_blank: {
        reference: 'CONFIRMACIÓN EN BLANCO DE SALDOS (ICAC)',
        intro: 'De conformidad con las Normas Técnicas de Auditoría del ICAC, les solicitamos que nos indiquen el saldo que, según SUS registros, mantienen con nuestra empresa a fecha 31 de diciembre de 2024.',
        body: 'Por favor, cumplimenten el importe del saldo según sus libros contables, sin tener en cuenta el saldo que aparece en nuestros registros.',
        balanceLabel: '(El saldo no se incluye intencionadamente)',
        closing: 'Rogamos remitan su respuesta directamente a los auditores.'
      },
      banks: {
        reference: 'Confirmación bancaria - Auditoría ejercicio 2024',
        intro: 'En relación con la auditoría de nuestras cuentas anuales, les solicitamos confirmación de todas las posiciones que nuestra empresa mantiene con su entidad a fecha 31 de diciembre de 2024.',
        body: 'Les rogamos nos confirmen: saldos de cuentas corrientes y de ahorro, préstamos y créditos, avales y garantías, pólizas de crédito, operaciones de derivados, cajas de seguridad, y cualquier otra operación o posición existente.',
        balanceLabel: 'Posiciones a confirmar:',
        closing: 'Autorizamos expresamente a su entidad a facilitar esta información a nuestros auditores.'
      },
      lawyers: {
        reference: 'Consulta sobre litigios y contingencias - Auditoría ejercicio 2024',
        intro: 'En relación con la auditoría de nuestras cuentas anuales, les solicitamos información sobre los procedimientos judiciales y reclamaciones en los que nuestra empresa sea parte a fecha 31 de diciembre de 2024.',
        body: 'Les rogamos nos indiquen para cada procedimiento: naturaleza del litigio, estado procesal, cuantía reclamada, provisión recomendada, y opinión sobre el desenlace probable.',
        balanceLabel: 'Honorarios devengados y pendientes:',
        closing: 'Les autorizamos a revelar esta información confidencial a nuestros auditores.'
      },
      related_parties: {
        reference: 'Confirmación de operaciones vinculadas - Auditoría ejercicio 2024',
        intro: 'En relación con la auditoría de nuestras cuentas anuales y conforme a la normativa de partes vinculadas, les solicitamos confirmación de las operaciones realizadas entre nuestras empresas durante el ejercicio 2024.',
        body: 'Les rogamos confirmen: saldos deudores/acreedores, ventas y compras realizadas, servicios prestados/recibidos, préstamos y créditos, y cualquier otra operación realizada.',
        balanceLabel: 'Saldo según nuestros registros:',
        closing: 'Es importante que la información facilitada coincida con la declarada en las memorias de ambas sociedades.'
      },
      public_admin: {
        reference: 'Confirmación de saldos con Administraciones Públicas',
        intro: 'En relación con la auditoría de cuentas, solicitamos certificación de los saldos y situación fiscal de nuestra empresa a fecha 31 de diciembre de 2024.',
        body: 'Les rogamos nos confirmen: deudas tributarias pendientes, aplazamientos/fraccionamientos, actas de inspección, sanciones, y situación de cumplimiento de obligaciones tributarias.',
        balanceLabel: 'Saldo a confirmar:',
        closing: 'Autorizamos la emisión de certificados a nombre de nuestros auditores.'
      },
      cutoff: {
        reference: 'Confirmación de corte de operaciones - Auditoría ejercicio 2024',
        intro: 'En relación con la auditoría de nuestras cuentas, solicitamos información sobre las operaciones realizadas en torno al cierre del ejercicio 2024.',
        body: 'Les rogamos nos confirmen las últimas operaciones de diciembre 2024 y primeras de enero 2025, indicando: fecha de factura, fecha de entrega/recepción, y número de albarán.',
        balanceLabel: 'Operaciones de corte a verificar:',
        closing: 'Esta información es esencial para verificar la correcta imputación temporal de operaciones.'
      },
      contingencies: {
        reference: 'Consulta sobre contingencias y compromisos',
        intro: 'Solicitamos información sobre cualquier contingencia, litigio, reclamación o compromiso que afecte a nuestra empresa y del que tengan conocimiento.',
        body: 'Les rogamos detallen: litigios en curso, reclamaciones recibidas, garantías prestadas, compromisos contractuales, y cualquier hecho que pueda originar pasivos futuros.',
        balanceLabel: 'Contingencias identificadas:',
        closing: 'Esta información será tratada con absoluta confidencialidad.'
      },
      guarantees: {
        reference: 'Confirmación de avales y garantías',
        intro: 'En relación con la auditoría de cuentas, solicitamos información sobre todos los avales, garantías y compromisos emitidos a favor de terceros.',
        body: 'Les rogamos confirmen: avales bancarios emitidos, garantías personales, cartas de patrocinio, compromisos de compra, y cualquier otro compromiso adquirido.',
        balanceLabel: 'Avales y garantías vigentes:',
        closing: 'Rogamos incluyan fecha de vencimiento y beneficiario de cada aval.'
      },
      leasing: {
        reference: 'Confirmación de contratos de arrendamiento',
        intro: 'Solicitamos confirmación de los contratos de arrendamiento (operativo y financiero) vigentes a 31 de diciembre de 2024.',
        body: 'Les rogamos nos confirmen para cada contrato: descripción del activo, cuotas pendientes, valor residual, fecha de finalización, y cláusulas especiales.',
        balanceLabel: 'Cuotas pendientes según nuestros registros:',
        closing: 'Esta información es necesaria para la correcta aplicación de NIIF 16.'
      },
    };
    
    return templates[templateType] || templates.standard;
  };

  const vendors = [
    { id: 'v1', name: 'Equipamiento Industrial SA', balance: 1250000, risk: 'high', address: 'Pol. Ind. Norte, Calle A, 12', contact: 'Juan Pérez' },
    { id: 'v2', name: 'Servicios Logísticos Global', balance: 980000, risk: 'high', address: 'Avda. Transporte 45', contact: 'María García' },
    { id: 'v3', name: 'Construcciones Modernas SL', balance: 45000, risk: 'medium', address: 'C/ Arquitectura 8', contact: 'Pedro López' },
    { id: 'v4', name: 'Consulting Group LTD', balance: 4500, risk: 'low', address: 'Plaza Negocios 1', contact: 'Ana Martínez' },
  ];

  // Mock tracking data - realistic circularization statuses
  const [circularizations, setCircularizations] = useState<Circularization[]>([
    { 
      id: 'c1', 
      vendor: 'Equipamiento Industrial SA', 
      balance: 1250000, 
      status: 'matched',
      sentDate: '10/03/2025',
      responseDate: '18/03/2025',
      confirmedBalance: 1250000,
      difference: 0,
      contact: 'Juan Pérez',
      address: 'Pol. Ind. Norte, Calle A, 12'
    },
    { 
      id: 'c2', 
      vendor: 'Servicios Logísticos Global', 
      balance: 980000, 
      status: 'unmatched',
      sentDate: '10/03/2025',
      responseDate: '20/03/2025',
      confirmedBalance: 965000,
      difference: -15000,
      contact: 'María García',
      address: 'Avda. Transporte 45'
    },
    { 
      id: 'c3', 
      vendor: 'Construcciones Modernas SL', 
      balance: 45000, 
      status: 'sent',
      sentDate: '15/03/2025',
      responseDate: null,
      confirmedBalance: null,
      difference: null,
      contact: 'Pedro López',
      address: 'C/ Arquitectura 8'
    },
    { 
      id: 'c4', 
      vendor: 'Tech Solutions SL', 
      balance: 125000, 
      status: 'pending_signature',
      sentDate: null,
      responseDate: null,
      confirmedBalance: null,
      difference: null,
      contact: 'Laura Sánchez',
      address: 'Parque Tecnológico 5'
    },
    { 
      id: 'c5', 
      vendor: 'Mantenimiento Integral SA', 
      balance: 78000, 
      status: 'responded',
      sentDate: '12/03/2025',
      responseDate: '22/03/2025',
      confirmedBalance: 78000,
      difference: 0,
      contact: 'Carlos Ruiz',
      address: 'C/ Industrial 23'
    },
  ]);

  const toggleVendor = (id: string) => {
    if (selectedVendors.includes(id)) {
      setSelectedVendors(selectedVendors.filter(v => v !== id));
    } else {
      setSelectedVendors([...selectedVendors, id]);
    }
  };

  const handleSendForSignature = () => {
    setShowSignatureModal(true);
  };

  const handleConfirmSignature = () => {
    setIsSending(true);
    
    // Simulate sending process
    setTimeout(() => {
      // Add selected vendors to tracking
      const newCircularizations: Circularization[] = selectedVendors.map(vendorId => {
        const vendor = vendors.find(v => v.id === vendorId)!;
        return {
          id: `c-new-${vendorId}`,
          vendor: vendor.name,
          balance: vendor.balance,
          status: 'pending_signature' as CircularizationStatus,
          sentDate: null,
          responseDate: null,
          confirmedBalance: null,
          difference: null,
          contact: vendor.contact,
          address: vendor.address
        };
      });
      
      setCircularizations(prev => [...prev, ...newCircularizations]);
      setIsSending(false);
      setSentSuccess(true);
      
      setTimeout(() => {
        setShowSignatureModal(false);
        setSentSuccess(false);
        setSelectedVendors([]);
        setActiveTab('tracking');
      }, 1500);
    }, 2000);
  };

  const getStatusBadge = (status: CircularizationStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200">
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        );
      case 'pending_signature':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md bg-[#FDFAF6] text-[#8B7355] border border-[#EDE5D8]">
            <FileSignature className="w-3 h-3" />
            Pendiente Firma
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md bg-[#F7F9FA] text-[#4A5D6A] border border-[#E0E5E8]">
            <Send className="w-3 h-3" />
            Enviada
          </span>
        );
      case 'responded':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md bg-neutral-50 text-neutral-700 border border-neutral-200">
            <Mail className="w-3 h-3" />
            Respondida
          </span>
        );
      case 'matched':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md bg-[#F7F9F7] text-[#4A5D4A] border border-[#E0E5E0]">
            <CheckCircle className="w-3 h-3" />
            Cuadra
          </span>
        );
      case 'unmatched':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md bg-[#FBF8F7] text-[#8B5A50] border border-[#E8E0DE]">
            <XCircle className="w-3 h-3" />
            Diferencia
          </span>
        );
    }
  };

  // Calculate stats
  const stats = {
    total: circularizations.length,
    pendingSignature: circularizations.filter(c => c.status === 'pending_signature').length,
    sent: circularizations.filter(c => c.status === 'sent').length,
    responded: circularizations.filter(c => ['responded', 'matched', 'unmatched'].includes(c.status)).length,
    matched: circularizations.filter(c => c.status === 'matched').length,
    unmatched: circularizations.filter(c => c.status === 'unmatched').length,
  };
  
  // Filtered circularizations
  const filteredCircularizations = useMemo(() => {
    return circularizations.filter(circ => {
      const matchesStatus = statusFilter === 'all' || circ.status === statusFilter;
      const matchesSearch = searchQuery === '' || 
        circ.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circ.contact.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [circularizations, statusFilter, searchQuery]);
  
  // Open letter preview
  const openLetterPreview = (circ: Circularization) => {
    setSelectedCircularization(circ);
    setShowLetterPreview(true);
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
       {/* Header */}
       <div className="flex items-center gap-4 pb-6 border-b border-neutral-200 shrink-0">
          <button
             onClick={onBack}
             className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
             <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center">
                <Mail className="w-5 h-5 text-neutral-600" />
             </div>
             <div>
                <h2 className="text-2xl font-serif text-neutral-900">Circularizaciones Proveedores</h2>
                <span className="text-xs text-neutral-400 font-mono">Circularizer</span>
             </div>
          </div>
       </div>

       {/* Tabs */}
       <div className="flex gap-6 border-b border-neutral-200 shrink-0">
          <button 
             onClick={() => setActiveTab('tracking')}
             className={`pb-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === 'tracking' 
                ? 'text-neutral-900 border-neutral-900' 
                : 'text-neutral-400 border-transparent hover:text-neutral-600'
             }`}
          >
             <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Seguimiento
             </span>
          </button>
          <button 
             onClick={() => setActiveTab('create')}
             className={`pb-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === 'create' 
                ? 'text-neutral-900 border-neutral-900' 
                : 'text-neutral-400 border-transparent hover:text-neutral-600'
             }`}
          >
             <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Nueva Circularización
             </span>
          </button>
       </div>

       {/* TAB: Tracking */}
       {activeTab === 'tracking' && (
         <div className="flex-1 overflow-hidden flex flex-col gap-6">
           {/* Stats Summary */}
           <div className="grid grid-cols-6 gap-px bg-neutral-200 border border-neutral-200 rounded-sm overflow-hidden shrink-0">
              <div className="bg-white p-4">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Total</span>
                  <div className="text-2xl font-serif text-neutral-900 tabular-nums">{stats.total}</div>
              </div>
              <div className="bg-white p-4">
                  <span className="text-[10px] text-[#8B7355] uppercase tracking-wider font-sans block mb-1">Pend. Firma</span>
                  <div className="text-2xl font-serif text-[#8B7355] tabular-nums">{stats.pendingSignature}</div>
              </div>
              <div className="bg-white p-4">
                  <span className="text-[10px] text-[#4A5D6A] uppercase tracking-wider font-sans block mb-1">Enviadas</span>
                  <div className="text-2xl font-serif text-[#4A5D6A] tabular-nums">{stats.sent}</div>
              </div>
              <div className="bg-white p-4">
                  <span className="text-[10px] text-neutral-600 uppercase tracking-wider font-sans block mb-1">Respondidas</span>
                  <div className="text-2xl font-serif text-neutral-600 tabular-nums">{stats.responded}</div>
              </div>
              <div className="bg-white p-4">
                  <span className="text-[10px] text-[#4A5D4A] uppercase tracking-wider font-sans block mb-1">Cuadran</span>
                  <div className="text-2xl font-serif text-[#4A5D4A] tabular-nums">{stats.matched}</div>
              </div>
              <div className="bg-white p-4">
                  <span className="text-[10px] text-[#8B5A50] uppercase tracking-wider font-sans block mb-1">Diferencias</span>
                  <div className="text-2xl font-serif text-[#8B5A50] tabular-nums">{stats.unmatched}</div>
              </div>
           </div>

           {/* Filters Bar */}
           <div className="bg-white border border-neutral-200 rounded-sm p-4 shadow-sm shrink-0">
              <div className="flex items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Buscar proveedor o contacto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm border border-neutral-200 rounded-lg pl-10 pr-4 py-2 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                
                {/* Status Filter Pills */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider mr-2">Filtrar:</span>
                  {[
                    { value: 'all', label: 'Todos', count: stats.total },
                    { value: 'pending_signature', label: 'Pend. Firma', count: stats.pendingSignature },
                    { value: 'sent', label: 'Enviadas', count: stats.sent },
                    { value: 'responded', label: 'Respondidas', count: circularizations.filter(c => c.status === 'responded').length },
                    { value: 'matched', label: 'Cuadran', count: stats.matched },
                    { value: 'unmatched', label: 'Diferencias', count: stats.unmatched },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setStatusFilter(filter.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                        statusFilter === filter.value
                          ? 'bg-neutral-900 text-white shadow-sm'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {filter.label}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        statusFilter === filter.value
                          ? 'bg-white/20 text-white'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}>
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
           </div>

           {/* Tracking Table */}
           <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm flex-1">
              <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center sticky top-0">
                <h3 className="text-xs font-medium font-serif text-neutral-900">
                  Historial de Circularizaciones
                  {statusFilter !== 'all' && (
                    <span className="ml-2 text-neutral-400 font-normal">
                      ({filteredCircularizations.length} resultados)
                    </span>
                  )}
                </h3>
                {(statusFilter !== 'all' || searchQuery) && (
                  <button 
                    onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
                    className="text-[10px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Limpiar filtros
                  </button>
                )}
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-450px)]">
                <table className="w-full text-left">
                  <thead className="bg-neutral-50 text-[10px] text-neutral-500 font-sans uppercase tracking-wider border-b border-neutral-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 font-medium">Proveedor</th>
                        <th className="px-4 py-2 font-medium text-right">Saldo Libros</th>
                        <th className="px-4 py-2 font-medium text-right">Saldo Confirmado</th>
                        <th className="px-4 py-2 font-medium text-right">Diferencia</th>
                        <th className="px-4 py-2 font-medium text-center">Fecha envío</th>
                        <th className="px-4 py-2 font-medium text-center">Fecha resp.</th>
                        <th className="px-4 py-2 font-medium text-center">Estado</th>
                        <th className="px-4 py-2 font-medium text-center">Acciones</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                      {filteredCircularizations.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-neutral-400 text-xs">
                            No se encontraron resultados
                          </td>
                        </tr>
                      ) : (
                        filteredCircularizations.map((circ) => (
                          <tr 
                              key={circ.id} 
                              className="hover:bg-neutral-50 transition-colors"
                          >
                              <td className="px-4 py-3">
                                <div className="font-medium text-xs text-neutral-900">{circ.vendor}</div>
                                <div className="text-[10px] text-neutral-400">{circ.contact}</div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-mono text-xs tabular-nums text-neutral-900">
                                    {circ.balance.toLocaleString('es-ES')} €
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                {circ.confirmedBalance !== null ? (
                                  <span className="font-mono text-xs tabular-nums text-neutral-900">
                                      {circ.confirmedBalance.toLocaleString('es-ES')} €
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-neutral-400">—</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {circ.difference !== null ? (
                                  <span className={`font-mono text-xs tabular-nums ${
                                    circ.difference === 0 
                                      ? 'text-[#4A5D4A]' 
                                      : 'text-[#8B5A50] font-medium'
                                  }`}>
                                      {circ.difference === 0 ? '0' : circ.difference.toLocaleString('es-ES')} €
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-neutral-400">—</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="font-mono text-[10px] text-neutral-500">
                                  {circ.sentDate || '—'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="font-mono text-[10px] text-neutral-500">
                                  {circ.responseDate || '—'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {getStatusBadge(circ.status)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => openLetterPreview(circ)}
                                  className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded transition-colors"
                                >
                                  <Eye className="w-3 h-3" />
                                  Ver carta
                                </button>
                              </td>
                          </tr>
                        ))
                      )}
                  </tbody>
                </table>
              </div>
           </div>
         </div>
       )}

       {/* TAB: Create New */}
       {activeTab === 'create' && (
         <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden min-h-0">
            {/* Left Column: Configuration & Selection */}
            <div className="col-span-7 flex flex-col gap-6 overflow-y-auto pr-2">
                {/* Configuration Panel */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-6">
                    <h3 className="text-sm font-serif text-neutral-900 mb-4">Configuración de la carta</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                          <label className="text-xs font-medium text-neutral-500 block mb-2 uppercase tracking-wider">Plantilla</label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                              className="w-full bg-white border border-neutral-200 rounded-sm px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 transition-colors text-left flex items-center justify-between hover:bg-neutral-50"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{getCurrentTemplate().label}</span>
                                <span className="text-[10px] text-neutral-400">{getCurrentTemplate().description}</span>
                              </div>
                              <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${showTemplateDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <AnimatePresence>
                              {showTemplateDropdown && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-sm shadow-lg max-h-80 overflow-y-auto"
                                >
                                  {templateOptions.map((group) => (
                                    <div key={group.group}>
                                      <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-neutral-400 bg-neutral-50 border-b border-neutral-100 font-medium sticky top-0">
                                        {group.group}
                                      </div>
                                      {group.options.map((option) => (
                                        <button
                                          key={option.value}
                                          type="button"
                                          onClick={() => {
                                            setCircularizerTemplate(option.value);
                                            setShowTemplateDropdown(false);
                                          }}
                                          className={`w-full px-3 py-2 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0 ${
                                            circularizerTemplate === option.value ? 'bg-neutral-100' : ''
                                          }`}
                                        >
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <span className="text-sm text-neutral-900 block">{option.label}</span>
                                              <span className="text-[10px] text-neutral-400">{option.description}</span>
                                            </div>
                                            {circularizerTemplate === option.value && (
                                              <CheckCircle className="w-4 h-4 text-[#4A5D4A]" />
                                            )}
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                            
                            {/* Click outside to close */}
                            {showTemplateDropdown && (
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setShowTemplateDropdown(false)}
                              />
                            )}
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-medium text-neutral-500 block mb-2 uppercase tracking-wider">Fecha límite</label>
                          <input
                            type="date"
                            value={circularizerDeadline}
                            onChange={(e) => setCircularizerDeadline(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-sm px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 font-mono"
                          />
                      </div>
                    </div>
                </div>

                {/* Vendor Selection Table */}
                <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm flex-1">
                    <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center sticky top-0">
                      <h3 className="text-xs font-medium font-serif text-neutral-900">Selección de proveedores ({selectedVendors.length})</h3>
                      <div className="flex gap-2">
                          <button 
                              className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 text-[10px] font-medium rounded-sm hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
                              onClick={() => setShowPreview(!showPreview)}
                          >
                              <Eye className="w-3 h-3" /> {showPreview ? 'Ocultar vista previa' : 'Ver vista previa'}
                          </button>
                          <button 
                              onClick={handleSendForSignature}
                              disabled={selectedVendors.length === 0}
                              className="px-4 py-1.5 bg-neutral-900 text-white text-[10px] font-medium rounded-sm hover:bg-black transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              <FileSignature className="w-3 h-3" />
                              Enviar para firma y aprobación
                          </button>
                      </div>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-neutral-50 text-[10px] text-neutral-500 font-sans uppercase tracking-wider border-b border-neutral-200 sticky top-[45px]">
                          <tr>
                            <th className="px-4 py-2 font-medium w-8">
                                <input type="checkbox" className="rounded border-neutral-300" />
                            </th>
                            <th className="px-4 py-2 font-medium">Proveedor</th>
                            <th className="px-4 py-2 font-medium text-right">Saldo</th>
                            <th className="px-4 py-2 font-medium text-center">Riesgo</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                          {vendors.map((vendor) => (
                            <tr 
                                key={vendor.id} 
                                className={`hover:bg-neutral-50 transition-colors cursor-pointer ${selectedVendors.includes(vendor.id) ? 'bg-neutral-50/50' : ''}`}
                                onClick={() => toggleVendor(vendor.id)}
                            >
                                <td className="px-4 py-2.5">
                                  <input 
                                      type="checkbox" 
                                      checked={selectedVendors.includes(vendor.id)}
                                      onChange={() => {}}
                                      className="rounded border-neutral-300"
                                  />
                                </td>
                                <td className="px-4 py-2.5">
                                  <div className="font-medium text-xs text-neutral-900">{vendor.name}</div>
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  <span className="font-mono text-xs tabular-nums text-neutral-900">
                                      {vendor.balance.toLocaleString('es-ES')} €
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                                      vendor.risk === 'high' 
                                        ? 'text-[#8B5A50] bg-[#FBF8F7] border-[#E8E0DE]'
                                        : vendor.risk === 'medium'
                                        ? 'text-[#8B7355] bg-[#FDFAF6] border-[#EDE5D8]'
                                        : 'text-[#4A5D4A] bg-[#F7F9F7] border-[#E0E5E0]'
                                  }`}>
                                      {vendor.risk === 'high' ? 'Alto' : vendor.risk === 'medium' ? 'Medio' : 'Bajo'}
                                  </span>
                                </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                </div>
            </div>

            {/* Right Column: Letter Preview */}
            <div className="col-span-5 bg-neutral-100 border border-neutral-200 rounded-sm p-8 overflow-y-auto relative shadow-inner">
                <div className="absolute top-4 right-4 text-[10px] text-neutral-400 uppercase tracking-widest font-medium">Vista previa</div>
                
                <motion.div 
                  className="bg-white shadow-lg max-w-lg mx-auto min-h-[600px] p-12 text-xs font-serif text-neutral-800 leading-relaxed relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                    {/* Letter Content */}
                    <div className="mb-12 text-right">
                        <p>Madrid, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>

                    <div className="mb-12">
                        <p className="font-bold uppercase mb-1">{selectedVendors.length > 0 ? vendors.find(v => v.id === selectedVendors[selectedVendors.length-1])?.name : '[Nombre del Proveedor]'}</p>
                        <p>{selectedVendors.length > 0 ? vendors.find(v => v.id === selectedVendors[selectedVendors.length-1])?.address : '[Dirección]'}</p>
                        <p>A/A: {selectedVendors.length > 0 ? vendors.find(v => v.id === selectedVendors[selectedVendors.length-1])?.contact : '[Contacto]'}</p>
                    </div>

                    <div className="mb-8">
                        <p className="font-bold underline mb-4">Asunto: Solicitud de confirmación de saldos a 31/12/2024</p>
                        <p className="mb-4">Estimados señores,</p>
                        <p className="mb-4 text-justify">
                            Nuestros auditores, <strong>Auditores Asociados S.L.</strong>, están realizando la auditoría de nuestras Cuentas Anuales.
                        </p>
                        {circularizerTemplate === 'standard' && (
                            <p className="mb-4 text-justify">
                                Les rogamos confirmen directamente a ellos si el saldo a nuestro favor que figura en sus libros a 31 de diciembre de 2024 coincide con el importe que se indica a continuación:
                            </p>
                        )}
                        {circularizerTemplate === 'detailed' && (
                            <p className="mb-4 text-justify">
                                Les rogamos confirmen directamente a ellos el desglose detallado de las facturas pendientes de pago que componen el saldo a 31 de diciembre de 2024 indicado a continuación:
                            </p>
                        )}
                        {circularizerTemplate === 'simplified' && (
                            <p className="mb-4 text-justify">
                                Por favor, indiquen a nuestros auditores el saldo pendiente con nuestra compañía a 31 de diciembre de 2024.
                            </p>
                        )}
                    </div>

                    <div className="mb-8 p-4 bg-neutral-50 border border-neutral-100 text-center">
                        <p className="text-neutral-500 text-[10px] uppercase tracking-wider mb-1">Saldo en nuestros libros</p>
                        <p className="text-xl font-bold tabular-nums">
                            {selectedVendors.length > 0 
                                ? vendors.find(v => v.id === selectedVendors[selectedVendors.length-1])?.balance.toLocaleString('es-ES') 
                                : '0,00'
                            } €
                        </p>
                    </div>

                    <div className="mb-12">
                        <p className="mb-4 text-justify">
                            Si el importe anterior no está de acuerdo con sus registros, les rogamos detallen las partidas que componen la diferencia en el espacio reservado al final de esta carta.
                        </p>
                        <p className="mb-4">
                            Por favor, envíen su respuesta antes del <strong>{new Date(circularizerDeadline).toLocaleDateString('es-ES')}</strong> directamente a nuestros auditores.
                        </p>
                        <p>Atentamente,</p>
                    </div>

                    {/* Signature Area */}
                    <div className="mt-12 pt-4 border-t border-neutral-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-24 h-12 border-2 border-dashed border-neutral-300 rounded flex items-center justify-center">
                                <span className="text-[10px] text-neutral-400">Firma Cliente</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-neutral-500">Pendiente de firma y aprobación</p>
                                <p className="text-[10px] text-neutral-400">Director Financiero / Apoderado</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-neutral-200">
                        <p className="text-[10px] text-neutral-400 text-center">Generado automáticamente por Circularizer Agent</p>
                    </div>
                </motion.div>
            </div>
         </div>
       )}

       {/* Signature Modal */}
       <AnimatePresence>
         {showSignatureModal && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
             onClick={() => !isSending && setShowSignatureModal(false)}
           >
             <motion.div
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
               onClick={e => e.stopPropagation()}
             >
               {sentSuccess ? (
                 <div className="text-center py-8">
                   <motion.div
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     className="w-16 h-16 bg-[#E8EDE8] rounded-full flex items-center justify-center mx-auto mb-4"
                   >
                     <CheckCircle className="w-8 h-8 text-[#4A5D4A]" />
                   </motion.div>
                   <h3 className="text-lg font-serif text-neutral-900 mb-2">¡Enviado correctamente!</h3>
                   <p className="text-sm text-neutral-500">Las circularizaciones han sido enviadas para firma y aprobación.</p>
                 </div>
               ) : (
                 <>
                   <div className="flex justify-between items-start mb-6">
                     <div>
                       <h3 className="text-lg font-serif text-neutral-900">Confirmar envío para firma</h3>
                       <p className="text-sm text-neutral-500 mt-1">Se enviarán {selectedVendors.length} circularizaciones al cliente para su firma y aprobación.</p>
                     </div>
                     <button 
                       onClick={() => setShowSignatureModal(false)}
                       className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors"
                       disabled={isSending}
                     >
                       <X className="w-5 h-5" />
                     </button>
                   </div>

                   <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
                     <div className="flex items-center gap-3 mb-3">
                       <Users className="w-5 h-5 text-neutral-400" />
                       <span className="text-sm font-medium text-neutral-900">Proveedores seleccionados:</span>
                     </div>
                     <ul className="space-y-1 pl-8">
                       {selectedVendors.map(id => {
                         const vendor = vendors.find(v => v.id === id);
                         return (
                           <li key={id} className="text-xs text-neutral-600 flex justify-between">
                             <span>{vendor?.name}</span>
                             <span className="font-mono text-neutral-500">{vendor?.balance.toLocaleString('es-ES')} €</span>
                           </li>
                         );
                       })}
                     </ul>
                   </div>

                   <div className="flex items-center gap-2 p-3 bg-[#FDFAF6] border border-[#EDE5D8] rounded-lg mb-6">
                     <AlertCircle className="w-4 h-4 text-[#8B7355] shrink-0" />
                     <p className="text-xs text-[#8B7355]">El cliente recibirá un email para revisar y firmar las cartas antes del envío a los proveedores.</p>
                   </div>

                   <div className="flex gap-3">
                     <button
                       onClick={() => setShowSignatureModal(false)}
                       disabled={isSending}
                       className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-600 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
                     >
                       Cancelar
                     </button>
                     <button
                       onClick={handleConfirmSignature}
                       disabled={isSending}
                       className="flex-1 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                       {isSending ? (
                         <>
                           <Loader2 className="w-4 h-4 animate-spin" />
                           Enviando...
                         </>
                       ) : (
                         <>
                           <Send className="w-4 h-4" />
                           Confirmar envío
                         </>
                       )}
                     </button>
                   </div>
                 </>
               )}
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>

      {/* Letter Preview Modal - Rendered via Portal for full-screen overlay */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showLetterPreview && selectedCircularization && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8"
              style={{ zIndex: 9999 }}
              onClick={() => setShowLetterPreview(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              >
               {/* Header */}
               <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center shrink-0">
                 <div>
                   <h3 className="text-lg font-serif text-neutral-900">Carta de Circularización</h3>
                   <div className="flex items-center gap-2 mt-1">
                     <p className="text-xs text-neutral-500">{selectedCircularization.vendor}</p>
                     <span className="text-[9px] px-1.5 py-0.5 bg-neutral-200 text-neutral-600 rounded font-medium">{getCurrentTemplate().label}</span>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <button 
                     className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded hover:bg-neutral-50 transition-colors inline-flex items-center gap-1.5"
                   >
                     <Download className="w-3.5 h-3.5" />
                     Descargar PDF
                   </button>
                   <button 
                     onClick={() => setShowLetterPreview(false)}
                     className="p-1.5 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors"
                   >
                     <X className="w-5 h-5" />
                   </button>
                 </div>
               </div>
               
               {/* Letter Content - Styled like a PDF preview */}
               <div className="flex-1 overflow-y-auto bg-neutral-100 p-6">
                 <div className="bg-white shadow-lg max-w-xl mx-auto p-8 space-y-6" style={{ minHeight: '700px' }}>
                   {/* Company Header */}
                   <div className="text-center border-b border-neutral-200 pb-4">
                     <h1 className="text-xl font-serif text-neutral-900">GRUPO ALFA, S.A.</h1>
                     <p className="text-xs text-neutral-500 mt-1">Avda. de la Industria, 45 - 28020 Madrid</p>
                     <p className="text-xs text-neutral-500">CIF: A-12345678</p>
                   </div>
                   
                   {/* Letter Body - Dynamic based on template */}
                   {(() => {
                     const letterContent = getLetterContent(
                       selectedCircularization.vendor,
                       selectedCircularization.address,
                       selectedCircularization.contact,
                       selectedCircularization.balance
                     );
                     return (
                       <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
                         <div className="text-right text-xs text-neutral-500">
                           Madrid, {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                         </div>
                         
                         <div>
                           <p className="font-medium text-neutral-900">{selectedCircularization.vendor}</p>
                           <p>{selectedCircularization.address}</p>
                           <p>A/A: {selectedCircularization.contact}</p>
                         </div>
                         
                         <div>
                           <p className="font-medium text-neutral-900 mb-2">Ref: {letterContent.reference}</p>
                         </div>
                         
                         <p>Muy Sres. nuestros:</p>
                         
                         <p>{letterContent.intro}</p>
                         
                         {circularizerTemplate !== 'icac_blank' && (
                           <div className="bg-neutral-50 border border-neutral-200 rounded p-4 my-4">
                             <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">{letterContent.balanceLabel}</p>
                             <p className="text-xl font-mono font-medium text-neutral-900">
                               {selectedCircularization.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                             </p>
                             <p className="text-xs text-neutral-500 mt-1">Saldo acreedor a nuestro cargo</p>
                           </div>
                         )}
                         
                         {circularizerTemplate === 'icac_blank' && (
                           <div className="bg-[#FDFAF6] border border-[#EDE5D8] rounded p-4 my-4">
                             <p className="text-xs text-[#8B7355] uppercase tracking-wider mb-2">Por favor, indiquen el saldo según SUS registros:</p>
                             <div className="border-b-2 border-dashed border-neutral-300 w-48 h-8 mt-2"></div>
                             <p className="text-xs text-neutral-400 mt-2 italic">(Importe no indicado intencionadamente)</p>
                           </div>
                         )}
                         
                         <p>{letterContent.body}</p>
                         
                         <div className="bg-neutral-50 border border-neutral-200 rounded p-3 text-xs">
                           <p className="font-medium text-neutral-900">Auditia Partners, S.L.</p>
                           <p className="text-neutral-600">Email: circularizaciones@auditia.io</p>
                           <p className="text-neutral-600">Ref: CIRC-2024-{selectedCircularization.id}</p>
                         </div>
                         
                         <p>{letterContent.closing}</p>
                         
                         <div className="pt-8">
                           <p className="text-xs text-neutral-400 italic">Firma autorizada:</p>
                           <div className="border-b border-neutral-300 w-48 mt-8 mb-2"></div>
                           <p className="text-sm font-medium text-neutral-900">D. Carlos Martínez López</p>
                           <p className="text-xs text-neutral-500">Director Financiero - Grupo Alfa S.A.</p>
                         </div>
                       </div>
                     );
                   })()}
                 </div>
               </div>
               
              {/* Footer */}
              <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center shrink-0">
                <div className="text-xs text-neutral-500">
                  {selectedCircularization.sentDate ? (
                    <span>Enviada el {selectedCircularization.sentDate}</span>
                  ) : (
                    <span>Pendiente de envío</span>
                  )}
                </div>
                <button
                  onClick={() => setShowLetterPreview(false)}
                  className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded hover:bg-black transition-colors"
                >
                  Cerrar
                </button>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
