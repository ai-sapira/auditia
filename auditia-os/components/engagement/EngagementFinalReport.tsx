import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Building2, 
  Users, 
  Download, 
  Share2,
  ChevronDown,
  ChevronRight,
  FileText,
  TrendingUp,
  Shield,
  Clock,
  Euro,
  BarChart3,
  Award,
  Printer,
  Mail,
  ExternalLink,
  Check,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Design System Colors
 */
const DS = {
  success: {
    bg: 'bg-[#F7F9F7]',
    text: 'text-[#4A5D4A]',
    border: 'border-[#E0E5E0]',
    solid: '#4A5D4A',
  },
  warning: {
    bg: 'bg-[#FDFAF6]',
    text: 'text-[#8B7355]',
    border: 'border-[#EDE5D8]',
    solid: '#8B7355',
  },
  error: {
    bg: 'bg-[#FBF8F7]',
    text: 'text-[#8B5A50]',
    border: 'border-[#E8E0DE]',
    solid: '#8B5A50',
  },
  info: {
    bg: 'bg-[#F7F9FA]',
    text: 'text-[#4A5D6A]',
    border: 'border-[#E0E5E8]',
    solid: '#4A5D6A',
  },
};

interface EngagementFinalReportProps {
  onSelectArea?: (areaId: string) => void;
}

export const EngagementFinalReport: React.FC<EngagementFinalReportProps> = ({ onSelectArea }) => {
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['summary', 'opinion']);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Simulate report generation
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            setIsGenerating(false);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Report Data
  const reportData = {
    client: 'Grupo Alfa S.A.',
    engagement: 'Auditoría de Cuentas Anuales 2025',
    period: '01/01/2025 - 31/12/2025',
    reportDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
    partner: 'Elena Martínez',
    manager: 'Carlos Delgado',
    senior: 'Alejandro Ruiz',
    
    opinion: {
      type: 'Sin salvedades',
      typeCode: 'unqualified',
      emphasis: null,
      otherMatters: null,
    },

    financials: {
      totalAssets: 125890000,
      totalLiabilities: 67340000,
      equity: 58550000,
      revenue: 89750000,
      netIncome: 8920000,
      materiality: 900000,
      performanceMateriality: 675000,
    },

    accountsSummary: [
      { code: '10-13', name: 'Patrimonio Neto', balance: 58550000, status: 'completed', findings: 0 },
      { code: '14-18', name: 'Pasivo no corriente', balance: 32450000, status: 'completed', findings: 0 },
      { code: '40-49', name: 'Pasivo corriente', balance: 34890000, status: 'completed', findings: 2 },
      { code: '20-29', name: 'Activo no corriente', balance: 62340000, status: 'completed', findings: 1 },
      { code: '30-39', name: 'Existencias', balance: 18750000, status: 'completed', findings: 0 },
      { code: '43-49', name: 'Deudores', balance: 28900000, status: 'completed', findings: 1 },
      { code: '57', name: 'Tesorería', balance: 15900000, status: 'completed', findings: 0 },
      { code: '60-69', name: 'Gastos', balance: 72830000, status: 'completed', findings: 0 },
      { code: '70-79', name: 'Ingresos', balance: 89750000, status: 'completed', findings: 0 },
    ],

    findingsSummary: {
      total: 12,
      resolved: 10,
      adjusted: 8,
      waived: 2,
      pending: 0,
      material: 0,
      categories: [
        { name: 'Corte de operaciones', count: 3, resolved: 3 },
        { name: 'Valoración', count: 4, resolved: 4 },
        { name: 'Presentación', count: 2, resolved: 2 },
        { name: 'Integridad', count: 3, resolved: 3 },
      ]
    },

    testsPerformed: {
      total: 48,
      substantive: 32,
      compliance: 16,
      coverage: 94,
      aiAssisted: 38,
    },

    timeline: {
      planningStart: '15/01/2025',
      fieldworkStart: '01/02/2025',
      fieldworkEnd: '15/03/2025',
      reviewEnd: '25/03/2025',
      reportDate: '28/03/2025',
      totalDays: 72,
      budgetedDays: 75,
    },

    hours: {
      budgeted: 180,
      actual: 165,
      partner: 18,
      manager: 35,
      senior: 52,
      staff: 60,
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Generation Screen
  if (isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto border-4 border-neutral-200 border-t-neutral-900 rounded-full"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-neutral-400" />
            </motion.div>
          </div>
          
          <h2 className="text-2xl font-serif text-neutral-900 mb-3">Generando Informe Final</h2>
          <p className="text-sm text-neutral-500 mb-8">
            Recopilando conclusiones de auditoría, consolidando hallazgos y preparando el informe...
          </p>
          
          <div className="w-full bg-neutral-100 rounded-full h-2 mb-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(generationProgress, 100)}%` }}
              className="h-full bg-neutral-900 rounded-full"
            />
          </div>
          
          <div className="flex justify-between text-xs text-neutral-400">
            <span>Procesando...</span>
            <span className="font-mono">{Math.round(generationProgress)}%</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      {/* Header */}
      <div className="flex justify-between items-start px-10 pt-8 pb-6 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded ${DS.success.bg}`}>
              <FileCheck className={`w-5 h-5 ${DS.success.text}`} />
            </div>
            <h1 className="text-2xl font-serif text-neutral-900">Informe de Auditoría</h1>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${DS.success.bg} ${DS.success.text} ${DS.success.border}`}>
              Finalizado
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span className="font-medium text-neutral-700">{reportData.client}</span>
            </div>
            <div className="w-px h-4 bg-neutral-200" />
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">{reportData.period}</span>
            </div>
            <div className="w-px h-4 bg-neutral-200" />
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Emitido: {reportData.reportDate}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 rounded hover:bg-neutral-200 transition-colors">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 rounded hover:bg-neutral-200 transition-colors">
            <Mail className="w-4 h-4" />
            Enviar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded hover:bg-neutral-800 transition-colors">
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-10 py-8">
        {/* Opinion Badge - Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-lg mb-8 ${DS.success.bg} border ${DS.success.border}`}
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Award className={`w-8 h-8 ${DS.success.text}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className={`text-xl font-serif ${DS.success.text}`}>Opinión de Auditoría</h2>
                <CheckCircle2 className={`w-5 h-5 ${DS.success.text}`} />
              </div>
              <p className="text-3xl font-serif text-neutral-900 mb-3">{reportData.opinion.type}</p>
              <p className="text-sm text-neutral-600 max-w-2xl">
                En nuestra opinión, las cuentas anuales adjuntas expresan, en todos los aspectos significativos, 
                la imagen fiel del patrimonio y de la situación financiera de <span className="font-medium">{reportData.client}</span> a 
                31 de diciembre de 2025, así como de sus resultados y flujos de efectivo correspondientes al ejercicio 
                terminado en dicha fecha, de conformidad con el marco normativo de información financiera que resulta 
                de aplicación y, en particular, con los principios y criterios contables contenidos en el mismo.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-neutral-200 p-5 rounded"
          >
            <div className="flex items-center gap-2 mb-3">
              <Euro className="w-4 h-4 text-neutral-400" />
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Total Activo</span>
            </div>
            <div className="text-2xl font-serif text-neutral-900 tabular-nums">{formatCurrency(reportData.financials.totalAssets)}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-neutral-200 p-5 rounded"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-neutral-400" />
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Cifra de Negocios</span>
            </div>
            <div className="text-2xl font-serif text-neutral-900 tabular-nums">{formatCurrency(reportData.financials.revenue)}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-neutral-200 p-5 rounded"
          >
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-neutral-400" />
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Materialidad</span>
            </div>
            <div className="text-2xl font-serif text-neutral-900 tabular-nums">{formatCurrency(reportData.financials.materiality)}</div>
            <div className="text-[10px] text-neutral-400 mt-1">
              Ejecución: {formatCurrency(reportData.financials.performanceMateriality)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white border border-neutral-200 p-5 rounded"
          >
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-neutral-400" />
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Cobertura Tests</span>
            </div>
            <div className="text-2xl font-serif text-neutral-900 tabular-nums">{reportData.testsPerformed.coverage}%</div>
            <div className="text-[10px] text-neutral-400 mt-1">
              {reportData.testsPerformed.total} tests ejecutados
            </div>
          </motion.div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* Accounts Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-neutral-200 rounded overflow-hidden"
          >
            <button
              onClick={() => toggleSection('accounts')}
              className="w-full flex items-center justify-between px-6 py-4 bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-neutral-500" />
                <span className="font-medium text-neutral-900">Resumen por Áreas Auditadas</span>
                <span className="text-xs text-neutral-400">{reportData.accountsSummary.length} áreas</span>
              </div>
              {expandedSections.includes('accounts') ? (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              )}
            </button>
            
            <AnimatePresence>
              {expandedSections.includes('accounts') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-y border-neutral-200">
                      <tr className="text-[10px] text-neutral-500 uppercase tracking-wider">
                        <th className="text-left px-6 py-3 font-medium">Área</th>
                        <th className="text-left px-6 py-3 font-medium">Código</th>
                        <th className="text-right px-6 py-3 font-medium">Saldo</th>
                        <th className="text-center px-6 py-3 font-medium">Hallazgos</th>
                        <th className="text-center px-6 py-3 font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {reportData.accountsSummary.map((account, i) => (
                        <tr key={i} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-3">
                            <span className="text-sm font-medium text-neutral-900">{account.name}</span>
                          </td>
                          <td className="px-6 py-3">
                            <span className="text-xs font-mono text-neutral-500">{account.code}</span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <span className="text-sm font-mono text-neutral-700">{formatCurrency(account.balance)}</span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            {account.findings > 0 ? (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${DS.success.bg} ${DS.success.text}`}>
                                <CheckCircle2 className="w-3 h-3" />
                                {account.findings} resueltos
                              </span>
                            ) : (
                              <span className="text-xs text-neutral-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded ${DS.success.bg} ${DS.success.text}`}>
                              <Check className="w-3 h-3" />
                              Completado
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Findings Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="border border-neutral-200 rounded overflow-hidden"
          >
            <button
              onClick={() => toggleSection('findings')}
              className="w-full flex items-center justify-between px-6 py-4 bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-neutral-500" />
                <span className="font-medium text-neutral-900">Resumen de Hallazgos</span>
                <span className={`text-xs px-2 py-0.5 rounded ${DS.success.bg} ${DS.success.text}`}>
                  {reportData.findingsSummary.resolved}/{reportData.findingsSummary.total} resueltos
                </span>
              </div>
              {expandedSections.includes('findings') ? (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              )}
            </button>
            
            <AnimatePresence>
              {expandedSections.includes('findings') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-neutral-50 rounded">
                      <div className="text-3xl font-serif text-neutral-900 tabular-nums">{reportData.findingsSummary.total}</div>
                      <div className="text-xs text-neutral-500 mt-1">Total detectados</div>
                    </div>
                    <div className={`text-center p-4 rounded ${DS.success.bg}`}>
                      <div className={`text-3xl font-serif tabular-nums ${DS.success.text}`}>{reportData.findingsSummary.adjusted}</div>
                      <div className="text-xs text-neutral-500 mt-1">Ajustados</div>
                    </div>
                    <div className="text-center p-4 bg-neutral-50 rounded">
                      <div className="text-3xl font-serif text-neutral-900 tabular-nums">{reportData.findingsSummary.waived}</div>
                      <div className="text-xs text-neutral-500 mt-1">No ajustados (NUD)</div>
                    </div>
                    <div className={`text-center p-4 rounded ${DS.success.bg}`}>
                      <div className={`text-3xl font-serif tabular-nums ${DS.success.text}`}>0</div>
                      <div className="text-xs text-neutral-500 mt-1">Pendientes</div>
                    </div>
                  </div>
                  
                  <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Por categoría</h4>
                  <div className="space-y-2">
                    {reportData.findingsSummary.categories.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                        <span className="text-sm text-neutral-700">{cat.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono text-neutral-500">{cat.count}</span>
                          <span className={`inline-flex items-center gap-1 text-xs ${DS.success.text}`}>
                            <CheckCircle2 className="w-3 h-3" />
                            {cat.resolved} resueltos
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Team & Hours Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border border-neutral-200 rounded overflow-hidden"
          >
            <button
              onClick={() => toggleSection('team')}
              className="w-full flex items-center justify-between px-6 py-4 bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-neutral-500" />
                <span className="font-medium text-neutral-900">Equipo y Horas</span>
                <span className="text-xs text-neutral-400">
                  {reportData.hours.actual}h de {reportData.hours.budgeted}h presupuestadas
                </span>
              </div>
              {expandedSections.includes('team') ? (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              )}
            </button>
            
            <AnimatePresence>
              {expandedSections.includes('team') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">Equipo de auditoría</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded">
                          <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                            EM
                          </div>
                          <div>
                            <div className="text-sm font-medium text-neutral-900">{reportData.partner}</div>
                            <div className="text-xs text-neutral-500">Socio responsable</div>
                          </div>
                          <div className="ml-auto text-right">
                            <div className="text-sm font-mono text-neutral-700">{reportData.hours.partner}h</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded">
                          <div className="w-10 h-10 rounded-full bg-neutral-700 text-white flex items-center justify-center text-xs font-bold">
                            CD
                          </div>
                          <div>
                            <div className="text-sm font-medium text-neutral-900">{reportData.manager}</div>
                            <div className="text-xs text-neutral-500">Manager</div>
                          </div>
                          <div className="ml-auto text-right">
                            <div className="text-sm font-mono text-neutral-700">{reportData.hours.manager}h</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded">
                          <div className="w-10 h-10 rounded-full bg-neutral-500 text-white flex items-center justify-center text-xs font-bold">
                            AR
                          </div>
                          <div>
                            <div className="text-sm font-medium text-neutral-900">{reportData.senior}</div>
                            <div className="text-xs text-neutral-500">Senior</div>
                          </div>
                          <div className="ml-auto text-right">
                            <div className="text-sm font-mono text-neutral-700">{reportData.hours.senior}h</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">Resumen de ejecución</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-neutral-600">Horas consumidas</span>
                            <span className={`font-mono font-medium ${DS.success.text}`}>
                              {reportData.hours.actual}h / {reportData.hours.budgeted}h
                            </span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${DS.success.bg.replace('bg-[#F7F9F7]', 'bg-[#4A5D4A]')}`}
                              style={{ width: `${(reportData.hours.actual / reportData.hours.budgeted) * 100}%`, backgroundColor: DS.success.solid }}
                            />
                          </div>
                          <div className={`text-xs mt-1 ${DS.success.text}`}>
                            {reportData.hours.budgeted - reportData.hours.actual}h bajo presupuesto ✓
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-neutral-200">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-neutral-600">Duración del encargo</span>
                            <span className="font-mono text-neutral-900">
                              {reportData.timeline.totalDays} días
                            </span>
                          </div>
                          <div className="text-xs text-neutral-400">
                            Planificación: {reportData.timeline.planningStart} → Informe: {reportData.timeline.reportDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-neutral-50 rounded-lg border border-neutral-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-1">Informe generado correctamente</h3>
              <p className="text-xs text-neutral-500">
                Este informe ha sido generado automáticamente a partir del trabajo de auditoría realizado.
                Revise y valide antes de su emisión oficial.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-600 border border-neutral-300 rounded hover:bg-white transition-colors">
                <ExternalLink className="w-4 h-4" />
                Ver papeles de trabajo
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded hover:bg-neutral-800 transition-colors">
                <Share2 className="w-4 h-4" />
                Compartir con equipo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

