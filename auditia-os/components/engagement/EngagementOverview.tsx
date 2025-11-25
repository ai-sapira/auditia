import React, { useState } from 'react';
import { 
  PanelRight, 
  PanelRightClose, 
  ArrowRight, 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Euro, 
  Timer, 
  BarChart3, 
  Wallet,
  AlertCircle,
  CheckCircle2,
  FileText,
  Users,
  Target,
  Percent,
  Activity,
  Calendar,
  Building2,
  CircleDot,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  PieChart
} from 'lucide-react';
import { TimelineEvent } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ========================================================================
 * DESIGN SYSTEM v2.0 - Color Constants
 * Legora + Devin inspired: Sobrio, Profesional, Regulado
 * ========================================================================
 */
const DS = {
  // Estados - Muy desaturados
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
  // Dot colors for timeline
  dot: {
    data: 'bg-[#4A5D4A]',
    test: 'bg-neutral-900',
    finding: 'bg-[#8B5A50]',
    request: 'bg-[#4A5D6A]',
    default: 'bg-neutral-400',
  },
  // Progress bar colors
  progress: {
    under: 'bg-[#4A5D4A]',
    over: 'bg-[#8B5A50]',
    warning: 'bg-[#8B7355]',
    neutral: 'bg-neutral-900',
  }
};

interface EngagementOverviewProps {
  showTimeline: boolean;
  setShowTimeline: (show: boolean) => void;
  progressData: { name: string; value: number; color: string }[];
  timeline: TimelineEvent[];
  onSelectArea?: (areaId: string) => void;
}

export const EngagementOverview: React.FC<EngagementOverviewProps> = ({
  showTimeline,
  setShowTimeline,
  progressData,
  timeline,
  onSelectArea
}) => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<'overview' | 'profitability'>('overview');

  // ========== MOCK DATA ==========
  const engagementData = {
    name: 'Auditoría 2025',
    client: 'Grupo Alfa',
    clientSector: 'Manufacturing',
    period: '01/01/2025–31/12/2025',
    status: 'En curso' as 'No iniciado' | 'En curso' | 'Cerrado',
    startDate: '15/01/2025',
    expectedEnd: '30/04/2025',
    daysRemaining: 67,
    progress: 65,
    findingsOpen: 8,
    findingsClosed: 12,
    findingsTotal: 20,
    requestsPending: 3,
    requestsCompleted: 7,
    riskLevel: 'Medio',
    manager: 'Carlos D.',
    partner: 'Elena M.',
  };

  const suppliersArea = {
    name: 'Proveedores',
    code: '40',
    saldo: 18890000,
    materialidad: 900000,
    dataLoaded: 85,
    testsExecuted: 72,
    testsTotal: 4,
    testsCompleted: 3,
    findingsOpen: 5,
    findingsClosed: 3,
    coverage: 78,
    lastActivity: 'Hace 2 horas',
  };

  const otherAccounts = [
    { code: '43', name: 'Clientes', saldo: 12500000, status: 'No iniciado', progress: 0 },
    { code: '57', name: 'Bancos', saldo: 8900000, status: 'No iniciado', progress: 0 },
    { code: '20', name: 'Inmovilizado', saldo: 45000000, status: 'No iniciado', progress: 0 },
    { code: '60', name: 'Compras', saldo: 32000000, status: 'No iniciado', progress: 0 },
  ];

  const recentActivity = [
    { id: '1', action: 'Cargados datos de Proveedores', time: 'Hace 2 horas', user: 'Alejandro R.', type: 'data', icon: FileText },
    { id: '2', action: 'Ejecutado test de cuadre (Reconciler)', time: 'Hace 4 horas', user: 'Sistema', type: 'test', icon: CheckCircle2 },
    { id: '3', action: 'Creado hallazgo H-023', time: 'Ayer', user: 'María G.', type: 'finding', icon: AlertCircle },
    { id: '4', action: 'Completada solicitud REQ-012', time: 'Ayer', user: 'Cliente', type: 'request', icon: Users },
    { id: '5', action: 'Enviadas circularizaciones (12)', time: 'Hace 2 días', user: 'Alejandro R.', type: 'test', icon: CheckCircle2 },
  ];

  // ========== PROFITABILITY DATA ==========
  const profitabilityData = {
    budget: {
      hours: 180,
      amount: 45000,
      avgRate: 250
    },
    actual: {
      hours: 127,
      amount: 31750
    },
    billed: {
      hours: 95,
      amount: 23750
    },
    teamBreakdown: [
      { role: 'Socio', name: 'Elena M.', budgeted: 20, actual: 18, rate: 350, billable: true },
      { role: 'Manager', name: 'Carlos D.', budgeted: 40, actual: 35, rate: 250, billable: true },
      { role: 'Senior', name: 'Alejandro R.', budgeted: 60, actual: 52, rate: 180, billable: true },
      { role: 'Staff', name: 'María G.', budgeted: 60, actual: 22, rate: 120, billable: true },
    ],
    weeklyProgress: [
      { week: 'S1', budgeted: 15, actual: 12 },
      { week: 'S2', budgeted: 15, actual: 18 },
      { week: 'S3', budgeted: 20, actual: 22 },
      { week: 'S4', budgeted: 25, actual: 20 },
      { week: 'S5', budgeted: 25, actual: 28 },
      { week: 'S6', budgeted: 20, actual: 15 },
      { week: 'S7', budgeted: 20, actual: 12 },
      { week: 'S8', budgeted: 20, actual: 0 },
    ],
    // Potential profitability metrics
    potential: {
      hoursRemaining: 53,
      estimatedCompletion: 145, // Estimated total hours at completion
      projectedMargin: 28.5, // Percentage
      budgetAtCompletion: 36250, // Estimated total cost
      varianceAtCompletion: 8750, // Positive = under budget
      efficiency: 112, // Percentage (higher = more efficient)
      realization: 94, // Percentage billed vs. worked
      effectiveRate: 267, // Actual avg rate being charged
      roi: 156, // Return on investment percentage
    }
  };

  // ========== COMPUTED VALUES ==========
  const hoursUsagePercent = Math.round((profitabilityData.actual.hours / profitabilityData.budget.hours) * 100);
  const budgetUsagePercent = Math.round((profitabilityData.actual.amount / profitabilityData.budget.amount) * 100);
  const billedPercent = Math.round((profitabilityData.billed.amount / profitabilityData.actual.amount) * 100);
  const findingsResolutionRate = Math.round((engagementData.findingsClosed / engagementData.findingsTotal) * 100);

  // ========== HELPER FUNCTIONS ==========
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'En curso':
        return `${DS.success.bg} ${DS.success.text} ${DS.success.border}`;
      case 'Cerrado':
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
      default:
        return 'bg-neutral-50 text-neutral-500 border-neutral-200';
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent > 100) return { text: DS.error.text, bar: DS.progress.over };
    if (percent > 80) return { text: DS.warning.text, bar: DS.progress.warning };
    return { text: DS.success.text, bar: DS.progress.under };
  };

  const getDotColor = (type: string) => {
    return DS.dot[type as keyof typeof DS.dot] || DS.dot.default;
  };

  const hoursColor = getProgressColor(hoursUsagePercent);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M €`;
    }
    return amount.toLocaleString('es-ES') + ' €';
  };

  // ========== MINI CHART COMPONENT ==========
  const MiniProgressRing = ({ percent, size = 40, strokeWidth = 3, color = 'neutral' }: { percent: number; size?: number; strokeWidth?: number; color?: string }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percent / 100) * circumference;
    const colorClass = color === 'success' ? DS.success.solid : color === 'warning' ? DS.warning.solid : '#171717';
    
    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E5E5"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-white">
      {/* Header */}
      <div className="flex justify-between items-start px-10 pt-8 pb-6 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-serif text-neutral-900">{engagementData.name}</h1>
            <span className={`text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded border ${getStatusStyle(engagementData.status)}`}>
              {engagementData.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span className="font-medium text-neutral-700">{engagementData.client}</span>
              <span className="text-neutral-300">·</span>
              <span>{engagementData.clientSector}</span>
            </div>
            <div className="w-px h-4 bg-neutral-200" />
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">{engagementData.period}</span>
            </div>
            <div className="w-px h-4 bg-neutral-200" />
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{engagementData.partner} / {engagementData.manager}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-neutral-100 rounded p-1">
            <button
              onClick={() => setActiveSection('overview')}
              className={`px-4 py-2 text-xs font-medium rounded transition-all ${
                activeSection === 'overview' 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveSection('profitability')}
              className={`px-4 py-2 text-xs font-medium rounded transition-all flex items-center gap-1.5 ${
                activeSection === 'profitability' 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Rentabilidad
            </button>
          </div>
          <button 
            onClick={() => setShowTimeline(!showTimeline)}
            className={`p-2 rounded hover:bg-neutral-100 transition-colors ${showTimeline ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-400'}`}
          >
            {showTimeline ? <PanelRightClose className="w-5 h-5" /> : <PanelRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-10 py-8 animate-fade-in">
        <AnimatePresence mode="wait">
          {/* ==================== SECTION: Overview ==================== */}
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Key Indicators Grid */}
              <div className="grid grid-cols-4 gap-6 mb-10">
                {/* Progress Card */}
                <div className="bg-white border border-neutral-200 p-5 rounded">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Avance del encargo</span>
                      <span className="text-3xl font-serif text-neutral-900 tabular-nums">{engagementData.progress}%</span>
                    </div>
                    <MiniProgressRing percent={engagementData.progress} size={48} strokeWidth={4} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-3 border-t border-neutral-100">
                    <span>Días restantes: {engagementData.daysRemaining}</span>
                    <span className="font-mono">→ {engagementData.expectedEnd}</span>
                  </div>
                </div>

                {/* Findings Card */}
                <div 
                  className="bg-white border border-neutral-200 p-5 rounded cursor-pointer hover:border-neutral-300 transition-colors group"
                  onClick={() => onSelectArea && onSelectArea('findings')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Hallazgos</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-serif text-neutral-900 tabular-nums">{engagementData.findingsOpen}</span>
                        <span className="text-sm text-neutral-400">/ {engagementData.findingsTotal}</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded ${engagementData.findingsOpen > 5 ? DS.warning.bg : DS.success.bg}`}>
                      <AlertCircle className={`w-4 h-4 ${engagementData.findingsOpen > 5 ? DS.warning.text : DS.success.text}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] pt-3 border-t border-neutral-100">
                    <span className="text-neutral-400">{findingsResolutionRate}% resueltos</span>
                    <span className={`font-medium ${DS.success.text}`}>{engagementData.findingsClosed} cerrados</span>
                  </div>
                </div>

                {/* Requests Card */}
                <div 
                  className="bg-white border border-neutral-200 p-5 rounded cursor-pointer hover:border-neutral-300 transition-colors group"
                  onClick={() => onSelectArea && onSelectArea('client-requests')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Solicitudes cliente</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-serif text-neutral-900 tabular-nums">{engagementData.requestsPending}</span>
                        <span className="text-sm text-neutral-400">pendientes</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded ${engagementData.requestsPending > 2 ? DS.warning.bg : 'bg-neutral-100'}`}>
                      <Users className={`w-4 h-4 ${engagementData.requestsPending > 2 ? DS.warning.text : 'text-neutral-500'}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] pt-3 border-t border-neutral-100">
                    <span className="text-neutral-400">{engagementData.requestsCompleted} completadas</span>
                    <span className="text-neutral-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver todas <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Budget Card */}
                <div className="bg-white border border-neutral-200 p-5 rounded">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Horas imputadas</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-serif text-neutral-900 tabular-nums">{profitabilityData.actual.hours}</span>
                        <span className="text-sm text-neutral-400">/ {profitabilityData.budget.hours}h</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded ${hoursUsagePercent > 90 ? DS.warning.bg : 'bg-neutral-100'}`}>
                      <Timer className={`w-4 h-4 ${hoursUsagePercent > 90 ? DS.warning.text : 'text-neutral-500'}`} />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-neutral-100">
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(hoursUsagePercent, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${hoursColor.bar}`}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px]">
                      <span className="text-neutral-400">{hoursUsagePercent}% consumido</span>
                      <span className={hoursColor.text}>{profitabilityData.budget.hours - profitabilityData.actual.hours}h restantes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accounts to Audit Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-sans text-neutral-500 uppercase tracking-widest">Cuentas a auditar</h3>
                  <span className="text-[10px] text-neutral-400">1 de 5 cuentas en proceso</span>
                </div>
                
                {/* Suppliers Card (Active/Detailed) */}
                <motion.div 
                  className="bg-white border border-neutral-200 p-6 mb-4 group hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer rounded"
                  onClick={() => onSelectArea && onSelectArea('40')}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className={`w-2 h-2 rounded-full ${DS.success.bg.replace('bg-', 'bg-').replace('[#F7F9F7]', '[#4A5D4A]')}`} style={{ backgroundColor: DS.success.solid }} />
                        <h4 className="text-lg font-serif text-neutral-900">{suppliersArea.name}</h4>
                        <span className="text-xs text-neutral-400 font-mono bg-neutral-100 px-2 py-0.5 rounded">{suppliersArea.code}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${DS.success.bg} ${DS.success.text}`}>En proceso</span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-neutral-400 mb-5 ml-5">
                        <span>Saldo: <span className="font-mono text-neutral-600">{formatCurrency(suppliersArea.saldo)}</span></span>
                        <span>·</span>
                        <span>Materialidad: <span className="font-mono text-neutral-600">{formatCurrency(suppliersArea.materialidad)}</span></span>
                        <span>·</span>
                        <span>Última actividad: {suppliersArea.lastActivity}</span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-6 ml-5">
                        <div>
                          <span className="text-[10px] text-neutral-500 block mb-2 uppercase tracking-wide">Datos cargados</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-serif text-neutral-900 tabular-nums">{suppliersArea.dataLoaded}%</span>
                            <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                              <div className="bg-neutral-900 h-full rounded-full transition-all" style={{ width: `${suppliersArea.dataLoaded}%` }}></div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block mb-2 uppercase tracking-wide">Tests ejecutados</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-serif text-neutral-900 tabular-nums">{suppliersArea.testsCompleted}/{suppliersArea.testsTotal}</span>
                            <div className="flex gap-1">
                              {[...Array(suppliersArea.testsTotal)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-3 h-3 rounded-sm ${i < suppliersArea.testsCompleted ? 'bg-neutral-900' : 'bg-neutral-200'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block mb-2 uppercase tracking-wide">Cobertura</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-serif text-neutral-900 tabular-nums">{suppliersArea.coverage}%</span>
                            <span className="text-[10px] text-neutral-400">del saldo</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block mb-2 uppercase tracking-wide">Hallazgos</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xl font-serif tabular-nums ${suppliersArea.findingsOpen > 3 ? DS.warning.text : 'text-neutral-900'}`}>{suppliersArea.findingsOpen}</span>
                            <span className="text-[10px] text-neutral-400">abiertos</span>
                            <span className="text-neutral-300">·</span>
                            <span className={`text-sm font-serif ${DS.success.text}`}>{suppliersArea.findingsClosed}</span>
                            <span className="text-[10px] text-neutral-400">cerrados</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-900 transition-colors ml-4" />
                  </div>
                </motion.div>

                {/* Other Accounts Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {otherAccounts.map((account) => (
                    <div key={account.code} className="bg-neutral-50 border border-neutral-200 p-4 rounded opacity-60">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                          <span className="text-sm font-medium text-neutral-700">{account.name}</span>
                        </div>
                        <span className="text-[9px] text-neutral-400 font-mono">{account.code}</span>
                      </div>
                      <div className="text-[10px] text-neutral-400 mb-2">
                        Saldo: <span className="font-mono">{formatCurrency(account.saldo)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-neutral-300" />
                        <span className="text-[10px] text-neutral-400">{account.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Section */}
              <div>
                <h3 className="text-[11px] font-sans text-neutral-500 uppercase tracking-widest mb-4">Actividad reciente</h3>
                <div className="bg-white border border-neutral-200 rounded overflow-hidden">
                  {recentActivity.map((activity, i) => {
                    const Icon = activity.icon;
                    return (
                      <div 
                        key={activity.id} 
                        className={`flex items-center gap-4 px-5 py-3 hover:bg-neutral-50 transition-colors ${i !== recentActivity.length - 1 ? 'border-b border-neutral-100' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getDotColor(activity.type).replace('bg-', 'bg-opacity-10 bg-')}`}>
                          <Icon className={`w-4 h-4 ${getDotColor(activity.type).replace('bg-', 'text-').replace('[', '').replace(']', '')}`} style={{ color: activity.type === 'data' ? DS.success.solid : activity.type === 'finding' ? DS.error.solid : activity.type === 'request' ? DS.info.solid : '#171717' }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-neutral-900">{activity.action}</p>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-neutral-400">
                          <span>{activity.user}</span>
                          <span className="font-mono">{activity.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== SECTION: Profitability ==================== */}
          {activeSection === 'profitability' && (
            <motion.div
              key="profitability"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Main Profitability KPIs */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-neutral-200 p-5 rounded">
                  <div className="flex items-center gap-2 mb-3">
                    <Timer className="w-4 h-4 text-neutral-400" />
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Horas Ppto.</span>
                  </div>
                  <div className="text-3xl font-serif text-neutral-900 tabular-nums">{profitabilityData.budget.hours}h</div>
                  <div className="text-xs text-neutral-400 mt-2">
                    {formatCurrency(profitabilityData.budget.amount)} presupuesto
                  </div>
                </div>
                
                <div className="bg-white border border-neutral-200 p-5 rounded">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-neutral-400" />
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Horas Imputadas</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-serif tabular-nums ${hoursUsagePercent > 100 ? DS.error.text : 'text-neutral-900'}`}>
                      {profitabilityData.actual.hours}h
                    </span>
                    <span className={`text-sm font-medium ${hoursColor.text}`}>
                      ({hoursUsagePercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full mt-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(hoursUsagePercent, 100)}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${hoursColor.bar}`}
                    />
                  </div>
                </div>
                
                <div className="bg-white border border-neutral-200 p-5 rounded">
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="w-4 h-4 text-neutral-400" />
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">WIP Actual</span>
                  </div>
                  <div className="text-3xl font-serif text-neutral-900 tabular-nums">
                    {formatCurrency(profitabilityData.actual.amount)}
                  </div>
                  <div className={`text-xs mt-2 flex items-center gap-1 ${budgetUsagePercent > 100 ? DS.error.text : DS.success.text}`}>
                    {budgetUsagePercent > 100 ? (
                      <>
                        <ArrowUpRight className="w-3 h-3" />
                        <span>Sobre presupuesto</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="w-3 h-3" />
                        <span>Dentro de presupuesto</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="bg-white border border-neutral-200 p-5 rounded">
                  <div className="flex items-center gap-2 mb-3">
                    <Euro className="w-4 h-4 text-neutral-400" />
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Facturado</span>
                  </div>
                  <div className={`text-3xl font-serif tabular-nums ${DS.success.text}`}>
                    {formatCurrency(profitabilityData.billed.amount)}
                  </div>
                  <div className="text-xs text-neutral-400 mt-2">
                    {billedPercent}% del WIP facturado
                  </div>
                </div>
              </div>

              {/* Potential Profitability Section - NEW */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-neutral-400" />
                  <h3 className="text-[11px] font-sans text-neutral-500 uppercase tracking-widest">Rentabilidad Potencial (Proyección)</h3>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {/* Estimated at Completion */}
                  <div className="bg-neutral-50 border border-neutral-200 p-5 rounded">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">EAC (Est. at Completion)</div>
                    <div className="text-2xl font-serif text-neutral-900 tabular-nums mb-1">
                      {profitabilityData.potential.estimatedCompletion}h
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${profitabilityData.potential.estimatedCompletion < profitabilityData.budget.hours ? DS.success.text : DS.error.text}`}>
                      {profitabilityData.potential.estimatedCompletion < profitabilityData.budget.hours ? (
                        <><ArrowDownRight className="w-3 h-3" /> {profitabilityData.budget.hours - profitabilityData.potential.estimatedCompletion}h bajo ppto.</>
                      ) : (
                        <><ArrowUpRight className="w-3 h-3" /> {profitabilityData.potential.estimatedCompletion - profitabilityData.budget.hours}h sobre ppto.</>
                      )}
                    </div>
                  </div>

                  {/* Projected Margin */}
                  <div className="bg-neutral-50 border border-neutral-200 p-5 rounded">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Margen Proyectado</div>
                    <div className={`text-2xl font-serif tabular-nums ${profitabilityData.potential.projectedMargin > 20 ? DS.success.text : DS.warning.text}`}>
                      {profitabilityData.potential.projectedMargin}%
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      Ahorro: {formatCurrency(profitabilityData.potential.varianceAtCompletion)}
                    </div>
                  </div>

                  {/* Efficiency */}
                  <div className="bg-neutral-50 border border-neutral-200 p-5 rounded">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Eficiencia</div>
                    <div className={`text-2xl font-serif tabular-nums ${profitabilityData.potential.efficiency >= 100 ? DS.success.text : DS.error.text}`}>
                      {profitabilityData.potential.efficiency}%
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      {profitabilityData.potential.efficiency >= 100 ? 'Sobre rendimiento estándar' : 'Bajo rendimiento estándar'}
                    </div>
                  </div>

                  {/* Realization Rate */}
                  <div className="bg-neutral-50 border border-neutral-200 p-5 rounded">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Tasa Realización</div>
                    <div className={`text-2xl font-serif tabular-nums ${profitabilityData.potential.realization >= 90 ? DS.success.text : DS.warning.text}`}>
                      {profitabilityData.potential.realization}%
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      Horas facturables vs. trabajadas
                    </div>
                  </div>

                  {/* Effective Rate */}
                  <div className="bg-neutral-50 border border-neutral-200 p-5 rounded">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Tarifa Efectiva</div>
                    <div className={`text-2xl font-serif tabular-nums ${profitabilityData.potential.effectiveRate >= profitabilityData.budget.avgRate ? DS.success.text : DS.error.text}`}>
                      {profitabilityData.potential.effectiveRate}€/h
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      vs. {profitabilityData.budget.avgRate}€/h ppto.
                    </div>
                  </div>
                </div>

                {/* ROI Highlight */}
                <div className="mt-4 bg-neutral-900 text-white p-5 rounded flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">ROI Proyectado del Encargo</div>
                      <div className="text-3xl font-serif tabular-nums">{profitabilityData.potential.roi}%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Beneficio Neto Estimado</div>
                    <div className="text-2xl font-serif tabular-nums">{formatCurrency(profitabilityData.budget.amount - profitabilityData.potential.budgetAtCompletion)}</div>
                  </div>
                </div>
              </div>

              {/* Team Breakdown Table */}
              <div className="mb-8">
                <h3 className="text-[11px] font-sans text-neutral-500 uppercase tracking-widest mb-4">Desglose por Equipo</h3>
                <div className="bg-white border border-neutral-200 rounded overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr className="text-[10px] text-neutral-500 uppercase tracking-wider">
                        <th className="text-left px-5 py-3 font-medium">Rol</th>
                        <th className="text-left px-5 py-3 font-medium">Nombre</th>
                        <th className="text-right px-5 py-3 font-medium">Horas Ppto.</th>
                        <th className="text-right px-5 py-3 font-medium">Horas Reales</th>
                        <th className="text-right px-5 py-3 font-medium">Desviación</th>
                        <th className="text-right px-5 py-3 font-medium">Tarifa/h</th>
                        <th className="text-right px-5 py-3 font-medium">Importe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {profitabilityData.teamBreakdown.map((member, i) => {
                        const deviation = member.actual - member.budgeted;
                        const deviationPercent = Math.round((deviation / member.budgeted) * 100);
                        const amount = member.actual * member.rate;
                        const deviationColor = deviation > 0 ? DS.error.text : deviation < 0 ? DS.success.text : 'text-neutral-400';
                        
                        return (
                          <tr key={i} className="hover:bg-neutral-50 transition-colors">
                            <td className="px-5 py-4">
                              <span className="text-xs font-medium text-neutral-900">{member.role}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-xs text-neutral-600">{member.name}</span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <span className="text-xs font-mono text-neutral-500">{member.budgeted}h</span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <span className="text-xs font-mono text-neutral-900 font-medium">{member.actual}h</span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <span className={`text-xs font-mono font-medium ${deviationColor}`}>
                                {deviation > 0 ? '+' : ''}{deviation}h ({deviationPercent > 0 ? '+' : ''}{deviationPercent}%)
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <span className="text-xs font-mono text-neutral-500">{member.rate}€</span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <span className="text-xs font-mono text-neutral-900 font-medium">
                                {formatCurrency(amount)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-neutral-50 border-t border-neutral-200">
                      <tr className="text-xs font-medium">
                        <td colSpan={2} className="px-5 py-3 text-neutral-900">Total</td>
                        <td className="px-5 py-3 text-right font-mono text-neutral-700">
                          {profitabilityData.budget.hours}h
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-neutral-900">
                          {profitabilityData.actual.hours}h
                        </td>
                        <td className={`px-5 py-3 text-right font-mono ${DS.success.text}`}>
                          -{profitabilityData.budget.hours - profitabilityData.actual.hours}h
                        </td>
                        <td className="px-5 py-3 text-right text-neutral-400">—</td>
                        <td className="px-5 py-3 text-right font-mono text-neutral-900">
                          {formatCurrency(profitabilityData.actual.amount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Weekly Progress Chart */}
              <div>
                <h3 className="text-[11px] font-sans text-neutral-500 uppercase tracking-widest mb-4">Evolución Semanal de Horas</h3>
                <div className="bg-white border border-neutral-200 p-6 rounded">
                  <div className="flex items-end gap-4 h-40">
                    {profitabilityData.weeklyProgress.map((week, i) => {
                      const maxValue = Math.max(...profitabilityData.weeklyProgress.map(w => Math.max(w.budgeted, w.actual)));
                      const budgetHeight = (week.budgeted / maxValue) * 100;
                      const actualHeight = (week.actual / maxValue) * 100;
                      
                      const getBarColor = () => {
                        if (week.actual === 0) return 'bg-neutral-100';
                        return week.actual > week.budgeted ? DS.progress.over : DS.progress.under;
                      };
                      
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div className="flex gap-1 items-end h-32 w-full justify-center">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${budgetHeight}%` }}
                              transition={{ delay: i * 0.05, duration: 0.3 }}
                              className="w-4 bg-neutral-200 rounded-t"
                            />
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${actualHeight}%` }}
                              transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                              className={`w-4 rounded-t ${getBarColor()}`}
                            />
                          </div>
                          <span className="text-[10px] text-neutral-500 font-mono">{week.week}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-neutral-200 rounded" />
                      <span className="text-[10px] text-neutral-500">Presupuestado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${DS.progress.under}`} />
                      <span className="text-[10px] text-neutral-500">Real (dentro ppto.)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${DS.progress.over}`} />
                      <span className="text-[10px] text-neutral-500">Real (sobre ppto.)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
