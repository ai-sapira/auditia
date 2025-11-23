
import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Clock, 
  Filter, 
  ArrowUpRight,
  MoreHorizontal,
  Calendar
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { PipelineStage } from '../types';

// Extended interface for local mock data to support richer UI
interface EnhancedPipelineItem {
  id: string;
  client: string;
  stage: PipelineStage;
  partner: string;
  manager: string;
  startDate: string;
  endDate: string;
  risk: 'low' | 'medium' | 'high';
  sector: string;
  daysInStage: number;
  teamInitials: string[];
}

export const PortfolioView: React.FC = () => {
  const { t } = useLanguage();
  const [selectedPartner, setSelectedPartner] = useState<string>('All');
  const [selectedSector, setSelectedSector] = useState<string>('All');

  // --- 1. Expanded Mock Data (12+ items) ---
  const fullPipeline: EnhancedPipelineItem[] = [
    // Not Started
    { id: '1', client: 'Industrias Beta', stage: 'not_started', partner: 'Elena M.', manager: 'Sofia L.', startDate: '01/04', endDate: '15/05', risk: 'low', sector: 'Manufacturing', daysInStage: 12, teamInitials: ['SL', 'AR'] },
    { id: '6', client: 'Kappa Energy', stage: 'not_started', partner: 'Javier P.', manager: 'Carlos D.', startDate: '10/04', endDate: '20/06', risk: 'medium', sector: 'Energy', daysInStage: 5, teamInitials: ['CD'] },
    
    // Ingestion
    { id: '2', client: 'Gamma Logistics', stage: 'ingestion', partner: 'Javier P.', manager: 'Carlos D.', startDate: '15/03', endDate: '30/04', risk: 'medium', sector: 'Logistics', daysInStage: 3, teamInitials: ['CD', 'MF'] },
    { id: '7', client: 'Epsilon Pharna', stage: 'ingestion', partner: 'Elena M.', manager: 'Sofia L.', startDate: '18/03', endDate: '15/05', risk: 'low', sector: 'Healthcare', daysInStage: 1, teamInitials: ['SL'] },

    // Testing (Fieldwork)
    { id: '3', client: 'Grupo Alfa', stage: 'testing', partner: 'Elena M.', manager: 'Carlos D.', startDate: '01/03', endDate: '30/03', risk: 'high', sector: 'Manufacturing', daysInStage: 15, teamInitials: ['CD', 'AR', 'JP'] },
    { id: '8', client: 'Zeta Bank', stage: 'testing', partner: 'Javier P.', manager: 'Maria F.', startDate: '20/02', endDate: '10/04', risk: 'high', sector: 'Finance', daysInStage: 22, teamInitials: ['MF', 'SL'] },
    { id: '9', client: 'Theta Tech', stage: 'testing', partner: 'Carlos D.', manager: 'Sofia L.', startDate: '05/03', endDate: '25/04', risk: 'medium', sector: 'Technology', daysInStage: 8, teamInitials: ['SL'] },

    // Review
    { id: '4', client: 'Delta Finance', stage: 'review', partner: 'Javier P.', manager: 'Maria F.', startDate: '15/02', endDate: '20/03', risk: 'medium', sector: 'Finance', daysInStage: 4, teamInitials: ['MF'] },
    { id: '10', client: 'Iota Construction', stage: 'review', partner: 'Elena M.', manager: 'Carlos D.', startDate: '10/01', endDate: '15/03', risk: 'low', sector: 'Real Estate', daysInStage: 10, teamInitials: ['CD', 'AR'] },

    // Closed
    { id: '5', client: 'Omega Retail', stage: 'closed', partner: 'Elena M.', manager: 'Sofia L.', startDate: '01/01', endDate: '28/02', risk: 'low', sector: 'Retail', daysInStage: 0, teamInitials: ['SL', 'AR'] },
    { id: '11', client: 'Lambda Foods', stage: 'closed', partner: 'Javier P.', manager: 'Maria F.', startDate: '01/01', endDate: '15/02', risk: 'medium', sector: 'Retail', daysInStage: 0, teamInitials: ['MF'] },
    { id: '12', client: 'Mu Motors', stage: 'closed', partner: 'Carlos D.', manager: 'Sofia L.', startDate: '15/12', endDate: '30/01', risk: 'low', sector: 'Manufacturing', daysInStage: 0, teamInitials: ['SL'] },
  ];

  // --- Filter Logic ---
  const pipeline = fullPipeline.filter(item => {
    const matchPartner = selectedPartner === 'All' || item.partner === selectedPartner;
    const matchSector = selectedSector === 'All' || item.sector === selectedSector;
    return matchPartner && matchSector;
  });

  const capacityData = [
    { week: 'W10', planned: 120, available: 140 },
    { week: 'W11', planned: 135, available: 140 },
    { week: 'W12', planned: 155, available: 140 }, // Over capacity
    { week: 'W13', planned: 110, available: 140 },
    { week: 'W14', planned: 95, available: 140 },
  ];

  const riskMap = [
    { client: 'Grupo Alfa', risk: 90, sector: 'Manufacturing', issue: 'Cut-off errors' },
    { client: 'Zeta Bank', risk: 85, sector: 'Finance', issue: 'Compliance' },
    { client: 'Delta Finance', risk: 75, sector: 'Finance', issue: 'Valuation' },
    { client: 'Theta Tech', risk: 60, sector: 'Technology', issue: 'Revenue rec.' },
    { client: 'Gamma Log.', risk: 45, sector: 'Logistics', issue: '-' },
    { client: 'Omega Retail', risk: 15, sector: 'Retail', issue: '-' },
  ];

  const stages: PipelineStage[] = ['not_started', 'ingestion', 'testing', 'review', 'closed'];
  const partners = ['All', 'Elena M.', 'Javier P.', 'Carlos D.'];
  const sectors = ['All', 'Manufacturing', 'Finance', 'Technology', 'Retail', 'Logistics', 'Energy', 'Healthcare'];

  // Custom Tooltip for BarChart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-stone-200 p-3 shadow-lg rounded-sm">
          <p className="text-xs font-serif text-stone-900 mb-2">{label}</p>
          <p className="text-[10px] text-stone-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-stone-900 rounded-full"></span>
            Planned: <span className="font-medium text-stone-900">{payload[0].value}h</span>
          </p>
          <p className="text-[10px] text-stone-500 flex items-center gap-2">
             <span className="w-2 h-2 bg-stone-200 rounded-full"></span>
            Available: <span className="font-medium text-stone-900">{payload[1].value}h</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-12 py-10 max-w-[1800px] mx-auto animate-fade-in bg-white">
      
      {/* Header & Section 1: Portfolio Summary */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-8 pb-6 border-b border-stone-100">
            <div>
                <h1 className="text-3xl text-stone-900 serif-font font-medium mb-1">{t('portfolio.header')}</h1>
                <p className="text-stone-400 font-sans text-sm">{t('portfolio.subtitle')}</p>
            </div>
            {/* Filters */}
            <div className="flex gap-3">
               {/* Partner Filter */}
               <div className="relative group">
                 <select 
                    value={selectedPartner}
                    onChange={(e) => setSelectedPartner(e.target.value)}
                    className="appearance-none pl-8 pr-8 py-1.5 border border-stone-200 rounded text-xs text-stone-600 cursor-pointer hover:border-stone-900 transition-colors bg-transparent focus:outline-none"
                 >
                    {partners.map(p => <option key={p} value={p}>{p === 'All' ? t('portfolio.filter_all') : p}</option>)}
                 </select>
                 <Filter className="w-3 h-3 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
               </div>
               
               {/* Sector Filter */}
               <div className="relative group">
                 <select 
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="appearance-none pl-8 pr-8 py-1.5 border border-stone-200 rounded text-xs text-stone-600 cursor-pointer hover:border-stone-900 transition-colors bg-transparent focus:outline-none"
                 >
                    {sectors.map(s => <option key={s} value={s}>{s === 'All' ? t('portfolio.filter_all') : s}</option>)}
                 </select>
                 <Briefcase className="w-3 h-3 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
               </div>
            </div>
        </div>

        <h3 className="text-[11px] font-sans text-stone-400 tracking-widest mb-6">{t('portfolio.section_summary')}</h3>
        <div className="grid grid-cols-4 gap-6">
            <div className="bg-stone-50 p-6 border border-stone-100 flex flex-col justify-between h-32 hover:border-stone-300 transition-colors">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-sans text-stone-500">{t('portfolio.kpi_active_clients')}</span>
                    <Users className="w-4 h-4 text-stone-400" />
                </div>
                <div className="text-4xl font-serif text-stone-900 tabular-nums">142</div>
            </div>
            <div className="bg-stone-50 p-6 border border-stone-100 flex flex-col justify-between h-32 hover:border-stone-300 transition-colors">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-sans text-stone-500">{t('portfolio.kpi_engagements')}</span>
                    <Briefcase className="w-4 h-4 text-stone-400" />
                </div>
                <div className="text-4xl font-serif text-stone-900 tabular-nums">
                    24 <span className="text-xl text-stone-400 font-light">/ 8 / 15</span>
                </div>
            </div>
            <div className="bg-stone-50 p-6 border border-stone-100 flex flex-col justify-between h-32 hover:border-stone-300 transition-colors">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-sans text-stone-500">{t('portfolio.kpi_ontime')}</span>
                    <Clock className="w-4 h-4 text-stone-400" />
                </div>
                <div className="text-4xl font-serif text-stone-900 tabular-nums">92%</div>
            </div>
             <div className="bg-white p-6 border border-stone-200 flex flex-col justify-between h-32 shadow-sm">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-sans text-stone-500">Requires attention</span>
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                </div>
                <div>
                    <div className="text-2xl font-serif text-stone-900 mb-1">Zeta Bank</div>
                    <div className="text-[10px] text-stone-400">High risk findings in testing</div>
                </div>
            </div>
        </div>
      </div>

      {/* Section 2: Engagement Pipeline (Rich Kanban) */}
      <div className="mb-12">
        <h3 className="text-[11px] font-sans text-stone-400 tracking-widest mb-6">{t('portfolio.section_pipeline')}</h3>
        <div className="grid grid-cols-5 gap-4 min-h-[400px]">
            {stages.map(stage => (
                <div key={stage} className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-stone-200">
                        <span className="text-[11px] font-medium text-stone-500 tracking-wide">
                           {t(`portfolio.stage_${stage}`)}
                        </span>
                        <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 rounded-full">
                           {pipeline.filter(p => p.stage === stage).length}
                        </span>
                    </div>
                    <div className="bg-stone-50/30 flex-1 p-2 space-y-3 rounded-sm border border-transparent hover:border-stone-100 transition-colors">
                        {pipeline.filter(p => p.stage === stage).map(item => (
                            <div key={item.id} className="bg-white p-4 border border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300 transition-all cursor-pointer group relative">
                                {/* Risk Indicator Strip */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                    item.risk === 'high' ? 'bg-rose-500' : 
                                    item.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}></div>
                                
                                <div className="pl-2">
                                   {/* Top Meta: Time in stage */}
                                   <div className="flex justify-between items-start mb-2">
                                       <span className="text-[9px] text-stone-400 font-medium uppercase tracking-wider">
                                          {item.daysInStage > 0 ? `${item.daysInStage} ${t('portfolio.card_days')}` : 'Just started'}
                                       </span>
                                       <MoreHorizontal className="w-3 h-3 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                   </div>

                                   {/* Title & Sector */}
                                   <h4 className="text-sm font-serif text-stone-900 font-medium mb-1 leading-tight">{item.client}</h4>
                                   <div className="inline-block px-1.5 py-0.5 bg-stone-100 text-[9px] text-stone-500 rounded mb-3">
                                      {item.sector}
                                   </div>

                                   {/* Bottom Meta: Team & Date */}
                                   <div className="flex justify-between items-center border-t border-stone-50 pt-3">
                                       <div className="flex -space-x-1.5">
                                          {item.teamInitials.map((init, i) => (
                                             <div key={i} className="w-5 h-5 rounded-full bg-stone-200 border border-white flex items-center justify-center text-[8px] font-medium text-stone-600">
                                                {init}
                                             </div>
                                          ))}
                                       </div>
                                       <div className="flex items-center gap-1 text-[10px] text-stone-400">
                                          <Calendar className="w-2.5 h-2.5" />
                                          <span>{item.endDate}</span>
                                       </div>
                                   </div>
                                </div>
                            </div>
                        ))}
                        {pipeline.filter(p => p.stage === stage).length === 0 && (
                            <div className="h-24 flex items-center justify-center text-[10px] text-stone-300 italic border-2 border-dashed border-stone-100 rounded">
                                Empty
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Section 3 & 4: Capacity & Risk */}
      <div className="grid grid-cols-3 gap-12">
          
          {/* Capacity */}
          <div className="col-span-2">
              <h3 className="text-[11px] font-sans text-stone-400 tracking-widest mb-6">{t('portfolio.section_capacity')}</h3>
              <div className="border border-stone-200 p-6 h-80 bg-white">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={capacityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                          <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#78716c', fontFamily: 'Inter'}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#78716c', fontFamily: 'Inter'}} />
                          <Tooltip content={<CustomTooltip />} cursor={{fill: '#fafaf9'}} />
                          <Bar dataKey="planned" name={t('portfolio.cap_planned')} stackId="a" fill="#1c1917" barSize={40} radius={[0, 0, 2, 2]} />
                          <Bar dataKey="available" name={t('portfolio.cap_available')} stackId="a" fill="#e5e7eb" barSize={40} radius={[2, 2, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
                  
                  {/* Custom Legend */}
                  <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-stone-900 rounded-sm"></div>
                          <span className="text-xs text-stone-600">{t('portfolio.cap_planned')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-stone-200 rounded-sm"></div>
                          <span className="text-xs text-stone-600">{t('portfolio.cap_available')}</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Risk Map List */}
          <div className="col-span-1">
               <h3 className="text-[11px] font-sans text-stone-400 tracking-widest mb-6">{t('portfolio.section_risk')}</h3>
               <div className="space-y-0 border border-stone-200 bg-white">
                  <div className="flex items-center justify-between p-3 bg-stone-50 border-b border-stone-200">
                      <span className="text-[10px] font-medium text-stone-500 uppercase">Client</span>
                      <span className="text-[10px] font-medium text-stone-500 uppercase">Risk Score</span>
                  </div>
                  {riskMap.map((client, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border-b border-stone-100 hover:bg-stone-50 transition-colors cursor-pointer group last:border-0">
                          <div>
                              <div className="text-sm font-serif text-stone-900">{client.client}</div>
                              <div className="text-[10px] text-stone-400 flex items-center gap-2">
                                 {client.sector}
                                 {client.risk > 50 && <span className="text-rose-400">• {client.issue}</span>}
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                               <div className="w-20 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                   <div 
                                      className={`h-full rounded-full ${client.risk > 80 ? 'bg-rose-500' : client.risk > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                      style={{ width: `${client.risk}%` }}
                                   ></div>
                               </div>
                               <span className="text-xs font-medium tabular-nums text-stone-600 w-6 text-right">{client.risk}</span>
                          </div>
                      </div>
                  ))}
                  <div className="p-3 text-center">
                      <button className="text-[10px] text-stone-500 hover:text-stone-900 flex items-center justify-center gap-1 w-full">
                          View full risk matrix <ArrowUpRight className="w-2.5 h-2.5" />
                      </button>
                  </div>
               </div>
          </div>

      </div>
    </div>
  );
};
