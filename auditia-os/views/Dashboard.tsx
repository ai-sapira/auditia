
import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  ArrowUpRight,
  Euro,
  Receipt,
  Calendar,
  Target,
  PieChart,
  BarChart3,
  Percent
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

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

interface DashboardProps {
  onNavigate?: (view: string) => void;
  onSelectClient?: (clientId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectClient }) => {
  const { t } = useLanguage();
  const [hoveredAlert, setHoveredAlert] = useState<string | null>(null);

  // Firm financial metrics - realistic data for a boutique audit firm
  const firmFinancials = {
    annualRevenue: 6415000, // €6.415M
    ytdRevenue: 5550000, // €5.55M (11 months)
    ytdTarget: 5400000, // €5.4M target for this point
    lastYearRevenue: 5980000, // €5.98M
    revenueGrowth: 7.3, // 7.3% growth
    wip: 109450, // WIP total from top engagements
    accountsReceivable: 485000, // €485K pending collection
    avgDaysToCollect: 43, // 43 days average
    utilizationRate: 79, // 79% utilization
    realization: 92, // 92% realization rate
  };

  // Partner metrics (matching existing partners in the app)
  const partnerMetrics = [
    { name: 'Elena Martínez', revenue: 2520000, clients: 14, utilization: 82, target: 2400000 },
    { name: 'Javier Pérez', revenue: 2180000, clients: 12, utilization: 79, target: 2100000 },
    { name: 'Carlos Domínguez', revenue: 850000, clients: 8, utilization: 76, target: 900000 },
  ];

  // Revenue by sector (matching existing clients' sectors)
  const revenueBySector = [
    { sector: 'Servicios Financieros', revenue: 1850000, percentage: 29, clients: 8, growth: 8.2 },
    { sector: 'Industria / Manufacturing', revenue: 1800000, percentage: 28, clients: 12, growth: 4.5 },
    { sector: 'Tecnología', revenue: 980000, percentage: 15, clients: 6, growth: 12.3 },
    { sector: 'Healthcare / Pharma', revenue: 720000, percentage: 11, clients: 4, growth: 5.8 },
    { sector: 'Logística / Retail / Otros', revenue: 1065000, percentage: 17, clients: 9, growth: 1.2 },
  ];

  // Aging of receivables
  const receivablesAging = [
    { range: '0-30 días', amount: 228000, percentage: 47 },
    { range: '31-60 días', amount: 155000, percentage: 32 },
    { range: '61-90 días', amount: 60000, percentage: 12 },
    { range: '+90 días', amount: 42000, percentage: 9 },
  ];

  // Top pending engagements by fees (using existing clients)
  const topEngagements = [
    { 
      client: 'Zeta Bank', 
      fees: 120000,
      billed: 78000,
      wip: 42000,
      status: 'testing',
      progress: 48,
      partner: 'Javier Pérez'
    },
    { 
      client: 'Industrias Beta', 
      fees: 95000,
      billed: 62000,
      wip: 33000,
      status: 'testing',
      progress: 58,
      partner: 'Elena Martínez'
    },
    { 
      client: 'Grupo Alfa', 
      fees: 85000,
      billed: 48000,
      wip: 22450,
      status: 'testing',
      progress: 42,
      partner: 'Elena Martínez'
    },
    { 
      client: 'Epsilon Pharma', 
      fees: 72000,
      billed: 54000,
      wip: 12000,
      status: 'review',
      progress: 85,
      partner: 'Elena Martínez'
    },
  ];

  // Key alerts for management (using existing clients)
  const managementAlerts = [
    { 
      id: 'a1', 
      type: 'collection', 
      severity: 'high', 
      title: 'Cobro pendiente crítico',
      message: 'Gamma Logistics tiene €42.000 pendientes hace +90 días',
      action: 'Gestionar cobro'
    },
    { 
      id: 'a2', 
      type: 'budget', 
      severity: 'medium', 
      title: 'Desviación presupuestaria',
      message: 'Zeta Bank supera estimación en 18% de horas',
      action: 'Revisar encargo'
    },
    { 
      id: 'a3', 
      type: 'capacity', 
      severity: 'medium', 
      title: 'Capacidad equipo',
      message: 'Equipo de Carlos Domínguez al 95% en próximas 3 semanas',
      action: 'Planificar recursos'
    },
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M €`;
    }
    return `${(amount / 1000).toFixed(0)}K €`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'testing': return { bg: DS.warning.bg, text: DS.warning.text, label: 'En pruebas' };
      case 'review': return { bg: DS.info.bg, text: DS.info.text, label: 'En revisión' };
      case 'closed': return { bg: DS.success.bg, text: DS.success.text, label: 'Cerrado' };
      default: return { bg: 'bg-neutral-100', text: 'text-neutral-600', label: 'Planificación' };
    }
  };

  const getAlertStyle = (severity: string) => {
    switch (severity) {
      case 'high': return { bg: DS.error.bg, text: DS.error.text, border: DS.error.border };
      case 'medium': return { bg: DS.warning.bg, text: DS.warning.text, border: DS.warning.border };
      default: return { bg: 'bg-neutral-50', text: 'text-neutral-600', border: 'border-neutral-200' };
    }
  };

  const ytdPerformance = ((firmFinancials.ytdRevenue / firmFinancials.ytdTarget) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-12 pt-10 pb-8 border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-serif text-neutral-900">Panel de Dirección</h1>
                <span className="text-sm text-neutral-400 font-sans">·</span>
                <span className="text-sm text-neutral-500 font-sans">Ejercicio 2025</span>
              </div>
              <p className="text-sm text-neutral-500 font-sans">
                Resumen ejecutivo de la firma · Datos actualizados a noviembre 2025
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select className="bg-white border border-neutral-200 text-xs py-2 px-3 rounded text-neutral-600 font-sans focus:outline-none focus:border-neutral-900 transition-colors cursor-pointer">
                <option>Año completo</option>
                <option>Q1 2025</option>
                <option>Q2 2025</option>
                <option>Q3 2025</option>
                <option>Q4 2025</option>
              </select>
              <select className="bg-white border border-neutral-200 text-xs py-2 px-3 rounded text-neutral-600 font-sans focus:outline-none focus:border-neutral-900 transition-colors cursor-pointer">
                <option>Todos los socios</option>
                <option>Elena Martínez</option>
                <option>Javier Pérez</option>
                <option>Carlos Domínguez</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-12 py-10 max-w-[1600px] mx-auto animate-fade-in">
        
        {/* Section 1: Key Financial Metrics */}
        <section className="mb-12">
          <h3 className="text-[11px] font-sans text-neutral-400 uppercase tracking-widest mb-5">Indicadores financieros clave</h3>
          
          <div className="grid grid-cols-5 gap-px bg-neutral-200 border border-neutral-200 rounded overflow-hidden">
            {/* Annual Revenue */}
            <div className="bg-white p-6 flex flex-col justify-between h-36 group hover:bg-neutral-50 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-neutral-500 font-sans uppercase tracking-wide">Facturación anual</span>
                <Euro className="w-4 h-4 text-neutral-300" />
              </div>
              <div>
                <div className="text-3xl font-serif text-neutral-900 tabular-nums mb-1">{formatCurrency(firmFinancials.annualRevenue)}</div>
                <div className={`text-[10px] font-medium flex items-center gap-1 ${DS.success.text}`}>
                  <TrendingUp className="w-3 h-3" />
                  +{firmFinancials.revenueGrowth}% vs 2024
                </div>
              </div>
            </div>

            {/* YTD Revenue vs Target */}
            <div className="bg-white p-6 flex flex-col justify-between h-36 group hover:bg-neutral-50 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-neutral-500 font-sans uppercase tracking-wide">YTD vs objetivo</span>
                <Target className="w-4 h-4 text-neutral-300" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif text-neutral-900 tabular-nums">{formatCurrency(firmFinancials.ytdRevenue)}</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden mt-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(Number(ytdPerformance), 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${Number(ytdPerformance) >= 100 ? 'bg-[#4A5D4A]' : 'bg-neutral-900'}`}
                  />
                </div>
                <div className={`text-[10px] font-medium mt-1 ${Number(ytdPerformance) >= 100 ? DS.success.text : 'text-neutral-500'}`}>
                  {ytdPerformance}% del objetivo anual
                </div>
              </div>
            </div>

            {/* WIP */}
            <div className="bg-white p-6 flex flex-col justify-between h-36 group hover:bg-neutral-50 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-neutral-500 font-sans uppercase tracking-wide">WIP pendiente</span>
                <Clock className="w-4 h-4 text-neutral-300" />
              </div>
              <div>
                <div className="text-3xl font-serif text-neutral-900 tabular-nums mb-1">{formatCurrency(firmFinancials.wip)}</div>
                <div className="text-[10px] text-neutral-400 font-medium">Trabajo en curso sin facturar</div>
              </div>
            </div>

            {/* Accounts Receivable */}
            <div className="bg-white p-6 flex flex-col justify-between h-36 group hover:bg-neutral-50 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-neutral-500 font-sans uppercase tracking-wide">Ctas. por cobrar</span>
                <Receipt className="w-4 h-4 text-neutral-300" />
              </div>
              <div>
                <div className="text-3xl font-serif text-neutral-900 tabular-nums mb-1">{formatCurrency(firmFinancials.accountsReceivable)}</div>
                <div className={`text-[10px] font-medium ${firmFinancials.avgDaysToCollect > 45 ? DS.warning.text : 'text-neutral-400'}`}>
                  {firmFinancials.avgDaysToCollect} días promedio de cobro
                </div>
              </div>
            </div>

            {/* Utilization & Realization */}
            <div className="bg-neutral-900 p-6 flex flex-col justify-between h-36 text-white">
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-neutral-400 font-sans uppercase tracking-wide">Utilización</span>
                <Percent className="w-4 h-4 text-neutral-500" />
              </div>
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-serif tabular-nums">{firmFinancials.utilizationRate}%</span>
                  <span className="text-lg text-neutral-400 font-serif">/ {firmFinancials.realization}%</span>
                </div>
                <div className="text-[10px] text-neutral-400 font-medium mt-1">Utilización / Realización</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Revenue by Sector & Partner Performance */}
        <section className="mb-12 grid grid-cols-2 gap-8">
          {/* Revenue by Sector */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-sans text-neutral-400 uppercase tracking-widest">Facturación por sector</h3>
              <span className="text-[10px] text-neutral-400">Ejercicio 2025</span>
            </div>
            
            <div className="bg-white border border-neutral-200 rounded overflow-hidden">
              <div className="divide-y divide-neutral-100">
                {revenueBySector.map((sector, idx) => (
                  <div key={idx} className="p-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-neutral-900">{sector.sector}</span>
                      <span className="text-sm font-serif text-neutral-900 tabular-nums">{formatCurrency(sector.revenue)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${sector.percentage}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="h-full bg-neutral-900 rounded-full"
                        />
                      </div>
                      <span className="text-[10px] text-neutral-500 w-12 text-right">{sector.percentage}%</span>
                      <span className={`text-[10px] font-medium w-14 text-right flex items-center justify-end gap-0.5 ${sector.growth >= 0 ? DS.success.text : DS.error.text}`}>
                        {sector.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {sector.growth >= 0 ? '+' : ''}{sector.growth}%
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">{sector.clients} clientes</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Partner Performance */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-sans text-neutral-400 uppercase tracking-widest">Rendimiento por socio</h3>
              <span className="text-[10px] text-neutral-400">YTD 2025</span>
            </div>
            
            <div className="bg-white border border-neutral-200 rounded overflow-hidden">
              <div className="divide-y divide-neutral-100">
                {partnerMetrics.map((partner, idx) => {
                  const performance = (partner.revenue / partner.target * 100);
                  const isAboveTarget = performance >= 100;
                  
                  return (
                    <div key={idx} className="p-4 hover:bg-neutral-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-sm font-medium text-neutral-900">{partner.name}</span>
                          <div className="text-[10px] text-neutral-400 mt-0.5">{partner.clients} clientes · {partner.utilization}% utilización</div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-serif text-neutral-900 tabular-nums">{formatCurrency(partner.revenue)}</span>
                          <div className={`text-[10px] font-medium ${isAboveTarget ? DS.success.text : DS.warning.text}`}>
                            {performance.toFixed(0)}% objetivo
                          </div>
                        </div>
                      </div>
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(performance, 100)}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className={`h-full rounded-full ${isAboveTarget ? 'bg-[#4A5D4A]' : 'bg-neutral-900'}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Main Content Grid */}
        <div className="grid grid-cols-3 gap-8">
          
          {/* Column 1-2: Top Engagements by Fees */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-sans text-neutral-400 uppercase tracking-widest">Principales encargos por honorarios</h3>
              <button 
                onClick={() => onNavigate && onNavigate('portfolio')}
                className="text-[10px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3">
              {topEngagements.map((engagement, idx) => {
                const statusStyle = getStatusColor(engagement.status);
                
                return (
                  <motion.div 
                    key={idx}
                    className="bg-white border border-neutral-200 p-5 rounded group hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => onSelectClient && onSelectClient(engagement.client)}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-serif text-neutral-900">{engagement.client}</h4>
                          <span className={`text-[9px] font-medium px-2 py-0.5 rounded uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-neutral-400">
                          <span>Socio: {engagement.partner}</span>
                          <span>·</span>
                          <span>Avance: {engagement.progress}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-xl font-serif text-neutral-900 tabular-nums">{formatCurrency(engagement.fees)}</div>
                          <div className="text-[9px] text-neutral-400 uppercase">Honorarios</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-serif text-neutral-900 tabular-nums">{formatCurrency(engagement.billed)}</div>
                          <div className="text-[9px] text-neutral-400 uppercase">Facturado</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-serif tabular-nums ${DS.warning.text}`}>{formatCurrency(engagement.wip)}</div>
                          <div className="text-[9px] text-neutral-400 uppercase">WIP</div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 transition-colors" />
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4 pt-3 border-t border-neutral-100">
                      <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                        <span>Progreso del encargo</span>
                        <span>{engagement.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${engagement.progress}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="h-full bg-neutral-900 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Alerts & Receivables Aging */}
          <div className="col-span-1 space-y-8">
            
            {/* Management Alerts */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-sans text-neutral-400 uppercase tracking-widest">Alertas de gestión</h3>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${DS.error.bg} ${DS.error.text}`}>
                  {managementAlerts.filter(a => a.severity === 'high').length} críticas
                </span>
              </div>
              
              <div className="space-y-2">
                {managementAlerts.map((alert) => {
                  const style = getAlertStyle(alert.severity);
                  return (
                    <motion.div 
                      key={alert.id}
                      className={`p-4 rounded border ${style.border} ${style.bg} cursor-pointer transition-all`}
                      onMouseEnter={() => setHoveredAlert(alert.id)}
                      onMouseLeave={() => setHoveredAlert(null)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${style.text}`}>
                          {alert.title}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mb-2">{alert.message}</p>
                      <button className={`text-[10px] font-medium ${style.text} hover:underline`}>
                        {alert.action} →
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Receivables Aging */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-sans text-neutral-400 uppercase tracking-widest">Antigüedad de cobros</h3>
                <span className="text-[10px] text-neutral-500">{formatCurrency(firmFinancials.accountsReceivable)} total</span>
              </div>
              
              <div className="bg-white border border-neutral-200 rounded overflow-hidden divide-y divide-neutral-100">
                {receivablesAging.map((item, idx) => (
                  <div key={idx} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-neutral-700">{item.range}</span>
                      <span className="text-sm font-serif text-neutral-900 tabular-nums">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 0.4, delay: idx * 0.1 }}
                          className={`h-full rounded-full ${idx >= 2 ? 'bg-[#8B7355]' : idx >= 1 ? 'bg-neutral-600' : 'bg-neutral-900'}`}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-400 w-8 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary */}
              <div className="mt-3 p-3 bg-neutral-50 border border-neutral-200 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-neutral-500">Pendiente +60 días</span>
                  <span className={`text-sm font-serif tabular-nums ${DS.warning.text}`}>
                    {formatCurrency(receivablesAging[2].amount + receivablesAging[3].amount)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
