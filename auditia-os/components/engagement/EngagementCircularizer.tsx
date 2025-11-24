import React, { useState } from 'react';
import { ChevronLeft, Mail, FileText, ArrowRight, CheckCircle2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface EngagementCircularizerProps {
  onBack: () => void;
}

export const EngagementCircularizer: React.FC<EngagementCircularizerProps> = ({ onBack }) => {
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [circularizerTemplate, setCircularizerTemplate] = useState('standard');
  const [circularizerDeadline, setCircularizerDeadline] = useState('2025-03-30');
  const [showPreview, setShowPreview] = useState(false);

  const vendors = [
    { id: 'v1', name: 'Equipamiento Industrial SA', balance: 1250000, risk: 'high', selected: false, address: 'Pol. Ind. Norte, Calle A, 12', contact: 'Juan Pérez' },
    { id: 'v2', name: 'Servicios Logísticos Global', balance: 980000, risk: 'high', selected: false, address: 'Avda. Transporte 45', contact: 'María García' },
    { id: 'v3', name: 'Construcciones Modernas SL', balance: 45000, risk: 'medium', selected: false, address: 'C/ Arquitectura 8', contact: 'Pedro López' },
    { id: 'v4', name: 'Consulting Group LTD', balance: 4500, risk: 'low', selected: false, address: 'Plaza Negocios 1', contact: 'Ana Martínez' },
  ];

  const circularizationStatus = [
    { vendor: 'Equipamiento Industrial SA', status: 'pending', sentDate: null, responseDate: null },
    { vendor: 'Servicios Logísticos Global', status: 'sent', sentDate: '15/03/2025', responseDate: null },
    { vendor: 'Construcciones Modernas SL', status: 'responded', sentDate: '10/03/2025', responseDate: '18/03/2025' },
  ];

  const toggleVendor = (id: string) => {
    if (selectedVendors.includes(id)) {
      setSelectedVendors(selectedVendors.filter(v => v !== id));
    } else {
      setSelectedVendors([...selectedVendors, id]);
    }
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
                        <button className="px-3 py-1.5 bg-stone-900 text-white text-[10px] font-medium rounded-sm hover:bg-black transition-colors flex items-center gap-1.5">
                            <Mail className="w-3 h-3" />
                            Generar y enviar
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
                                    onChange={() => {}} // Handled by row click
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

                  <div className="mt-20 pt-8 border-t border-stone-200">
                      <p className="text-[10px] text-stone-400 text-center">Generado automáticamente por Circularizer Agent</p>
                  </div>
              </motion.div>
          </div>
       </div>
    </div>
  );
};

