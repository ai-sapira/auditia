import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Send, 
  RefreshCw,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EngagementConclusionsWriterProps {
  onBack: () => void;
}

// Simulated test results data
interface TestResult {
  id: string;
  name: string;
  type: 'reconciliation' | 'circularization' | 'sampling' | 'analytical';
  status: 'completed' | 'issues' | 'pending';
  findings: number;
  coverage: number;
}

interface Finding {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  status: 'open' | 'resolved' | 'pending_client';
  area: string;
  amount?: number;
}

export const EngagementConclusionsWriter: React.FC<EngagementConclusionsWriterProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState<'review' | 'generating' | 'editing'>('review');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [generatedText, setGeneratedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>(['scope', 'methodology', 'tests', 'findings', 'conclusion', 'opinion']);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Mock data for the engagement results
  const testResults: TestResult[] = [
    { id: 'reconciler', name: 'Cuadre básico Proveedores', type: 'reconciliation', status: 'issues', findings: 3, coverage: 100 },
    { id: 'riskmapper', name: 'Mapa de riesgos', type: 'reconciliation', status: 'completed', findings: 0, coverage: 100 },
    { id: 'circularizer', name: 'Circularizaciones', type: 'circularization', status: 'completed', findings: 1, coverage: 78 },
    { id: 'tester', name: 'Prueba Alternativa', type: 'sampling', status: 'completed', findings: 2, coverage: 85 },
    { id: 'analytical', name: 'Revisión Analítica', type: 'analytical', status: 'issues', findings: 2, coverage: 100 },
  ];

  const findings: Finding[] = [
    { id: 'H-001', title: 'Descuadre con submayor ACME Corp', severity: 'high', status: 'pending_client', area: 'Proveedores', amount: 45230 },
    { id: 'H-002', title: 'Factura sin pedido autorizado', severity: 'medium', status: 'open', area: 'Proveedores', amount: 12500 },
    { id: 'H-003', title: 'Diferencia en circularización TechSupply', severity: 'low', status: 'resolved', area: 'Proveedores', amount: 3200 },
    { id: 'H-004', title: 'Variación significativa prov. extranjeros', severity: 'medium', status: 'open', area: 'Proveedores', amount: 1100000 },
    { id: 'H-005', title: 'Reclasificación efectos comerciales', severity: 'low', status: 'pending_client', area: 'Proveedores', amount: 250000 },
  ];

  const sections = [
    { id: 'scope', name: 'Alcance del trabajo' },
    { id: 'methodology', name: 'Metodología aplicada' },
    { id: 'tests', name: 'Pruebas realizadas' },
    { id: 'findings', name: 'Hallazgos identificados' },
    { id: 'conclusion', name: 'Conclusiones' },
    { id: 'opinion', name: 'Opinión de auditoría' },
  ];

  // The mega-detailed report that will be typed out
  const fullReport = `# INFORME DE CONCLUSIONES - ÁREA DE PROVEEDORES
## Auditoría Financiera Ejercicio 2024

---

## 1. ALCANCE DEL TRABAJO

El presente informe recoge las conclusiones del trabajo de auditoría realizado sobre el área de **Proveedores y Cuentas a Pagar** de Grupo Alfa S.A. correspondiente al ejercicio cerrado a 31 de diciembre de 2024.

**Saldo auditado:** €18.890.000
**Materialidad aplicada:** €900.000 (5% del saldo)
**Materialidad de ejecución:** €675.000

El alcance ha incluido las siguientes cuentas del Plan General Contable:
- 400 - Proveedores (€12.500.000)
- 401 - Proveedores, efectos comerciales a pagar (€1.850.000)
- 403 - Proveedores, empresas del grupo (€890.000)
- 410 - Acreedores por prestaciones de servicios (€3.200.000)
- 411 - Acreedores, efectos comerciales a pagar (€450.000)

---

## 2. METODOLOGÍA APLICADA

### 2.1 Enfoque de auditoría

Se ha aplicado un enfoque combinado de pruebas sustantivas y procedimientos analíticos, considerando:

- **Riesgo inherente:** Medio-Alto (sector industrial con múltiples proveedores)
- **Riesgo de control:** Medio (controles internos evaluados como efectivos con algunas debilidades)
- **Riesgo de detección planificado:** Bajo

### 2.2 Procedimientos aplicados

| Procedimiento | Descripción | Cobertura |
|---------------|-------------|-----------|
| Cuadre básico | Conciliación entre submayor, mayor y balance | 100% |
| Mapa de riesgos | Clasificación de proveedores por nivel de riesgo | 100% |
| Circularización | Confirmación directa con proveedores seleccionados | 78% del saldo |
| Prueba alternativa | Verificación documental de facturas | 85 transacciones |
| Revisión analítica | Comparación interanual de saldos | 100% |

---

## 3. PRUEBAS REALIZADAS Y RESULTADOS

### 3.1 Cuadre Básico de Proveedores

**Estado: Completado con incidencias**

Se ha verificado la consistencia entre el submayor de proveedores, el libro mayor y el balance de comprobación. 

**Resultados:**
- ✓ Cuadre global: Correcto
- ⚠ Diferencias individuales identificadas: 3
  - ACME Corp: €45.230 pendiente de explicación
  - Industrial Supplies: €8.120 reclasificación contable
  - TransLogistics: €2.340 diferencia temporal

**Conclusión:** Las diferencias identificadas no superan la materialidad de ejecución de forma agregada. Se ha obtenido explicación satisfactoria para 2 de 3 diferencias.

### 3.2 Circularizaciones

**Estado: Completado**

Se han enviado 47 confirmaciones de saldo a proveedores, obteniendo:
- Respuestas recibidas: 36 (77%)
- Confirmaciones conformes: 33 (92% de respuestas)
- Confirmaciones con diferencias: 3 (8% de respuestas)

**Cobertura del saldo circularizado:** €14.730.000 (78% del total)

Las diferencias identificadas en las respuestas han sido:
1. TechSupply Ltd: €3.200 - Diferencia temporal por factura en tránsito → **RESUELTO**
2. MaterialPro: €12.500 - Factura no registrada → **HALLAZGO H-002**
3. Global Parts: €1.890 - Error de conversión divisa → **RESUELTO**

**Conclusión:** El nivel de respuesta y conformidad es satisfactorio. Las diferencias identificadas no son materiales.

### 3.3 Prueba Alternativa

**Estado: Completado**

Se han seleccionado 85 facturas para verificación documental utilizando muestreo estadístico (MUS - Monetary Unit Sampling).

**Atributos verificados:**
- Existencia de factura original
- Autorización del pedido
- Conformidad de albarán/recepción
- Registro en período correcto
- Cálculo aritmético correcto

**Resultados:**
- Facturas sin errores: 82 (96%)
- Facturas con errores menores: 2 (2%)
- Facturas con errores significativos: 1 (1%)

**Error proyectado:** €28.500 (por debajo de materialidad de ejecución)

**Conclusión:** Los resultados del muestreo son satisfactorios y permiten concluir que la población está razonablemente libre de errores materiales.

### 3.4 Revisión Analítica

**Estado: Completado con observaciones**

Se ha realizado comparativa del saldo de proveedores respecto al ejercicio anterior:

| Categoría | 2024 | 2023 | Variación | Análisis |
|-----------|------|------|-----------|----------|
| Prov. nacionales | €12.5M | €11.8M | +5.9% | ✓ Consistente con aumento actividad |
| Prov. extranjeros | €3.2M | €2.1M | +52.4% | ⚠ Requiere análisis adicional |
| Prov. grupo | €0.89M | €0.92M | -3.3% | ✓ OK |
| Acreedores varios | €0.45M | €0.38M | +18.4% | ⚠ Revisar composición |
| Efectos comerciales | €1.85M | €2.1M | -11.9% | ⚠ Cambio política financiación |

**Conclusión:** Las variaciones significativas han sido analizadas y se han obtenido explicaciones razonables del cliente. El incremento en proveedores extranjeros se debe a la apertura de línea de negocio internacional.

---

## 4. HALLAZGOS IDENTIFICADOS

Durante la ejecución del trabajo se han identificado los siguientes hallazgos:

### 4.1 Hallazgos de Alta Severidad

**H-001: Descuadre con submayor ACME Corp**
- **Importe:** €45.230
- **Estado:** Pendiente confirmación cliente
- **Descripción:** Diferencia no conciliada entre el saldo contable y la confirmación recibida del proveedor.
- **Impacto:** Posible error en el registro de operaciones o factura no contabilizada.
- **Recomendación:** Obtener explicación detallada del cliente y documentación soporte.

### 4.2 Hallazgos de Severidad Media

**H-002: Factura sin pedido autorizado**
- **Importe:** €12.500
- **Estado:** Abierto
- **Descripción:** Factura de MaterialPro registrada sin pedido de compra autorizado.
- **Impacto:** Debilidad en el control interno de compras.
- **Recomendación:** Reforzar el control de autorización de pedidos.

**H-004: Variación significativa proveedores extranjeros**
- **Importe:** €1.100.000
- **Estado:** Abierto
- **Descripción:** Incremento del 52% en el saldo de proveedores extranjeros.
- **Impacto:** Potencial riesgo de tipos de cambio y exposición.
- **Recomendación:** Documentar la justificación del negocio y verificar política de cobertura.

### 4.3 Hallazgos de Baja Severidad

**H-003: Diferencia en circularización TechSupply**
- **Importe:** €3.200
- **Estado:** Resuelto
- **Resolución:** Diferencia temporal por factura en tránsito a cierre.

**H-005: Reclasificación efectos comerciales**
- **Importe:** €250.000
- **Estado:** Pendiente confirmación cliente
- **Descripción:** Disminución en efectos comerciales que requiere verificación de reclasificación.

---

## 5. CONCLUSIONES

### 5.1 Conclusión sobre el área auditada

Con base en los procedimientos de auditoría realizados:

✓ **Existencia:** Los saldos de proveedores representan obligaciones reales de la entidad.

✓ **Integridad:** No se han identificado pasivos significativos no registrados.

✓ **Valoración:** Los saldos están correctamente valorados al coste amortizado.

✓ **Clasificación:** La presentación y desglose en estados financieros es adecuada.

⚠ **Corte de operaciones:** Se han identificado diferencias menores en el corte de operaciones que no superan la materialidad.

### 5.2 Resumen de ajustes propuestos

| Referencia | Concepto | Debe | Haber |
|------------|----------|------|-------|
| A-001 | Reclasificación proveedores grupo | €45.230 | - |
| A-002 | Ajuste cut-off facturas en tránsito | €12.500 | - |
| **TOTAL** | | **€57.730** | |

**Impacto sobre el saldo:** 0.31% (No material)

---

## 6. OPINIÓN DE AUDITORÍA

### 6.1 Opinión sobre el área de Proveedores

En nuestra opinión, basándonos en la evidencia de auditoría obtenida, el área de **Proveedores y Cuentas a Pagar** de Grupo Alfa S.A. presenta razonablemente, en todos los aspectos materiales, el saldo a 31 de diciembre de 2024 de conformidad con el marco normativo de información financiera aplicable.

### 6.2 Asuntos clave de auditoría

No se han identificado asuntos clave de auditoría específicos para esta área que requieran mención especial en el informe.

### 6.3 Recomendaciones para próximos ejercicios

1. **Reforzar el control de autorización de compras** para evitar facturas sin pedido autorizado.
2. **Mejorar el proceso de conciliación** con proveedores principales de forma mensual.
3. **Documentar la política de gestión** de proveedores extranjeros y exposición a tipo de cambio.

---

*Informe generado automáticamente por Auditia AI*
*Fecha de emisión: ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}*
*Preparado por: Sistema de Inteligencia Artificial*
*Revisado por: Pendiente de revisión del Manager*

---

**FIRMA DIGITAL**

Este documento ha sido generado electrónicamente y contiene una firma digital que garantiza su integridad y autenticidad.

_________________________________
Auditia Partners, S.L.
Ref: INF-2024-GALFA-PROV-001`;

  // Section markers for progress tracking
  const sectionMarkers = [
    { name: 'Alcance', position: 0.08 },
    { name: 'Metodología', position: 0.20 },
    { name: 'Pruebas', position: 0.55 },
    { name: 'Hallazgos', position: 0.75 },
    { name: 'Conclusiones', position: 0.88 },
    { name: 'Opinión', position: 1.0 },
  ];

  const startGeneration = () => {
    setCurrentStep('generating');
    setIsGenerating(true);
    setIsTyping(true);
    setGeneratedText('');
    setGenerationProgress(0);
    setCurrentSection(0);

    // Split report into lines for cleaner typing effect
    const lines = fullReport.split('\n');
    let lineIndex = 0;
    let charIndex = 0;
    const totalLength = fullReport.length;
    let currentText = '';
    
    const typingInterval = setInterval(() => {
      if (lineIndex < lines.length) {
        const currentLine = lines[lineIndex];
        
        if (charIndex < currentLine.length) {
          // Add characters within the current line (faster for longer lines)
          const charsToAdd = Math.min(
            Math.floor(Math.random() * 4) + 3, // 3-6 chars at a time
            currentLine.length - charIndex
          );
          charIndex += charsToAdd;
          currentText = lines.slice(0, lineIndex).join('\n') + 
                       (lineIndex > 0 ? '\n' : '') + 
                       currentLine.slice(0, charIndex);
        } else {
          // Move to next line
          lineIndex++;
          charIndex = 0;
          currentText = lines.slice(0, lineIndex).join('\n');
        }
        
        setGeneratedText(currentText);
        
        // Update progress based on character count
        const progress = currentText.length / totalLength;
        setGenerationProgress(progress);
        
        // Update current section
        for (let i = sectionMarkers.length - 1; i >= 0; i--) {
          if (progress >= sectionMarkers[i].position) {
            setCurrentSection(i);
            break;
          }
        }
        
        // Auto-scroll
        if (reportRef.current) {
          reportRef.current.scrollTop = reportRef.current.scrollHeight;
        }
      } else {
        clearInterval(typingInterval);
        setIsGenerating(false);
        setIsTyping(false);
        setGeneratedText(fullReport); // Ensure complete text
        setCurrentStep('editing');
      }
    }, 12);
  };

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(s => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Process inline formatting (bold, italic) in a line
  const processInlineFormatting = (text: string): React.ReactNode => {
    // Handle **bold** text
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;
    
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
      if (boldMatch && boldMatch.index !== undefined) {
        // Add text before bold
        if (boldMatch.index > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>);
        }
        // Add bold text
        parts.push(<strong key={key++} className="font-semibold text-neutral-900">{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      } else {
        // No more bold, add remaining text
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }
    
    return parts.length > 0 ? <>{parts}</> : text;
  };

  // Render markdown-like content with improved parsing
  const renderContent = (text: string) => {
    // Only process complete lines (ignore incomplete last line during typing)
    const lines = text.split('\n');
    const lastLine = lines[lines.length - 1];
    const isLastLineComplete = text.endsWith('\n') || !isTyping;
    
    return lines.map((line, i) => {
      // Skip incomplete last line during typing
      if (i === lines.length - 1 && !isLastLineComplete && isTyping) {
        return <span key={i} className="text-neutral-600 text-[13px]">{line}<span className="animate-pulse">|</span></span>;
      }
      
      // Main title
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-2xl font-serif text-neutral-900 mb-4 pb-2 border-b-2 border-neutral-900">{line.slice(2)}</h1>;
      }
      // Section titles
      if (line.startsWith('## ')) {
        const content = line.slice(3);
        const isNumber = /^\d\./.test(content);
        return <h2 key={i} className={`text-lg font-serif text-neutral-900 mt-8 mb-3 ${isNumber ? 'bg-neutral-100 px-3 py-2 -mx-3' : ''}`}>{content}</h2>;
      }
      // Subsection
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-sm font-semibold text-neutral-800 mt-5 mb-2">{line.slice(4)}</h3>;
      }
      // Horizontal rule
      if (line.startsWith('---')) {
        return <hr key={i} className="my-6 border-neutral-200" />;
      }
      // Skip table separator lines
      if (line.match(/^\|[\s\-:|]+\|$/)) {
        return null;
      }
      // Table rows
      if (line.startsWith('|') && line.endsWith('|')) {
        const cells = line.slice(1, -1).split('|').map(c => c.trim());
        const isHeader = i > 0 && lines[i - 1]?.startsWith('|') && lines[i + 1]?.match(/^\|[\s\-:|]+\|$/);
        return (
          <div key={i} className={`grid gap-2 text-xs py-2 border-b border-neutral-100 ${isHeader ? 'font-semibold bg-neutral-50 text-neutral-800' : 'text-neutral-600'}`} style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
            {cells.map((cell, j) => (
              <span key={j} className="px-2">{processInlineFormatting(cell)}</span>
            ))}
          </div>
        );
      }
      // List items with checkmarks
      if (line.startsWith('- ✓') || line.startsWith('- ⚠')) {
        const isCheck = line.includes('✓');
        const content = line.replace(/^- [✓⚠]\s*/, '');
        return (
          <div key={i} className={`flex items-start gap-2 ml-4 my-1 ${isCheck ? 'text-[#4A5D4A]' : 'text-[#8B7355]'}`}>
            {isCheck ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
            <span className="text-neutral-600">{processInlineFormatting(content)}</span>
          </div>
        );
      }
      // Regular list items
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-6 text-neutral-600 list-disc my-1">{processInlineFormatting(line.slice(2))}</li>;
      }
      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        return <li key={i} className="ml-6 text-neutral-600 list-decimal my-1">{processInlineFormatting(line.replace(/^\d+\.\s/, ''))}</li>;
      }
      // Standalone checkmarks and warnings
      if (line.startsWith('✓ ')) {
        return <p key={i} className="text-[#4A5D4A] flex items-center gap-2 my-1"><CheckCircle2 className="w-4 h-4" />{processInlineFormatting(line.slice(2))}</p>;
      }
      if (line.startsWith('⚠ ')) {
        return <p key={i} className="text-[#8B7355] flex items-center gap-2 my-1"><AlertTriangle className="w-4 h-4" />{processInlineFormatting(line.slice(2))}</p>;
      }
      // Italics (signature lines)
      if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
        return <p key={i} className="text-neutral-400 italic text-[11px] mt-1">{line.slice(1, -1)}</p>;
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      // Regular paragraph with inline formatting
      return <p key={i} className="text-neutral-600 text-[13px] leading-relaxed my-1">{processInlineFormatting(line)}</p>;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-200 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-serif text-neutral-900">Redactar Conclusiones</h2>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Generación automática con IA</span>
          </div>
        </div>
        
        {currentStep === 'editing' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={copyToClipboard}
              className="px-3 py-1.5 text-xs font-medium bg-neutral-100 text-neutral-700 rounded-sm hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5"
            >
              {copied ? <CheckCircle className="w-3 h-3 text-[#4A5D4A]" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
            <button 
              onClick={() => setShowExportModal(true)}
              className="px-4 py-1.5 text-xs font-medium bg-neutral-900 text-white rounded-sm hover:bg-black transition-colors inline-flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" />
              Exportar a Word
            </button>
          </div>
        )}
      </div>

      {/* Step 1: Review Data */}
      {currentStep === 'review' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 overflow-y-auto space-y-6"
        >
          {/* Data Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-neutral-200 rounded-sm p-4 shadow-sm">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Pruebas Completadas</span>
              <div className="text-3xl font-serif text-neutral-900">5</div>
              <span className="text-xs text-[#4A5D4A] font-medium">100% ejecutadas</span>
            </div>
            <div className="bg-white border border-neutral-200 rounded-sm p-4 shadow-sm">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Hallazgos Totales</span>
              <div className="text-3xl font-serif text-[#8B7355]">5</div>
              <span className="text-xs text-neutral-500">1 alta, 2 media, 2 baja</span>
            </div>
            <div className="bg-white border border-neutral-200 rounded-sm p-4 shadow-sm">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Cobertura Promedio</span>
              <div className="text-3xl font-serif text-neutral-900">92%</div>
              <span className="text-xs text-neutral-500">del saldo auditado</span>
            </div>
            <div className="bg-white border border-neutral-200 rounded-sm p-4 shadow-sm">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Ajustes Propuestos</span>
              <div className="text-3xl font-serif text-neutral-900">€57.7K</div>
              <span className="text-xs text-[#4A5D4A]">No material</span>
            </div>
          </div>

          {/* Test Results Review */}
          <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
              <h3 className="text-sm font-serif text-neutral-900">Resultados de pruebas a incluir</h3>
              <p className="text-xs text-neutral-500">Estos datos se utilizarán para generar el informe</p>
            </div>
            <div className="divide-y divide-neutral-100">
              {testResults.map((test) => (
                  <div key={test.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm text-neutral-900">{test.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                            test.status === 'completed' ? 'bg-[#F7F9F7] text-[#4A5D4A] border-[#E0E5E0]' :
                            test.status === 'issues' ? 'bg-[#FDFAF6] text-[#8B7355] border-[#EDE5D8]' :
                            'bg-neutral-50 text-neutral-500 border-neutral-200'
                          }`}>
                            {test.status === 'completed' ? 'Completado' : test.status === 'issues' ? 'Con incidencias' : 'Pendiente'}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {test.findings} hallazgos • {test.coverage}% cobertura
                          </span>
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-[#4A5D4A]" />
                  </div>
              ))}
            </div>
          </div>

          {/* Findings Review */}
          <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
              <h3 className="text-sm font-serif text-neutral-900">Hallazgos identificados</h3>
              <p className="text-xs text-neutral-500">Se incluirán en la sección de hallazgos del informe</p>
            </div>
            <div className="divide-y divide-neutral-100">
              {findings.map((finding) => (
                <div key={finding.id} className="px-5 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      finding.severity === 'high' ? 'bg-[#FBF8F7]0' :
                      finding.severity === 'medium' ? 'bg-[#FDFAF6]0' :
                      'bg-[#F7F9F7]0'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-400">{finding.id}</span>
                        <span className="text-sm text-neutral-900">{finding.title}</span>
                      </div>
                      {finding.amount && (
                        <span className="text-xs text-neutral-500">€{finding.amount.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                    finding.status === 'resolved' ? 'bg-[#F7F9F7] text-[#4A5D4A] border-[#E0E5E0]' :
                    finding.status === 'pending_client' ? 'bg-[#F7F9FA] text-[#4A5D6A] border-[#E0E5E8]' :
                    'bg-[#FDFAF6] text-[#8B7355] border-[#EDE5D8]'
                  }`}>
                    {finding.status === 'resolved' ? 'Resuelto' : finding.status === 'pending_client' ? 'Pte. cliente' : 'Abierto'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section Selection */}
          <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50">
              <h3 className="text-sm font-serif text-neutral-900">Secciones del informe</h3>
              <p className="text-xs text-neutral-500">Selecciona las secciones que deseas incluir</p>
            </div>
            <div className="p-5 grid grid-cols-3 gap-2">
              {sections.map((section) => {
                const isSelected = selectedSections.includes(section.id);
                return (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={`px-4 py-3 rounded-sm border transition-all text-left flex items-center justify-between ${
                      isSelected 
                        ? 'border-neutral-400 bg-neutral-50' 
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                    }`}
                  >
                    <span className={`text-xs ${isSelected ? 'text-neutral-900 font-medium' : 'text-neutral-600'}`}>
                      {section.name}
                    </span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-[#4A5D4A]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <div className="border border-neutral-200 rounded-sm p-6 bg-neutral-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-1">Todo listo para generar</h3>
              <p className="text-xs text-neutral-500">
                Se generará un informe completo basado en los datos seleccionados.
              </p>
            </div>
            <button 
              onClick={startGeneration}
              className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-medium rounded-sm hover:bg-black transition-colors inline-flex items-center gap-2"
            >
              Generar Informe
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2 & 3: Generating / Editing */}
      {(currentStep === 'generating' || currentStep === 'editing') && (
        <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
          {/* Left: Progress Panel */}
          <div className="w-72 shrink-0 flex flex-col gap-4">
            {/* Generation Progress */}
            <div className="bg-white border border-neutral-200 rounded-sm p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Progreso</span>
                <span className="text-sm font-mono font-semibold text-neutral-900">
                  {Math.round(generationProgress * 100)}%
                </span>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-neutral-900 rounded-full"
                  animate={{ width: `${generationProgress * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              {/* Section Progress */}
              <div className="space-y-2">
                {sectionMarkers.map((section, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      currentSection > i 
                        ? 'bg-[#F7F9F7]0 text-white' 
                        : currentSection === i 
                        ? 'bg-neutral-500 text-white animate-pulse' 
                        : 'bg-neutral-100 text-neutral-400'
                    }`}>
                      {currentSection > i ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs ${currentSection >= i ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
                      {section.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Status */}
            <div className={`border rounded-sm p-4 transition-all ${
              isTyping 
                ? 'bg-neutral-50 border-neutral-200' 
                : 'bg-[#F7F9F7] border-[#E0E5E0]'
            }`}>
              <div className="flex items-center gap-3">
                {isTyping ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-neutral-500 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5 text-white" />
                      </motion.div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-900">IA escribiendo...</span>
                      <p className="text-xs text-neutral-600">Redactando sección {currentSection + 1} de {sectionMarkers.length}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-[#F7F9F7]0 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-[#4A5D4A]">Generación completada</span>
                      <p className="text-xs text-[#4A5D4A]">Informe listo para revisión</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            {currentStep === 'editing' && (
              <div className="bg-white border border-neutral-200 rounded-sm p-4 shadow-sm space-y-3">
                <h4 className="text-[10px] text-neutral-400 uppercase tracking-wider">Estadísticas del informe</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-2xl font-serif text-neutral-900">{generatedText.split(' ').length}</span>
                    <span className="text-xs text-neutral-500 block">palabras</span>
                  </div>
                  <div>
                    <span className="text-2xl font-serif text-neutral-900">{Math.ceil(generatedText.split(' ').length / 200)}</span>
                    <span className="text-xs text-neutral-500 block">min. lectura</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {currentStep === 'editing' && (
              <div className="space-y-2">
                <button 
                  onClick={() => { setGeneratedText(''); startGeneration(); }}
                  className="w-full px-4 py-2 text-xs font-medium bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerar informe
                </button>
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="w-full px-4 py-2 text-xs font-medium bg-neutral-600 text-white rounded hover:bg-neutral-700 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar para revisión
                </button>
              </div>
            )}
          </div>

          {/* Right: Report Content */}
          <div className="flex-1 bg-white border border-neutral-200 rounded-sm overflow-hidden flex flex-col shadow-lg">
            {/* Document Header */}
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-neutral-400" />
                <div>
                  <span className="text-sm font-serif text-neutral-900">Informe de Conclusiones</span>
                  <span className="text-[10px] text-neutral-400 block">INF-2024-GALFA-PROV-001</span>
                </div>
              </div>
              {isTyping && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-full">
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      className="w-1.5 h-1.5 bg-neutral-500 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                      className="w-1.5 h-1.5 bg-neutral-500 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                      className="w-1.5 h-1.5 bg-neutral-500 rounded-full"
                    />
                  </div>
                  <span className="text-xs text-neutral-700 font-medium">Escribiendo</span>
                </div>
              )}
            </div>

            {/* Document Content */}
            <div 
              ref={reportRef}
              className="flex-1 overflow-y-auto p-8 bg-white"
              style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}
            >
              <div className="prose prose-sm max-w-none">
                {renderContent(generatedText)}
                
                {/* Blinking cursor while typing */}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="inline-block w-2.5 h-5 bg-neutral-500 ml-0.5 rounded-sm"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-neutral-100">
                <h3 className="text-lg font-serif text-neutral-900">Exportar informe</h3>
                <p className="text-sm text-neutral-500">Selecciona el formato de exportación</p>
              </div>

              <div className="p-6 space-y-3">
                <button className="w-full p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E8EDEF] rounded-lg flex items-center justify-center text-[#4A5D6A] font-bold text-lg">
                    W
                  </div>
                  <div>
                    <span className="text-sm font-medium text-neutral-900 block">Microsoft Word (.docx)</span>
                    <span className="text-xs text-neutral-500">Formato editable con estilos</span>
                  </div>
                </button>
                
                <button className="w-full p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F0E8E6] rounded-lg flex items-center justify-center text-[#8B5A50] font-bold text-lg">
                    PDF
                  </div>
                  <div>
                    <span className="text-sm font-medium text-neutral-900 block">PDF (.pdf)</span>
                    <span className="text-xs text-neutral-500">Formato de lectura final</span>
                  </div>
                </button>

                <button className="w-full p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E8EDE8] rounded-lg flex items-center justify-center text-[#4A5D4A]">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-neutral-900 block">Enviar al Manager</span>
                    <span className="text-xs text-neutral-500">Para revisión y aprobación</span>
                  </div>
                </button>
              </div>

              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="w-full px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

