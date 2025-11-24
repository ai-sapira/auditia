import React from 'react';
import { ChevronLeft, MapPin, AlertCircle, Filter, Download, Info } from 'lucide-react';

interface EngagementRiskMapperProps {
  onBack: () => void;
}

export const EngagementRiskMapper: React.FC<EngagementRiskMapperProps> = ({ onBack }) => {
  const vendors = [
    { name: 'Equipamiento Industrial SA', balance: 1250000, risk: 'high', discrepancies: 2 },
    { name: 'Servicios Logísticos Global', balance: 980000, risk: 'high', discrepancies: 1 },
    { name: 'Construcciones Modernas SL', balance: 45000, risk: 'medium', discrepancies: 0 },
    { name: 'Consulting Group LTD', balance: 4500, risk: 'low', discrepancies: 0 },
    { name: 'Tech Solutions SL', balance: 1250, risk: 'low', discrepancies: 0 },
  ];

  const highRiskCount = vendors.filter(v => v.risk === 'high').length;
  const mediumRiskCount = vendors.filter(v => v.risk === 'medium').length;
  const lowRiskCount = vendors.filter(v => v.risk === 'low').length;
  const totalVendors = vendors.length;

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header */}
       <div className="flex items-center gap-4 pb-6 border-b border-stone-200">
          <button
             onClick={onBack}
             className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-colors"
          >
             <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-700" />
             </div>
             <div>
                <h2 className="text-2xl font-serif text-stone-900">Mapa de riesgos de Proveedores</h2>
                <span className="text-xs text-stone-400 font-mono">RiskMapper · Ejecutado automáticamente 15/03 09:20</span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-3 gap-6">
          {/* Risk Distribution Panel */}
          <div className="col-span-2 bg-stone-50 border border-stone-200 rounded-sm p-6">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-serif text-stone-900">Distribución de Riesgos</h3>
                  <span className="text-xs text-stone-500">{totalVendors} proveedores analizados</span>
              </div>

              <div className="space-y-6">
                  {/* High Risk Bar */}
                  <div>
                      <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-medium text-rose-700">Riesgo Alto</span>
                          <span className="font-mono text-stone-500">{highRiskCount} ({Math.round(highRiskCount/totalVendors*100)}%)</span>
                      </div>
                      <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                          <div style={{ width: `${(highRiskCount/totalVendors)*100}%` }} className="h-full bg-rose-500 rounded-full"></div>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-1">Requieren revisión detallada y circularización prioritaria.</p>
                  </div>

                  {/* Medium Risk Bar */}
                  <div>
                      <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-medium text-amber-700">Riesgo Medio</span>
                          <span className="font-mono text-stone-500">{mediumRiskCount} ({Math.round(mediumRiskCount/totalVendors*100)}%)</span>
                      </div>
                      <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                          <div style={{ width: `${(mediumRiskCount/totalVendors)*100}%` }} className="h-full bg-amber-500 rounded-full"></div>
                      </div>
                  </div>

                  {/* Low Risk Bar */}
                  <div>
                      <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-medium text-emerald-700">Riesgo Bajo</span>
                          <span className="font-mono text-stone-500">{lowRiskCount} ({Math.round(lowRiskCount/totalVendors*100)}%)</span>
                      </div>
                      <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                          <div style={{ width: `${(lowRiskCount/totalVendors)*100}%` }} className="h-full bg-emerald-500 rounded-full"></div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Info Card */}
          <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                 <Info className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-sm font-medium text-stone-900 mb-1">Criterios de clasificación</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                       El agente RiskMapper evalúa múltiples factores para determinar el nivel de riesgo:
                    </p>
                 </div>
              </div>
              <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-xs text-stone-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                      <span>Importe &gt; Materialidad</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-stone-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                      <span>Existencia de desajustes previos</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-stone-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                      <span>Volumen atípico de abonos</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-stone-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                      <span>Proveedores de nueva creación</span>
                  </li>
              </ul>
          </div>
       </div>

       {/* Vendors Table */}
       <div className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
             <h3 className="text-sm font-serif text-stone-900">Clasificación de proveedores</h3>
             <div className="flex gap-2">
                <button className="p-1.5 text-stone-400 hover:text-stone-900 border border-transparent hover:border-stone-200 rounded">
                   <Filter className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-stone-400 hover:text-stone-900 border border-transparent hover:border-stone-200 rounded">
                   <Download className="w-4 h-4" />
                </button>
             </div>
          </div>
          <table className="w-full text-left">
             <thead className="bg-stone-50 text-[10px] text-stone-500 font-sans uppercase tracking-wider border-b border-stone-200">
                <tr>
                   <th className="px-6 py-3 font-medium">Proveedor</th>
                   <th className="px-6 py-3 font-medium text-right">Saldo</th>
                   <th className="px-6 py-3 font-medium text-center">Riesgo</th>
                   <th className="px-6 py-3 font-medium text-center">Desajustes</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-stone-100">
                {vendors.map((vendor, i) => (
                   <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4">
                         <div className="font-medium text-sm text-stone-900">{vendor.name}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <span className="font-mono text-sm tabular-nums text-stone-900">
                            {vendor.balance.toLocaleString('es-ES')} €
                         </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border ${
                            vendor.risk === 'high' 
                               ? 'text-rose-700 bg-rose-50 border-rose-100'
                               : vendor.risk === 'medium'
                               ? 'text-amber-700 bg-amber-50 border-amber-100'
                               : 'text-emerald-700 bg-emerald-50 border-emerald-100'
                         }`}>
                            {vendor.risk === 'high' ? 'Alto' : vendor.risk === 'medium' ? 'Medio' : 'Bajo'}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className="text-xs text-stone-600 font-mono">{vendor.discrepancies}</span>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};

