import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Scale, Filter, Download, Plus, AlertTriangle, ArrowRight, Eye, X, FileText, Calendar, Euro, CloudDownload, Loader2, CheckCircle2, Building2 } from 'lucide-react';

interface EngagementReconcilerProps {
  onBack: () => void;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  description: string;
  status: 'in_ledger' | 'not_in_ledger' | 'amount_mismatch';
  ledgerAmount?: number;
}

interface Discrepancy {
  vendor: string;
  difference: number;
  invoices: Invoice[];
  status: 'material' | 'immaterial';
  ledgerBalance: number;
  subledgerBalance: number;
}

export const EngagementReconciler: React.FC<EngagementReconcilerProps> = ({ onBack }) => {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showAddFindingModal, setShowAddFindingModal] = useState(false);
  const [findingTitle, setFindingTitle] = useState('');
  const [findingDescription, setFindingDescription] = useState('');
  const [findingPriority, setFindingPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  // SAP fetch states
  const [fetchingSAPInvoice, setFetchingSAPInvoice] = useState<string | null>(null);
  const [sapFetchedInvoices, setSapFetchedInvoices] = useState<Set<string>>(new Set());
  const [showSAPDataModal, setShowSAPDataModal] = useState(false);
  const [selectedSAPInvoice, setSelectedSAPInvoice] = useState<{
    invoiceNumber: string;
    sapData: {
      documentNumber: string;
      postingDate: string;
      vendor: string;
      vendorCode: string;
      amount: number;
      currency: string;
      paymentTerms: string;
      paymentDueDate: string;
      documentType: string;
      companyCode: string;
      fiscalYear: string;
      lineItems: Array<{
        item: number;
        glAccount: string;
        description: string;
        debit: number;
        credit: number;
        costCenter: string;
      }>;
      status: string;
      clearingDocument: string | null;
    };
  } | null>(null);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showInvoiceModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showInvoiceModal]);

  // Mock data with detailed invoices
  const discrepancies: Discrepancy[] = [
    { 
      vendor: 'Logística Norte S.L.', 
      difference: 12500, 
      invoices: [
        { id: '1', invoiceNumber: 'F-2025-0123', date: '2025-01-15', amount: 8500, description: 'Servicios logísticos Q1', status: 'not_in_ledger' },
        { id: '2', invoiceNumber: 'F-2025-0189', date: '2025-01-22', amount: 3200, description: 'Transporte urgente', status: 'amount_mismatch', ledgerAmount: 2800 },
        { id: '3', invoiceNumber: 'F-2025-0201', date: '2025-01-28', amount: 800, description: 'Almacenamiento', status: 'in_ledger' }
      ],
      status: 'material',
      ledgerBalance: 485000,
      subledgerBalance: 497500
    },
    { 
      vendor: 'Servicios Centrales SA', 
      difference: 14500, 
      invoices: [
        { id: '4', invoiceNumber: 'F-2025-0087', date: '2025-01-10', amount: 14500, description: 'Servicios de consultoría', status: 'not_in_ledger' }
      ],
      status: 'material',
      ledgerBalance: 320000,
      subledgerBalance: 334500
    },
    { 
      vendor: 'Equipamiento Industrial', 
      difference: 1800, 
      invoices: [
        { id: '5', invoiceNumber: 'F-2025-0156', date: '2025-01-18', amount: 1800, description: 'Equipamiento oficina', status: 'amount_mismatch', ledgerAmount: 0 }
      ],
      status: 'immaterial',
      ledgerBalance: 125000,
      subledgerBalance: 126800
    },
    { 
      vendor: 'Marketing Digital Pro', 
      difference: 3200, 
      invoices: [
        { id: '6', invoiceNumber: 'F-2025-0198', date: '2025-01-25', amount: 3200, description: 'Campaña digital enero', status: 'not_in_ledger' }
      ],
      status: 'immaterial',
      ledgerBalance: 89000,
      subledgerBalance: 92200
    },
  ];

  const totalDiscrepancy = discrepancies.reduce((sum, d) => sum + d.difference, 0);
  const materialDiscrepancy = discrepancies.filter(d => d.status === 'material').reduce((sum, d) => sum + d.difference, 0);
  const immaterialDiscrepancy = totalDiscrepancy - materialDiscrepancy;
  
  // Calculate totals from ledger and subledger
  const totalLedgerBalance = discrepancies.reduce((sum, d) => sum + d.ledgerBalance, 0);
  const totalSubledgerBalance = discrepancies.reduce((sum, d) => sum + d.subledgerBalance, 0);
  
  const selectedDiscrepancy = discrepancies.find(d => d.vendor === selectedVendor);

  // Generate next finding code
  const getNextFindingCode = () => {
    // In a real app, this would come from the backend
    const baseCode = 'H-';
    const nextNum = Math.floor(Math.random() * 1000) + 27; // Random number for demo
    return `${baseCode}${nextNum.toString().padStart(3, '0')}`;
  };

  const handleAddFinding = () => {
    if (!selectedDiscrepancy || !findingTitle.trim()) return;

    const newFinding = {
      id: `f-${Date.now()}`,
      code: getNextFindingCode(),
      title: findingTitle,
      amount: selectedDiscrepancy.difference,
      type: 'error' as const,
      status: 'draft' as const,
      responsible: 'Usuario Actual', // In real app, get from auth context
      description: findingDescription || `Diferencia detectada en el cuadre de proveedores para ${selectedDiscrepancy.vendor}. ${selectedDiscrepancy.difference.toLocaleString('es-ES')} € de diferencia entre el libro mayor y el submayor.`,
      affectedRows: selectedDiscrepancy.invoices.map((inv, idx) => ({
        id: `r-${Date.now()}-${idx}`,
        invoiceNo: inv.invoiceNumber,
        supplier: selectedDiscrepancy.vendor,
        date: inv.date,
        amount: inv.amount,
        discrepancy: inv.status === 'not_in_ledger' ? 'No registrada' : inv.status === 'amount_mismatch' ? 'Importe no coincide' : 'Registrada',
        status: 'pending' as const
      })),
      complianceTags: selectedDiscrepancy.status === 'material' ? ['NIA-ES 505'] : [],
      documents: [],
      internalComments: [],
      messages: [],
      createdAt: new Date().toLocaleDateString('es-ES'),
      updatedAt: new Date().toLocaleDateString('es-ES'),
      priority: findingPriority
    };

    // In a real app, this would be sent to the backend or context
    console.log('New finding created:', newFinding);
    
    // Reset form
    setFindingTitle('');
    setFindingDescription('');
    setFindingPriority('medium');
  };

  // Function to fetch invoice data from SAP
  const handleFetchFromSAP = async (invoice: Invoice) => {
    setFetchingSAPInvoice(invoice.id);
    
    // Simulate API call to SAP
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock SAP data - in real app, this would come from SAP API
    const mockSAPData = {
      documentNumber: invoice.invoiceNumber.replace('F-', 'SAP-'),
      postingDate: invoice.date,
      vendor: selectedDiscrepancy?.vendor || '',
      vendorCode: `V${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
      amount: invoice.amount,
      currency: 'EUR',
      paymentTerms: 'Z030',
      paymentDueDate: new Date(new Date(invoice.date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      documentType: 'KR',
      companyCode: '1000',
      fiscalYear: '2025',
      lineItems: [
        {
          item: 10,
          glAccount: '6000001',
          description: invoice.description,
          debit: invoice.amount,
          credit: 0,
          costCenter: 'CC-100'
        },
        {
          item: 20,
          glAccount: '4000001',
          description: `Proveedor: ${selectedDiscrepancy?.vendor}`,
          debit: 0,
          credit: invoice.amount,
          costCenter: ''
        }
      ],
      status: invoice.status === 'in_ledger' ? 'Contabilizado' : invoice.status === 'not_in_ledger' ? 'No encontrado en SAP' : 'Importe diferente',
      clearingDocument: invoice.status === 'in_ledger' ? `CLR-${Math.floor(Math.random() * 100000)}` : null
    };
    
    setSelectedSAPInvoice({
      invoiceNumber: invoice.invoiceNumber,
      sapData: mockSAPData
    });
    
    // Mark as fetched
    setSapFetchedInvoices(prev => new Set(prev).add(invoice.id));
    setFetchingSAPInvoice(null);
    setShowSAPDataModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header */}
       <div className="flex items-center gap-4 pb-6 border-b border-neutral-200">
          <button
             onClick={onBack}
             className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
             <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[#FDFAF6] border border-[#EDE5D8] flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#8B7355]" />
             </div>
             <div>
                <h2 className="text-2xl font-serif text-neutral-900">Cuadre básico de Proveedores</h2>
                <span className="text-xs text-neutral-400 font-mono">Reconciler · Ejecutado 15/03 09:15</span>
             </div>
          </div>
       </div>

       {/* Analytics Panel */}
       <div className="grid grid-cols-3 gap-6">
          {/* Summary KPI */}
          <div className="col-span-2 bg-neutral-50 border border-neutral-200 rounded-sm p-6">
              <h3 className="text-sm font-serif text-neutral-900 mb-4">Resumen del cuadre</h3>
              
              {/* Main Reconciliation Summary */}
              <div className="bg-white border border-neutral-200 rounded-sm p-4 mb-6">
                  <div className="grid grid-cols-3 gap-4">
                      <div>
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Saldo Libro Mayor</span>
                          <div className="text-2xl font-serif text-neutral-900 tabular-nums">{totalLedgerBalance.toLocaleString('es-ES')} €</div>
                          <span className="text-[10px] text-neutral-500">Cuentas 400/410</span>
                      </div>
                      <div>
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Saldo Submayor</span>
                          <div className="text-2xl font-serif text-neutral-900 tabular-nums">{totalSubledgerBalance.toLocaleString('es-ES')} €</div>
                          <span className="text-[10px] text-neutral-500">Suma proveedores</span>
                      </div>
                      <div>
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Diferencia</span>
                          <div className={`text-2xl font-serif tabular-nums ${
                              totalDiscrepancy === 0 ? 'text-[#4A5D4A]' : 'text-[#8B5A50]'
                          }`}>
                              {totalDiscrepancy > 0 ? '+' : ''}{totalDiscrepancy.toLocaleString('es-ES')} €
                          </div>
                          <span className="text-[10px] text-neutral-500">
                              {totalDiscrepancy === 0 ? 'Cuadre correcto' : `${((totalDiscrepancy / totalLedgerBalance) * 100).toFixed(2)}% del saldo`}
                          </span>
                      </div>
                  </div>
              </div>
              
              <div className="flex items-center gap-8 mb-6">
                  <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Desajuste total</span>
                      <div className="text-3xl font-serif text-neutral-900 tabular-nums">{totalDiscrepancy.toLocaleString('es-ES')} €</div>
                      <span className="text-[10px] text-neutral-500">{discrepancies.length} proveedores con diferencias</span>
                  </div>
                  <div className="h-8 w-px bg-neutral-200"></div>
                  <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Material (&gt;0,9 M€)</span>
                      <div className="text-3xl font-serif text-[#8B5A50] tabular-nums">{materialDiscrepancy.toLocaleString('es-ES')} €</div>
                      <span className="text-[10px] text-neutral-500">{discrepancies.filter(d => d.status === 'material').length} proveedores afectados</span>
                  </div>
              </div>

              {/* Visual Bar Chart */}
              <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider font-medium text-neutral-500">
                      <span>Distribución de diferencias</span>
                      <span>Total: {totalDiscrepancy.toLocaleString('es-ES')} €</span>
                  </div>
                  <div className="h-4 flex rounded-sm overflow-hidden">
                      <div style={{ width: `${(materialDiscrepancy / totalDiscrepancy) * 100}%` }} className="bg-[#8B5A50]"></div>
                      <div style={{ width: `${(immaterialDiscrepancy / totalDiscrepancy) * 100}%` }} className="bg-neutral-300"></div>
                  </div>
                  <div className="flex gap-4 justify-end text-[10px] text-neutral-500">
                      <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-[#8B5A50]"></div>
                          <span>Material ({Math.round((materialDiscrepancy / totalDiscrepancy) * 100)}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
                          <span>Inmaterial ({Math.round((immaterialDiscrepancy / totalDiscrepancy) * 100)}%)</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Action Card */}
          <div className="bg-white border border-neutral-200 rounded-sm p-6 shadow-sm flex flex-col justify-between">
              <div>
                  <div className="w-10 h-10 bg-[#FBF8F7] rounded-full flex items-center justify-center mb-4">
                      <AlertTriangle className="w-5 h-5 text-[#8B5A50]" />
                  </div>
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">Acción requerida</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                      Se han detectado 2 diferencias materiales que requieren justificación o ajuste.
                  </p>
              </div>
              <button className="w-full mt-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-sm hover:bg-black transition-colors flex items-center justify-center gap-2">
                  Revisar hallazgos <ArrowRight className="w-3.5 h-3.5" />
              </button>
          </div>
       </div>

       {/* Discrepancies Table */}
       <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
             <h3 className="text-sm font-serif text-neutral-900">Diferencias por proveedor</h3>
             <div className="flex gap-2">
                <button className="p-1.5 text-neutral-400 hover:text-neutral-900 border border-transparent hover:border-neutral-200 rounded">
                   <Filter className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-neutral-400 hover:text-neutral-900 border border-transparent hover:border-neutral-200 rounded">
                   <Download className="w-4 h-4" />
                </button>
             </div>
          </div>
          <table className="w-full text-left">
             <thead className="bg-neutral-50 text-[10px] text-neutral-500 font-sans uppercase tracking-wider border-b border-neutral-200">
                <tr>
                   <th className="px-6 py-3 font-medium">Proveedor</th>
                   <th className="px-6 py-3 font-medium text-right">Diferencia</th>
                   <th className="px-6 py-3 font-medium text-center">Nº Facturas</th>
                   <th className="px-6 py-3 font-medium text-center">Estado</th>
                   <th className="px-6 py-3 font-medium text-right">Acción</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-neutral-100">
                {discrepancies.map((disc, i) => (
                   <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4">
                         <div className="font-medium text-sm text-neutral-900">{disc.vendor}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <span className={`font-mono text-sm tabular-nums ${
                            disc.status === 'material' ? 'font-semibold text-[#8B5A50]' : 'text-neutral-900'
                         }`}>
                            {disc.difference.toLocaleString('es-ES')} €
                         </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex items-center justify-center gap-2">
                            <span className="text-xs text-neutral-600 font-mono">{disc.invoices.length}</span>
                            <button 
                               onClick={() => {
                                  setSelectedVendor(disc.vendor);
                                  setShowInvoiceModal(true);
                               }}
                               className="p-1 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded transition-colors"
                               title="Ver facturas"
                            >
                               <Eye className="w-3.5 h-3.5" />
                            </button>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         {disc.status === 'material' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8B5A50] bg-[#FBF8F7] px-2 py-0.5 rounded border border-[#E8E0DE]">
                               <AlertTriangle className="w-3 h-3" />
                               Material
                            </span>
                         ) : (
                            <span className="text-[10px] text-neutral-400">Inmaterial</span>
                         )}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button 
                               onClick={() => {
                                  setSelectedVendor(disc.vendor);
                                  setShowAddFindingModal(true);
                               }}
                               className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 text-xs font-medium rounded-sm hover:bg-neutral-50 hover:border-neutral-300 transition-colors flex items-center gap-1.5"
                            >
                               <Plus className="w-3 h-3" />
                               Añadir hallazgo
                            </button>
                         </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {/* Invoice Detail Modal */}
       <AnimatePresence>
          {showInvoiceModal && selectedDiscrepancy && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                onClick={() => {
                   setShowInvoiceModal(false);
                   setSelectedVendor(null);
                }}
             >
                <motion.div
                   initial={{ scale: 0.98, opacity: 0, y: 10 }}
                   animate={{ scale: 1, opacity: 1, y: 0 }}
                   exit={{ scale: 0.98, opacity: 0, y: 10 }}
                   transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                   className="bg-white rounded-sm border border-neutral-200 shadow-2xl max-w-3xl w-full flex flex-col relative z-[101]"
                   onClick={(e) => e.stopPropagation()}
                >
                   {/* Header */}
                   <div className="px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
                      <div>
                         <h3 className="text-sm font-serif text-neutral-900">Detalle de facturas</h3>
                         <p className="text-[11px] text-neutral-500 mt-0.5 font-sans">{selectedDiscrepancy.vendor}</p>
                      </div>
                      <button
                         onClick={() => {
                            setShowInvoiceModal(false);
                            setSelectedVendor(null);
                         }}
                         className="p-1.5 hover:bg-neutral-50 rounded-sm transition-colors text-neutral-400 hover:text-neutral-900"
                      >
                         <X className="w-4 h-4" />
                      </button>
                   </div>

                   {/* Summary - Compact */}
                   <div className="px-5 py-3 border-b border-neutral-200 bg-white">
                      <div className="grid grid-cols-3 gap-3">
                         <div>
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-0.5">Libro Mayor</span>
                            <div className="text-base font-serif text-neutral-900 tabular-nums">
                               {selectedDiscrepancy.ledgerBalance.toLocaleString('es-ES')} €
                            </div>
                         </div>
                         <div>
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-0.5">Submayor</span>
                            <div className="text-base font-serif text-neutral-900 tabular-nums">
                               {selectedDiscrepancy.subledgerBalance.toLocaleString('es-ES')} €
                            </div>
                         </div>
                         <div>
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-0.5">Diferencia</span>
                            <div className="text-base font-serif text-[#8B5A50] tabular-nums font-semibold">
                               +{selectedDiscrepancy.difference.toLocaleString('es-ES')} €
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Invoices - Compact Table Style */}
                   <div className="px-5 py-3 bg-white">
                      <div className="space-y-2">
                         {selectedDiscrepancy.invoices.map((invoice) => {
                            const hasError = invoice.status === 'not_in_ledger' || invoice.status === 'amount_mismatch';
                            return (
                               <div
                                  key={invoice.id}
                                  className={`border rounded-sm p-3 ${
                                     invoice.status === 'not_in_ledger' 
                                        ? 'border-[#E8E0DE] bg-[#FBF8F7]/50' 
                                        : invoice.status === 'amount_mismatch'
                                        ? 'border-[#EDE5D8] bg-[#FDFAF6]/50'
                                        : 'border-neutral-200 bg-white'
                                  }`}
                               >
                                  <div className="flex items-center justify-between gap-4">
                                     <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                           {hasError ? (
                                              <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${
                                                 invoice.status === 'not_in_ledger' ? 'text-[#8B5A50]' : 'text-[#8B7355]'
                                              }`} />
                                           ) : (
                                              <FileText className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                           )}
                                           <span className="font-medium text-xs font-mono text-neutral-900">
                                              {invoice.invoiceNumber}
                                           </span>
                                           {invoice.status === 'not_in_ledger' && (
                                              <span className="text-[9px] font-medium text-[#8B5A50] bg-[#F0E8E6] px-1.5 py-0.5 rounded-sm border border-[#E8E0DE]">
                                                 No registrada
                                              </span>
                                           )}
                                           {invoice.status === 'amount_mismatch' && (
                                              <span className="text-[9px] font-medium text-[#8B7355] bg-[#F5EDE0] px-1.5 py-0.5 rounded-sm border border-[#EDE5D8]">
                                                 Importe no coincide
                                              </span>
                                           )}
                                        </div>
                                        <p className="text-[11px] text-neutral-600 mb-1">{invoice.description}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                                           <Calendar className="w-3 h-3" />
                                           <span>{new Date(invoice.date).toLocaleDateString('es-ES')}</span>
                                        </div>
                                     </div>
                                     <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right">
                                           <div className="text-sm font-serif text-neutral-900 tabular-nums">
                                              {invoice.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                           </div>
                                           {invoice.ledgerAmount !== undefined && (
                                              <div className={`text-xs font-serif tabular-nums mt-0.5 ${
                                                 invoice.ledgerAmount !== invoice.amount ? 'text-[#8B7355] font-semibold' : 'text-neutral-500'
                                              }`}>
                                                 Libro: {invoice.ledgerAmount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                              </div>
                                           )}
                                           {invoice.ledgerAmount !== undefined && invoice.ledgerAmount !== invoice.amount && (
                                              <div className="text-[10px] text-[#8B5A50] font-medium mt-0.5">
                                                 Dif: {(invoice.amount - invoice.ledgerAmount).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                              </div>
                                           )}
                                           {invoice.status === 'not_in_ledger' && (
                                              <div className="text-[10px] text-[#8B5A50] font-medium mt-0.5">
                                                 No encontrada
                                              </div>
                                           )}
                                        </div>
                                        {(invoice.status === 'not_in_ledger' || invoice.status === 'amount_mismatch') && (
                                           <button 
                                              onClick={() => handleFetchFromSAP(invoice)}
                                              disabled={fetchingSAPInvoice === invoice.id}
                                              className={`px-2.5 py-1.5 text-[10px] font-medium rounded-sm transition-all flex items-center gap-1.5 ${
                                                 sapFetchedInvoices.has(invoice.id)
                                                    ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                                                    : 'bg-[#1A4D8C] hover:bg-[#143D6B] text-white'
                                              } ${fetchingSAPInvoice === invoice.id ? 'opacity-75 cursor-wait' : ''}`}
                                           >
                                              {fetchingSAPInvoice === invoice.id ? (
                                                 <>
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                    Cargando...
                                                 </>
                                              ) : sapFetchedInvoices.has(invoice.id) ? (
                                                 <>
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Ver SAP
                                                 </>
                                              ) : (
                                                 <>
                                                    <CloudDownload className="w-3 h-3" />
                                                    Traer desde SAP
                                                 </>
                                              )}
                                           </button>
                                        )}
                                     </div>
                                  </div>
                               </div>
                            );
                         })}
                      </div>
                   </div>

                   {/* Footer */}
                   <div className="px-5 py-2.5 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                      <div className="text-[11px] text-neutral-500 font-sans">
                         {selectedDiscrepancy.invoices.length} factura{selectedDiscrepancy.invoices.length !== 1 ? 's' : ''} · 
                         Diferencia: <span className="font-semibold text-neutral-900 font-mono">{selectedDiscrepancy.difference.toLocaleString('es-ES')} €</span>
                      </div>
                      <div className="flex gap-2">
                         <button
                            onClick={() => {
                               setShowInvoiceModal(false);
                               setSelectedVendor(null);
                            }}
                            className="px-3 py-1 bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 text-[11px] font-medium rounded-sm transition-colors"
                         >
                            Cerrar
                         </button>
                      </div>
                   </div>
                </motion.div>
             </motion.div>
          )}
       </AnimatePresence>

       {/* Add Finding Modal */}
       <AnimatePresence>
          {showAddFindingModal && selectedDiscrepancy && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                onClick={() => {
                   setShowAddFindingModal(false);
                   setSelectedVendor(null);
                   setFindingTitle('');
                   setFindingDescription('');
                }}
             >
                <motion.div
                   initial={{ scale: 0.98, opacity: 0, y: 10 }}
                   animate={{ scale: 1, opacity: 1, y: 0 }}
                   exit={{ scale: 0.98, opacity: 0, y: 10 }}
                   transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                   className="bg-white rounded-sm border border-neutral-200 shadow-2xl max-w-2xl w-full flex flex-col relative z-[101]"
                   onClick={(e) => e.stopPropagation()}
                >
                   {/* Header */}
                   <div className="px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
                      <div>
                         <h3 className="text-sm font-serif text-neutral-900">Añadir hallazgo</h3>
                         <p className="text-[11px] text-neutral-500 mt-0.5 font-sans">{selectedDiscrepancy.vendor}</p>
                      </div>
                      <button
                         onClick={() => {
                            setShowAddFindingModal(false);
                            setSelectedVendor(null);
                            setFindingTitle('');
                            setFindingDescription('');
                         }}
                         className="p-1.5 hover:bg-neutral-50 rounded-sm transition-colors text-neutral-400 hover:text-neutral-900"
                      >
                         <X className="w-4 h-4" />
                      </button>
                   </div>

                   {/* Form */}
                   <div className="px-5 py-4 space-y-4">
                      {/* Summary Info */}
                      <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-3">
                         <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                               <span className="text-neutral-500">Diferencia:</span>
                               <span className={`ml-2 font-mono font-semibold ${
                                  selectedDiscrepancy.status === 'material' ? 'text-[#8B5A50]' : 'text-neutral-900'
                               }`}>
                                  {selectedDiscrepancy.difference.toLocaleString('es-ES')} €
                               </span>
                            </div>
                            <div>
                               <span className="text-neutral-500">Facturas afectadas:</span>
                               <span className="ml-2 font-mono font-semibold text-neutral-900">
                                  {selectedDiscrepancy.invoices.length}
                               </span>
                            </div>
                         </div>
                      </div>

                      {/* Title */}
                      <div>
                         <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                            Título del hallazgo <span className="text-[#8B5A50]">*</span>
                         </label>
                         <input
                            type="text"
                            value={findingTitle}
                            onChange={(e) => setFindingTitle(e.target.value)}
                            placeholder="Ej: Diferencias en facturas no reflejadas al cierre"
                            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                         />
                      </div>

                      {/* Description */}
                      <div>
                         <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                            Descripción
                         </label>
                         <textarea
                            value={findingDescription}
                            onChange={(e) => setFindingDescription(e.target.value)}
                            placeholder="Describe el hallazgo en detalle..."
                            rows={4}
                            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 resize-none"
                         />
                         {!findingDescription && (
                            <p className="text-[10px] text-neutral-400 mt-1">
                               Si no se proporciona, se generará automáticamente basado en la discrepancia.
                            </p>
                         )}
                      </div>

                      {/* Priority */}
                      <div>
                         <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                            Prioridad
                         </label>
                         <div className="flex gap-2">
                            {(['low', 'medium', 'high'] as const).map((priority) => (
                               <button
                                  key={priority}
                                  onClick={() => setFindingPriority(priority)}
                                  className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors ${
                                     findingPriority === priority
                                        ? priority === 'high'
                                           ? 'bg-neutral-900 text-white border-neutral-900'
                                           : priority === 'medium'
                                           ? 'bg-neutral-100 text-neutral-700 border-neutral-300'
                                           : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                                  }`}
                               >
                                  {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}
                               </button>
                            ))}
                         </div>
                      </div>

                      {/* Affected Invoices Preview */}
                      <div>
                         <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                            Facturas afectadas ({selectedDiscrepancy.invoices.length})
                         </label>
                         <div className="border border-neutral-200 rounded-sm max-h-32 overflow-y-auto">
                            {selectedDiscrepancy.invoices.map((invoice) => (
                               <div key={invoice.id} className="px-3 py-2 border-b border-neutral-100 last:border-0 flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                     <FileText className="w-3 h-3 text-neutral-400" />
                                     <span className="font-mono text-neutral-900">{invoice.invoiceNumber}</span>
                                     {invoice.status === 'not_in_ledger' && (
                                        <span className="text-[9px] text-[#8B5A50] bg-[#FBF8F7] px-1.5 py-0.5 rounded border border-[#E8E0DE]">
                                           No registrada
                                        </span>
                                     )}
                                     {invoice.status === 'amount_mismatch' && (
                                        <span className="text-[9px] text-[#8B7355] bg-[#FDFAF6] px-1.5 py-0.5 rounded border border-[#EDE5D8]">
                                           Importe no coincide
                                        </span>
                                     )}
                                  </div>
                                  <span className="font-mono text-neutral-600">
                                     {invoice.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                                  </span>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Footer */}
                   <div className="px-5 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                      <div className="text-[11px] text-neutral-500 font-sans">
                         El hallazgo se creará con estado "Borrador"
                      </div>
                      <div className="flex gap-2">
                         <button
                            onClick={() => {
                               setShowAddFindingModal(false);
                               setSelectedVendor(null);
                               setFindingTitle('');
                               setFindingDescription('');
                            }}
                            className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 text-xs font-medium rounded-sm transition-colors"
                         >
                            Cancelar
                         </button>
                         <button
                            onClick={handleAddFinding}
                            disabled={!findingTitle.trim()}
                            className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-sm hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                         >
                            <Plus className="w-3 h-3" />
                            Crear hallazgo
                         </button>
                      </div>
                   </div>
                </motion.div>
             </motion.div>
          )}
       </AnimatePresence>

       {/* SAP Data Modal */}
       <AnimatePresence>
          {showSAPDataModal && selectedSAPInvoice && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                onClick={() => {
                   setShowSAPDataModal(false);
                   setSelectedSAPInvoice(null);
                }}
             >
                <motion.div
                   initial={{ scale: 0.98, opacity: 0, y: 10 }}
                   animate={{ scale: 1, opacity: 1, y: 0 }}
                   exit={{ scale: 0.98, opacity: 0, y: 10 }}
                   transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                   className="bg-white rounded-sm border border-neutral-200 shadow-2xl max-w-3xl w-full flex flex-col relative z-[101] max-h-[85vh] overflow-hidden"
                   onClick={(e) => e.stopPropagation()}
                >
                   {/* Header */}
                   <div className="px-5 py-3 border-b border-neutral-200 flex items-center justify-between bg-gradient-to-r from-[#1A4D8C] to-[#2E6DB4]">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-white" />
                         </div>
                         <div>
                            <h3 className="text-sm font-serif text-white">Datos desde SAP</h3>
                            <p className="text-[11px] text-white/70 mt-0.5 font-mono">{selectedSAPInvoice.invoiceNumber}</p>
                         </div>
                      </div>
                      <button
                         onClick={() => {
                            setShowSAPDataModal(false);
                            setSelectedSAPInvoice(null);
                         }}
                         className="p-1.5 hover:bg-white/10 rounded-sm transition-colors text-white/70 hover:text-white"
                      >
                         <X className="w-4 h-4" />
                      </button>
                   </div>

                   {/* Content */}
                   <div className="overflow-y-auto flex-1">
                      {/* Document Info */}
                      <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
                         <div className="grid grid-cols-4 gap-4">
                            <div>
                               <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-0.5">Nº Documento SAP</span>
                               <div className="text-sm font-mono text-neutral-900">{selectedSAPInvoice.sapData.documentNumber}</div>
                            </div>
                            <div>
                               <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-0.5">Tipo Doc.</span>
                               <div className="text-sm font-mono text-neutral-900">{selectedSAPInvoice.sapData.documentType}</div>
                            </div>
                            <div>
                               <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-0.5">Sociedad</span>
                               <div className="text-sm font-mono text-neutral-900">{selectedSAPInvoice.sapData.companyCode}</div>
                            </div>
                            <div>
                               <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-0.5">Año Fiscal</span>
                               <div className="text-sm font-mono text-neutral-900">{selectedSAPInvoice.sapData.fiscalYear}</div>
                            </div>
                         </div>
                      </div>

                      {/* Vendor & Amount */}
                      <div className="px-5 py-4 border-b border-neutral-100">
                         <div className="grid grid-cols-2 gap-6">
                            <div>
                               <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-2">Proveedor</span>
                               <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center">
                                     <Building2 className="w-4 h-4 text-neutral-500" />
                                  </div>
                                  <div>
                                     <div className="text-sm font-medium text-neutral-900">{selectedSAPInvoice.sapData.vendor}</div>
                                     <div className="text-[11px] text-neutral-500 font-mono">{selectedSAPInvoice.sapData.vendorCode}</div>
                                  </div>
                               </div>
                            </div>
                            <div>
                               <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-2">Importe</span>
                               <div className="text-2xl font-serif text-neutral-900 tabular-nums">
                                  {selectedSAPInvoice.sapData.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} <span className="text-sm text-neutral-500">{selectedSAPInvoice.sapData.currency}</span>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Dates & Payment */}
                      <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/30">
                         <div className="grid grid-cols-3 gap-4">
                            <div>
                               <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-0.5">Fecha Contable</span>
                               <div className="text-sm text-neutral-900">{new Date(selectedSAPInvoice.sapData.postingDate).toLocaleDateString('es-ES')}</div>
                            </div>
                            <div>
                               <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-0.5">Condición Pago</span>
                               <div className="text-sm font-mono text-neutral-900">{selectedSAPInvoice.sapData.paymentTerms}</div>
                            </div>
                            <div>
                               <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-0.5">Vencimiento</span>
                               <div className="text-sm text-neutral-900">{new Date(selectedSAPInvoice.sapData.paymentDueDate).toLocaleDateString('es-ES')}</div>
                            </div>
                         </div>
                      </div>

                      {/* Status */}
                      <div className="px-5 py-3 border-b border-neutral-100">
                         <div className="flex items-center justify-between">
                            <div>
                               <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-0.5">Estado</span>
                               <div className={`text-sm font-medium ${
                                  selectedSAPInvoice.sapData.status === 'Contabilizado' ? 'text-[#2E7D32]' : 
                                  selectedSAPInvoice.sapData.status === 'No encontrado en SAP' ? 'text-[#8B5A50]' : 'text-[#8B7355]'
                               }`}>
                                  {selectedSAPInvoice.sapData.status}
                               </div>
                            </div>
                            {selectedSAPInvoice.sapData.clearingDocument && (
                               <div className="text-right">
                                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-0.5">Doc. Compensación</span>
                                  <div className="text-sm font-mono text-neutral-900">{selectedSAPInvoice.sapData.clearingDocument}</div>
                               </div>
                            )}
                         </div>
                      </div>

                      {/* Line Items */}
                      <div className="px-5 py-4">
                         <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-3">Posiciones del documento</span>
                         <div className="border border-neutral-200 rounded-sm overflow-hidden">
                            <table className="w-full text-xs">
                               <thead className="bg-neutral-50 border-b border-neutral-200">
                                  <tr>
                                     <th className="px-3 py-2 text-left font-medium text-neutral-500">Pos.</th>
                                     <th className="px-3 py-2 text-left font-medium text-neutral-500">Cuenta</th>
                                     <th className="px-3 py-2 text-left font-medium text-neutral-500">Descripción</th>
                                     <th className="px-3 py-2 text-right font-medium text-neutral-500">Debe</th>
                                     <th className="px-3 py-2 text-right font-medium text-neutral-500">Haber</th>
                                     <th className="px-3 py-2 text-left font-medium text-neutral-500">CeCo</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-neutral-100">
                                  {selectedSAPInvoice.sapData.lineItems.map((item) => (
                                     <tr key={item.item} className="hover:bg-neutral-50/50">
                                        <td className="px-3 py-2 font-mono text-neutral-600">{item.item}</td>
                                        <td className="px-3 py-2 font-mono text-neutral-900">{item.glAccount}</td>
                                        <td className="px-3 py-2 text-neutral-700 max-w-[200px] truncate">{item.description}</td>
                                        <td className="px-3 py-2 text-right font-mono text-neutral-900 tabular-nums">
                                           {item.debit > 0 ? item.debit.toLocaleString('es-ES', { minimumFractionDigits: 2 }) : '-'}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono text-neutral-900 tabular-nums">
                                           {item.credit > 0 ? item.credit.toLocaleString('es-ES', { minimumFractionDigits: 2 }) : '-'}
                                        </td>
                                        <td className="px-3 py-2 font-mono text-neutral-600">{item.costCenter || '-'}</td>
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>
                      </div>
                   </div>

                   {/* Footer */}
                   <div className="px-5 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                         <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                         Datos sincronizados desde SAP
                      </div>
                      <div className="flex gap-2">
                         <button
                            onClick={() => {
                               setShowSAPDataModal(false);
                               setSelectedSAPInvoice(null);
                            }}
                            className="px-4 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 text-xs font-medium rounded-sm transition-colors"
                         >
                            Cerrar
                         </button>
                      </div>
                   </div>
                </motion.div>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};

