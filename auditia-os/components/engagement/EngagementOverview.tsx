import React, { useState } from 'react';
import { PanelRight, PanelRightClose, ArrowRight, Clock, ChevronRight, TrendingUp, TrendingDown, Euro, Timer, BarChart3, Wallet } from 'lucide-react';
import { TimelineEvent } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';

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
  },
  warning: {
    bg: 'bg-[#FDFAF6]',
    text: 'text-[#8B7355]',
    border: 'border-[#EDE5D8]',
  },
  error: {
    bg: 'bg-[#FBF8F7]',
    text: 'text-[#8B5A50]',
    border: 'border-[#E8E0DE]',
  },
  info: {
    bg: 'bg-[#F7F9FA]',
    text: 'text-[#4A5D6A]',
    border: 'border-[#E0E5E8]',
  },
  // Dot colors for timeline
  dot: {
    data: 'bg-[#4A5D4A]',      // Success green
    test: 'bg-neutral-900',    // Black
    finding: 'bg-[#8B5A50]',   // Error red
    request: 'bg-[#4A5D6A]',   // Info blue
    default: 'bg-neutral-400',
  },
  // Progress bar colors
  progress: {
    under: 'bg-[#4A5D4A]',     // Under budget (success)
    over: 'bg-[#8B5A50]',      // Over budget (error)
    warning: 'bg-[#8B7355]',   // Near limit (warning)
    neutral: 'bg-neutral-900', // Default
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

  // Mock data
  const engagementData = {
    name: 'Auditoría 2025',
    client: 'Grupo Alfa',
    period: '01/01/2025–31/12/2025',
    status: 'En curso' as 'No iniciado' | 'En curso' | 'Cerrado',
    progress: 65,
    findingsOpen: 8,
    findingsClosed: 12,
    requestsPending: 3,
    requestsCompleted: 7,
  };

  const suppliersArea = {
    name: 'Proveedores',
    code: '40',
    dataLoaded: 85,
    testsExecuted: 72,
    findingsOpen: 5,
  };

  const otherAccounts = [
    { code: '43', name: 'Clientes', status: 'No iniciado' },
    { code: '57', name: 'Bancos', status: 'No iniciado' },
    { code: '20', name: 'Inmovilizado', status: 'No iniciado' },
    { code: '60', name: 'Compras', status: 'No iniciado' },
  ];

  const recentActivity = [
    { id: '1', action: 'Cargados datos de Proveedores', time: 'Hace 2 horas', user: 'Alejandro R.', type: 'data' },
    { id: '2', action: 'Ejecutado test de cuadre (Reconciler)', time: 'Hace 4 horas', user: 'Sistema', type: 'test' },
    { id: '3', action: 'Creado hallazgo H-023', time: 'Ayer', user: 'María G.', type: 'finding' },
    { id: '4', action: 'Completada solicitud REQ-012', time: 'Ayer', user: 'Cliente', type: 'request' },
  ];

  // Profitability data
  const profitabilityData = {
    budget: {
      hours: 180,
      amount: 45000
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
      { role: 'Socio', name: 'Elena M.', budgeted: 20, actual: 18, rate: 350 },
      { role: 'Manager', name: 'Carlos D.', budgeted: 40, actual: 35, rate: 250 },
      { role: 'Senior', name: 'Alejandro R.', budgeted: 60, actual: 52, rate: 180 },
      { role: 'Staff', name: 'María G.', budgeted: 60, actual: 22, rate: 120 },
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
    ]
  };

  // Status badge - Design System compliant
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

  // Progress indicator colors
  const getProgressColor = (percent: number) => {
    if (percent > 100) return { text: DS.error.text, bar: DS.progress.over };
    if (percent > 80) return { text: DS.warning.text, bar: DS.progress.warning };
    return { text: DS.success.text, bar: DS.progress.under };
  };

  // Timeline dot color
  const getDotColor = (type: string) => {
    return DS.dot[type as keyof typeof DS.dot] || DS.dot.default;
  };

  const hoursUsagePercent = Math.round((profitabilityData.actual.hours / profitabilityData.budget.hours) * 100);
  const budgetUsagePercent = Math.round((profitabilityData.actual.amount / profitabilityData.budget.amount) * 100);
  const billedPercent = Math.round((profitabilityData.billed.amount / profitabilityData.actual.amount) * 100);

  const hoursColor = getProgressColor(hoursUsagePercent);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-white">
      {/* Overview Header */}
      <div className="flex justify-between items-start px-10 pt-10 mb-6">
        <div>
          <h1 className="text-3xl font-serif text-neutral-900">{t('engagement.overview_title')}</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Section Toggle - Neutral colors only */}
          <div className="flex bg-neutral-100 rounded p-1">
            <button
              onClick={() => setActiveSection('overview')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                activeSection === 'overview' 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveSection('profitability')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all flex items-center gap-1.5 ${
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
      
      <div className="flex-1 overflow-y-auto px-10 pb-10 animate-fade-in">
        {/* Engagement Header Card */}
        <div className="bg-white border border-neutral-200 p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-serif text-neutral-900 mb-3">{engagementData.name}</h2>
              <div className="flex items-center gap-6 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">{t('engagement.overview_client')}:</span>
                  <span className="font-medium">{engagementData.client}</span>
                </div>
                <div className="w-px h-4 bg-neutral-200"></div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span className="font-mono text-xs">{engagementData.period}</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium uppercase tracking-wider px-3 py-1.5 rounded border ${getStatusStyle(engagementData.status)}`}>
              {engagementData.status}
            </span>
          </div>
        </div>

        {/* SECTION: Overview */}
        {activeSection === 'overview' && (
          <>
            {/* Key Indicators - Grid with dividers */}
            <div className="grid grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 mb-10">
              <div className="bg-white p-6 h-32 flex flex-col justify-between">
                <span className="text-[11px] text-neutral-500 font-sans tracking-wide">{t('engagement.kpi_completion')}</span>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-serif text-neutral-900 tabular-nums">{engagementData.progress}%</span>
                  <div className="w-16 h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="bg-neutral-900 h-full transition-all" style={{ width: `${engagementData.progress}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 h-32 flex flex-col justify-between">
                <span className="text-[11px] text-neutral-500 font-sans tracking-wide">{t('engagement.overview_findings')}</span>
                <div className="flex items-end gap-3">
                  <div>
                    <span className="text-3xl font-serif text-neutral-900 tabular-nums">{engagementData.findingsOpen}</span>
                    <span className="text-xs text-neutral-400 ml-1">abiertos</span>
                  </div>
                  <div className="w-px h-8 bg-neutral-200"></div>
                  <div>
                    <span className="text-2xl font-serif text-neutral-500 tabular-nums">{engagementData.findingsClosed}</span>
                    <span className="text-xs text-neutral-400 ml-1">cerrados</span>
                  </div>
                </div>
              </div>
              
              <div 
                className={`bg-white p-6 h-32 flex flex-col justify-between ${engagementData.requestsPending > 2 ? 'cursor-pointer group hover:bg-neutral-50 transition-colors' : ''}`}
                onClick={engagementData.requestsPending > 2 && onSelectArea ? () => onSelectArea('client-requests') : undefined}
              >
                <span className="text-[11px] text-neutral-500 font-sans tracking-wide">{t('engagement.overview_requests')}</span>
                <div className="flex items-end gap-3">
                  <div>
                    <span className="text-3xl font-serif text-neutral-900 tabular-nums">{engagementData.requestsPending}</span>
                    <span className="text-xs text-neutral-400 ml-1">pendientes</span>
                  </div>
                  <div className="w-px h-8 bg-neutral-200"></div>
                  <div>
                    <span className="text-2xl font-serif text-neutral-500 tabular-nums">{engagementData.requestsCompleted}</span>
                    <span className="text-xs text-neutral-400 ml-1">completadas</span>
                  </div>
                </div>
                {engagementData.requestsPending > 2 && (
                  <div className="flex items-center gap-1 text-[10px] text-neutral-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Ver solicitudes</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>

            {/* Accounts to Audit Section */}
            <div className="mb-10">
              <h3 className="text-[11px] font-sans text-neutral-500 uppercase tracking-widest mb-4">{t('sidebar.audit_accounts')}</h3>
              
              {/* Suppliers Card (Active/Detailed) */}
              <div 
                className="bg-white border border-neutral-200 p-6 mb-4 group hover:border-neutral-300 transition-all cursor-pointer"
                onClick={() => onSelectArea && onSelectArea('40')}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h4 className="text-lg font-serif text-neutral-900">{suppliersArea.name}</h4>
                      <span className="text-xs text-neutral-400 font-mono">({suppliersArea.code})</span>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1 uppercase tracking-wide">{t('engagement.overview_data_loaded')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-serif text-neutral-900 tabular-nums">{suppliersArea.dataLoaded}%</span>
                          <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden max-w-20">
                            <div className="bg-neutral-900 h-full transition-all" style={{ width: `${suppliersArea.dataLoaded}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1 uppercase tracking-wide">{t('engagement.overview_tests_executed')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-serif text-neutral-900 tabular-nums">{suppliersArea.testsExecuted}%</span>
                          <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden max-w-20">
                            <div className="bg-neutral-900 h-full transition-all" style={{ width: `${suppliersArea.testsExecuted}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block mb-1 uppercase tracking-wide">{t('engagement.overview_findings_open')}</span>
                        <span className="text-xl font-serif text-neutral-900 tabular-nums">{suppliersArea.findingsOpen}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-900 transition-colors" />
                </div>
              </div>

              {/* Other Accounts (Inactive/Placeholders) */}
              <div className="grid grid-cols-2 gap-4">
                {otherAccounts.map((account) => (
                  <div key={account.code} className="bg-white border border-neutral-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-serif text-neutral-900">{account.name}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">({account.code})</span>
                        </div>
                        <span className="text-[10px] text-neutral-400">{account.status}</span>
                      </div>
                      <Clock className="w-4 h-4 text-neutral-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div>
              <h3 className="text-[11px] font-sans text-neutral-500 uppercase tracking-widest mb-4">{t('engagement.overview_recent_activity')}</h3>
              <div className="bg-white border border-neutral-200 p-6">
                <div className="relative pl-4 border-l border-neutral-200 space-y-8">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="relative">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${getDotColor(activity.type)}`}></div>
                      
                      <div className="flex flex-col">
                        <p className="text-xs font-medium text-neutral-900 mb-0.5">{activity.action}</p>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                          <span>{activity.time}</span>
                          <span>•</span>
                          <span>{activity.user}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* SECTION: Profitability Analysis */}
        {activeSection === 'profitability' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main Profitability KPIs */}
            <div className="grid grid-cols-4 gap-px bg-neutral-200 border border-neutral-200 mb-8">
              <div className="bg-white p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="w-4 h-4 text-neutral-400" />
                  <span className="text-[11px] text-neutral-500 font-sans tracking-wide uppercase">Horas Presupuestadas</span>
                </div>
                <div className="text-3xl font-serif text-neutral-900 tabular-nums">{profitabilityData.budget.hours}</div>
                <div className="text-xs text-neutral-400 mt-1">
                  {profitabilityData.budget.amount.toLocaleString('es-ES')} € en honorarios
                </div>
              </div>
              
              <div className="bg-white p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span className="text-[11px] text-neutral-500 font-sans tracking-wide uppercase">Horas Imputadas</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-serif tabular-nums ${hoursUsagePercent > 100 ? DS.error.text : 'text-neutral-900'}`}>
                    {profitabilityData.actual.hours}
                  </span>
                  <span className={`text-sm font-medium ${hoursColor.text}`}>
                    ({hoursUsagePercent}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full mt-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${hoursColor.bar}`}
                    style={{ width: `${Math.min(hoursUsagePercent, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-white p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-4 h-4 text-neutral-400" />
                  <span className="text-[11px] text-neutral-500 font-sans tracking-wide uppercase">WIP Actual</span>
                </div>
                <div className="text-3xl font-serif text-neutral-900 tabular-nums">
                  {profitabilityData.actual.amount.toLocaleString('es-ES')} €
                </div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${budgetUsagePercent > 100 ? DS.error.text : DS.success.text}`}>
                  {budgetUsagePercent > 100 ? (
                    <>
                      <TrendingUp className="w-3 h-3" />
                      <span>Sobre presupuesto</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3" />
                      <span>Dentro de presupuesto</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Euro className="w-4 h-4 text-neutral-400" />
                  <span className="text-[11px] text-neutral-500 font-sans tracking-wide uppercase">Facturado</span>
                </div>
                <div className={`text-3xl font-serif tabular-nums ${DS.success.text}`}>
                  {profitabilityData.billed.amount.toLocaleString('es-ES')} €
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {billedPercent}% del WIP facturado
                </div>
              </div>
            </div>

            {/* Team Breakdown Table */}
            <div className="mb-8">
              <h3 className="text-[11px] font-sans text-neutral-500 uppercase tracking-widest mb-4">Desglose por Equipo</h3>
              <div className="bg-white border border-neutral-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr className="text-[10px] text-neutral-500 uppercase tracking-wider">
                      <th className="text-left px-6 py-3 font-medium">Rol</th>
                      <th className="text-left px-6 py-3 font-medium">Nombre</th>
                      <th className="text-right px-6 py-3 font-medium">Horas Ppto.</th>
                      <th className="text-right px-6 py-3 font-medium">Horas Reales</th>
                      <th className="text-right px-6 py-3 font-medium">Desviación</th>
                      <th className="text-right px-6 py-3 font-medium">Tarifa/h</th>
                      <th className="text-right px-6 py-3 font-medium">Importe</th>
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
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-neutral-900">{member.role}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-neutral-600">{member.name}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-xs font-mono text-neutral-500">{member.budgeted}h</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-xs font-mono text-neutral-900 font-medium">{member.actual}h</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`text-xs font-mono font-medium ${deviationColor}`}>
                              {deviation > 0 ? '+' : ''}{deviation}h ({deviationPercent > 0 ? '+' : ''}{deviationPercent}%)
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-xs font-mono text-neutral-500">{member.rate} €</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-xs font-mono text-neutral-900 font-medium">
                              {amount.toLocaleString('es-ES')} €
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-neutral-50 border-t border-neutral-200">
                    <tr className="text-xs font-medium">
                      <td colSpan={2} className="px-6 py-3 text-neutral-900">Total</td>
                      <td className="px-6 py-3 text-right font-mono text-neutral-700">
                        {profitabilityData.budget.hours}h
                      </td>
                      <td className="px-6 py-3 text-right font-mono text-neutral-900">
                        {profitabilityData.actual.hours}h
                      </td>
                      <td className={`px-6 py-3 text-right font-mono ${DS.success.text}`}>
                        -{profitabilityData.budget.hours - profitabilityData.actual.hours}h
                      </td>
                      <td className="px-6 py-3 text-right text-neutral-400">—</td>
                      <td className="px-6 py-3 text-right font-mono text-neutral-900">
                        {profitabilityData.actual.amount.toLocaleString('es-ES')} €
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Weekly Progress Chart */}
            <div>
              <h3 className="text-[11px] font-sans text-neutral-500 uppercase tracking-widest mb-4">Evolución Semanal de Horas</h3>
              <div className="bg-white border border-neutral-200 p-6">
                <div className="flex items-end gap-4 h-40">
                  {profitabilityData.weeklyProgress.map((week, i) => {
                    const maxValue = Math.max(...profitabilityData.weeklyProgress.map(w => Math.max(w.budgeted, w.actual)));
                    const budgetHeight = (week.budgeted / maxValue) * 100;
                    const actualHeight = (week.actual / maxValue) * 100;
                    
                    // Determine bar color based on budget comparison
                    const getBarColor = () => {
                      if (week.actual === 0) return 'bg-neutral-100';
                      return week.actual > week.budgeted ? DS.progress.over : DS.progress.under;
                    };
                    
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex gap-1 items-end h-32 w-full justify-center">
                          {/* Budget bar */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${budgetHeight}%` }}
                            transition={{ delay: i * 0.05, duration: 0.3 }}
                            className="w-4 bg-neutral-200 rounded-t"
                          />
                          {/* Actual bar */}
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
                {/* Legend */}
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
      </div>
    </div>
  );
};
