
import React from 'react';
import { 
  AlertCircle, 
  TrendingUp,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { Alert } from '../types';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  // Mock data for alerts
  const alerts: Alert[] = [
    { id: 'a1', type: 'delay', severity: 'high', message: 'Tech Solutions audit is 5 days overdue', entity: 'Tech Solutions', date: 'Today' },
    { id: 'a2', type: 'quality', severity: 'medium', message: 'Documentation missing in Revenue cycle', entity: 'Beta Ind.', date: 'Yesterday' },
    { id: 'a3', type: 'anomaly', severity: 'low', message: 'High volume of manual overrides detected', entity: 'Grupo Alfa', date: 'Mar 14' },
  ];

  const heatmapData = [
    { name: 'Sector A', risk: 80, clients: 5 },
    { name: 'Sector B', risk: 45, clients: 12 },
    { name: 'Sector C', risk: 20, clients: 8 },
    { name: 'Sector D', risk: 95, clients: 2 },
  ];

  return (
    <div className="px-12 py-10 max-w-[1600px] mx-auto animate-fade-in bg-white">
      
      {/* Filters Header */}
      <div className="flex justify-between items-end mb-10 border-b border-stone-100 pb-6">
        <div>
           <h1 className="text-3xl text-stone-900 serif-font font-medium mb-2">{t('dashboard.title')}</h1>
           <div className="flex gap-3">
              <select className="bg-stone-50 border border-stone-200 text-[11px] py-1 px-2 rounded text-stone-600 font-sans focus:outline-none">
                 <option>Filter: All Sectors</option>
              </select>
              <select className="bg-stone-50 border border-stone-200 text-[11px] py-1 px-2 rounded text-stone-600 font-sans focus:outline-none">
                 <option>Filter: Partner (All)</option>
              </select>
           </div>
        </div>
      </div>

      <div className="space-y-12">
         
         {/* BLOCK 1: Portfolio Vision */}
         <section>
            <h3 className="text-[11px] font-sans text-stone-400 uppercase tracking-widest mb-6">{t('dashboard.block_portfolio')}</h3>
            <div className="grid grid-cols-3 gap-px bg-stone-200 border border-stone-200">
               
               {/* KPI 1 */}
               <div className="bg-white p-8 flex flex-col justify-between h-40 group hover:bg-stone-50 transition-colors">
                  <div className="flex justify-between">
                     <span className="text-[11px] text-stone-500 font-sans">{t('dashboard.kpi_clients')}</span>
                     <Briefcase className="w-4 h-4 text-stone-300 group-hover:text-stone-900 transition-colors" />
                  </div>
                  <div>
                     <div className="text-4xl font-serif text-stone-900 tabular-nums mb-1">142</div>
                     <div className="text-[10px] text-emerald-600 font-medium">+4 this quarter</div>
                  </div>
               </div>

               {/* KPI 2 */}
               <div className="bg-white p-8 flex flex-col justify-between h-40 group hover:bg-stone-50 transition-colors">
                  <div className="flex justify-between">
                     <span className="text-[11px] text-stone-500 font-sans">{t('dashboard.kpi_engagements')}</span>
                     <Clock className="w-4 h-4 text-stone-300 group-hover:text-stone-900 transition-colors" />
                  </div>
                  <div>
                     <div className="text-4xl font-serif text-stone-900 tabular-nums mb-1">24 <span className="text-xl text-stone-400">/ 15</span></div>
                     <div className="text-[10px] text-stone-400 font-medium">Active / Closed</div>
                  </div>
               </div>

               {/* KPI 3 */}
               <div className="bg-white p-8 flex flex-col justify-between h-40 group hover:bg-stone-50 transition-colors">
                  <div className="flex justify-between">
                     <span className="text-[11px] text-stone-500 font-sans">{t('dashboard.kpi_ai_active')}</span>
                     <Sparkles className="w-4 h-4 text-stone-300 group-hover:text-stone-900 transition-colors" />
                  </div>
                  <div>
                     <div className="text-4xl font-serif text-stone-900 tabular-nums mb-1">78%</div>
                     <div className="text-[10px] text-stone-400 font-medium">of procedures automated</div>
                  </div>
               </div>
            </div>
         </section>

         {/* BLOCK 2: Risk & Quality */}
         <section className="grid grid-cols-3 gap-12">
            <div className="col-span-2">
               <h3 className="text-[11px] font-sans text-stone-400 uppercase tracking-widest mb-6">{t('dashboard.block_risk')}</h3>
               
               <div className="border border-stone-200 p-6 bg-white h-64 flex gap-8">
                  <div className="flex-1">
                     <h4 className="font-serif text-lg text-stone-900 mb-1">{t('dashboard.risk_heatmap')}</h4>
                     <p className="text-[10px] text-stone-400 mb-4">{t('dashboard.risk_heatmap_sub')}</p>
                     <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={heatmapData}>
                              <Bar dataKey="risk" radius={[0, 0, 0, 0]}>
                                 {heatmapData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.risk > 70 ? '#be123c' : entry.risk > 40 ? '#d97706' : '#10b981'} />
                                 ))}
                              </Bar>
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                  <div className="w-px bg-stone-100"></div>
                  <div className="w-48 flex flex-col justify-center gap-6">
                      <div>
                         <span className="text-[10px] text-stone-400 block mb-1">{t('dashboard.kpi_deadline')}</span>
                         <span className="text-2xl font-serif text-stone-900">92%</span>
                      </div>
                      <div>
                         <span className="text-[10px] text-stone-400 block mb-1">{t('dashboard.kpi_overrides')}</span>
                         <span className="text-2xl font-serif text-stone-900">4.5</span>
                      </div>
                  </div>
               </div>
            </div>

            {/* BLOCK 3: Alerts */}
            <div className="col-span-1">
               <h3 className="text-[11px] font-sans text-stone-400 uppercase tracking-widest mb-6">{t('dashboard.block_alerts')}</h3>
               
               <div className="bg-stone-50 border border-stone-200">
                  {alerts.map((alert, i) => (
                     <div key={alert.id} className={`p-4 border-b border-stone-200 last:border-0 group hover:bg-white transition-colors cursor-pointer`}>
                        <div className="flex justify-between items-start mb-1">
                           <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                              alert.severity === 'high' ? 'bg-rose-100 text-rose-700' : 
                              alert.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 
                              'bg-stone-200 text-stone-600'
                           }`}>
                              {t(`dashboard.alert_${alert.type}`)}
                           </span>
                           <span className="text-[10px] text-stone-400 font-sans">{alert.date}</span>
                        </div>
                        <p className="text-xs font-medium text-stone-900 mt-2 mb-0.5">{alert.message}</p>
                        <p className="text-[10px] text-stone-500">{alert.entity}</p>
                     </div>
                  ))}
                  <div className="p-3 text-center border-t border-stone-200">
                     <button className="text-[10px] font-medium text-stone-600 hover:text-stone-900 flex items-center justify-center gap-1 mx-auto">
                        {t('dashboard.view_details')} <ArrowRight className="w-2.5 h-2.5" />
                     </button>
                  </div>
               </div>
            </div>
         </section>

      </div>
    </div>
  );
};