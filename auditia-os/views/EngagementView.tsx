
import React, { useState } from 'react';
import { 
  Play, 
  Filter, 
  ArrowUpRight, 
  FileText,
  CheckCircle,
  Download,
  MoreHorizontal,
  AlertOctagon,
  PanelRight,
  PanelRightClose,
  History,
  UploadCloud,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart as RePieChart, Pie } from 'recharts';
import { AGENTS_ALFA, FINDINGS_ALFA } from '../constants';
import { AgentStatus, TimelineEvent } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface EngagementViewProps {
  activeArea: string | null; // 'summary' or '40' (Proveedores)
}

export const EngagementView: React.FC<EngagementViewProps> = ({ activeArea }) => {
  const { t } = useLanguage();
  
  // Detail View States
  const [activeTab, setActiveTab] = useState('data');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false); 
  
  // Charts Data
  const monthlyData = [
    { name: 'Jan', value: 400000 }, { name: 'Feb', value: 350000 }, { name: 'Mar', value: 500000 },
    { name: 'Apr', value: 420000 }, { name: 'May', value: 380000 }, { name: 'Jun', value: 450000 },
  ];

  const histogramData = [
    { range: '0-1k', count: 8500 },
    { range: '1k-10k', count: 3200 },
    { range: '10k-50k', count: 650 },
    { range: '50k+', count: 55 },
  ];

  const progressData = [
    { name: 'Completed', value: 68, color: '#1c1917' }, 
    { name: 'Remaining', value: 32, color: '#e5e5e5' }, 
  ];

  const timeline: TimelineEvent[] = [
     { id: 'tl-1', type: 'agent', title: 'Reconciler executed', timestamp: '2h ago', description: 'Detected 3 material discrepancies in Suppliers.', user: 'System' },
     { id: 'tl-2', type: 'override', title: 'Manual Override', timestamp: '4h ago', description: 'Marked H-004 as immaterial based on supporting docs.', user: 'Alejandro R.' },
  ];
  
  const agents = AGENTS_ALFA;
  const papers = [
    { id: 'WP-AP-01', name: 'Lead Schedule - Accounts Payable', status: 'final', date: '15/03/2025' },
    { id: 'WP-AP-02', name: 'Search for Unrecorded Liabilities', status: 'review', date: '14/03/2025' },
  ];

  const handleRunAgent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
  };

  // --- RENDER: OVERVIEW (Section 1) ---
  const renderOverview = () => (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-white">
       {/* Overview Header */}
       <div className="flex justify-between items-start px-10 pt-10 mb-6">
          <div>
             <h1 className="text-3xl font-serif text-stone-900">{t('engagement.overview_title')}</h1>
             <p className="text-stone-400 font-sans text-sm mt-1">{t('engagement.header_subtitle')}</p>
          </div>
          <button 
             onClick={() => setShowTimeline(!showTimeline)}
             className={`p-2 rounded hover:bg-stone-100 transition-colors ${showTimeline ? 'text-stone-900 bg-stone-100' : 'text-stone-400'}`}
          >
             {showTimeline ? <PanelRightClose className="w-5 h-5" /> : <PanelRight className="w-5 h-5" />}
          </button>
       </div>
       
       <div className="flex-1 overflow-y-auto px-10 pb-10 animate-fade-in">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-px bg-stone-200 border border-stone-200 mb-10">
             <div className="bg-white p-6 h-32 flex flex-col justify-between">
                <span className="text-[11px] text-stone-500 font-sans tracking-wide">{t('engagement.kpi_completion')}</span>
                <div className="flex items-end justify-between">
                   <span className="text-3xl font-serif text-stone-900 tabular-nums">68%</span>
                   <div className="w-12 h-1 bg-stone-100 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '68%' }}></div>
                   </div>
                </div>
             </div>
             <div className="bg-white p-6 h-32 flex flex-col justify-between">
                <span className="text-[11px] text-stone-500 font-sans tracking-wide">{t('engagement.kpi_material_findings')}</span>
                <span className="text-3xl font-serif text-stone-900 text-rose-600 tabular-nums">5</span>
             </div>
             <div className="bg-white p-6 h-32 flex flex-col justify-between">
                <span className="text-[11px] text-stone-500 font-sans tracking-wide">{t('engagement.kpi_client_requests')}</span>
                <span className="text-3xl font-serif text-stone-900 text-amber-600 tabular-nums">3</span>
             </div>
             <div className="bg-white p-6 h-32 flex flex-col justify-between">
                <span className="text-[11px] text-stone-500 font-sans tracking-wide">{t('engagement.kpi_automation')}</span>
                <span className="text-3xl font-serif text-stone-900 tabular-nums">78%</span>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
             {/* Donut Chart */}
             <div className="col-span-1 bg-stone-50 border border-stone-200 p-6">
                <h3 className="text-xs font-sans text-stone-500 uppercase tracking-wide mb-4">{t('engagement.chart_progress')}</h3>
                <div className="h-48 w-full relative">
                   <ResponsiveContainer>
                      <RePieChart>
                         <Pie data={progressData} innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value" startAngle={90} endAngle={-270}>
                            {progressData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                         </Pie>
                      </RePieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                         <span className="block text-3xl font-serif text-stone-900">68%</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Timeline Bar */}
             <div className="col-span-2 bg-white border border-stone-200 p-8 flex flex-col justify-center">
                <h3 className="text-xs font-sans text-stone-500 uppercase tracking-wide mb-10">{t('engagement.timeline_milestones')}</h3>
                <div className="relative">
                   <div className="h-px bg-stone-200 w-full absolute top-1.5"></div>
                   <div className="flex justify-between relative z-10">
                      {[{ label: 'Kick-off', date: 'Jan 15', status: 'done' }, { label: 'Ingestion', date: 'Feb 01', status: 'done' }, { label: 'Testing', date: 'Mar 15', status: 'active' }, { label: 'Review', date: 'Mar 25', status: 'pending' }, { label: 'Report', date: 'Mar 30', status: 'pending' }].map((milestone, i) => (
                         <div key={i} className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full mb-3 ring-4 ring-white ${milestone.status === 'done' ? 'bg-stone-900' : milestone.status === 'active' ? 'bg-emerald-500' : 'bg-stone-200'}`}></div>
                            <span className={`text-xs font-medium ${milestone.status === 'pending' ? 'text-stone-300' : 'text-stone-900'}`}>{milestone.label}</span>
                            <span className="text-[10px] text-stone-400 mt-1">{milestone.date}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  // --- RENDER: AREA DETAIL (Section 3) ---
  const renderAreaDetail = () => {
    // Findings Logic for Master-Detail
    const selectedFinding = FINDINGS_ALFA.find(f => f.id === selectedFindingId);

    return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-stone-50/30 relative">
         {/* Header */}
         <div className="px-10 pt-10 pb-0 bg-white border-b border-stone-200">
            <div className="flex justify-between items-start">
               <h1 className="text-3xl font-serif text-stone-900 mb-6">{t('engagement.header_title')}</h1>
               <button 
                  onClick={() => setShowTimeline(!showTimeline)}
                  className={`p-2 rounded hover:bg-stone-100 transition-colors ${showTimeline ? 'text-stone-900 bg-stone-100' : 'text-stone-400'}`}
               >
                  {showTimeline ? <PanelRightClose className="w-5 h-5" /> : <History className="w-5 h-5" />}
               </button>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-8">
               {['Data', 'Tests', 'Findings', 'Papers'].map((tab) => (
                  <button 
                     key={tab}
                     onClick={() => { setActiveTab(tab.toLowerCase()); setSelectedFindingId(null); }}
                     className={`pb-4 text-xs font-medium tracking-wide uppercase transition-all border-b-2 ${
                        activeTab === tab.toLowerCase() 
                        ? 'text-stone-900 border-stone-900' 
                        : 'text-stone-400 border-transparent hover:text-stone-600'
                     }`}
                  >
                     {t(`engagement.tab_${tab.toLowerCase()}`)}
                  </button>
               ))}
            </div>
         </div>

         {/* Content */}
         <div className="flex-1 overflow-y-auto p-10">
            
            {/* --- TAB 1: DATA --- */}
            {activeTab === 'data' && (
               <div className="animate-fade-in space-y-8 max-w-5xl">
                  {/* Dropzone */}
                  <div className="border-2 border-dashed border-stone-200 rounded-sm bg-stone-50/50 p-8 flex flex-col items-center justify-center hover:bg-stone-50 transition-colors cursor-pointer group">
                     <div className="w-12 h-12 bg-white rounded-full border border-stone-200 flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                        <UploadCloud className="w-5 h-5 text-stone-400 group-hover:text-stone-600" />
                     </div>
                     <h3 className="text-sm font-medium text-stone-900">{t('engagement.drag_drop_title')}</h3>
                     <p className="text-xs text-stone-400 mt-1">{t('engagement.drag_drop_subtitle')}</p>
                  </div>

                  {/* KPIs */}
                  <div className="grid grid-cols-4 gap-6">
                     <div className="bg-white p-5 border border-stone-200 shadow-sm">
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans">{t('engagement.data_txns')}</span>
                        <div className="text-2xl font-serif text-stone-900 mt-1 tabular-nums">12,405</div>
                     </div>
                     <div className="bg-white p-5 border border-stone-200 shadow-sm">
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans">{t('engagement.data_amount')}</span>
                        <div className="text-2xl font-serif text-stone-900 mt-1 tabular-nums">€ 4.85M</div>
                     </div>
                     <div className="bg-white p-5 border border-stone-200 shadow-sm">
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans">{t('engagement.data_counterparties')}</span>
                        <div className="text-2xl font-serif text-stone-900 mt-1 tabular-nums">230</div>
                     </div>
                     <div className="bg-stone-900 p-5 border border-stone-900 shadow-sm text-white">
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans">Materiality (PM)</span>
                        <div className="text-2xl font-serif text-white mt-1 tabular-nums">1.8% <span className="text-sm text-stone-400 font-sans ml-1">≈ 87k€</span></div>
                     </div>
                  </div>

                  {/* Preview Table */}
                  <div>
                     <h4 className="text-xs font-serif text-stone-900 mb-4">{t('engagement.preview_table')}</h4>
                     <div className="border border-stone-200 rounded-sm overflow-hidden">
                        <table className="w-full text-left">
                           <thead className="bg-stone-50 text-[10px] text-stone-500 font-sans uppercase tracking-wider border-b border-stone-200">
                              <tr>
                                 <th className="px-4 py-3 font-medium">Date</th>
                                 <th className="px-4 py-3 font-medium">Journal ID</th>
                                 <th className="px-4 py-3 font-medium">Description</th>
                                 <th className="px-4 py-3 font-medium text-right">Debit</th>
                                 <th className="px-4 py-3 font-medium text-right">Credit</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-stone-100 bg-white">
                              {[1, 2, 3, 4, 5].map((row) => (
                                 <tr key={row} className="text-xs text-stone-600 hover:bg-stone-50">
                                    <td className="px-4 py-2.5 font-mono text-stone-400">2025-01-1{row}</td>
                                    <td className="px-4 py-2.5 font-mono">JRN-{2000+row}</td>
                                    <td className="px-4 py-2.5">Purchase Invoice - Vendor {row}0</td>
                                    <td className="px-4 py-2.5 text-right font-mono tabular-nums">1,250.00</td>
                                    <td className="px-4 py-2.5 text-right font-mono tabular-nums text-stone-300">-</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}

            {/* --- TAB 2: AUTO TESTS --- */}
            {activeTab === 'tests' && (
               <div className="animate-fade-in bg-white border border-stone-200 shadow-sm rounded-sm overflow-hidden max-w-5xl">
                   <table className="w-full text-left">
                      <thead className="bg-stone-50 text-[10px] text-stone-500 font-sans uppercase tracking-wider border-b border-stone-200">
                         <tr>
                            <th className="px-6 py-4 font-medium">Agent Name</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Last Execution</th>
                            <th className="px-6 py-4 font-medium text-right">Population</th>
                            <th className="px-6 py-4 font-medium text-right">Results</th>
                            <th className="px-6 py-4 font-medium text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                         {agents.map((agent) => (
                            <tr key={agent.id} className="hover:bg-stone-50/50 transition-colors group">
                               <td className="px-6 py-4">
                                  <div className="font-medium text-sm text-stone-900">{agent.agentName}</div>
                               </td>
                               <td className="px-6 py-4">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                     agent.status === AgentStatus.COMPLETED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                     agent.status === AgentStatus.NEEDS_REVIEW ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                     'bg-stone-100 text-stone-500 border-stone-200'
                                  }`}>
                                     {agent.status}
                                  </span>
                               </td>
                               <td className="px-6 py-4 text-xs text-stone-500 font-mono">{agent.lastRun}</td>
                               <td className="px-6 py-4 text-right text-xs text-stone-500 tabular-nums">{agent.coverage}%</td>
                               <td className="px-6 py-4 text-right">
                                  {agent.findingsCount > 0 ? (
                                     <span className="text-xs font-medium text-rose-600">{agent.findingsCount} Issues</span>
                                  ) : (
                                     <span className="text-xs text-stone-400 flex items-center justify-end gap-1"><CheckCircle className="w-3 h-3" /> Clean</span>
                                  )}
                               </td>
                               <td className="px-6 py-4 text-right">
                                  <button 
                                     onClick={(e) => { setSelectedAgentId(agent.id); handleRunAgent(e); }}
                                     className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-900 transition-colors"
                                     title="Run Agent"
                                  >
                                     {isRunning && selectedAgentId === agent.id ? <div className="w-3 h-3 border-2 border-stone-400 border-t-stone-900 rounded-full animate-spin"></div> : <Play className="w-3.5 h-3.5" />}
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
               </div>
            )}

            {/* --- TAB 3: FINDINGS (Master-Detail) --- */}
            {activeTab === 'findings' && (
               <div className="animate-fade-in h-full flex flex-col">
                  {selectedFinding ? (
                     <div className="flex flex-col h-full">
                        {/* Detail Header */}
                        <div className="flex items-center gap-4 mb-6">
                           <button 
                              onClick={() => setSelectedFindingId(null)}
                              className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-colors"
                           >
                              <ChevronRight className="w-5 h-5 rotate-180" />
                           </button>
                           <div>
                              <div className="flex items-center gap-3">
                                 <span className="font-mono text-xs text-stone-400">{selectedFinding.code}</span>
                                 <span className={`text-[10px] px-2 py-0.5 rounded-full border ${selectedFinding.status === 'Abierto' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-stone-100 text-stone-500'}`}>
                                    {selectedFinding.status}
                                 </span>
                              </div>
                              <h2 className="text-xl font-serif text-stone-900 mt-1">{selectedFinding.description}</h2>
                           </div>
                        </div>

                        <div className="grid grid-cols-3 gap-8 flex-1">
                           {/* Left: Details */}
                           <div className="col-span-2 space-y-6">
                              {/* Affected Data Table */}
                              <div className="bg-white border border-stone-200 p-6 rounded-sm">
                                 <h3 className="text-xs font-sans text-stone-500 uppercase tracking-wider mb-4">{t('engagement.affected_data')}</h3>
                                 <table className="w-full text-xs text-left">
                                    <thead className="bg-stone-50 text-stone-400 font-medium border-b border-stone-100">
                                       <tr>
                                          <th className="px-3 py-2">Date</th>
                                          <th className="px-3 py-2">Ref</th>
                                          <th className="px-3 py-2 text-right">Amount</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       <tr className="border-b border-stone-50">
                                          <td className="px-3 py-2 text-stone-500">02/01/2025</td>
                                          <td className="px-3 py-2 text-stone-900">FAC-2025-001 (Logística Norte)</td>
                                          <td className="px-3 py-2 text-right font-mono">12.500 €</td>
                                       </tr>
                                       <tr>
                                          <td className="px-3 py-2 text-stone-500">03/01/2025</td>
                                          <td className="px-3 py-2 text-stone-900">FAC-2025-004 (Servicios Centrales)</td>
                                          <td className="px-3 py-2 text-right font-mono">14.500 €</td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </div>

                              {/* Adjustment Proposal (T-Account Style) */}
                              <div className="bg-stone-50 border border-stone-200 p-6 rounded-sm">
                                 <h3 className="text-xs font-sans text-stone-500 uppercase tracking-wider mb-4">{t('engagement.prop_adjustment')}</h3>
                                 <div className="bg-white border border-stone-200 p-4 font-mono text-xs">
                                    <div className="flex justify-between mb-2 pb-2 border-b border-stone-100">
                                       <span className="text-stone-400">{t('engagement.prop_account')}</span>
                                       <div className="flex gap-8">
                                          <span className="text-stone-400 w-20 text-right">{t('engagement.prop_debit')}</span>
                                          <span className="text-stone-400 w-20 text-right">{t('engagement.prop_credit')}</span>
                                       </div>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                       <span>600. Compras</span>
                                       <div className="flex gap-8">
                                          <span className="w-20 text-right">27.000</span>
                                          <span className="w-20 text-right text-stone-300">-</span>
                                       </div>
                                    </div>
                                    <div className="flex justify-between">
                                       <span>400. Proveedores</span>
                                       <div className="flex gap-8">
                                          <span className="w-20 text-right text-stone-300">-</span>
                                          <span className="w-20 text-right">27.000</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="mt-4 flex gap-3">
                                    <button className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded-sm hover:bg-black transition-colors">{t('engagement.btn_accept_adj')}</button>
                                    <button className="px-4 py-2 bg-white border border-stone-200 text-stone-600 text-xs font-medium rounded-sm hover:border-stone-300 transition-colors">{t('engagement.btn_reject_adj')}</button>
                                 </div>
                              </div>
                           </div>

                           {/* Right: Actions */}
                           <div className="col-span-1 space-y-4">
                              <div className="bg-white border border-stone-200 p-6 rounded-sm">
                                 <h3 className="text-xs font-sans text-stone-500 uppercase tracking-wider mb-4">Actions</h3>
                                 <button className="w-full flex items-center justify-between px-4 py-3 border border-stone-200 rounded-sm text-xs font-medium text-stone-700 hover:border-stone-900 transition-all group mb-2">
                                    <span>{t('engagement.btn_req_client')}</span>
                                    <MessageSquare className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900" />
                                 </button>
                                 <button className="w-full flex items-center justify-between px-4 py-3 border border-stone-200 rounded-sm text-xs font-medium text-stone-700 hover:border-stone-900 transition-all group">
                                    <span>{t('engagement.btn_link_paper')}</span>
                                    <FileText className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  ) : (
                     /* List View */
                     <div className="bg-white border border-stone-200 shadow-sm rounded-sm overflow-hidden max-w-5xl">
                        <table className="w-full text-left">
                           <thead className="bg-stone-50 text-[10px] text-stone-500 font-sans uppercase tracking-wider border-b border-stone-200">
                              <tr>
                                 <th className="px-6 py-4 font-medium">{t('engagement.col_ref')}</th>
                                 <th className="px-6 py-4 font-medium">Description</th>
                                 <th className="px-6 py-4 font-medium text-right">{t('engagement.col_amount')}</th>
                                 <th className="px-6 py-4 font-medium text-center">Materiality</th>
                                 <th className="px-6 py-4 font-medium">Status</th>
                                 <th className="px-6 py-4 font-medium text-right">Source</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-stone-100">
                              {FINDINGS_ALFA.map(finding => (
                                 <tr key={finding.id} className="hover:bg-stone-50/50 transition-colors cursor-pointer group" onClick={() => setSelectedFindingId(finding.id)}>
                                    <td className="px-6 py-4 font-mono text-xs text-stone-500">{finding.code}</td>
                                    <td className="px-6 py-4">
                                       <p className="text-sm font-medium text-stone-900 truncate max-w-xs">{finding.description}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-xs text-stone-900">€{finding.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                       {finding.isMaterial ? (
                                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                                             <AlertOctagon className="w-2.5 h-2.5" /> Material
                                          </span>
                                       ) : (
                                          <span className="text-[10px] text-stone-400">-</span>
                                       )}
                                    </td>
                                    <td className="px-6 py-4">
                                       <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                          finding.status === 'Abierto' ? 'bg-stone-100 text-stone-600 border-stone-200' :
                                          finding.status === 'Pendiente Cliente' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                          'bg-emerald-50 text-emerald-700 border-emerald-100'
                                       }`}>
                                          {finding.status}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-[10px] text-stone-400">
                                       {finding.detectedBy}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
               </div>
            )}

            {/* --- TAB 4: PAPERS --- */}
            {activeTab === 'papers' && (
               <div className="animate-fade-in bg-white border border-stone-200 shadow-sm divide-y divide-stone-100 max-w-5xl">
                  {papers.map(paper => (
                     <div key={paper.id} className="p-5 flex items-center justify-between hover:bg-stone-50 transition-colors group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400">
                              <FileText className="w-5 h-5" />
                           </div>
                           <div>
                              <h4 className="text-sm font-medium text-stone-900">{paper.name}</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <span className="text-xs text-stone-400 font-mono">{paper.id}</span>
                                 <span className="text-[10px] text-stone-300">•</span>
                                 <span className="text-[10px] text-stone-400">Modified {paper.date}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wide font-medium ${
                              paper.status === 'final' ? 'bg-stone-900 text-white border-stone-900' :
                              paper.status === 'review' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              'bg-stone-100 text-stone-500 border-stone-200'
                           }`}>
                              {t(`engagement.paper_status_${paper.status}`)}
                           </span>
                           <button className="p-2 text-stone-300 hover:text-stone-900 hover:bg-stone-100 rounded transition-all">
                              <Download className="w-4 h-4" />
                           </button>
                           <button className="p-2 text-stone-300 hover:text-stone-900 hover:bg-stone-100 rounded transition-all">
                              <MoreHorizontal className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            )}

         </div>
    </div>
    );
  };

  return (
    <div className="flex h-full bg-white">
      {/* CENTER PANEL - Main Content */}
      {activeArea === 'summary' ? renderOverview() : renderAreaDetail()}

      {/* RIGHT PANEL - Timeline Only (Collapsible) */}
      {showTimeline && (
         <div className="w-[280px] bg-white flex flex-col border-l border-stone-200 h-full animate-fade-in">
            <div className="p-6 border-b border-stone-100 bg-white flex justify-between items-center">
                <h4 className="text-[11px] font-sans font-medium text-stone-400 uppercase tracking-wider">{t('engagement.timeline')}</h4>
                <button onClick={() => setShowTimeline(false)} className="text-stone-400 hover:text-stone-900">
                   <PanelRightClose className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-stone-50/10">
                <div className="relative border-l border-stone-200 ml-1.5 space-y-8 pl-5 py-2">
                   {timeline.map(event => (
                      <div key={event.id} className="relative group">
                         <div className={`absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white transition-transform group-hover:scale-110 ${
                            event.type === 'agent' ? 'bg-stone-900' :
                            event.type === 'override' ? 'bg-amber-500' : 'bg-stone-300'
                         }`}></div>
                         <div className="flex flex-col">
                            <span className="text-[10px] text-stone-400 mb-0.5 font-mono">{event.timestamp}</span>
                            <span className="text-xs font-bold text-stone-900 mb-1 leading-tight">{event.title}</span>
                            <p className="text-[11px] text-stone-500 leading-snug">{event.description}</p>
                            {event.user && <span className="text-[9px] text-stone-400 mt-2 font-medium uppercase tracking-wide">{event.user}</span>}
                         </div>
                      </div>
                   ))}
                </div>
            </div>
         </div>
      )}
    </div>
  );
};
