import React from 'react';
import { ChevronLeft, MapPin, AlertCircle, Filter, Download, Info } from 'lucide-react';

interface EngagementRiskMapperProps {
  onBack: () => void;
}

export const EngagementRiskMapper: React.FC<EngagementRiskMapperProps> = ({ onBack }) => {
  // Data aligned with the 40 vendors in the Proveedores area
  const vendors = [
    // High Risk (7) - Balance > Materialidad o discrepancias significativas
    { name: 'Equipamiento Industrial SA', balance: 1250000, risk: 'high', discrepancies: 2 },
    { name: 'Servicios Logísticos Global', balance: 980000, risk: 'high', discrepancies: 1 },
    { name: 'Logística Norte S.L.', balance: 497500, risk: 'high', discrepancies: 3 },
    { name: 'Servicios Centrales SA', balance: 334500, risk: 'high', discrepancies: 1 },
    { name: 'Transportes Peninsulares', balance: 425000, risk: 'high', discrepancies: 2 },
    { name: 'Suministros Técnicos SL', balance: 312000, risk: 'high', discrepancies: 1 },
    { name: 'Materiales Premium SA', balance: 287000, risk: 'high', discrepancies: 0 },
    
    // Medium Risk (12) - Balance moderado o proveedores nuevos
    { name: 'Construcciones Modernas SL', balance: 126800, risk: 'medium', discrepancies: 1 },
    { name: 'Marketing Digital Pro', balance: 92200, risk: 'medium', discrepancies: 1 },
    { name: 'Tech Solutions SL', balance: 125000, risk: 'medium', discrepancies: 0 },
    { name: 'Mantenimiento Integral SA', balance: 78000, risk: 'medium', discrepancies: 0 },
    { name: 'Energía Solar Plus', balance: 156000, risk: 'medium', discrepancies: 0 },
    { name: 'Comunicaciones Globales', balance: 89000, risk: 'medium', discrepancies: 0 },
    { name: 'Servicios Cloud SL', balance: 67500, risk: 'medium', discrepancies: 0 },
    { name: 'Formación Empresarial', balance: 45000, risk: 'medium', discrepancies: 0 },
    { name: 'Seguridad Integral', balance: 98000, risk: 'medium', discrepancies: 0 },
    { name: 'Asesoría Legal Partners', balance: 134000, risk: 'medium', discrepancies: 0 },
    { name: 'Consultoría Estratégica', balance: 87000, risk: 'medium', discrepancies: 0 },
    { name: 'Mobiliario Oficina Pro', balance: 52000, risk: 'medium', discrepancies: 0 },
    
    // Low Risk (21) - Balance bajo, sin discrepancias
    { name: 'Consulting Group LTD', balance: 4500, risk: 'low', discrepancies: 0 },
    { name: 'Papelería Express', balance: 2800, risk: 'low', discrepancies: 0 },
    { name: 'Limpieza Industrial', balance: 12500, risk: 'low', discrepancies: 0 },
    { name: 'Mensajería Rápida SL', balance: 8900, risk: 'low', discrepancies: 0 },
    { name: 'Catering Eventos', balance: 6700, risk: 'low', discrepancies: 0 },
    { name: 'Floristería Garden', balance: 1200, risk: 'low', discrepancies: 0 },
    { name: 'Servicios Informáticos', balance: 15600, risk: 'low', discrepancies: 0 },
    { name: 'Renting Vehículos', balance: 28000, risk: 'low', discrepancies: 0 },
    { name: 'Agua y Bebidas SL', balance: 3400, risk: 'low', discrepancies: 0 },
    { name: 'Material Oficina Plus', balance: 5600, risk: 'low', discrepancies: 0 },
    { name: 'Telefonía Empresas', balance: 18900, risk: 'low', discrepancies: 0 },
    { name: 'Seguros Generales SA', balance: 34000, risk: 'low', discrepancies: 0 },
    { name: 'Gestión Documental', balance: 7800, risk: 'low', discrepancies: 0 },
    { name: 'Publicidad Local', balance: 4200, risk: 'low', discrepancies: 0 },
    { name: 'Ferretería Industrial', balance: 9100, risk: 'low', discrepancies: 0 },
    { name: 'Hosting Web Services', balance: 2400, risk: 'low', discrepancies: 0 },
    { name: 'Transporte Mercancías', balance: 11200, risk: 'low', discrepancies: 0 },
    { name: 'Servicios Auxiliares', balance: 6800, risk: 'low', discrepancies: 0 },
    { name: 'Equipos Informáticos', balance: 19500, risk: 'low', discrepancies: 0 },
    { name: 'Reciclaje Empresarial', balance: 3200, risk: 'low', discrepancies: 0 },
    { name: 'Viajes Corporativos', balance: 14800, risk: 'low', discrepancies: 0 },
  ];

  const highRiskCount = vendors.filter(v => v.risk === 'high').length;
  const mediumRiskCount = vendors.filter(v => v.risk === 'medium').length;
  const lowRiskCount = vendors.filter(v => v.risk === 'low').length;
  const totalVendors = vendors.length;
  
  // Color palette aligned with the platform's warm, sober design system
  const colors = {
    high: { main: '#8B5A50', bg: '#FBF8F7', border: '#E8E0DE', text: '#8B5A50' },
    medium: { main: '#8B7355', bg: '#FDFAF6', border: '#EDE5D8', text: '#8B7355' },
    low: { main: '#4A5D4A', bg: '#F7F9F7', border: '#E0E5E0', text: '#4A5D4A' }
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
             <div className="w-10 h-10 rounded-full bg-[#F7F9F7] border border-[#E0E5E0] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#4A5D4A]" />
             </div>
             <div>
                <h2 className="text-2xl font-serif text-neutral-900">Mapa de riesgos de Proveedores</h2>
                <span className="text-xs text-neutral-400 font-mono">RiskMapper · Ejecutado automáticamente 15/03 09:20</span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-3 gap-6">
          {/* Risk Distribution Panel */}
          <div className="col-span-2 bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-serif text-neutral-900">Distribución de Riesgos</h3>
                  <span className="text-xs text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">{totalVendors} proveedores</span>
              </div>

              {/* Donut Chart Visualization */}
              <div className="flex items-center gap-8 mb-8">
                  <div className="relative w-40 h-40">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          {/* Background circle */}
                          <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#f5f5f5"
                              strokeWidth="16"
                          />
                          {/* High Risk Arc */}
                          <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={colors.high.main}
                              strokeWidth="16"
                              strokeDasharray={`${(highRiskCount/totalVendors)*251.2} 251.2`}
                              strokeDashoffset="0"
                              className="transition-all duration-700"
                          />
                          {/* Medium Risk Arc */}
                          <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={colors.medium.main}
                              strokeWidth="16"
                              strokeDasharray={`${(mediumRiskCount/totalVendors)*251.2} 251.2`}
                              strokeDashoffset={`${-(highRiskCount/totalVendors)*251.2}`}
                              className="transition-all duration-700"
                          />
                          {/* Low Risk Arc */}
                          <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={colors.low.main}
                              strokeWidth="16"
                              strokeDasharray={`${(lowRiskCount/totalVendors)*251.2} 251.2`}
                              strokeDashoffset={`${-((highRiskCount+mediumRiskCount)/totalVendors)*251.2}`}
                              className="transition-all duration-700"
                          />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-neutral-900">{totalVendors}</span>
                          <span className="text-xs text-neutral-500">Total</span>
                      </div>
                  </div>

                  {/* Legend */}
                  <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: colors.high.bg, borderColor: colors.high.border }}>
                          <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.high.main }}></div>
                              <span className="text-sm font-medium" style={{ color: colors.high.text }}>Riesgo Alto</span>
                          </div>
                          <div className="text-right">
                              <span className="text-lg font-bold" style={{ color: colors.high.text }}>{highRiskCount}</span>
                              <span className="text-xs ml-1 opacity-70" style={{ color: colors.high.text }}>({Math.round(highRiskCount/totalVendors*100)}%)</span>
                          </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: colors.medium.bg, borderColor: colors.medium.border }}>
                          <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.medium.main }}></div>
                              <span className="text-sm font-medium" style={{ color: colors.medium.text }}>Riesgo Medio</span>
                          </div>
                          <div className="text-right">
                              <span className="text-lg font-bold" style={{ color: colors.medium.text }}>{mediumRiskCount}</span>
                              <span className="text-xs ml-1 opacity-70" style={{ color: colors.medium.text }}>({Math.round(mediumRiskCount/totalVendors*100)}%)</span>
                          </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: colors.low.bg, borderColor: colors.low.border }}>
                          <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.low.main }}></div>
                              <span className="text-sm font-medium" style={{ color: colors.low.text }}>Riesgo Bajo</span>
                          </div>
                          <div className="text-right">
                              <span className="text-lg font-bold" style={{ color: colors.low.text }}>{lowRiskCount}</span>
                              <span className="text-xs ml-1 opacity-70" style={{ color: colors.low.text }}>({Math.round(lowRiskCount/totalVendors*100)}%)</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4 pt-6 border-t border-neutral-100">
                  <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-4">Desglose por categoría</p>
                  
                  {/* High Risk Bar */}
                  <div>
                      <div className="flex justify-between text-xs mb-2">
                          <span className="font-medium" style={{ color: colors.high.text }}>Alto</span>
                          <span className="font-mono text-neutral-500">{highRiskCount} proveedores</span>
                      </div>
                      <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                              style={{ width: `${(highRiskCount/totalVendors)*100}%`, backgroundColor: colors.high.main }} 
                              className="h-full rounded-full transition-all duration-500"
                          ></div>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1.5">Requieren revisión detallada y circularización prioritaria.</p>
                  </div>

                  {/* Medium Risk Bar */}
                  <div>
                      <div className="flex justify-between text-xs mb-2">
                          <span className="font-medium" style={{ color: colors.medium.text }}>Medio</span>
                          <span className="font-mono text-neutral-500">{mediumRiskCount} proveedores</span>
                      </div>
                      <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                              style={{ width: `${(mediumRiskCount/totalVendors)*100}%`, backgroundColor: colors.medium.main }} 
                              className="h-full rounded-full transition-all duration-500"
                          ></div>
                      </div>
                  </div>

                  {/* Low Risk Bar */}
                  <div>
                      <div className="flex justify-between text-xs mb-2">
                          <span className="font-medium" style={{ color: colors.low.text }}>Bajo</span>
                          <span className="font-mono text-neutral-500">{lowRiskCount} proveedores</span>
                      </div>
                      <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                              style={{ width: `${(lowRiskCount/totalVendors)*100}%`, backgroundColor: colors.low.main }} 
                              className="h-full rounded-full transition-all duration-500"
                          ></div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Info Card */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                 <Info className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-sm font-medium text-neutral-900 mb-1">Criterios de clasificación</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                       El agente RiskMapper evalúa múltiples factores para determinar el nivel de riesgo:
                    </p>
                 </div>
              </div>
              <ul className="space-y-3">
                  <li className="flex items-center gap-2.5 text-xs text-neutral-600">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.high.main }}></div>
                      <span>Importe &gt; Materialidad</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-neutral-600">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.high.main }}></div>
                      <span>Existencia de desajustes previos</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-neutral-600">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.medium.main }}></div>
                      <span>Volumen atípico de abonos</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-neutral-600">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.medium.main }}></div>
                      <span>Proveedores de nueva creación</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-neutral-600">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.low.main }}></div>
                      <span>Sin factores de riesgo identificados</span>
                  </li>
              </ul>
          </div>
       </div>

       {/* Vendors Table */}
       <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
             <h3 className="text-sm font-serif text-neutral-900">Clasificación de proveedores</h3>
             <div className="flex items-center gap-4">
                <span className="text-xs text-neutral-500">Mostrando {vendors.length} de {totalVendors}</span>
                <div className="flex gap-2">
                   <button className="p-1.5 text-neutral-400 hover:text-neutral-900 border border-transparent hover:border-neutral-200 rounded">
                      <Filter className="w-4 h-4" />
                   </button>
                   <button className="p-1.5 text-neutral-400 hover:text-neutral-900 border border-transparent hover:border-neutral-200 rounded">
                      <Download className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
             <table className="w-full text-left">
                <thead className="bg-neutral-50 text-[10px] text-neutral-500 font-sans uppercase tracking-wider border-b border-neutral-200 sticky top-0">
                   <tr>
                      <th className="px-6 py-3 font-medium">Proveedor</th>
                      <th className="px-6 py-3 font-medium text-right">Saldo</th>
                      <th className="px-6 py-3 font-medium text-center">Riesgo</th>
                      <th className="px-6 py-3 font-medium text-center">Desajustes</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                   {vendors.map((vendor, i) => {
                      const riskColor = vendor.risk === 'high' ? colors.high : vendor.risk === 'medium' ? colors.medium : colors.low;
                      return (
                         <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="px-6 py-3">
                               <div className="font-medium text-sm text-neutral-900">{vendor.name}</div>
                            </td>
                            <td className="px-6 py-3 text-right">
                               <span className="font-mono text-sm tabular-nums text-neutral-900">
                                  {vendor.balance.toLocaleString('es-ES')} €
                               </span>
                            </td>
                            <td className="px-6 py-3 text-center">
                               <span 
                                  className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded border"
                                  style={{ 
                                     color: riskColor.text, 
                                     backgroundColor: riskColor.bg, 
                                     borderColor: riskColor.border 
                                  }}
                               >
                                  {vendor.risk === 'high' ? 'Alto' : vendor.risk === 'medium' ? 'Medio' : 'Bajo'}
                               </span>
                            </td>
                            <td className="px-6 py-3 text-center">
                               {vendor.discrepancies > 0 ? (
                                  <span 
                                     className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-semibold rounded-full border"
                                     style={{ 
                                        color: colors.high.text, 
                                        backgroundColor: colors.high.bg, 
                                        borderColor: colors.high.border 
                                     }}
                                  >
                                     {vendor.discrepancies}
                                  </span>
                               ) : (
                                  <span className="text-xs text-neutral-400 font-mono">—</span>
                               )}
                            </td>
                         </tr>
                      );
                   })}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

