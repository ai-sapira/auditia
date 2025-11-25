import React from 'react';
import { 
  Briefcase, 
  Clock, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  MoreHorizontal,
  Calendar,
  DollarSign,
  PieChart,
  Users as UsersIcon,
  AlertTriangle,
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  FileCheck,
  MessageSquare,
  ClipboardList,
  Target,
  Zap
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LineChart, Line, PieChart as RechartsPie, Pie } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface ClientOverviewViewProps {
  clientName: string;
  onNavigateToEngagement: (id: string) => void;
}

export const ClientOverviewView: React.FC<ClientOverviewViewProps> = ({ clientName, onNavigateToEngagement }) => {
  const { t } = useLanguage();

  // Client Info (coherent with engagement data)
  const clientInfo = {
    legalName: 'Grupo Alfa, S.A.',
    sector: 'Manufacturero',
    cif: 'A-12345678',
    address: 'Calle Industrial, 42, 28023 Madrid',
    phone: '+34 91 123 45 67',
    web: 'www.grupoalfa.es',
    employees: '450',
    revenue: '€85M',
    partner: 'Elena Martínez',
    manager: 'Carlos Domínguez',
    clientSince: '2019',
    status: 'Activo'
  };

  // Engagements (coherent with app data)
  const engagements = [
    { 
      id: 'eng-001', 
      name: 'Auditoría 2025', 
      type: 'Auditoría Financiera', 
      status: 'En Curso', 
      progress: 42, 
      deadline: '30/06/2025', 
      team: ['EM', 'CD', 'AR', 'MG', 'SL'], 
      fee: '€48.000',
      hoursUsed: 245,
      hoursTotal: 320,
      findings: 3,
      requests: 5
    },
    { 
      id: 'eng-002', 
      name: 'Revisión Fiscal Q1', 
      type: 'Compliance Fiscal', 
      status: 'Planificación', 
      progress: 15, 
      deadline: '15/05/2025', 
      team: ['CD', 'MG'], 
      fee: '€12.000',
      hoursUsed: 8,
      hoursTotal: 60,
      findings: 0,
      requests: 2
    },
  ];

  // Billing (coherent data)
  const billingData = [
    { month: 'Oct', billed: 8000, wip: 2000 },
    { month: 'Nov', billed: 10000, wip: 5000 },
    { month: 'Dec', billed: 12000, wip: 8000 },
    { month: 'Ene', billed: 15000, wip: 12000 },
    { month: 'Feb', billed: 8000, wip: 18000 },
    { month: 'Mar', billed: 5000, wip: 22450 },
  ];

  // Pending Tasks for Auditor
  const pendingTasks = [
    { 
      id: 'task-1', 
      title: 'Revisar respuesta cliente H-023', 
      engagement: 'Auditoría 2025',
      area: 'Proveedores',
      priority: 'high',
      dueDate: '22/03/2025',
      type: 'finding'
    },
    { 
      id: 'task-2', 
      title: 'Ejecutar test de circularizaciones', 
      engagement: 'Auditoría 2025',
      area: 'Proveedores',
      priority: 'high',
      dueDate: '23/03/2025',
      type: 'test'
    },
    { 
      id: 'task-3', 
      title: 'Revisar documentación REQ-002', 
      engagement: 'Auditoría 2025',
      area: 'Tesorería',
      priority: 'medium',
      dueDate: '24/03/2025',
      type: 'request'
    },
    { 
      id: 'task-4', 
      title: 'Completar papeles de trabajo cut-off', 
      engagement: 'Auditoría 2025',
      area: 'Proveedores',
      priority: 'medium',
      dueDate: '25/03/2025',
      type: 'workpaper'
    },
    { 
      id: 'task-5', 
      title: 'Preparar borrador planificación fiscal', 
      engagement: 'Revisión Fiscal Q1',
      area: 'General',
      priority: 'low',
      dueDate: '28/03/2025',
      type: 'planning'
    },
  ];

  // Activity Log (coherent with engagement activity)
  const activityLog = [
    { id: 1, type: 'doc', user: 'Laura Sánchez (Cliente)', action: 'subió', target: 'Albaranes Logística Norte', time: 'Hace 2h', engagement: 'Auditoría 2025' },
    { id: 2, type: 'msg', user: 'Alejandro R.', action: 'comentó en', target: 'H-023', time: 'Hace 4h', engagement: 'Auditoría 2025' },
    { id: 3, type: 'sys', user: 'Sistema', action: 'detectó', target: 'Diferencia de saldo €27.450', time: 'Ayer', engagement: 'Auditoría 2025' },
    { id: 4, type: 'status', user: 'Carlos D.', action: 'completó', target: 'Conciliación de saldos', time: 'Hace 2 días', engagement: 'Auditoría 2025' },
  ];

  // Client team
  const clientTeam = [
    { name: 'Marta García', role: 'CFO', initials: 'MG', main: true },
    { name: 'Laura Sánchez', role: 'Controller', initials: 'LS', main: false },
    { name: 'Pedro López', role: 'Tesorero', initials: 'PL', main: false },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#FBF8F7] text-[#8B5A50] border-[#E8E0DE]';
      case 'medium': return 'bg-[#FDFAF6] text-[#8B7355] border-[#EDE5D8]';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'finding': return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'test': return <Zap className="w-3.5 h-3.5" />;
      case 'request': return <MessageSquare className="w-3.5 h-3.5" />;
      case 'workpaper': return <FileCheck className="w-3.5 h-3.5" />;
      default: return <ClipboardList className="w-3.5 h-3.5" />;
    }
  };

  // Calculate totals
  const totalWIP = billingData[billingData.length - 1].wip;
  const totalBilledYTD = billingData.reduce((sum, d) => sum + d.billed, 0);
  const openFindings = engagements.reduce((sum, e) => sum + e.findings, 0);
  const openRequests = engagements.reduce((sum, e) => sum + e.requests, 0);

  return (
    <div className="px-12 py-10 max-w-[1600px] mx-auto animate-fade-in bg-white h-full overflow-y-auto">
      
      {/* 1. HEADER: Client Identity */}
      <div className="flex justify-between items-start mb-8 border-b border-neutral-100 pb-8">
        <div className="flex items-start gap-6">
          {/* Logo placeholder */}
          <div className="w-16 h-16 bg-neutral-100 border border-neutral-200 rounded-lg flex items-center justify-center">
            <Building2 className="w-8 h-8 text-neutral-400" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-serif text-neutral-900">{clientName}</h1>
              <span className="px-2 py-0.5 bg-[#E8EDE8] text-[#4A5D4A] text-[10px] font-sans tracking-wide uppercase rounded-sm border border-[#E0E5E0]">
                Activo
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs font-sans text-neutral-500 mb-3">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3 h-3" /> {clientInfo.legalName}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> {clientInfo.sector}
              </span>
              <span className="flex items-center gap-1.5">
                CIF: {clientInfo.cif}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-neutral-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {clientInfo.address}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {clientInfo.phone}
              </span>
            </div>
          </div>
        </div>
        
        {/* Key Stats */}
        <div className="flex gap-6">
          <div className="text-right px-4 border-r border-neutral-100">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Partner</span>
            <div className="text-sm font-medium text-neutral-900">{clientInfo.partner}</div>
          </div>
          <div className="text-right px-4 border-r border-neutral-100">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Manager</span>
            <div className="text-sm font-medium text-neutral-900">{clientInfo.manager}</div>
          </div>
          <div className="text-right px-4 border-r border-neutral-100">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Facturación</span>
            <div className="text-sm font-medium text-neutral-900">{clientInfo.revenue}</div>
          </div>
          <div className="text-right pl-4">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Cliente desde</span>
            <div className="text-sm font-medium text-neutral-900">{clientInfo.clientSince}</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">WIP Actual</span>
            <DollarSign className="w-4 h-4 text-neutral-300" />
          </div>
          <div className="text-2xl font-serif text-neutral-900">€{totalWIP.toLocaleString()}</div>
          <div className="text-[10px] text-[#8B7355] mt-1">↑ Pendiente facturar</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Facturado YTD</span>
            <TrendingUp className="w-4 h-4 text-neutral-300" />
          </div>
          <div className="text-2xl font-serif text-neutral-900">€{totalBilledYTD.toLocaleString()}</div>
          <div className="text-[10px] text-[#4A5D4A] mt-1">En línea con presupuesto</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Hallazgos Abiertos</span>
            <AlertTriangle className="w-4 h-4 text-neutral-300" />
          </div>
          <div className="text-2xl font-serif text-neutral-900">{openFindings}</div>
          <div className="text-[10px] text-[#8B7355] mt-1">Pendientes de resolución</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Solicitudes</span>
            <MessageSquare className="w-4 h-4 text-neutral-300" />
          </div>
          <div className="text-2xl font-serif text-neutral-900">{openRequests}</div>
          <div className="text-[10px] text-neutral-500 mt-1">Pendientes cliente</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Engagements & Billing (2/3 width) */}
        <div className="col-span-2 space-y-10">
          
          {/* Active Engagements */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-lg font-serif text-neutral-900">Encargos activos</h3>
              <button className="text-[10px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors">
                Ver historial <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {engagements.map(eng => (
                <div 
                  key={eng.id} 
                  onClick={() => onNavigateToEngagement(eng.id)}
                  className="bg-white border border-neutral-200 rounded-lg p-5 hover:shadow-sm hover:border-neutral-300 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-serif text-base text-neutral-900">{eng.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${
                          eng.status === 'En Curso' ? 'bg-[#F7F9FA] text-[#4A5D6A] border-[#E0E5E8]' : 
                          'bg-neutral-50 text-neutral-600 border-neutral-200'
                        }`}>
                          {eng.status}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500">{eng.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-neutral-900">{eng.fee}</div>
                      <div className="text-[10px] text-neutral-400">Honorarios</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase mb-1">Progreso</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-neutral-800 rounded-full" style={{ width: `${eng.progress}%` }} />
                        </div>
                        <span className="text-xs font-mono text-neutral-600">{eng.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase mb-1">Fecha límite</div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-700">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        {eng.deadline}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase mb-1">Horas</div>
                      <div className="text-xs text-neutral-700 font-mono">{eng.hoursUsed} / {eng.hoursTotal}h</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase mb-1">Equipo</div>
                      <div className="flex -space-x-1.5">
                        {eng.team.slice(0, 4).map((member, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-neutral-100 border border-white flex items-center justify-center text-[9px] font-medium text-neutral-600">
                            {member}
                          </div>
                        ))}
                        {eng.team.length > 4 && (
                          <div className="w-6 h-6 rounded-full bg-neutral-200 border border-white flex items-center justify-center text-[9px] font-medium text-neutral-600">
                            +{eng.team.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-4 text-[10px]">
                      {eng.findings > 0 && (
                        <span className="flex items-center gap-1 text-[#8B7355]">
                          <AlertTriangle className="w-3 h-3" />
                          {eng.findings} hallazgos
                        </span>
                      )}
                      {eng.requests > 0 && (
                        <span className="flex items-center gap-1 text-[#4A5D6A]">
                          <MessageSquare className="w-3 h-3" />
                          {eng.requests} solicitudes
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Billing Analysis */}
          <section>
            <h3 className="text-lg font-serif text-neutral-900 mb-4">Análisis financiero</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-neutral-200 rounded-lg p-5 h-64">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-sm font-medium text-neutral-900 block mb-1">WIP vs Facturado (6M)</span>
                    <span className="text-[10px] text-neutral-400">Evolución del trabajo en curso</span>
                  </div>
                  <BarChart className="w-4 h-4 text-neutral-300" />
                </div>
                <ResponsiveContainer width="100%" height="75%">
                  <BarChart data={billingData} barGap={2}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a8a29e'}} dy={10} />
                    <Tooltip 
                      cursor={{fill: '#f5f5f4'}}
                      contentStyle={{backgroundColor: '#fff', borderColor: '#e7e5e4', fontSize: '11px', borderRadius: '4px'}}
                      formatter={(value: number) => [`€${value.toLocaleString()}`, '']}
                    />
                    <Bar dataKey="billed" name="Facturado" fill="#e5e7eb" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="wip" name="WIP" fill="#1c1917" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 h-64 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-base text-neutral-900 mb-4">Resumen financiero</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm border-b border-neutral-200 pb-2">
                      <span className="text-neutral-500">Valor Contratos</span>
                      <span className="font-medium text-neutral-900">€60.000</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-neutral-200 pb-2">
                      <span className="text-neutral-500">Facturado YTD</span>
                      <span className="font-medium text-neutral-900">€{totalBilledYTD.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-neutral-200 pb-2">
                      <span className="text-neutral-500">WIP Pendiente</span>
                      <span className="font-medium text-[#8B7355]">€{totalWIP.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Tasa Recuperación</span>
                      <span className="font-medium text-[#4A5D4A]">94%</span>
                    </div>
                  </div>
                </div>
                <button className="text-xs text-neutral-600 hover:text-neutral-900 underline self-start">
                  Ver desglose detallado
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Tasks, Activity & Team */}
        <div className="col-span-1 space-y-8">
          
          {/* PENDING TASKS - NEW SECTION */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif text-neutral-900">Mis tareas pendientes</h3>
              <span className="text-[10px] px-2 py-0.5 bg-neutral-900 text-white rounded-full font-medium">
                {pendingTasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {pendingTasks.map((task) => (
                <div 
                  key={task.id}
                  className="bg-white border border-neutral-200 rounded-lg p-3 hover:shadow-sm hover:border-neutral-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded ${getPriorityColor(task.priority)}`}>
                      {getTaskIcon(task.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-neutral-900 mb-1 truncate group-hover:text-neutral-700">
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span>{task.engagement}</span>
                        <span>•</span>
                        <span>{task.area}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-[10px] font-mono ${
                        task.priority === 'high' ? 'text-[#8B5A50]' : 'text-neutral-500'
                      }`}>
                        {task.dueDate}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-xs text-neutral-500 hover:text-neutral-900 py-2 border border-dashed border-neutral-200 rounded-lg hover:border-neutral-400 transition-colors">
              Ver todas las tareas →
            </button>
          </section>

          {/* Recent Activity */}
          <section>
            <h3 className="text-lg font-serif text-neutral-900 mb-4">Actividad reciente</h3>
            <div className="bg-white border-l-2 border-neutral-200 pl-5 py-1 space-y-6 relative">
              {activityLog.map((log) => (
                <div key={log.id} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    log.type === 'sys' ? 'bg-[#8B5A50]' : 
                    log.type === 'doc' ? 'bg-[#4A5D6A]' : 
                    log.type === 'msg' ? 'bg-[#8B7355]' :
                    'bg-neutral-400'
                  }`}></div>
                  
                  <p className="text-xs text-neutral-900 mb-0.5">
                    <span className="font-medium">{log.user}</span> {log.action} <span className="font-medium">{log.target}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-400">{log.time}</span>
                    <span className="text-[10px] text-neutral-300">•</span>
                    <span className="text-[10px] text-neutral-400">{log.engagement}</span>
                  </div>
                </div>
              ))}
              <button className="text-[10px] text-neutral-400 hover:text-neutral-900 transition-colors pt-2">
                Ver más actividad...
              </button>
            </div>
          </section>

          {/* Client Team */}
          <section>
            <h3 className="text-lg font-serif text-neutral-900 mb-4">Equipo cliente</h3>
            <div className="space-y-2">
              {clientTeam.map((person, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-100 rounded-lg">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-serif ${
                    person.main ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-600'
                  }`}>
                    {person.initials}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-neutral-900">{person.name}</div>
                    <div className="text-[10px] text-neutral-500">{person.role}</div>
                  </div>
                  {person.main && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-neutral-200 text-neutral-600 rounded">Principal</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Internal Notes */}
          <section>
            <h3 className="text-lg font-serif text-neutral-900 mb-3">Notas internas</h3>
            <div className="bg-[#FDFAF6] border border-[#EDE5D8] p-4 rounded-lg">
              <p className="text-xs text-neutral-600 italic leading-relaxed">
                "Cliente en proceso de expansión internacional. Revisar implicaciones fiscales de la nueva filial en Portugal y tratamiento contable de las operaciones intercompany."
              </p>
              <div className="mt-2 text-[10px] text-neutral-400 text-right">— Elena M., 15/03/2025</div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
