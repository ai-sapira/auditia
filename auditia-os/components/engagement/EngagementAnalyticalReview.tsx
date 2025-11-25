import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ChevronLeft, TrendingUp, TrendingDown, FileText, Sparkles, Loader2, CheckCircle, AlertTriangle, Download, Send, RefreshCw } from 'lucide-react';
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
    
    // Split report into lines for cleaner typing effect (like ConclusionsWriter)
    const lines = fullReportText.split('\n');
    let lineIndex = 0;
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (lineIndex < lines.length) {
        const currentLine = lines[lineIndex];
        
        if (charIndex < currentLine.length) {
          // Add characters within the current line
          const charsToAdd = Math.min(
            Math.floor(Math.random() * 4) + 3, // 3-6 chars at a time
            currentLine.length - charIndex
          );
          charIndex += charsToAdd;
          
          // Rebuild text from completed lines + current progress
          const newText = lines.slice(0, lineIndex).join('\n') + 
                         (lineIndex > 0 ? '\n' : '') + 
                         currentLine.slice(0, charIndex);
          setGeneratedText(newText);
        } else {
          // Move to next line
          lineIndex++;
          charIndex = 0;
          const newText = lines.slice(0, lineIndex).join('\n');
          setGeneratedText(newText);
        }
        
        // Auto-scroll to bottom
        if (reportRef.current) {
          reportRef.current.scrollTop = reportRef.current.scrollHeight;
        }
      } else {
        clearInterval(typingInterval);
        setIsGeneratingReport(false);
        setGeneratedText(fullReportText); // Ensure complete text
      }
    }, 15);
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
       {/* Header */}
       <div className="flex items-center gap-4 pb-6 border-b border-neutral-200 shrink-0">
          <button
             onClick={onBack}
             className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
             <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
             <h2 className="text-xl font-serif text-neutral-900">Revisión Analítica</h2>
             <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Comparativa año anterior</span>
          </div>
       </div>

       <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden min-h-0">
          {/* Left Column: Analysis */}
          <div className="col-span-7 flex flex-col gap-6 overflow-y-auto pr-2">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-sm overflow-hidden">
                  <div className="bg-white p-4">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Saldo 2024</span>
                      <div className="text-2xl font-serif text-neutral-900 tabular-nums">{(totalCurrent/1000000).toFixed(2)} M€</div>
                  </div>
                  <div className="bg-white p-4">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Saldo 2023</span>
                      <div className="text-2xl font-serif text-neutral-500 tabular-nums">{(totalPrevious/1000000).toFixed(2)} M€</div>
                  </div>
                  <div className="bg-white p-4">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans block mb-1">Variación</span>
                      <div className={`text-2xl font-serif tabular-nums flex items-center gap-2 ${parseFloat(totalVariationPercent) >= 0 ? 'text-[#4A5D4A]' : 'text-[#8B5A50]'}`}>
                        {parseFloat(totalVariationPercent) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        {totalVariationPercent}%
                      </div>
                  </div>
              </div>

              {/* Action Button */}
              {!analysisComplete && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900 mb-1">Comparativa Proveedores 2024 vs 2023</h3>
                    <p className="text-xs text-neutral-500">
                      Identifica variaciones significativas comparando saldos con el ejercicio anterior.
                    </p>
                  </div>
                  <button 
                    onClick={runAnalysis}
                    disabled={isAnalysisRunning}
                    className="px-5 py-2 bg-neutral-900 text-white text-xs font-medium rounded-sm hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50 shrink-0"
                  >
                    {isAnalysisRunning ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Analizando...
                      </>
                    ) : (
                      'Ejecutar análisis'
                    )}
                  </button>
                </div>
              )}

              {/* Comparison Table */}
              {analysisComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm"
                >
                  <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
                    <h3 className="text-xs font-medium font-serif text-neutral-900">Desglose por categoría</h3>
                    <span className="text-[10px] text-neutral-400">Umbral significativo: ±15%</span>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-neutral-50 text-[10px] text-neutral-500 font-sans uppercase tracking-wider border-b border-neutral-200">
                        <tr>
                          <th className="px-4 py-2 font-medium">Categoría</th>
                          <th className="px-4 py-2 font-medium text-right">2024</th>
                          <th className="px-4 py-2 font-medium text-right">2023</th>
                          <th className="px-4 py-2 font-medium text-right">Variación</th>
                          <th className="px-4 py-2 font-medium text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {comparisonData.map((row, i) => (
                          <motion.tr 
                            key={i} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`hover:bg-neutral-50 transition-colors ${row.isSignificant ? 'bg-[#FDFAF6]/30' : ''}`}
                          >
                              <td className="px-4 py-3">
                                <div className="text-xs text-neutral-900 font-medium">{row.category}</div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-mono text-xs tabular-nums text-neutral-900">
                                    {(row.currentYear/1000).toLocaleString('es-ES')} K€
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-mono text-xs tabular-nums text-neutral-500">
                                    {(row.previousYear/1000).toLocaleString('es-ES')} K€
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className={`flex items-center justify-end gap-1 ${row.variation >= 0 ? 'text-[#4A5D4A]' : 'text-[#8B5A50]'}`}>
                                  {row.variation >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                  <span className="font-mono text-xs tabular-nums font-medium">
                                      {row.variationPercent >= 0 ? '+' : ''}{row.variationPercent.toFixed(2)}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {row.isSignificant ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8B7355] bg-[#FDFAF6] px-2 py-0.5 rounded border border-[#EDE5D8]">
                                    <AlertTriangle className="w-3 h-3" />
                                    Revisar
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#4A5D4A] bg-[#F7F9F7] px-2 py-0.5 rounded border border-[#E0E5E0]">
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
                  <div className="px-4 py-4 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <AlertTriangle className="w-4 h-4 text-[#8B7355]" />
                      <span>{comparisonData.filter(d => d.isSignificant).length} categorías requieren revisión</span>
                    </div>
                    <button 
                      onClick={generateReport}
                      disabled={isGeneratingReport || generatedText.length > 0}
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-sm hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Generar informe con IA
                    </button>
                  </div>
                </motion.div>
              )}
          </div>

          {/* Right Column: AI Report */}
          <div className="col-span-5 bg-neutral-50 border border-neutral-200 rounded-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-neutral-200 bg-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neutral-500" />
                <span className="text-xs font-medium text-neutral-900">Informe Generado por IA</span>
              </div>
              {generatedText.length > 0 && !isGeneratingReport && (
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowSendModal(true)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setGeneratedText(''); generateReport(); }}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div ref={reportRef} className="flex-1 overflow-y-auto p-6">
              {!analysisComplete && !isGeneratingReport && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-xs text-neutral-400">Ejecuta el análisis para generar el informe</p>
                </div>
              )}
              
              {analysisComplete && generatedText.length === 0 && !isGeneratingReport && (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                  <p className="text-xs text-neutral-400">Pulsa "Generar informe con IA" para crear el análisis</p>
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
                    <div className="flex items-center gap-2 text-xs text-neutral-600 mb-4 pb-4 border-b border-neutral-200">
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                          className="w-1.5 h-1.5 bg-neutral-900 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          className="w-1.5 h-1.5 bg-neutral-900 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          className="w-1.5 h-1.5 bg-neutral-900 rounded-full"
                        />
                      </div>
                      <span>Auditia AI está escribiendo...</span>
                    </div>
                  )}
                  
                  {/* Rendered Markdown-like content */}
                  <div className="text-neutral-700 leading-relaxed">
                    {generatedText.split('\n').map((line, i) => {
                      // Process inline bold formatting
                      const processInline = (text: string): React.ReactNode => {
                        const parts: React.ReactNode[] = [];
                        let remaining = text;
                        let key = 0;
                        while (remaining.length > 0) {
                          const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
                          if (boldMatch && boldMatch.index !== undefined) {
                            if (boldMatch.index > 0) {
                              parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>);
                            }
                            parts.push(<strong key={key++} className="font-semibold text-neutral-900">{boldMatch[1]}</strong>);
                            remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
                          } else {
                            parts.push(<span key={key++}>{remaining}</span>);
                            break;
                          }
                        }
                        return parts.length > 0 ? <>{parts}</> : text;
                      };

                      // Section titles (## )
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-lg font-serif text-neutral-900 mt-6 mb-3 pb-2 border-b border-neutral-200">{line.slice(3)}</h2>;
                      }
                      // Subsection titles (### )
                      if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-sm font-semibold text-neutral-800 mt-5 mb-2">{line.slice(4)}</h3>;
                      }
                      // Horizontal rule
                      if (line.startsWith('---')) {
                        return <hr key={i} className="my-6 border-neutral-200" />;
                      }
                      // Numbered list with checkmarks (1. ✓)
                      if (/^\d+\.\s*✓/.test(line)) {
                        const content = line.replace(/^\d+\.\s*✓\s*/, '');
                        return (
                          <div key={i} className="flex items-start gap-2 ml-4 my-1.5 text-[#4A5D4A]">
                            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <span className="text-neutral-600 text-[13px]">{processInline(content)}</span>
                          </div>
                        );
                      }
                      // Regular numbered list
                      if (/^\d+\.\s/.test(line)) {
                        return <li key={i} className="ml-6 text-neutral-600 list-decimal my-1 text-[13px]">{processInline(line.replace(/^\d+\.\s/, ''))}</li>;
                      }
                      // List items
                      if (line.startsWith('- ')) {
                        return <li key={i} className="ml-6 text-neutral-600 list-disc my-1 text-[13px]">{processInline(line.slice(2))}</li>;
                      }
                      // Italics (signature lines) - single asterisks
                      if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
                        return <p key={i} className="text-neutral-400 italic text-[11px] mt-1">{line.slice(1, -1)}</p>;
                      }
                      // Empty line
                      if (line.trim() === '') {
                        return <div key={i} className="h-2" />;
                      }
                      // Regular paragraph with inline formatting
                      return <p key={i} className="text-neutral-600 text-[13px] leading-relaxed my-1">{processInline(line)}</p>;
                    })}
                    
                    {/* Blinking cursor when typing */}
                    {isGeneratingReport && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 h-4 bg-neutral-900 ml-0.5"
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Send to Client Footer */}
            {generatedText.length > 0 && !isGeneratingReport && (
              <div className="px-4 py-3 border-t border-neutral-200 bg-white shrink-0">
                <button 
                  onClick={() => setShowSendModal(true)}
                  className="w-full px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar al cliente para revisión
                </button>
              </div>
            )}
          </div>
       </div>

       {/* Send Modal - Using Portal */}
       {ReactDOM.createPortal(
         <AnimatePresence>
           {showSendModal && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
               onClick={() => setShowSendModal(false)}
             >
               <motion.div
                 initial={{ scale: 0.95, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.95, opacity: 0 }}
                 className="bg-white rounded-sm shadow-2xl max-w-md w-full"
                 onClick={e => e.stopPropagation()}
               >
                 <div className="p-6 border-b border-neutral-100">
                   <h3 className="text-lg font-serif text-neutral-900 mb-2">Enviar informe al cliente</h3>
                   <p className="text-xs text-neutral-500">
                     El informe de revisión analítica será enviado al cliente para su revisión. 
                     Se creará automáticamente una solicitud de confirmación.
                   </p>
                 </div>
                 
                 <div className="p-6">
                   <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-4">
                     <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Destinatario</div>
                     <div className="text-sm font-medium text-neutral-900">Marta García (CFO)</div>
                     <div className="text-xs text-neutral-500">Grupo Alfa</div>
                   </div>
                 </div>
                 
                 <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex gap-3">
                   <button
                     onClick={() => setShowSendModal(false)}
                     className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-600 text-xs font-medium rounded-sm hover:bg-white transition-colors"
                   >
                     Cancelar
                   </button>
                   <button
                     onClick={() => setShowSendModal(false)}
                     className="flex-1 px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
                   >
                     Enviar
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

