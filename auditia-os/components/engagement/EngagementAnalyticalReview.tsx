import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, BarChart3, TrendingUp, TrendingDown, Play, FileText, Sparkles, Loader2, CheckCircle, AlertTriangle, ArrowRight, Download, Send, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EngagementAnalyticalReviewProps {
  onBack: () => void;
}

interface ComparisonData {
  category: string;
  currentYear: number;
  previousYear: number;
  variation: number;
  variationPercent: number;
  isSignificant: boolean;
}

export const EngagementAnalyticalReview: React.FC<EngagementAnalyticalReviewProps> = ({ onBack }) => {
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Mock comparison data
  const comparisonData: ComparisonData[] = [
    { category: 'Proveedores nacionales', currentYear: 12500000, previousYear: 11800000, variation: 700000, variationPercent: 5.93, isSignificant: false },
    { category: 'Proveedores extranjeros', currentYear: 3200000, previousYear: 2100000, variation: 1100000, variationPercent: 52.38, isSignificant: true },
    { category: 'Proveedores grupo', currentYear: 890000, previousYear: 920000, variation: -30000, variationPercent: -3.26, isSignificant: false },
    { category: 'Acreedores varios', currentYear: 450000, previousYear: 380000, variation: 70000, variationPercent: 18.42, isSignificant: true },
    { category: 'Efectos comerciales a pagar', currentYear: 1850000, previousYear: 2100000, variation: -250000, variationPercent: -11.90, isSignificant: true },
  ];

  const totalCurrent = comparisonData.reduce((sum, d) => sum + d.currentYear, 0);
  const totalPrevious = comparisonData.reduce((sum, d) => sum + d.previousYear, 0);
  const totalVariation = totalCurrent - totalPrevious;
  const totalVariationPercent = ((totalVariation / totalPrevious) * 100).toFixed(2);

  // The report text that will be "typed out" by the AI
  const fullReportText = `## Análisis Comparativo de Proveedores 2024 vs 2023

### Resumen Ejecutivo

El análisis comparativo del saldo de proveedores muestra un **incremento neto del ${totalVariationPercent}%** respecto al ejercicio anterior, pasando de €${(totalPrevious/1000000).toFixed(2)}M a €${(totalCurrent/1000000).toFixed(2)}M.

### Variaciones Significativas Identificadas

**1. Proveedores Extranjeros (+52.38%)**
Se observa un incremento significativo de €1.1M en el saldo de proveedores extranjeros. Esta variación requiere una investigación adicional para determinar:
- Si corresponde a nuevas líneas de negocio o proveedores
- Impacto de tipos de cambio
- Verificación de condiciones de pago y cut-off

**Recomendación:** Solicitar al cliente detalle de las operaciones con nuevos proveedores extranjeros y analizar impacto cambiario.

**2. Efectos Comerciales a Pagar (-11.90%)**
La disminución en efectos comerciales por €250K sugiere:
- Cambio en la política de financiación de proveedores
- Posible reclasificación de deuda

**Recomendación:** Verificar si existe cambio de política de pago o reclasificación contable.

**3. Acreedores Varios (+18.42%)**
Incremento de €70K que requiere análisis de composición.

### Conclusión Preliminar

Las variaciones identificadas **no superan el umbral de materialidad** establecido (€900K) de forma individual, excepto proveedores extranjeros. Se recomienda:

1. ✓ Obtener detalle de nuevos proveedores extranjeros
2. ✓ Revisar política de efectos comerciales
3. ✓ Circularizar proveedores extranjeros principales

---
*Informe generado automáticamente por Auditia AI*
*Fecha: ${new Date().toLocaleDateString('es-ES')}*`;

  const runAnalysis = () => {
    setIsAnalysisRunning(true);
    setTimeout(() => {
      setIsAnalysisRunning(false);
      setAnalysisComplete(true);
    }, 2500);
  };

  const generateReport = () => {
    setIsGeneratingReport(true);
    setGeneratedText('');
    
    // Simulate AI typing effect
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullReportText.length) {
        // Add characters in chunks for more realistic typing
        const chunkSize = Math.floor(Math.random() * 5) + 3;
        setGeneratedText(prev => prev + fullReportText.slice(index, index + chunkSize));
        index += chunkSize;
        
        // Auto-scroll to bottom
        if (reportRef.current) {
          reportRef.current.scrollTop = reportRef.current.scrollHeight;
        }
      } else {
        clearInterval(typingInterval);
        setIsGeneratingReport(false);
      }
    }, 30);
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
                <BarChart3 className="w-5 h-5 text-stone-600" />
             </div>
             <div>
                <h2 className="text-2xl font-serif text-stone-900">Revisión Analítica</h2>
                <span className="text-xs text-stone-400 font-mono">Comparative Analyzer</span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden min-h-0">
          {/* Left Column: Analysis */}
          <div className="col-span-7 flex flex-col gap-6 overflow-y-auto pr-2">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-px bg-stone-200 border border-stone-200 rounded-sm overflow-hidden">
                  <div className="bg-white p-4">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block mb-1">Saldo 2024</span>
                      <div className="text-2xl font-serif text-stone-900 tabular-nums">{(totalCurrent/1000000).toFixed(2)} M€</div>
                  </div>
                  <div className="bg-white p-4">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block mb-1">Saldo 2023</span>
                      <div className="text-2xl font-serif text-stone-500 tabular-nums">{(totalPrevious/1000000).toFixed(2)} M€</div>
                  </div>
                  <div className="bg-white p-4">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block mb-1">Variación</span>
                      <div className={`text-2xl font-serif tabular-nums flex items-center gap-2 ${parseFloat(totalVariationPercent) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {parseFloat(totalVariationPercent) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        {totalVariationPercent}%
                      </div>
                  </div>
              </div>

              {/* Action Button */}
              {!analysisComplete && (
                <div className="bg-stone-50 border border-stone-200 rounded-sm p-6 text-center">
                  <BarChart3 className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-sm font-serif text-stone-900 mb-2">Comparativa Proveedores 2024 vs 2023</h3>
                  <p className="text-xs text-stone-500 mb-4 max-w-md mx-auto">
                    Compara el saldo de proveedores contra el año anterior para identificar variaciones significativas que requieran investigación adicional.
                  </p>
                  <button 
                    onClick={runAnalysis}
                    disabled={isAnalysisRunning}
                    className="px-6 py-2 bg-stone-900 text-white text-sm font-medium rounded-sm hover:bg-black transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                  >
                    {isAnalysisRunning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analizando datos...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Ejecutar análisis comparativo
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Comparison Table */}
              {analysisComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm"
                >
                  <div className="px-4 py-3 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
                    <h3 className="text-xs font-medium font-serif text-stone-900">Desglose por categoría</h3>
                    <span className="text-[10px] text-stone-400">Umbral significativo: ±15%</span>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 text-[10px] text-stone-500 font-sans uppercase tracking-wider border-b border-stone-200">
                        <tr>
                          <th className="px-4 py-2 font-medium">Categoría</th>
                          <th className="px-4 py-2 font-medium text-right">2024</th>
                          <th className="px-4 py-2 font-medium text-right">2023</th>
                          <th className="px-4 py-2 font-medium text-right">Variación</th>
                          <th className="px-4 py-2 font-medium text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {comparisonData.map((row, i) => (
                          <motion.tr 
                            key={i} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`hover:bg-stone-50 transition-colors ${row.isSignificant ? 'bg-amber-50/30' : ''}`}
                          >
                              <td className="px-4 py-3">
                                <div className="text-xs text-stone-900 font-medium">{row.category}</div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-mono text-xs tabular-nums text-stone-900">
                                    {(row.currentYear/1000).toLocaleString('es-ES')} K€
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-mono text-xs tabular-nums text-stone-500">
                                    {(row.previousYear/1000).toLocaleString('es-ES')} K€
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className={`flex items-center justify-end gap-1 ${row.variation >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {row.variation >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                  <span className="font-mono text-xs tabular-nums font-medium">
                                      {row.variationPercent >= 0 ? '+' : ''}{row.variationPercent.toFixed(2)}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {row.isSignificant ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    <AlertTriangle className="w-3 h-3" />
                                    Revisar
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                    <CheckCircle className="w-3 h-3" />
                                    OK
                                  </span>
                                )}
                              </td>
                          </motion.tr>
                        ))}
                    </tbody>
                  </table>
                  
                  {/* Generate Report CTA */}
                  <div className="px-4 py-4 border-t border-stone-200 bg-stone-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span>{comparisonData.filter(d => d.isSignificant).length} categorías requieren revisión</span>
                    </div>
                    <button 
                      onClick={generateReport}
                      disabled={isGeneratingReport || generatedText.length > 0}
                      className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded-sm hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Generar informe con IA
                    </button>
                  </div>
                </motion.div>
              )}
          </div>

          {/* Right Column: AI Report */}
          <div className="col-span-5 bg-stone-50 border border-stone-200 rounded-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-stone-200 bg-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-medium text-stone-900">Informe Generado por IA</span>
              </div>
              {generatedText.length > 0 && !isGeneratingReport && (
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowSendModal(true)}
                    className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setGeneratedText(''); generateReport(); }}
                    className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div ref={reportRef} className="flex-1 overflow-y-auto p-6">
              {!analysisComplete && !isGeneratingReport && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-xs text-stone-400">Ejecuta el análisis para generar el informe</p>
                </div>
              )}
              
              {analysisComplete && generatedText.length === 0 && !isGeneratingReport && (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-purple-200 mx-auto mb-4" />
                  <p className="text-xs text-stone-400">Pulsa "Generar informe con IA" para crear el análisis</p>
                </div>
              )}

              {(isGeneratingReport || generatedText.length > 0) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-sm max-w-none"
                >
                  {/* AI Writing Indicator */}
                  {isGeneratingReport && (
                    <div className="flex items-center gap-2 text-xs text-purple-600 mb-4 pb-4 border-b border-stone-200">
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                          className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                        />
                      </div>
                      <span>Auditia AI está escribiendo...</span>
                    </div>
                  )}
                  
                  {/* Rendered Markdown-like content */}
                  <div className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed font-mono">
                    {generatedText.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-lg font-serif text-stone-900 mt-6 mb-4 font-normal">{line.replace('## ', '')}</h2>;
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-sm font-medium text-stone-800 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-semibold text-stone-900 mt-3">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4 text-stone-600">{line.replace('- ', '')}</li>;
                      }
                      if (line.startsWith('---')) {
                        return <hr key={i} className="my-4 border-stone-200" />;
                      }
                      if (line.startsWith('*') && line.endsWith('*')) {
                        return <p key={i} className="text-stone-400 italic text-[10px]">{line.replace(/\*/g, '')}</p>;
                      }
                      if (line.trim() === '') {
                        return <br key={i} />;
                      }
                      return <p key={i} className="text-stone-600 font-sans">{line}</p>;
                    })}
                    
                    {/* Blinking cursor when typing */}
                    {isGeneratingReport && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 h-4 bg-purple-500 ml-0.5"
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Send to Client Footer */}
            {generatedText.length > 0 && !isGeneratingReport && (
              <div className="px-4 py-3 border-t border-stone-200 bg-white shrink-0">
                <button 
                  onClick={() => setShowSendModal(true)}
                  className="w-full px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar al cliente para revisión
                </button>
              </div>
            )}
          </div>
       </div>

       {/* Send Modal */}
       <AnimatePresence>
         {showSendModal && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
             onClick={() => setShowSendModal(false)}
           >
             <motion.div
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
               onClick={e => e.stopPropagation()}
             >
               <h3 className="text-lg font-serif text-stone-900 mb-2">Enviar informe al cliente</h3>
               <p className="text-sm text-stone-500 mb-4">
                 El informe de revisión analítica será enviado al cliente para su revisión. 
                 Se creará automáticamente una solicitud de confirmación.
               </p>
               
               <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mb-4">
                 <div className="text-xs text-stone-500 mb-2">Destinatario:</div>
                 <div className="text-sm font-medium text-stone-900">Marta García (CFO) - Grupo Alfa</div>
               </div>
               
               <div className="flex gap-3">
                 <button
                   onClick={() => setShowSendModal(false)}
                   className="flex-1 px-4 py-2 border border-stone-200 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
                 >
                   Cancelar
                 </button>
                 <button
                   onClick={() => setShowSendModal(false)}
                   className="flex-1 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
                 >
                   <Send className="w-4 h-4" />
                   Enviar
                 </button>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

