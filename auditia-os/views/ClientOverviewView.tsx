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
  Users as UsersIcon
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LineChart, Line } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface ClientOverviewViewProps {
  clientName: string;
  onNavigateToEngagement: (id: string) => void;
}

export const ClientOverviewView: React.FC<ClientOverviewViewProps> = ({ clientName, onNavigateToEngagement }) => {
  const { t } = useLanguage();

  // Mock Data
  const engagements = [
    { id: 'eng-001', name: 'Audit FY2024', type: 'Financial Audit', status: 'In Progress', progress: 68, deadline: 'Apr 30, 2025', team: ['JP', 'AR', 'SL'], fee: '€45k' },
    { id: 'eng-002', name: 'Tax Review Q1', type: 'Tax Compliance', status: 'Planning', progress: 15, deadline: 'May 15, 2025', team: ['JP', 'MD'], fee: '€12k' },
    { id: 'eng-003', name: 'Internal Controls', type: 'Advisory', status: 'Review', progress: 90, deadline: 'Mar 20, 2025', team: ['AR', 'SL'], fee: '€28k' },
  ];

  const billingData = [
    { month: 'Oct', billed: 12000, wip: 4000 },
    { month: 'Nov', billed: 15000, wip: 8000 },
    { month: 'Dec', billed: 22000, wip: 12000 },
    { month: 'Jan', billed: 18000, wip: 15000 },
    { month: 'Feb', billed: 10000, wip: 18000 }, // High WIP
    { month: 'Mar', billed: 5000, wip: 22000 },  // Very High WIP (Current)
  ];

  const activityLog = [
    { id: 1, type: 'doc', user: 'Marta G. (Client)', action: 'uploaded', target: 'Trial Balance Q4', time: '2h ago' },
    { id: 2, type: 'msg', user: 'Javier P. (Partner)', action: 'commented on', target: 'Revenue Cycle', time: '4h ago' },
    { id: 3, type: 'sys', user: 'System', action: 'flagged', target: 'Unusual Transaction #4021', time: 'Yesterday' },
    { id: 4, type: 'status', user: 'Sofia L. (Manager)', action: 'completed', target: 'Planning Phase', time: '2 days ago' },
  ];

  return (
    <div className="px-12 py-10 max-w-[1600px] mx-auto animate-fade-in bg-white h-full flex flex-col">
      
      {/* 1. HEADER: Identity & Key Metrics */}
      <div className="flex justify-between items-start mb-10 border-b border-stone-100 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-serif text-stone-900">{clientName}</h1>
            <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-[10px] font-sans tracking-wide uppercase rounded-sm">Manufacturing</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-sans text-stone-500">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3 h-3" /> Grupo Alfa S.A.
            </span>
            <span className="flex items-center gap-1.5">
              <UsersIcon className="w-3 h-3" /> Partner: Javier P.
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="w-3 h-3" /> Good Standing
            </span>
          </div>
        </div>
        
        {/* High-Level Stats */}
        <div className="flex gap-8">
           <div className="text-right">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Total WIP</span>
              <div className="text-2xl font-serif text-stone-900">€22,450</div>
           </div>
           <div className="w-px bg-stone-100 h-10"></div>
           <div className="text-right">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Open Alerts</span>
              <div className="text-2xl font-serif text-stone-900 flex items-center justify-end gap-2">
                 3 <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-12 flex-1">
        
        {/* LEFT COLUMN: Engagements & Billing (2/3 width) */}
        <div className="col-span-2 space-y-12">
          
          {/* Engagements List */}
          <section>
             <div className="flex justify-between items-end mb-6">
                <h3 className="text-lg font-serif text-stone-900">Active Engagements</h3>
                <button className="text-[10px] text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors">
                   View all history <ArrowRight className="w-2.5 h-2.5" />
                </button>
             </div>
             
             <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-stone-50 border-b border-stone-200">
                      <tr>
                         <th className="px-6 py-3 text-[10px] font-medium text-stone-500 uppercase tracking-wider font-sans w-1/3">Engagement</th>
                         <th className="px-6 py-3 text-[10px] font-medium text-stone-500 uppercase tracking-wider font-sans">Status</th>
                         <th className="px-6 py-3 text-[10px] font-medium text-stone-500 uppercase tracking-wider font-sans">Deadline</th>
                         <th className="px-6 py-3 text-[10px] font-medium text-stone-500 uppercase tracking-wider font-sans">Fee</th>
                         <th className="px-6 py-3 text-[10px] font-medium text-stone-500 uppercase tracking-wider font-sans text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-stone-100">
                      {engagements.map(eng => (
                         <tr key={eng.id} className="group hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => onNavigateToEngagement(eng.id)}>
                            <td className="px-6 py-4">
                               <div className="font-serif text-sm text-stone-900 font-medium mb-0.5">{eng.name}</div>
                               <div className="text-[10px] text-stone-400">{eng.type}</div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                     <div className="h-full bg-stone-800" style={{ width: `${eng.progress}%` }}></div>
                                  </div>
                                  <span className="text-xs text-stone-600 tabular-nums">{eng.progress}%</span>
                               </div>
                               <div className="text-[10px] text-stone-400 mt-1">{eng.status}</div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-1.5 text-xs text-stone-600">
                                  <Calendar className="w-3 h-3 text-stone-300" />
                                  {eng.deadline}
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className="text-xs font-medium text-stone-600">{eng.fee}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 ml-auto transition-colors" />
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </section>

          {/* Billing & Financials */}
          <section>
             <h3 className="text-lg font-serif text-stone-900 mb-6">Billing & WIP Analysis</h3>
             <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-stone-200 p-6 h-64">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <span className="text-xs font-medium text-stone-900 block mb-1">WIP vs Billed (6 Mo)</span>
                         <span className="text-[10px] text-stone-400">Accumulating WIP needs attention</span>
                      </div>
                      <DollarSign className="w-4 h-4 text-stone-300" />
                   </div>
                   <ResponsiveContainer width="100%" height="100%" minHeight={100}>
                      <BarChart data={billingData} barGap={2}>
                         <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a8a29e'}} dy={10} />
                         <Tooltip 
                            cursor={{fill: '#f5f5f4'}}
                            contentStyle={{backgroundColor: '#fff', borderColor: '#e7e5e4', fontSize: '12px'}}
                         />
                         <Bar dataKey="billed" name="Billed" fill="#e5e7eb" radius={[2, 2, 0, 0]} />
                         <Bar dataKey="wip" name="WIP" fill="#1c1917" radius={[2, 2, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-6 h-64 flex flex-col justify-between">
                    <div>
                       <h4 className="font-serif text-lg text-stone-900 mb-2">Financial Summary</h4>
                       <div className="space-y-4 mt-4">
                          <div className="flex justify-between text-sm border-b border-stone-200 pb-2">
                             <span className="text-stone-500">Total Contract Value</span>
                             <span className="font-medium text-stone-900">€85,000</span>
                          </div>
                          <div className="flex justify-between text-sm border-b border-stone-200 pb-2">
                             <span className="text-stone-500">Billed YTD</span>
                             <span className="font-medium text-stone-900">€45,000</span>
                          </div>
                          <div className="flex justify-between text-sm pb-2">
                             <span className="text-stone-500">Recovery Rate</span>
                             <span className="font-medium text-stone-900 text-emerald-600">94%</span>
                          </div>
                       </div>
                    </div>
                    <button className="text-xs text-stone-600 hover:text-stone-900 underline self-start">
                       View detailed ledger
                    </button>
                </div>
             </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Activity & Info (1/3 width) */}
        <div className="col-span-1 space-y-12">
           
           {/* Recent Activity Feed */}
           <section>
              <h3 className="text-lg font-serif text-stone-900 mb-6">Recent Activity</h3>
              <div className="bg-white border-l border-stone-200 pl-6 py-2 space-y-8 relative">
                 {activityLog.map((log, i) => (
                    <div key={log.id} className="relative">
                       {/* Timeline Dot */}
                       <div className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                          log.type === 'sys' ? 'bg-rose-400' : 
                          log.type === 'doc' ? 'bg-stone-400' : 'bg-stone-900'
                       }`}></div>
                       
                       <p className="text-xs text-stone-900 mb-1">
                          <span className="font-medium">{log.user}</span> {log.action} <span className="font-medium">{log.target}</span>
                       </p>
                       <span className="text-[10px] text-stone-400 block">{log.time}</span>
                    </div>
                 ))}
                 <div className="pt-4">
                    <button className="text-[10px] text-stone-400 hover:text-stone-900 transition-colors">Load more activities...</button>
                 </div>
              </div>
           </section>

           {/* Team & Contacts */}
           <section>
              <h3 className="text-lg font-serif text-stone-900 mb-6">Client Team</h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 p-3 border border-stone-100 bg-stone-50 rounded-sm">
                    <div className="w-8 h-8 bg-white border border-stone-200 rounded-full flex items-center justify-center text-xs font-serif text-stone-600">MG</div>
                    <div>
                       <div className="text-xs font-medium text-stone-900">Marta Garcia</div>
                       <div className="text-[10px] text-stone-500">CFO</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-3 border border-stone-100 bg-stone-50 rounded-sm">
                    <div className="w-8 h-8 bg-white border border-stone-200 rounded-full flex items-center justify-center text-xs font-serif text-stone-600">JL</div>
                    <div>
                       <div className="text-xs font-medium text-stone-900">Jose Lopez</div>
                       <div className="text-[10px] text-stone-500">Controller</div>
                    </div>
                 </div>
              </div>
           </section>

           {/* Client Notes */}
           <section>
              <h3 className="text-lg font-serif text-stone-900 mb-4">Internal Notes</h3>
              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-sm">
                 <p className="text-xs text-stone-600 italic leading-relaxed">
                    "Client is preparing for IPO in 2026. Pay special attention to revenue recognition policies and capitalization of R&D expenses this cycle."
                 </p>
                 <div className="mt-2 text-[10px] text-stone-400 text-right">— Javier P.</div>
              </div>
           </section>

        </div>

      </div>
    </div>
  );
};

// Helper Icon for Users (reusing existing Lucide import)


