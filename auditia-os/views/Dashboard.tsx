
import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  FileText,
  Zap,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Building2,
  ArrowUpRight,
  Timer,
  Bot,
  ShieldCheck
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

  // Firm metrics
  const firmMetrics = {
    activeClients: 142,
    activeEngagements: 24,
    engagementsInPlanning: 8,
    engagementsClosed: 15,
    teamMembers: 48,
    avgEngagementProgress: 67,
    onTimeDelivery: 92,
    clientSatisfaction: 4.8,
  };

  // AI Automation metrics
  const automationMetrics = {
    testsAutomated: 1247,
    hoursRecovered: 892,
    findingsAutoDetected: 156,
    dataPointsAnalyzed: '2.4M',
    circularizationsSent: 342,
    reconciliationsPerformed: 89,
    efficiencyGain: 34,
  };

  // Active engagements that need attention
  const engagementsAttention = [
    { 
      id: '1', 
      client: 'Grupo Alfa', 
      engagement: 'Auditoría 2025',
      status: 'testing',
      progress: 65,
      daysRemaining: 45,
      findingsOpen: 8,
      risk: 'medium',
      manager: 'Carlos D.',
      sector: 'Manufacturing'
    },
    { 
      id: '2', 
      client: 'Zeta Bank', 
      engagement: 'Auditoría 2025',
      status: 'testing',
      progress: 48,
      daysRemaining: 30,
      findingsOpen: 12,
      risk: 'high',
      manager: 'María F.',
      sector: 'Finance'
    },
    { 
      id: '3', 
      client: 'Delta Finance', 
      engagement: 'Auditoría 2025',
      status: 'review',
      progress: 85,
      daysRemaining: 15,
      findingsOpen: 3,
      risk: 'low',
      manager: 'María F.',
      sector: 'Finance'
    },
    { 
      id: '4', 
      client: 'Theta Tech', 
      engagement: 'Auditoría 2025',
      status: 'testing',
      progress: 55,
      daysRemaining: 52,
      findingsOpen: 5,
      risk: 'medium',
      manager: 'Sofia L.',
      sector: 'Technology'
    },
  ];

  // Alerts and anomalies
  const alerts = [
    { 
      id: 'a1', 
      type: 'risk', 
      severity: 'high', 
      title: 'Riesgo alto en Zeta Bank',
      message: 'Hallazgos materiales detectados en área de provisiones',
      entity: 'Zeta Bank', 
      date: 'Hoy',
      action: 'Revisar hallazgos'
    },
    { 
      id: 'a2', 
      type: 'deadline', 
      severity: 'medium', 
      title: 'Plazo cercano',
      message: 'Delta Finance cierra en 15 días, pendiente revisión final',
      entity: 'Delta Finance', 
      date: 'Hoy',
      action: 'Ver encargo'
    },
    { 
      id: 'a3', 
      type: 'request', 
      severity: 'low', 
      title: 'Solicitud pendiente',
      message: 'Grupo Alfa tiene 3 solicitudes sin respuesta hace 5 días',
      entity: 'Grupo Alfa', 
      date: 'Ayer',
      action: 'Ver solicitudes'
    },
  ];

  // Recent AI activity
  const aiActivity = [
    { id: '1', type: 'test', message: 'Test de corte ejecutado en Proveedores', client: 'Grupo Alfa', time: 'Hace 2h', exceptions: 4 },
    { id: '2', type: 'reconciliation', message: 'Conciliación bancaria completada', client: 'Delta Finance', time: 'Hace 3h', exceptions: 0 },
    { id: '3', type: 'finding', message: 'Hallazgo detectado automáticamente', client: 'Zeta Bank', time: 'Hace 4h', exceptions: 1 },
    { id: '4', type: 'circularization', message: '12 confirmaciones enviadas', client: 'Grupo Alfa', time: 'Hace 5h', exceptions: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'testing': return { bg: DS.warning.bg, text: DS.warning.text, label: 'En pruebas' };
      case 'review': return { bg: DS.info.bg, text: DS.info.text, label: 'En revisión' };
      case 'closed': return { bg: DS.success.bg, text: DS.success.text, label: 'Cerrado' };
      default: return { bg: 'bg-neutral-100', text: 'text-neutral-600', label: 'No iniciado' };
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return DS.error;
      case 'medium': return DS.warning;
      default: return DS.success;
    }
  };

  const getAlertStyle = (severity: string) => {
    switch (severity) {
      case 'high': return { bg: DS.error.bg, text: DS.error.text, border: DS.error.border };
      case 'medium': return { bg: DS.warning.bg, text: DS.warning.text, border: DS.warning.border };
      default: return { bg: 'bg-neutral-50', text: 'text-neutral-600', border: 'border-neutral-200' };
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-12 pt-10 pb-8 border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-serif text-neutral-900">{t('dashboard.title')}</h1>
                <span className="text-sm text-neutral-400 font-sans">·</span>
                <span className="text-sm text-neutral-500 font-sans">{t('dashboard.period')}</span>
              </div>
              <p className="text-sm text-neutral-500 font-sans">
                Visión general de la firma y estado de los encargos en curso
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select className="bg-white border border-neutral-200 text-xs py-2 px-3 rounded text-neutral-600 font-sans focus:outline-none focus:border-neutral-900 transition-colors cursor-pointer">
                <option>Todos los sectores</option>
                <option>Manufacturing</option>
                <option>Finance</option>
                <option>Technology</option>
              </select>
              <select className="bg-white border border-neutral-200 text-xs py-2 px-3 rounded text-neutral-600 font-sans focus:outline-none focus:border-neutral-900 transition-colors cursor-pointer">
                <option>Todos los socios</option>
                <option>Elena M.</option>
                <option>Javier P.</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-12 py-10 max-w-[1600px] mx-auto animate-fade-in">
        
        {/* Section 1: Key Metrics */}
        <section className="mb-12">
          <h3 className="text-[11px] font-sans text-neutral-400 uppercase tracking-widest mb-5">Métricas de la firma</h3>
          
          <div className="grid grid-cols-4 gap-px bg-neutral-200 border border-neutral-200 rounded overflow-hidden">
            {/* Clients */}
            <motion.div 
              className="bg-white p-7 flex flex-col justify-between h-36 group hover:bg-neutral-50 transition-colors cursor-pointer"
              onClick={() => onNavigate && onNavigate('portfolio')}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-neutral-500 font-sans uppercase tracking-wide">Clientes activos</span>
                <Building2 className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 transition-colors" />
              </div>
              <div>
                <div className="text-4xl font-serif text-neutral-900 tabular-nums mb-1">{firmMetrics.activeClients}</div>
                <div className={`text-[10px] font-medium ${DS.success.text}`}>+4 este trimestre</div>
              </div>
            </motion.div>

            {/* Engagements */}
            <motion.div 
              className="bg-white p-7 flex flex-col justify-between h-36 group hover:bg-neutral-50 transition-colors cursor-pointer"
              onClick={() => onNavigate && onNavigate('portfolio')}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-neutral-500 font-sans uppercase tracking-wide">Encargos</span>
                <Briefcase className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 transition-colors" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-serif text-neutral-900 tabular-nums">{firmMetrics.activeEngagements}</span>
                  <span className="text-lg text-neutral-400 font-serif">/ {firmMetrics.engagementsInPlanning}</span>
                  <span className="text-lg text-neutral-300 font-serif">/ {firmMetrics.engagementsClosed}</span>
                </div>
                <div className="text-[10px] text-neutral-400 font-medium mt-1">En curso / Planificación / Cerrados</div>
              </div>
            </motion.div>

            {/* On-time delivery */}
            <div className="bg-white p-7 flex flex-col justify-between h-36 group hover:bg-neutral-50 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-neutral-500 font-sans uppercase tracking-wide">Entregas en plazo</span>
                <Clock className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 transition-colors" />
              </div>
              <div>
                <div className="text-4xl font-serif text-neutral-900 tabular-nums mb-1">{firmMetrics.onTimeDelivery}%</div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${firmMetrics.onTimeDelivery}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${firmMetrics.onTimeDelivery >= 90 ? 'bg-[#4A5D4A]' : 'bg-[#8B7355]'}`}
                  />
                </div>
              </div>
            </div>

            {/* AI Automation */}
            <div className="bg-neutral-900 p-7 flex flex-col justify-between h-36 group text-white">
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-neutral-400 font-sans uppercase tracking-wide">Automatización IA</span>
                <Sparkles className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </div>
              <div>
                <div className="text-4xl font-serif tabular-nums mb-1">{automationMetrics.efficiencyGain}%</div>
                <div className="text-[10px] text-neutral-400 font-medium">Ganancia de eficiencia vs. manual</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: AI Performance Banner */}
        <section className="mb-12">
          <div className="bg-neutral-50 border border-neutral-200 rounded p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-900 mb-1">Auditia Intelligence</h4>
                  <p className="text-xs text-neutral-500">Automatización activa en todos los encargos</p>
                </div>
              </div>
              
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-2xl font-serif text-neutral-900 tabular-nums">{automationMetrics.testsAutomated}</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wide">Tests ejecutados</div>
                </div>
                <div className="w-px bg-neutral-200" />
                <div className="text-center">
                  <div className="text-2xl font-serif text-neutral-900 tabular-nums">{automationMetrics.dataPointsAnalyzed}</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wide">Datos analizados</div>
                </div>
                <div className="w-px bg-neutral-200" />
                <div className="text-center">
                  <div className={`text-2xl font-serif tabular-nums ${DS.success.text}`}>{automationMetrics.hoursRecovered}h</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wide">Horas ahorradas</div>
                </div>
                <div className="w-px bg-neutral-200" />
                <div className="text-center">
                  <div className={`text-2xl font-serif tabular-nums ${DS.warning.text}`}>{automationMetrics.findingsAutoDetected}</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wide">Hallazgos detectados</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Main Content Grid */}
        <div className="grid grid-cols-3 gap-8">
          
          {/* Column 1-2: Active Engagements */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-sans text-neutral-400 uppercase tracking-widest">Encargos activos</h3>
              <button 
                onClick={() => onNavigate && onNavigate('portfolio')}
                className="text-[10px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3">
              {engagementsAttention.map((engagement) => {
                const statusStyle = getStatusColor(engagement.status);
                const riskStyle = getRiskColor(engagement.risk);
                
                return (
                  <motion.div 
                    key={engagement.id}
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
                          {engagement.risk === 'high' && (
                            <span className={`text-[9px] font-medium px-2 py-0.5 rounded uppercase tracking-wider ${riskStyle.bg} ${riskStyle.text} border ${riskStyle.border}`}>
                              Riesgo alto
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-neutral-400">
                          <span>{engagement.engagement}</span>
                          <span>·</span>
                          <span>{engagement.sector}</span>
                          <span>·</span>
                          <span>Manager: {engagement.manager}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-xl font-serif text-neutral-900 tabular-nums">{engagement.progress}%</div>
                          <div className="text-[9px] text-neutral-400 uppercase">Avance</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl font-serif tabular-nums ${engagement.daysRemaining < 30 ? DS.warning.text : 'text-neutral-900'}`}>
                            {engagement.daysRemaining}d
                          </div>
                          <div className="text-[9px] text-neutral-400 uppercase">Restantes</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl font-serif tabular-nums ${engagement.findingsOpen > 5 ? DS.warning.text : 'text-neutral-900'}`}>
                            {engagement.findingsOpen}
                          </div>
                          <div className="text-[9px] text-neutral-400 uppercase">Hallazgos</div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 transition-colors" />
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4 pt-3 border-t border-neutral-100">
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

          {/* Column 3: Alerts & AI Activity */}
          <div className="col-span-1 space-y-8">
            
            {/* Alerts */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-sans text-neutral-400 uppercase tracking-widest">Alertas activas</h3>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${DS.error.bg} ${DS.error.text}`}>
                  {alerts.filter(a => a.severity === 'high').length} críticas
                </span>
              </div>
              
              <div className="space-y-2">
                {alerts.map((alert) => {
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
                        <span className="text-[10px] text-neutral-400">{alert.date}</span>
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

            {/* AI Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-sans text-neutral-400 uppercase tracking-widest">Actividad IA</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4A5D4A] animate-pulse" />
                  <span className="text-[10px] text-neutral-500">En tiempo real</span>
                </div>
              </div>
              
              <div className="bg-neutral-50 border border-neutral-200 rounded divide-y divide-neutral-200">
                {aiActivity.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-white transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {activity.type === 'test' && <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />}
                        {activity.type === 'reconciliation' && <CheckCircle2 className="w-3.5 h-3.5 text-[#4A5D4A]" />}
                        {activity.type === 'finding' && <AlertCircle className="w-3.5 h-3.5 text-[#8B7355]" />}
                        {activity.type === 'circularization' && <FileText className="w-3.5 h-3.5 text-neutral-400" />}
                        <span className="text-xs text-neutral-700">{activity.message}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-neutral-400">{activity.client}</span>
                      <div className="flex items-center gap-3">
                        {activity.exceptions > 0 && (
                          <span className={`text-[10px] font-medium ${DS.warning.text}`}>
                            {activity.exceptions} excepciones
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-400 font-mono">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
