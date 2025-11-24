import React from 'react';
import { PanelRight, PanelRightClose, ArrowRight, Clock, FileText, Play, AlertCircle, ChevronRight, History } from 'lucide-react';
import { TimelineEvent } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En curso':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Cerrado':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      default:
        return 'bg-stone-200 text-stone-600 border-stone-300';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-white">
      {/* Overview Header */}
      <div className="flex justify-between items-start px-10 pt-10 mb-6">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">{t('engagement.overview_title')}</h1>
        </div>
        <button 
          onClick={() => setShowTimeline(!showTimeline)}
          className={`p-2 rounded hover:bg-stone-100 transition-colors ${showTimeline ? 'text-stone-900 bg-stone-100' : 'text-stone-400'}`}
        >
          {showTimeline ? <PanelRightClose className="w-5 h-5" /> : <PanelRight className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-10 pb-10 animate-fade-in">
        {/* Engagement Header */}
        <div className="bg-white border border-stone-200 p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-serif text-stone-900 mb-3">{engagementData.name}</h2>
              <div className="flex items-center gap-6 text-sm text-stone-600">
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">{t('engagement.overview_client')}:</span>
                  <span className="font-medium">{engagementData.client}</span>
                </div>
                <div className="w-px h-4 bg-stone-200"></div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <span className="font-mono text-xs">{engagementData.period}</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium uppercase tracking-wider px-3 py-1.5 rounded-sm border ${getStatusColor(engagementData.status)}`}>
              {engagementData.status}
            </span>
          </div>
        </div>

        {/* Key Indicators */}
        <div className="grid grid-cols-3 gap-px bg-stone-200 border border-stone-200 mb-10">
          <div className="bg-white p-6 h-32 flex flex-col justify-between">
            <span className="text-[11px] text-stone-500 font-sans tracking-wide">{t('engagement.kpi_completion')}</span>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-serif text-stone-900 tabular-nums">{engagementData.progress}%</span>
              <div className="w-16 h-1 bg-stone-100 rounded-full overflow-hidden">
                <div className="bg-stone-900 h-full" style={{ width: `${engagementData.progress}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 h-32 flex flex-col justify-between">
            <span className="text-[11px] text-stone-500 font-sans tracking-wide">{t('engagement.overview_findings')}</span>
            <div className="flex items-end gap-3">
              <div>
                <span className="text-3xl font-serif text-stone-900 tabular-nums">{engagementData.findingsOpen}</span>
                <span className="text-xs text-stone-400 ml-1">abiertos</span>
              </div>
              <div className="w-px h-8 bg-stone-200"></div>
              <div>
                <span className="text-2xl font-serif text-stone-600 tabular-nums">{engagementData.findingsClosed}</span>
                <span className="text-xs text-stone-400 ml-1">cerrados</span>
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white p-6 h-32 flex flex-col justify-between ${engagementData.requestsPending > 2 ? 'cursor-pointer group hover:bg-stone-50 transition-colors' : ''}`}
            onClick={engagementData.requestsPending > 2 && onSelectArea ? () => onSelectArea('client-requests') : undefined}
          >
            <span className="text-[11px] text-stone-500 font-sans tracking-wide">{t('engagement.overview_requests')}</span>
            <div className="flex items-end gap-3">
              <div>
                <span className="text-3xl font-serif text-stone-900 tabular-nums">{engagementData.requestsPending}</span>
                <span className="text-xs text-stone-400 ml-1">pendientes</span>
              </div>
              <div className="w-px h-8 bg-stone-200"></div>
              <div>
                <span className="text-2xl font-serif text-stone-600 tabular-nums">{engagementData.requestsCompleted}</span>
                <span className="text-xs text-stone-400 ml-1">completadas</span>
              </div>
            </div>
            {engagementData.requestsPending > 2 && (
              <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Ver solicitudes</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>

        {/* Accounts to Audit */}
        <div className="mb-10">
          <h3 className="text-[11px] font-sans text-stone-500 uppercase tracking-widest mb-4">{t('sidebar.audit_accounts')}</h3>
          
          {/* Suppliers Card (Detailed) */}
          <div 
            className="bg-white border border-stone-200 p-6 mb-4 group hover:shadow-sm transition-all cursor-pointer"
            onClick={() => onSelectArea && onSelectArea('40')}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="text-lg font-serif text-stone-900">{suppliersArea.name}</h4>
                  <span className="text-xs text-stone-400 font-mono">({suppliersArea.code})</span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <span className="text-[10px] text-stone-500 block mb-1 uppercase tracking-wide">{t('engagement.overview_data_loaded')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-serif text-stone-900 tabular-nums">{suppliersArea.dataLoaded}%</span>
                      <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden max-w-20">
                        <div className="bg-stone-900 h-full" style={{ width: `${suppliersArea.dataLoaded}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block mb-1 uppercase tracking-wide">{t('engagement.overview_tests_executed')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-serif text-stone-900 tabular-nums">{suppliersArea.testsExecuted}%</span>
                      <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden max-w-20">
                        <div className="bg-stone-900 h-full" style={{ width: `${suppliersArea.testsExecuted}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block mb-1 uppercase tracking-wide">{t('engagement.overview_findings_open')}</span>
                    <span className="text-xl font-serif text-stone-900 tabular-nums">{suppliersArea.findingsOpen}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-stone-900 transition-colors" />
            </div>
          </div>

          {/* Other Accounts (Placeholders) */}
          <div className="grid grid-cols-2 gap-4">
            {otherAccounts.map((account) => (
              <div key={account.code} className="bg-white border border-stone-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-serif text-stone-900">{account.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">({account.code})</span>
                    </div>
                    <span className="text-[10px] text-stone-500">{account.status}</span>
                  </div>
                  <Clock className="w-4 h-4 text-stone-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-[11px] font-sans text-stone-500 uppercase tracking-widest mb-4">{t('engagement.overview_recent_activity')}</h3>
          <div className="bg-white border border-stone-200 p-6">
            <div className="relative pl-4 border-l border-stone-200 space-y-8">
              {recentActivity.map((activity, index) => {
                const getDotColor = () => {
                  switch (activity.type) {
                    case 'data': return 'bg-emerald-500';
                    case 'test': return 'bg-stone-900';
                    case 'finding': return 'bg-rose-500';
                    case 'request': return 'bg-blue-500';
                    default: return 'bg-stone-400';
                  }
                };
                
                return (
                  <div key={activity.id} className="relative">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${getDotColor()}`}></div>
                    
                    <div className="flex flex-col">
                      <p className="text-xs font-medium text-stone-900 mb-0.5">{activity.action}</p>
                      <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                        <span>{activity.time}</span>
                        <span>•</span>
                        <span>{activity.user}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
