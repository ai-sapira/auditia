import React, { useState } from 'react';
import { ChevronLeft, ClipboardCheck, Play, Download, CheckCircle, AlertTriangle, FileCheck, Loader2, X, FileText, Calendar, Euro, Database, Send, Eye, Receipt, CreditCard, Truck, MessageSquare, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EngagementTesterProps {
  onBack: () => void;
}

type InvoiceStatus = 'pending' | 'reviewed' | 'doubt' | 'missing_doc' | 'sap_fetching' | 'sap_fetched' | 'sent_to_client' | 'client_confirmed_paid' | 'client_confirmed_unpaid' | 'waiting_proof';

interface SampleInvoice {
  invoice: string;
  vendor: string;
  date: string;
  amount: number;
  description: string;
  risk: 'low' | 'medium' | 'high';
  status: InvoiceStatus;
  sapDocument?: {
    invoiceNumber: string;
    date: string;
    amount: number;
    paymentTerms: string;
    isPaid: boolean | null;
  };
  clientResponse?: {
    isPaid: boolean;
    responseDate: string;
    proofRequested: 'payment' | 'delivery_note' | null;
    proofUploaded: boolean;
  };
}

export const EngagementTester: React.FC<EngagementTesterProps> = ({ onBack }) => {
  const [testerParams, setTesterParams] = useState({
    sampleSize: 30,
    focusHighRisk: true,
    minAmount: 0,
    maxAmount: 1000000,
  });

  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [sample, setSample] = useState<SampleInvoice[]>([
    { invoice: 'F-2025-001', vendor: 'Tech Solutions SL', date: '2025-01-12', amount: 1250.00, description: 'Servicios cloud mensual', risk: 'low', status: 'pending' },
    { invoice: 'F-2025-002', vendor: 'Limpiezas Generales SA', date: '2025-01-14', amount: 850.50, description: 'Limpieza oficinas Enero', risk: 'low', status: 'pending' },
    { invoice: 'F-2025-003', vendor: 'Office Supplies Co', date: '2025-01-15', amount: 234.00, description: 'Material de oficina', risk: 'low', status: 'reviewed' },
    { invoice: 'F-2025-004', vendor: 'Seguridad Integral SL', date: '2025-01-16', amount: 3200.00, description: 'Servicios seguridad mensual', risk: 'medium', status: 'sap_fetched', sapDocument: { invoiceNumber: 'F-2025-004', date: '2025-01-16', amount: 3200.00, paymentTerms: '30 días', isPaid: null } },
    { invoice: 'F-2025-005', vendor: 'Mantenimiento Técnico SA', date: '2025-01-17', amount: 1850.75, description: 'Mantenimiento preventivo', risk: 'low', status: 'waiting_proof', clientResponse: { isPaid: true, responseDate: '20/03/2025', proofRequested: 'payment', proofUploaded: false } },
    { invoice: 'F-2025-006', vendor: 'Transportes Rápidos SL', date: '2025-01-18', amount: 2450.00, description: 'Transporte mercancías', risk: 'medium', status: 'client_confirmed_unpaid', clientResponse: { isPaid: false, responseDate: '21/03/2025', proofRequested: 'delivery_note', proofUploaded: false } },
  ]);

  const [showSAPModal, setShowSAPModal] = useState(false);
  const [sapFetching, setSapFetching] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [sendingToClient, setSendingToClient] = useState(false);

  const updateInvoiceStatus = (invoice: string, status: InvoiceStatus) => {
    setSample(prev => prev.map(item => 
      item.invoice === invoice ? { ...item, status } : item
    ));
    setSelectedInvoice(null);
  };

  const handleFetchFromSAP = (invoiceIndex: number) => {
    const invoice = sample[invoiceIndex];
    setSapFetching(true);
    setShowSAPModal(true);
    
    // Simulate SAP fetch
    setTimeout(() => {
      setSample(prev => prev.map((item, i) => 
        i === invoiceIndex 
          ? { 
              ...item, 
              status: 'sap_fetched' as InvoiceStatus,
              sapDocument: {
                invoiceNumber: item.invoice,
                date: item.date,
                amount: item.amount,
                paymentTerms: '30 días fecha factura',
                isPaid: null
              }
            } 
          : item
      ));
      setSapFetching(false);
    }, 2500);
  };

  const handleSendToClient = (invoiceIndex: number) => {
    setSendingToClient(true);
    
    setTimeout(() => {
      setSample(prev => prev.map((item, i) => 
        i === invoiceIndex 
          ? { ...item, status: 'sent_to_client' as InvoiceStatus } 
          : item
      ));
      setSendingToClient(false);
      setShowClientModal(true);
    }, 1500);
  };

  const handleClientResponse = (invoiceIndex: number, isPaid: boolean) => {
    const proofType = isPaid ? 'payment' : 'delivery_note';
    
    setSample(prev => prev.map((item, i) => 
      i === invoiceIndex 
        ? { 
            ...item, 
            status: isPaid ? 'client_confirmed_paid' as InvoiceStatus : 'client_confirmed_unpaid' as InvoiceStatus,
            clientResponse: {
              isPaid,
              responseDate: new Date().toLocaleDateString('es-ES'),
              proofRequested: proofType,
              proofUploaded: false
            }
          } 
        : item
    ));
    setShowClientModal(false);
  };

  const handleRequestProof = (invoiceIndex: number) => {
    setSample(prev => prev.map((item, i) => 
      i === invoiceIndex 
        ? { ...item, status: 'waiting_proof' as InvoiceStatus } 
        : item
    ));
  };

  const reviewedCount = sample.filter(s => !['pending', 'sap_fetching'].includes(s.status)).length;
  const pendingCount = sample.filter(s => s.status === 'pending').length;
  const sapFetchedCount = sample.filter(s => s.status === 'sap_fetched').length;
  const waitingProofCount = sample.filter(s => s.status === 'waiting_proof').length;

  const getStatusDisplay = (status: InvoiceStatus, item: SampleInvoice) => {
    switch (status) {
      case 'pending':
        return <span className="text-[10px] text-neutral-400">Pendiente</span>;
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#4A5D4A] bg-[#F7F9F7] px-2 py-0.5 rounded border border-[#E0E5E0]">
            <CheckCircle className="w-3 h-3" />
            Revisado
          </span>
        );
      case 'doubt':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8B7355] bg-[#FDFAF6] px-2 py-0.5 rounded border border-[#EDE5D8]">
            <AlertTriangle className="w-3 h-3" />
            Duda
          </span>
        );
      case 'missing_doc':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8B5A50] bg-[#FBF8F7] px-2 py-0.5 rounded border border-[#E8E0DE]">
            <FileCheck className="w-3 h-3" />
            Falta doc.
          </span>
        );
      case 'sap_fetching':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#4A5D6A] bg-[#F7F9FA] px-2 py-0.5 rounded border border-[#E0E5E8]">
            <Loader2 className="w-3 h-3 animate-spin" />
            Extrayendo SAP
          </span>
        );
      case 'sap_fetched':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-700 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200">
            <Database className="w-3 h-3" />
            SAP OK
          </span>
        );
      case 'sent_to_client':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#4A5D6A] bg-[#F7F9FA] px-2 py-0.5 rounded border border-[#E0E5E8]">
            <Send className="w-3 h-3" />
            Enviado cliente
          </span>
        );
      case 'client_confirmed_paid':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#4A5D4A] bg-[#F7F9F7] px-2 py-0.5 rounded border border-[#E0E5E0]">
            <CreditCard className="w-3 h-3" />
            Pagada
          </span>
        );
      case 'client_confirmed_unpaid':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8B7355] bg-[#FDFAF6] px-2 py-0.5 rounded border border-[#EDE5D8]">
            <Truck className="w-3 h-3" />
            No pagada
          </span>
        );
      case 'waiting_proof':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8B7355] bg-[#FDFAF6] px-2 py-0.5 rounded border border-[#EDE5D8]">
            <FileText className="w-3 h-3" />
            Esperando {item.clientResponse?.proofRequested === 'payment' ? 'comprobante' : 'albarán'}
          </span>
        );
      default:
        return null;
    }
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
                <ClipboardCheck className="w-5 h-5 text-neutral-600" />
             </div>
             <div>
                <h2 className="text-2xl font-serif text-neutral-900">Muestreo Alternativo</h2>
                <span className="text-xs text-neutral-400 font-mono">Tester Agent</span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden min-h-0">
          {/* Left Column: Parameters & Table */}
          <div className="col-span-8 flex flex-col gap-6 overflow-y-auto pr-2">
              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-px bg-neutral-200 border border-neutral-200 rounded-sm overflow-hidden">
                  <div className="bg-white p-4">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Muestra</span>
                      <div className="text-2xl font-serif text-neutral-900 tabular-nums">{sample.length}</div>
                      <span className="text-[10px] text-neutral-500">facturas</span>
                  </div>
                  <div className="bg-white p-4">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Revisadas</span>
                      <div className="text-2xl font-serif text-[#4A5D4A] tabular-nums">{reviewedCount}</div>
                      <span className="text-[10px] text-neutral-500">{Math.round(reviewedCount/sample.length*100)}% completado</span>
                  </div>
                  <div className="bg-white p-4">
                      <span className="text-[10px] text-neutral-600 uppercase tracking-wider font-sans block mb-1">Con SAP</span>
                      <div className="text-2xl font-serif text-neutral-600 tabular-nums">{sapFetchedCount}</div>
                      <span className="text-[10px] text-neutral-500">docs extraídos</span>
                  </div>
                  <div className="bg-white p-4">
                      <span className="text-[10px] text-[#8B7355] uppercase tracking-wider font-sans block mb-1">Esperando</span>
                      <div className="text-2xl font-serif text-[#8B7355] tabular-nums">{waitingProofCount}</div>
                      <span className="text-[10px] text-neutral-500">comprobantes</span>
                  </div>
              </div>

              {/* Parameters Panel */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-6">
                  <h3 className="text-sm font-serif text-neutral-900 mb-4">Parámetros de muestreo</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium text-neutral-500 block mb-2 uppercase tracking-wider">Número de ítems</label>
                        <input
                          type="number"
                          value={testerParams.sampleSize}
                          onChange={(e) => setTesterParams({ ...testerParams, sampleSize: parseInt(e.target.value) })}
                          className="w-full bg-white border border-neutral-200 rounded-sm px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 font-mono"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-neutral-500 block mb-2 uppercase tracking-wider flex items-center gap-2">
                          <input
                             type="checkbox"
                             checked={testerParams.focusHighRisk}
                             onChange={(e) => setTesterParams({ ...testerParams, focusHighRisk: e.target.checked })}
                             className="rounded border-neutral-300"
                          />
                          Foco en proveedores de riesgo alto
                        </label>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-neutral-500 block mb-2 uppercase tracking-wider">Importe mínimo (€)</label>
                        <input
                          type="number"
                          value={testerParams.minAmount}
                          onChange={(e) => setTesterParams({ ...testerParams, minAmount: parseInt(e.target.value) })}
                          className="w-full bg-white border border-neutral-200 rounded-sm px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 font-mono"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-neutral-500 block mb-2 uppercase tracking-wider">Importe máximo (€)</label>
                        <input
                          type="number"
                          value={testerParams.maxAmount}
                          onChange={(e) => setTesterParams({ ...testerParams, maxAmount: parseInt(e.target.value) })}
                          className="w-full bg-white border border-neutral-200 rounded-sm px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 font-mono"
                        />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-sm hover:bg-black transition-colors flex items-center gap-2">
                        <Play className="w-3.5 h-3.5" />
                        Generar muestra
                    </button>
                  </div>
              </div>

              {/* Sample Table */}
              <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm flex-1">
                  <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center sticky top-0">
                    <h3 className="text-xs font-medium font-serif text-neutral-900">Facturas seleccionadas para revisión</h3>
                    <div className="flex gap-2">
                        <button className="p-1.5 text-neutral-400 hover:text-neutral-900 border border-transparent hover:border-neutral-200 rounded">
                          <Download className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-neutral-50 text-[10px] text-neutral-500 font-sans uppercase tracking-wider border-b border-neutral-200 sticky top-[45px]">
                        <tr>
                          <th className="px-4 py-2 font-medium">Nº Factura</th>
                          <th className="px-4 py-2 font-medium">Proveedor</th>
                          <th className="px-4 py-2 font-medium">Fecha</th>
                          <th className="px-4 py-2 font-medium text-right">Importe</th>
                          <th className="px-4 py-2 font-medium text-center">Estado</th>
                          <th className="px-4 py-2 font-medium text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {sample.map((item, i) => (
                            <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                                <td className="px-4 py-2.5">
                                    <span className="font-mono text-xs text-neutral-900">{item.invoice}</span>
                                </td>
                                <td className="px-4 py-2.5">
                                    <div className="text-xs text-neutral-900">{item.vendor}</div>
                                </td>
                                <td className="px-4 py-2.5">
                                    <span className="text-xs font-mono text-neutral-500">{item.date}</span>
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                    <span className="font-mono text-xs tabular-nums text-neutral-900">
                                        {item.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                    {getStatusDisplay(item.status, item)}
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                    <button 
                                        onClick={() => setSelectedInvoice(i)}
                                        className="px-3 py-1.5 border border-neutral-200 rounded-sm text-[10px] font-medium hover:bg-neutral-50 transition-colors uppercase tracking-wide"
                                    >
                                        Revisar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                  </table>
              </div>
          </div>

          {/* Right Column: Invoice Detail Panel */}
          <div className="col-span-4 bg-neutral-50 border border-neutral-200 rounded-sm p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                  {selectedInvoice !== null ? (
                      <motion.div
                          key="detail"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="bg-white rounded-sm p-6 shadow-sm border border-neutral-200"
                      >
                          <div className="flex justify-between items-start mb-6">
                              <h4 className="text-sm font-serif text-neutral-900">Revisión de factura</h4>
                              <button 
                                  onClick={() => setSelectedInvoice(null)}
                                  className="p-1 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
                              >
                                  <X className="w-4 h-4" />
                              </button>
                          </div>

                          {sample[selectedInvoice] && (
                              <>
                                  <div className="space-y-4 mb-6">
                                      <div>
                                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Número de factura</span>
                                          <p className="text-sm font-mono text-neutral-900">{sample[selectedInvoice].invoice}</p>
                                      </div>
                                      <div>
                                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Proveedor</span>
                                          <p className="text-sm text-neutral-900">{sample[selectedInvoice].vendor}</p>
                                      </div>
                                      <div>
                                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Fecha</span>
                                          <p className="text-sm font-mono text-neutral-900">{sample[selectedInvoice].date}</p>
                                      </div>
                                      <div>
                                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Descripción</span>
                                          <p className="text-sm text-neutral-500">{sample[selectedInvoice].description}</p>
                                      </div>
                                      <div className="pt-4 border-t border-neutral-200">
                                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Importe</span>
                                          <p className="text-2xl font-serif text-neutral-900 tabular-nums">{sample[selectedInvoice].amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</p>
                                      </div>
                                  </div>

                                  {/* SAP Document Info */}
                                  {sample[selectedInvoice].sapDocument && (
                                    <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                                      <div className="flex items-center gap-2 mb-3">
                                        <Database className="w-4 h-4 text-neutral-600" />
                                        <span className="text-xs font-medium text-neutral-800">Documento SAP</span>
                                      </div>
                                      <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                          <span className="text-neutral-600">Nº Documento:</span>
                                          <span className="font-mono text-neutral-900">{sample[selectedInvoice].sapDocument.invoiceNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-neutral-600">Condiciones pago:</span>
                                          <span className="text-neutral-900">{sample[selectedInvoice].sapDocument.paymentTerms}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-neutral-600">Importe:</span>
                                          <span className="font-mono text-neutral-900">{sample[selectedInvoice].sapDocument.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Client Response Info */}
                                  {sample[selectedInvoice].clientResponse && (
                                    <div className={`mb-6 p-4 rounded-lg border ${sample[selectedInvoice].clientResponse!.isPaid ? 'bg-[#F7F9F7] border-[#E0E5E0]' : 'bg-[#FDFAF6] border-[#EDE5D8]'}`}>
                                      <div className="flex items-center gap-2 mb-3">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-xs font-medium">Respuesta Cliente</span>
                                      </div>
                                      <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                          <span>Estado de pago:</span>
                                          <span className="font-medium">{sample[selectedInvoice].clientResponse!.isPaid ? 'PAGADA' : 'NO PAGADA'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Fecha respuesta:</span>
                                          <span className="font-mono">{sample[selectedInvoice].clientResponse!.responseDate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Documentación solicitada:</span>
                                          <span className="font-medium">{sample[selectedInvoice].clientResponse!.proofRequested === 'payment' ? 'Comprobante de pago' : 'Albarán de entrega'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Documentación recibida:</span>
                                          <span className={sample[selectedInvoice].clientResponse!.proofUploaded ? 'text-[#4A5D4A] font-medium' : 'text-[#8B7355]'}>{sample[selectedInvoice].clientResponse!.proofUploaded ? 'Sí ✓' : 'Pendiente'}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div className="space-y-2">
                                      <span className="text-xs font-medium text-neutral-700 block mb-2">Acciones:</span>
                                      
                                      {/* SAP Fetch Action */}
                                      {!sample[selectedInvoice].sapDocument && (
                                        <button
                                            onClick={() => handleFetchFromSAP(selectedInvoice)}
                                            disabled={sample[selectedInvoice].status === 'sap_fetching'}
                                            className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs font-medium rounded-sm hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {sample[selectedInvoice].status === 'sap_fetching' ? (
                                              <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Extrayendo de SAP...
                                              </>
                                            ) : (
                                              <>
                                                <Database className="w-4 h-4" />
                                                Obtener factura desde SAP
                                              </>
                                            )}
                                        </button>
                                      )}

                                      {/* Send to Client Action */}
                                      {sample[selectedInvoice].sapDocument && !sample[selectedInvoice].clientResponse && (
                                        <button
                                            onClick={() => handleSendToClient(selectedInvoice)}
                                            disabled={sendingToClient}
                                            className="w-full px-4 py-2 bg-[#F7F9FA] border border-[#E0E5E8] text-[#4A5D6A] text-xs font-medium rounded-sm hover:bg-[#E8EDEF] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {sendingToClient ? (
                                              <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Enviando...
                                              </>
                                            ) : (
                                              <>
                                                <Send className="w-4 h-4" />
                                                Enviar al cliente para confirmar pago
                                              </>
                                            )}
                                        </button>
                                      )}

                                      {/* Request Proof Actions */}
                                      {sample[selectedInvoice].status === 'client_confirmed_paid' && (
                                        <button
                                            onClick={() => handleRequestProof(selectedInvoice)}
                                            className="w-full px-4 py-2 bg-[#F7F9F7] border border-[#E0E5E0] text-[#4A5D4A] text-xs font-medium rounded-sm hover:bg-[#E8EDE8] transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CreditCard className="w-4 h-4" />
                                            Solicitar comprobante de pago
                                        </button>
                                      )}

                                      {sample[selectedInvoice].status === 'client_confirmed_unpaid' && (
                                        <button
                                            onClick={() => handleRequestProof(selectedInvoice)}
                                            className="w-full px-4 py-2 bg-[#FDFAF6] border border-[#EDE5D8] text-[#8B7355] text-xs font-medium rounded-sm hover:bg-[#F5EDE0] transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Truck className="w-4 h-4" />
                                            Solicitar albarán de entrega
                                        </button>
                                      )}

                                      <div className="border-t border-neutral-200 pt-3 mt-3">
                                        <span className="text-[10px] text-neutral-500 block mb-2">Marcar como:</span>
                                        <div className="space-y-2">
                                          <button
                                              onClick={() => updateInvoiceStatus(sample[selectedInvoice].invoice, 'reviewed')}
                                              className="w-full px-4 py-2 bg-[#F7F9F7] border border-[#E0E5E0] text-[#4A5D4A] text-xs font-medium rounded-sm hover:bg-[#E8EDE8] transition-colors flex items-center justify-center gap-2"
                                          >
                                              <CheckCircle className="w-4 h-4" />
                                              Revisado (OK)
                                          </button>
                                          <button
                                              onClick={() => updateInvoiceStatus(sample[selectedInvoice].invoice, 'doubt')}
                                              className="w-full px-4 py-2 bg-[#FDFAF6] border border-[#EDE5D8] text-[#8B7355] text-xs font-medium rounded-sm hover:bg-[#F5EDE0] transition-colors flex items-center justify-center gap-2"
                                          >
                                              <AlertTriangle className="w-4 h-4" />
                                              Duda / Requiere aclaración
                                          </button>
                                          <button
                                              onClick={() => updateInvoiceStatus(sample[selectedInvoice].invoice, 'missing_doc')}
                                              className="w-full px-4 py-2 bg-[#FBF8F7] border border-[#E8E0DE] text-[#8B5A50] text-xs font-medium rounded-sm hover:bg-[#F0E8E6] transition-colors flex items-center justify-center gap-2"
                                          >
                                              <FileCheck className="w-4 h-4" />
                                              Falta documentación
                                          </button>
                                        </div>
                                      </div>
                                  </div>
                              </>
                          )}
                      </motion.div>
                  ) : (
                      <motion.div
                          key="placeholder"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center py-12"
                      >
                          <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                          <p className="text-xs text-neutral-400">Selecciona una factura para revisar</p>
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>
       </div>

       {/* SAP Modal */}
       <AnimatePresence>
         {showSAPModal && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
             onClick={() => !sapFetching && setShowSAPModal(false)}
           >
             <motion.div
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
               onClick={e => e.stopPropagation()}
             >
               {sapFetching ? (
                 <div className="text-center py-8">
                   <motion.div
                     animate={{ rotate: 360 }}
                     transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                     className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-900 rounded-full mx-auto mb-4"
                   />
                   <h3 className="text-lg font-serif text-neutral-900 mb-2">Conectando con SAP...</h3>
                   <p className="text-sm text-neutral-500">Extrayendo documento de factura del ERP</p>
                   <div className="mt-4 space-y-1 text-xs text-neutral-400">
                     <p>• Verificando credenciales...</p>
                     <p>• Consultando tabla BSAK...</p>
                     <p>• Recuperando documento...</p>
                   </div>
                 </div>
               ) : (
                 <div className="text-center py-8">
                   <motion.div
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4"
                   >
                     <Database className="w-8 h-8 text-neutral-600" />
                   </motion.div>
                   <h3 className="text-lg font-serif text-neutral-900 mb-2">Documento extraído</h3>
                   <p className="text-sm text-neutral-500">La factura ha sido recuperada de SAP correctamente.</p>
                   <button
                     onClick={() => setShowSAPModal(false)}
                     className="mt-6 px-6 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
                   >
                     Continuar
                   </button>
                 </div>
               )}
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Client Response Modal */}
       <AnimatePresence>
         {showClientModal && selectedInvoice !== null && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
           >
             <motion.div
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
             >
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-lg font-serif text-neutral-900">Simular respuesta del cliente</h3>
                   <p className="text-sm text-neutral-500 mt-1">¿La factura ha sido pagada?</p>
                 </div>
                 <button 
                   onClick={() => setShowClientModal(false)}
                   className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors"
                 >
                   <X className="w-5 h-5" />
                 </button>
               </div>

               <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
                 <p className="text-xs text-neutral-600">
                   <strong>Factura:</strong> {sample[selectedInvoice]?.invoice}
                 </p>
                 <p className="text-xs text-neutral-600">
                   <strong>Importe:</strong> {sample[selectedInvoice]?.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                 </p>
               </div>

               <div className="flex gap-3">
                 <button
                   onClick={() => handleClientResponse(selectedInvoice, true)}
                   className="flex-1 px-4 py-3 bg-[#F7F9F7] border border-[#E0E5E0] text-[#4A5D4A] text-sm font-medium rounded-lg hover:bg-[#E8EDE8] transition-colors flex flex-col items-center gap-1"
                 >
                   <CreditCard className="w-5 h-5" />
                   <span>Sí, pagada</span>
                   <span className="text-[10px] text-[#4A5D4A]">Se solicitará comprobante</span>
                 </button>
                 <button
                   onClick={() => handleClientResponse(selectedInvoice, false)}
                   className="flex-1 px-4 py-3 bg-[#FDFAF6] border border-[#EDE5D8] text-[#8B7355] text-sm font-medium rounded-lg hover:bg-[#F5EDE0] transition-colors flex flex-col items-center gap-1"
                 >
                   <Truck className="w-5 h-5" />
                   <span>No, pendiente</span>
                   <span className="text-[10px] text-[#8B7355]">Se solicitará albarán</span>
                 </button>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};
