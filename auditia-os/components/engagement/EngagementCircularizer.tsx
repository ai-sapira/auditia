import React, { useState } from 'react';
import { ChevronLeft, Mail, FileText, ArrowRight, CheckCircle2, Eye, Send, Clock, AlertCircle, CheckCircle, XCircle, FileSignature, Users, BarChart3, X, Loader2 } from 'lucide-react';
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

export const EngagementCircularizer: React.FC<EngagementCircularizerProps> = ({ onBack }) => {
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [circularizerTemplate, setCircularizerTemplate] = useState('standard');
  const [circularizerDeadline, setCircularizerDeadline] = useState('2025-03-30');
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'tracking'>('tracking');
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

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
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        );
      case 'pending_signature':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            <FileSignature className="w-3 h-3" />
            Pendiente Firma
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            <Send className="w-3 h-3" />
            Enviada
          </span>
        );
      case 'responded':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
            <Mail className="w-3 h-3" />
            Respondida
          </span>
        );
      case 'matched':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Cuadra
          </span>
        );
      case 'unmatched':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
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

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
       {/* Header */}
       <div className="flex items-center gap-4 pb-6 border-b border-stone-200 shrink-0">
          <button
             onClick={onBack}
             className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-colors"
          >
             <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center">
                <Mail className="w-5 h-5 text-stone-600" />
             </div>
             <div>
                <h2 className="text-2xl font-serif text-stone-900">Circularizaciones Proveedores</h2>
                <span className="text-xs text-stone-400 font-mono">Circularizer</span>
             </div>
          </div>
       </div>

       {/* Tabs */}
       <div className="flex gap-6 border-b border-stone-200 shrink-0">
          <button 
             onClick={() => setActiveTab('tracking')}
             className={`pb-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === 'tracking' 
                ? 'text-stone-900 border-stone-900' 
                : 'text-stone-400 border-transparent hover:text-stone-600'
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
                ? 'text-stone-900 border-stone-900' 
                : 'text-stone-400 border-transparent hover:text-stone-600'
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
           <div className="grid grid-cols-6 gap-px bg-stone-200 border border-stone-200 rounded-sm overflow-hidden shrink-0">
              <div className="bg-white p-4">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block mb-1">Total</span>
                  <div className="text-2xl font-serif text-stone-900 tabular-nums">{stats.total}</div>
              </div>
              <div className="bg-white p-4">
                  <span className="text-[10px] text-amber-600 uppercase tracking-wider font-sans block mb-1">Pend. Firma</span>
                  <div className="text-2xl font-serif text-amber-600 tabular-nums">{stats.pendingSignature}</div>
              </div>
              <div className="bg-white p-4">
                  <span className="text-[10px] text-blue-600 uppercase tracking-wider font-sans block mb-1">Enviadas</span>
                  <div className="text-2xl font-serif text-blue-600 tabular-nums">{stats.sent}</div>
              </div>
              <div className="bg-white p-4">
                  <span className="text-[10px] text-purple-600 uppercase tracking-wider font-sans block mb-1">Respondidas</span>
                  <div className="text-2xl font-serif text-purple-600 tabular-nums">{stats.responded}</div>
              </div>
              <div className="bg-white p-4">
                  <span className="text-[10px] text-emerald-600 uppercase tracking-wider font-sans block mb-1">Cuadran</span>
                  <div className="text-2xl font-serif text-emerald-600 tabular-nums">{stats.matched}</div>
              </div>
              <div className="bg-white p-4">
                  <span className="text-[10px] text-rose-600 uppercase tracking-wider font-sans block mb-1">Diferencias</span>
                  <div className="text-2xl font-serif text-rose-600 tabular-nums">{stats.unmatched}</div>
              </div>
           </div>

           {/* Tracking Table */}
           <div className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm flex-1">
              <div className="px-4 py-3 border-b border-stone-200 bg-stone-50 flex justify-between items-center sticky top-0">
                <h3 className="text-xs font-medium font-serif text-stone-900">Historial de Circularizaciones</h3>
                <div className="flex gap-2">
                    <select className="text-[10px] border border-stone-200 rounded px-2 py-1 bg-white text-stone-600">
                      <option value="all">Todos los estados</option>
                      <option value="pending_signature">Pendiente Firma</option>
                      <option value="sent">Enviadas</option>
                      <option value="responded">Respondidas</option>
                      <option value="matched">Cuadran</option>
                      <option value="unmatched">Diferencias</option>
                    </select>
                </div>
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-450px)]">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-[10px] text-stone-500 font-sans uppercase tracking-wider border-b border-stone-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 font-medium">Proveedor</th>
                        <th className="px-4 py-2 font-medium text-right">Saldo Libros</th>
                        <th className="px-4 py-2 font-medium text-right">Saldo Confirmado</th>
                        <th className="px-4 py-2 font-medium text-right">Diferencia</th>
                        <th className="px-4 py-2 font-medium text-center">Fecha Envío</th>
                        <th className="px-4 py-2 font-medium text-center">Fecha Resp.</th>
                        <th className="px-4 py-2 font-medium text-center">Estado</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                      {circularizations.map((circ) => (
                        <tr 
                            key={circ.id} 
                            className="hover:bg-stone-50 transition-colors cursor-pointer"
                        >
                            <td className="px-4 py-3">
                              <div className="font-medium text-xs text-stone-900">{circ.vendor}</div>
                              <div className="text-[10px] text-stone-400">{circ.contact}</div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-mono text-xs tabular-nums text-stone-900">
                                  {circ.balance.toLocaleString('es-ES')} €
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              {circ.confirmedBalance !== null ? (
                                <span className="font-mono text-xs tabular-nums text-stone-900">
                                    {circ.confirmedBalance.toLocaleString('es-ES')} €
                                </span>
                              ) : (
                                <span className="text-[10px] text-stone-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {circ.difference !== null ? (
                                <span className={`font-mono text-xs tabular-nums ${
                                  circ.difference === 0 
                                    ? 'text-emerald-600' 
                                    : 'text-rose-600 font-medium'
                                }`}>
                                    {circ.difference === 0 ? '0' : circ.difference.toLocaleString('es-ES')} €
                                </span>
                              ) : (
                                <span className="text-[10px] text-stone-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="font-mono text-[10px] text-stone-500">
                                {circ.sentDate || '—'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="font-mono text-[10px] text-stone-500">
                                {circ.responseDate || '—'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {getStatusBadge(circ.status)}
                            </td>
                        </tr>
                      ))}
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
                <div className="bg-stone-50 border border-stone-200 rounded-sm p-6">
                    <h3 className="text-sm font-serif text-stone-900 mb-4">Configuración de la carta</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                          <label className="text-xs font-medium text-stone-500 block mb-2 uppercase tracking-wider">Plantilla</label>
                          <select 
                            value={circularizerTemplate}
                            onChange={(e) => setCircularizerTemplate(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-sm px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors"
                          >
                            <option value="standard">Estándar (Confirmación saldos)</option>
                            <option value="detailed">Detallada (Desglose facturas)</option>
                            <option value="simplified">Simplificada (Solo totales)</option>
                          </select>
                      </div>
                      <div>
                          <label className="text-xs font-medium text-stone-500 block mb-2 uppercase tracking-wider">Fecha límite</label>
                          <input
                            type="date"
                            value={circularizerDeadline}
                            onChange={(e) => setCircularizerDeadline(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-sm px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-400 font-mono"
                          />
                      </div>
                    </div>
                </div>

                {/* Vendor Selection Table */}
                <div className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm flex-1">
                    <div className="px-4 py-3 border-b border-stone-200 bg-stone-50 flex justify-between items-center sticky top-0">
                      <h3 className="text-xs font-medium font-serif text-stone-900">Selección de proveedores ({selectedVendors.length})</h3>
                      <div className="flex gap-2">
                          <button 
                              className="px-3 py-1.5 bg-white border border-stone-200 text-stone-600 text-[10px] font-medium rounded-sm hover:bg-stone-50 transition-colors flex items-center gap-1.5"
                              onClick={() => setShowPreview(!showPreview)}
                          >
                              <Eye className="w-3 h-3" /> {showPreview ? 'Ocultar vista previa' : 'Ver vista previa'}
                          </button>
                          <button 
                              onClick={handleSendForSignature}
                              disabled={selectedVendors.length === 0}
                              className="px-4 py-1.5 bg-stone-900 text-white text-[10px] font-medium rounded-sm hover:bg-black transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              <FileSignature className="w-3 h-3" />
                              Enviar para firma y aprobación
                          </button>
                      </div>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-stone-50 text-[10px] text-stone-500 font-sans uppercase tracking-wider border-b border-stone-200 sticky top-[45px]">
                          <tr>
                            <th className="px-4 py-2 font-medium w-8">
                                <input type="checkbox" className="rounded border-stone-300" />
                            </th>
                            <th className="px-4 py-2 font-medium">Proveedor</th>
                            <th className="px-4 py-2 font-medium text-right">Saldo</th>
                            <th className="px-4 py-2 font-medium text-center">Riesgo</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                          {vendors.map((vendor) => (
                            <tr 
                                key={vendor.id} 
                                className={`hover:bg-stone-50 transition-colors cursor-pointer ${selectedVendors.includes(vendor.id) ? 'bg-stone-50/50' : ''}`}
                                onClick={() => toggleVendor(vendor.id)}
                            >
                                <td className="px-4 py-2.5">
                                  <input 
                                      type="checkbox" 
                                      checked={selectedVendors.includes(vendor.id)}
                                      onChange={() => {}}
                                      className="rounded border-stone-300"
                                  />
                                </td>
                                <td className="px-4 py-2.5">
                                  <div className="font-medium text-xs text-stone-900">{vendor.name}</div>
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  <span className="font-mono text-xs tabular-nums text-stone-900">
                                      {vendor.balance.toLocaleString('es-ES')} €
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                                      vendor.risk === 'high' 
                                        ? 'text-rose-700 bg-rose-50 border-rose-100'
                                        : vendor.risk === 'medium'
                                        ? 'text-amber-700 bg-amber-50 border-amber-100'
                                        : 'text-emerald-700 bg-emerald-50 border-emerald-100'
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
            <div className="col-span-5 bg-stone-100 border border-stone-200 rounded-sm p-8 overflow-y-auto relative shadow-inner">
                <div className="absolute top-4 right-4 text-[10px] text-stone-400 uppercase tracking-widest font-medium">Vista previa</div>
                
                <motion.div 
                  className="bg-white shadow-lg max-w-lg mx-auto min-h-[600px] p-12 text-xs font-serif text-stone-800 leading-relaxed relative"
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

                    <div className="mb-8 p-4 bg-stone-50 border border-stone-100 text-center">
                        <p className="text-stone-500 text-[10px] uppercase tracking-wider mb-1">Saldo en nuestros libros</p>
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
                    <div className="mt-12 pt-4 border-t border-stone-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-24 h-12 border-2 border-dashed border-stone-300 rounded flex items-center justify-center">
                                <span className="text-[10px] text-stone-400">Firma Cliente</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-stone-500">Pendiente de firma y aprobación</p>
                                <p className="text-[10px] text-stone-400">Director Financiero / Apoderado</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-stone-200">
                        <p className="text-[10px] text-stone-400 text-center">Generado automáticamente por Circularizer Agent</p>
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
                     className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                   >
                     <CheckCircle className="w-8 h-8 text-emerald-600" />
                   </motion.div>
                   <h3 className="text-lg font-serif text-stone-900 mb-2">¡Enviado correctamente!</h3>
                   <p className="text-sm text-stone-500">Las circularizaciones han sido enviadas para firma y aprobación.</p>
                 </div>
               ) : (
                 <>
                   <div className="flex justify-between items-start mb-6">
                     <div>
                       <h3 className="text-lg font-serif text-stone-900">Confirmar envío para firma</h3>
                       <p className="text-sm text-stone-500 mt-1">Se enviarán {selectedVendors.length} circularizaciones al cliente para su firma y aprobación.</p>
                     </div>
                     <button 
                       onClick={() => setShowSignatureModal(false)}
                       className="p-1 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-900 transition-colors"
                       disabled={isSending}
                     >
                       <X className="w-5 h-5" />
                     </button>
                   </div>

                   <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mb-6">
                     <div className="flex items-center gap-3 mb-3">
                       <Users className="w-5 h-5 text-stone-400" />
                       <span className="text-sm font-medium text-stone-900">Proveedores seleccionados:</span>
                     </div>
                     <ul className="space-y-1 pl-8">
                       {selectedVendors.map(id => {
                         const vendor = vendors.find(v => v.id === id);
                         return (
                           <li key={id} className="text-xs text-stone-600 flex justify-between">
                             <span>{vendor?.name}</span>
                             <span className="font-mono text-stone-500">{vendor?.balance.toLocaleString('es-ES')} €</span>
                           </li>
                         );
                       })}
                     </ul>
                   </div>

                   <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                     <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                     <p className="text-xs text-amber-700">El cliente recibirá un email para revisar y firmar las cartas antes del envío a los proveedores.</p>
                   </div>

                   <div className="flex gap-3">
                     <button
                       onClick={() => setShowSignatureModal(false)}
                       disabled={isSending}
                       className="flex-1 px-4 py-2 border border-stone-200 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50"
                     >
                       Cancelar
                     </button>
                     <button
                       onClick={handleConfirmSignature}
                       disabled={isSending}
                       className="flex-1 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
    </div>
  );
};
