import React, { useState } from 'react';
import { ChevronLeft, ClipboardCheck, Play, Download, CheckCircle, AlertTriangle, FileCheck, Loader2, X, FileText, Calendar, Euro } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EngagementTesterProps {
  onBack: () => void;
}

export const EngagementTester: React.FC<EngagementTesterProps> = ({ onBack }) => {
  const [testerParams, setTesterParams] = useState({
    sampleSize: 30,
    focusHighRisk: true,
    minAmount: 0,
    maxAmount: 1000000,
  });

  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [invoiceStatuses, setInvoiceStatuses] = useState<{[key: string]: string}>({
    'F-2025-001': 'pending',
    'F-2025-002': 'pending',
    'F-2025-003': 'reviewed',
    'F-2025-004': 'doubt',
    'F-2025-005': 'missing_doc',
  });

  const sample = [
    { invoice: 'F-2025-001', vendor: 'Tech Solutions SL', date: '2025-01-12', amount: 1250.00, description: 'Servicios cloud mensual', risk: 'low' },
    { invoice: 'F-2025-002', vendor: 'Limpiezas Generales SA', date: '2025-01-14', amount: 850.50, description: 'Limpieza oficinas Enero', risk: 'low' },
    { invoice: 'F-2025-003', vendor: 'Office Supplies Co', date: '2025-01-15', amount: 234.00, description: 'Material de oficina', risk: 'low' },
    { invoice: 'F-2025-004', vendor: 'Seguridad Integral SL', date: '2025-01-16', amount: 3200.00, description: 'Servicios seguridad mensual', risk: 'medium' },
    { invoice: 'F-2025-005', vendor: 'Mantenimiento Técnico SA', date: '2025-01-17', amount: 1850.75, description: 'Mantenimiento preventivo', risk: 'low' },
  ];

  const updateInvoiceStatus = (invoice: string, status: string) => {
    setInvoiceStatuses(prev => ({ ...prev, [invoice]: status }));
    setSelectedInvoice(null);
  };

  const reviewedCount = Object.values(invoiceStatuses).filter(s => s !== 'pending').length;
  const pendingCount = sample.length - reviewedCount;

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
                <ClipboardCheck className="w-5 h-5 text-stone-600" />
             </div>
             <div>
                <h2 className="text-2xl font-serif text-stone-900">Muestreo Proveedores</h2>
                <span className="text-xs text-stone-400 font-mono">Tester</span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden min-h-0">
          {/* Left Column: Parameters & Table */}
          <div className="col-span-8 flex flex-col gap-6 overflow-y-auto pr-2">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-px bg-stone-200 border border-stone-200 rounded-sm overflow-hidden">
                  <div className="bg-white p-4">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block mb-1">Muestra</span>
                      <div className="text-2xl font-serif text-stone-900 tabular-nums">{sample.length}</div>
                      <span className="text-[10px] text-stone-500">facturas</span>
                  </div>
                  <div className="bg-white p-4">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block mb-1">Revisadas</span>
                      <div className="text-2xl font-serif text-emerald-600 tabular-nums">{reviewedCount}</div>
                      <span className="text-[10px] text-stone-500">{Math.round(reviewedCount/sample.length*100)}% completado</span>
                  </div>
                  <div className="bg-white p-4">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block mb-1">Pendientes</span>
                      <div className="text-2xl font-serif text-amber-600 tabular-nums">{pendingCount}</div>
                      <span className="text-[10px] text-stone-500">por revisar</span>
                  </div>
              </div>

              {/* Parameters Panel */}
              <div className="bg-stone-50 border border-stone-200 rounded-sm p-6">
                  <h3 className="text-sm font-serif text-stone-900 mb-4">Parámetros de muestreo</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium text-stone-500 block mb-2 uppercase tracking-wider">Número de ítems</label>
                        <input
                          type="number"
                          value={testerParams.sampleSize}
                          onChange={(e) => setTesterParams({ ...testerParams, sampleSize: parseInt(e.target.value) })}
                          className="w-full bg-white border border-stone-200 rounded-sm px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-400 font-mono"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-stone-500 block mb-2 uppercase tracking-wider flex items-center gap-2">
                          <input
                             type="checkbox"
                             checked={testerParams.focusHighRisk}
                             onChange={(e) => setTesterParams({ ...testerParams, focusHighRisk: e.target.checked })}
                             className="rounded border-stone-300"
                          />
                          Foco en proveedores de riesgo alto
                        </label>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-stone-500 block mb-2 uppercase tracking-wider">Importe mínimo (€)</label>
                        <input
                          type="number"
                          value={testerParams.minAmount}
                          onChange={(e) => setTesterParams({ ...testerParams, minAmount: parseInt(e.target.value) })}
                          className="w-full bg-white border border-stone-200 rounded-sm px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-400 font-mono"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-stone-500 block mb-2 uppercase tracking-wider">Importe máximo (€)</label>
                        <input
                          type="number"
                          value={testerParams.maxAmount}
                          onChange={(e) => setTesterParams({ ...testerParams, maxAmount: parseInt(e.target.value) })}
                          className="w-full bg-white border border-stone-200 rounded-sm px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-400 font-mono"
                        />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded-sm hover:bg-black transition-colors flex items-center gap-2">
                        <Play className="w-3.5 h-3.5" />
                        Generar muestra
                    </button>
                  </div>
              </div>

              {/* Sample Table */}
              <div className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm flex-1">
                  <div className="px-4 py-3 border-b border-stone-200 bg-stone-50 flex justify-between items-center sticky top-0">
                    <h3 className="text-xs font-medium font-serif text-stone-900">Facturas seleccionadas para revisión</h3>
                    <div className="flex gap-2">
                        <button className="p-1.5 text-stone-400 hover:text-stone-900 border border-transparent hover:border-stone-200 rounded">
                          <Download className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 text-[10px] text-stone-500 font-sans uppercase tracking-wider border-b border-stone-200 sticky top-[45px]">
                        <tr>
                          <th className="px-4 py-2 font-medium">Nº Factura</th>
                          <th className="px-4 py-2 font-medium">Proveedor</th>
                          <th className="px-4 py-2 font-medium">Fecha</th>
                          <th className="px-4 py-2 font-medium text-right">Importe</th>
                          <th className="px-4 py-2 font-medium text-center">Estado</th>
                          <th className="px-4 py-2 font-medium text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {sample.map((item, i) => {
                            const status = invoiceStatuses[item.invoice] || 'pending';
                            return (
                                <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="px-4 py-2.5">
                                        <span className="font-mono text-xs text-stone-900">{item.invoice}</span>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <div className="text-xs text-stone-900">{item.vendor}</div>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <span className="text-xs font-mono text-stone-500">{item.date}</span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <span className="font-mono text-xs tabular-nums text-stone-900">
                                            {item.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                        {status === 'pending' ? (
                                            <span className="text-[10px] text-stone-400">Pendiente</span>
                                        ) : status === 'reviewed' ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                                <CheckCircle className="w-3 h-3" />
                                                Revisado
                                            </span>
                                        ) : status === 'doubt' ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                                <AlertTriangle className="w-3 h-3" />
                                                Duda
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                                                <FileCheck className="w-3 h-3" />
                                                Falta doc.
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <button 
                                            onClick={() => setSelectedInvoice(i)}
                                            className="px-3 py-1.5 border border-stone-200 rounded-sm text-[10px] font-medium hover:bg-stone-50 transition-colors uppercase tracking-wide"
                                        >
                                            Revisar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                  </table>
              </div>
          </div>

          {/* Right Column: Invoice Detail Panel */}
          <div className="col-span-4 bg-stone-50 border border-stone-200 rounded-sm p-6 overflow-y-auto">
              <AnimatePresence>
                  {selectedInvoice !== null ? (
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="bg-white rounded-sm p-6 shadow-sm border border-stone-200"
                      >
                          <div className="flex justify-between items-start mb-6">
                              <h4 className="text-sm font-serif text-stone-900">Revisión de factura</h4>
                              <button 
                                  onClick={() => setSelectedInvoice(null)}
                                  className="p-1 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
                              >
                                  <X className="w-4 h-4" />
                              </button>
                          </div>

                          {sample[selectedInvoice] && (
                              <>
                                  <div className="space-y-4 mb-6">
                                      <div>
                                          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block mb-1">Número de factura</span>
                                          <p className="text-sm font-mono text-stone-900">{sample[selectedInvoice].invoice}</p>
                                      </div>
                                      <div>
                                          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block mb-1">Proveedor</span>
                                          <p className="text-sm text-stone-900">{sample[selectedInvoice].vendor}</p>
                                      </div>
                                      <div>
                                          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block mb-1">Fecha</span>
                                          <p className="text-sm font-mono text-stone-900">{sample[selectedInvoice].date}</p>
                                      </div>
                                      <div>
                                          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block mb-1">Descripción</span>
                                          <p className="text-sm text-stone-500">{sample[selectedInvoice].description}</p>
                                      </div>
                                      <div className="pt-4 border-t border-stone-200">
                                          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block mb-1">Importe</span>
                                          <p className="text-2xl font-serif text-stone-900 tabular-nums">{sample[selectedInvoice].amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</p>
                                      </div>
                                  </div>

                                  <div className="space-y-2">
                                      <span className="text-xs font-medium text-stone-700 block mb-2">Marcar como:</span>
                                      <button
                                          onClick={() => updateInvoiceStatus(sample[selectedInvoice].invoice, 'reviewed')}
                                          className="w-full px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-sm hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                                      >
                                          <CheckCircle className="w-4 h-4" />
                                          Revisado (OK)
                                      </button>
                                      <button
                                          onClick={() => updateInvoiceStatus(sample[selectedInvoice].invoice, 'doubt')}
                                          className="w-full px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium rounded-sm hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
                                      >
                                          <AlertTriangle className="w-4 h-4" />
                                          Duda / Requiere aclaración
                                      </button>
                                      <button
                                          onClick={() => updateInvoiceStatus(sample[selectedInvoice].invoice, 'missing_doc')}
                                          className="w-full px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-sm hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                                      >
                                          <FileCheck className="w-4 h-4" />
                                          Falta documentación
                                      </button>
                                  </div>
                              </>
                          )}
                      </motion.div>
                  ) : (
                      <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                          <p className="text-xs text-stone-400">Selecciona una factura para revisar</p>
                      </div>
                  )}
              </AnimatePresence>
          </div>
       </div>
    </div>
  );
};

