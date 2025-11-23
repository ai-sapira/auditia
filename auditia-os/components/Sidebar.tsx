
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Search,
  BarChart2,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Users,
  ArrowLeft,
  CheckSquare,
  Files,
  PieChart,
  FolderOpen,
  Plus,
  FileText,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';
import { CURRENT_USER, CLIENT_USER } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { ViewLevel } from '../types';

interface SidebarProps {
  mode: 'auditor' | 'client';
  viewLevel: ViewLevel;
  selectedClient: string | null;
  selectedEngagement: string | null;
  activeArea: string | null;
  onNavigate: (view: string) => void;
  onBackToClient: () => void;
  onSelectEngagement: (id: string) => void;
  onSelectArea: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  mode, 
  viewLevel, 
  selectedClient, 
  activeArea,
  onNavigate,
  onBackToClient,
  onSelectEngagement,
  onSelectArea
}) => {
  const { t } = useLanguage();
  const [isOthersOpen, setIsOthersOpen] = useState(false); // Default closed

  // --- 1. CLIENT PORTAL (External View) ---
  if (mode === 'client') {
    return (
      <div className="w-64 h-screen bg-white border-r border-stone-200 flex flex-col sticky top-0 animate-slide-in">
        {/* Header */}
        <div className="h-24 flex flex-col justify-center px-6 border-b border-stone-100">
          <span className="font-serif text-xl font-bold text-stone-900 tracking-tight">Grupo Alfa</span>
          <span className="text-[10px] text-stone-400 font-sans uppercase tracking-wider mt-1">Portal del Cliente</span>
        </div>

        {/* Menu */}
        <div className="flex-1 py-8 px-4 space-y-1">
           <NavItem 
             icon={CheckSquare} 
             label={t('sidebar.tasks')} 
             isActive={true} 
             onClick={() => onNavigate('client-tasks')} 
           />
           <NavItem 
             icon={Files} 
             label={t('sidebar.documents')} 
             isActive={false} 
           />
           <NavItem 
             icon={MessageSquare} 
             label={t('sidebar.messages')} 
             isActive={false} 
           />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-100">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[10px] font-serif text-stone-600">
                MG
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-medium text-stone-900">{CLIENT_USER.name}</span>
                 <span className="text-[10px] text-stone-400">{CLIENT_USER.role}</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- 2. FIRM LEVEL (Dashboard Global) ---
  if (viewLevel === 'firm') {
    return (
      <div className="w-64 h-screen bg-white border-r border-stone-200 flex flex-col sticky top-0 animate-slide-in">
        <div className="flex-1 py-12 px-4">
           <div className="px-4 mb-8">
              <span className="font-serif text-lg text-stone-900 block">Auditia Partners</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">Madrid HQ</span>
           </div>
           
           <SectionHeader label={t('sidebar.modules')} className="px-4" />
           <div className="space-y-1">
              <NavItem 
                icon={LayoutDashboard} 
                label={t('sidebar.firm_dashboard')} 
                isActive={true} 
                onClick={() => onNavigate('dashboard')} 
              />
              <NavItem 
                icon={Briefcase} 
                label={t('sidebar.portfolio_planning')} 
                isActive={false}
                onClick={() => onNavigate('portfolio')} 
              />
              <NavItem 
                icon={BarChart2} 
                label={t('sidebar.reporting_quality')} 
                isActive={false} 
              />
              <NavItem 
                icon={SettingsIcon} 
                label={t('sidebar.admin')} 
                isActive={false} 
              />
           </div>
        </div>
        <UserProfile compact={false} />
      </div>
    );
  }

  // --- 3. CLIENT LEVEL (Sidebar de Cliente) ---
  if (viewLevel === 'client') {
    return (
      <div className="w-72 h-screen bg-white border-r border-stone-200 flex flex-col sticky top-0 animate-slide-in z-40">
        {/* Client Header */}
        <div className="h-28 flex flex-col justify-center px-6 border-b border-stone-100 bg-white">
           <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">Cliente activo</span>
           </div>
           <span className="font-serif text-2xl font-bold text-stone-900 leading-none tracking-tight">{selectedClient}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-8">
           
           {/* 1. Overview */}
           <div 
              className="flex items-center gap-3 px-3 py-2.5 -mx-3 rounded-md text-[13px] font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 cursor-pointer transition-all group"
           >
              <PieChart className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors" /> 
              {t('sidebar.client_overview')}
           </div>

           {/* 2. Encargos */}
           <div>
              <SectionHeader label={t('sidebar.engagements_list')} />
              
              {/* Search Input */}
              <div className="relative mb-4 group">
                 <Search className="absolute left-0 top-2 w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder={t('sidebar.search')} 
                   className="w-full bg-transparent border-b border-stone-200 py-1.5 pl-6 pr-2 text-[12px] text-stone-600 focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-300 font-sans"
                 />
              </div>

              <div className="space-y-2">
                 {/* Active Engagement Card - High Fidelity */}
                 <div 
                    onClick={() => onSelectEngagement('eng-001')}
                    className="group relative pl-4 border-l-2 border-emerald-500 cursor-pointer py-2 transition-all hover:pl-5"
                 >
                    <div className="flex justify-between items-center">
                       <span className="text-[13px] font-serif font-semibold text-stone-900 group-hover:text-emerald-900 transition-colors">Auditoría 2025</span>
                       <ArrowRight className="w-3 h-3 text-emerald-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <span className="text-[10px] text-stone-400 group-hover:text-stone-500 mt-0.5 block">En curso · FY25</span>
                 </div>
                 
                 {/* Closed Engagement */}
                 <div 
                    onClick={() => onSelectEngagement('eng-002')}
                    className="group relative pl-4 border-l-2 border-transparent hover:border-stone-200 cursor-pointer py-2 transition-all hover:pl-5 opacity-70 hover:opacity-100"
                 >
                    <div className="flex justify-between items-center">
                        <span className="text-[13px] font-serif font-medium text-stone-500 group-hover:text-stone-800 transition-colors">Auditoría 2024</span>
                    </div>
                    <span className="text-[10px] text-stone-300 group-hover:text-stone-400 mt-0.5 block">Cerrado</span>
                 </div>

                 {/* Create New */}
                 <button className="flex items-center gap-2 text-[11px] font-medium text-stone-400 hover:text-stone-900 mt-4 pt-3 transition-colors group w-full">
                    <div className="w-5 h-5 rounded border border-stone-200 border-dashed flex items-center justify-center group-hover:border-solid group-hover:border-stone-400 transition-all">
                        <Plus className="w-3 h-3" /> 
                    </div>
                    {t('top_nav.btn_create')}
                 </button>
              </div>
           </div>

           {/* 3. Comentarios */}
           <div className="flex items-center gap-3 px-3 py-2.5 -mx-3 rounded-md text-[13px] font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 cursor-pointer transition-all group">
              <MessageSquare className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
              {t('sidebar.client_comments')}
           </div>

           {/* 4. Client Intelligence (Others) */}
           <div className="pt-6 border-t border-stone-50">
              <div 
                onClick={() => setIsOthersOpen(!isOthersOpen)}
                className="flex items-center justify-between cursor-pointer group select-none mb-4"
              >
                 <SectionHeader label={t('sidebar.others')} className="mb-0" />
                 <ChevronDown 
                    className={`w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500 transition-transform duration-300 ${isOthersOpen ? 'rotate-180' : ''}`} 
                 />
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOthersOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                 <div className="space-y-1">
                    <IntelligenceItem icon={Users} label={t('sidebar.client_team')} />
                    <IntelligenceItem icon={FolderOpen} label={t('sidebar.client_docs')} />
                    <IntelligenceItem icon={Database} label="ERP & Sistemas" />
                    <IntelligenceItem icon={FileText} label="Ficha Fiscal" />
                 </div>
              </div>
           </div>
        </div>
        <UserProfile compact={false} />
      </div>
    );
  }

  // --- 4. ENGAGEMENT LEVEL (Double Sidebar) ---
  if (viewLevel === 'engagement') {
    return (
      <div className="flex h-screen sticky top-0 animate-slide-in shadow-2xl z-30">
         
         {/* 4A. The Strip (Context - Collapsed Client Sidebar) */}
         {/* Changed to Soft Grey (bg-stone-100) per user request */}
         <div className="w-[72px] bg-stone-100 border-r border-stone-200 flex flex-col items-center py-6 z-20 shadow-lg transition-all duration-300 group/strip">
            
            {/* Back Button - Interactive */}
            <div className="mb-10 relative w-full flex justify-center">
               <button 
                  onClick={onBackToClient}
                  className="w-10 h-10 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:border-stone-900 hover:scale-105 transition-all duration-300 shadow-sm z-20"
                  title={t('sidebar.back_to_client')}
               >
                  <ArrowLeft className="w-4 h-4" />
               </button>
            </div>

            {/* Divider */}
            <div className="w-8 h-px bg-stone-200 mb-10"></div>

            {/* Vertical Text (Client Context) */}
            <div className="flex-1 flex items-center justify-center w-full py-8">
                <div className="writing-vertical-rl text-[11px] font-serif font-medium text-stone-400 tracking-[0.15em] uppercase transform rotate-180 select-none group-hover/strip:text-stone-600 transition-colors cursor-default">
                   {selectedClient || 'Cliente'}
                </div>
            </div>

            {/* Context Icons */}
            <div className="space-y-3 mb-10 flex flex-col items-center">
               <StripIcon icon={Users} tooltip="Equipo" />
               <StripIcon icon={FolderOpen} tooltip="Docs" />
               <StripIcon icon={MessageSquare} tooltip="Chat" />
            </div>
            
            {/* User Avatar */}
            <div className="w-9 h-9 bg-white text-stone-500 rounded-full flex items-center justify-center text-[10px] font-bold font-serif border border-stone-300 shadow-sm">
               AR
            </div>
         </div>

         {/* 4B. The Sub-Sidebar (Engagement Work Area) */}
         <div className="w-72 bg-white border-r border-stone-200 flex flex-col animate-width relative z-10">
            {/* Engagement Header */}
            <div className="px-8 pt-10 pb-8 border-b border-stone-50 bg-white">
               <h2 className="font-serif text-xl font-bold text-stone-900 leading-tight mb-2">Auditoría 2025</h2>
               <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold rounded uppercase tracking-wider">En curso</span>
                  <span className="text-[10px] text-stone-400 font-sans">FY25 · Manufacturing</span>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
               
               {/* Summary Link */}
               <div>
                  <div 
                     onClick={() => onSelectArea('summary')}
                     className={`group flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all border border-transparent ${
                        activeArea === 'summary' 
                        ? 'bg-stone-900 text-white shadow-md' 
                        : 'text-stone-600 hover:bg-stone-50 hover:border-stone-100'
                     }`}
                  >
                     <PieChart className={`w-4 h-4 ${activeArea === 'summary' ? 'text-stone-300' : 'text-stone-400 group-hover:text-stone-900'}`} />
                     <span className="text-[13px] font-medium">{t('sidebar.engagement_summary')}</span>
                  </div>
               </div>

               {/* Accounts Tree - High Structure */}
               <div>
                  <SectionHeader label={t('sidebar.audit_accounts')} />
                  <div className="space-y-0 relative pl-2">
                     {/* Vertical Tree Line */}
                     <div className="absolute left-[15px] top-2 bottom-6 w-px bg-stone-200"></div>

                     <TreeItem 
                        code="30" 
                        label="Existencias" 
                        status="not_started" 
                     />
                     <TreeItem 
                        code="40" 
                        label="Proveedores (v1.0)" 
                        status="in_progress" 
                        isActive={activeArea === '40'}
                        onClick={() => onSelectArea('40')}
                     />
                     <TreeItem 
                        code="43" 
                        label="Clientes" 
                        status="not_started" 
                     />
                     <TreeItem 
                        code="57" 
                        label="Bancos" 
                        status="review" 
                     />
                  </div>
               </div>

               {/* Tools */}
               <div>
                  <SectionHeader label={t('sidebar.others')} />
                  <div className="space-y-1">
                     <SubNavItem icon={CheckSquare} label={t('sidebar.requests')} />
                     <SubNavItem icon={MessageSquare} label={t('sidebar.messages')} />
                  </div>
               </div>

            </div>
         </div>
      </div>
    );
  }

  return null;
};

// --- HELPER COMPONENTS ---

const SectionHeader = ({ label, className = "" }: { label: string, className?: string }) => (
  <h3 className={`text-[10px] font-sans text-stone-400 font-semibold uppercase tracking-widest mb-3 ${className}`}>
    {label}
  </h3>
);

const NavItem = ({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-md cursor-pointer transition-all group ${
      isActive 
      ? 'bg-stone-900 text-white shadow-sm' 
      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
    }`}
  >
    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-stone-300' : 'text-stone-400 group-hover:text-stone-900'}`} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const IntelligenceItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
   <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-stone-50 cursor-pointer group transition-all">
      <div className="w-6 h-6 rounded bg-white border border-stone-200 flex items-center justify-center group-hover:border-stone-300 group-hover:scale-105 transition-all shadow-sm">
         <Icon className="w-3 h-3 text-stone-400 group-hover:text-stone-600" />
      </div>
      <span className="text-xs font-medium text-stone-500 group-hover:text-stone-900 transition-colors">{label}</span>
   </div>
);

const SubNavItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
   <div className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all group hover:bg-stone-50 hover:pl-4">
      <Icon className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 transition-colors" /> 
      <span className="text-[13px] text-stone-500 group-hover:text-stone-900 font-medium transition-colors">{label}</span>
   </div>
);

const StripIcon = ({ icon: Icon, tooltip }: { icon: any, tooltip: string }) => (
   <div className="p-2.5 rounded-lg cursor-pointer transition-all text-stone-400 hover:text-stone-900 hover:bg-white hover:shadow-sm border border-transparent hover:border-stone-200 group relative">
      <Icon className="w-5 h-5" />
      {/* Tooltip */}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-stone-900 text-white text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-[-5px] group-hover:translate-x-0 z-50">
         {tooltip}
         {/* Arrow */}
         <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-stone-900 transform rotate-45"></div>
      </div>
   </div>
);

const UserProfile = ({ compact }: { compact: boolean }) => (
  <div className="p-6 border-t border-stone-100 mt-auto bg-white">
    <div className="flex items-center gap-3 cursor-pointer group">
      <div className="w-8 h-8 bg-stone-50 text-stone-600 flex items-center justify-center text-[10px] font-bold font-serif rounded-full border border-stone-200 group-hover:border-stone-400 group-hover:bg-white transition-colors">
        AR
      </div>
      {!compact && (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-stone-900 leading-none mb-1 group-hover:underline transition-all">{CURRENT_USER.name}</span>
          <span className="text-[10px] text-stone-400 leading-none">{CURRENT_USER.role}</span>
        </div>
      )}
    </div>
  </div>
);

const TreeItem = ({ code, label, status, isActive, onClick }: { code: string, label: string, status: string, isActive?: boolean, onClick?: () => void }) => {
   const dotColor = 
      status === 'in_progress' ? 'bg-amber-400' : 
      status === 'review' ? 'bg-blue-400' : 
      'bg-stone-200';

   return (
      <div 
         onClick={onClick}
         className={`relative flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all z-10 group ${
            isActive 
            ? 'bg-stone-900 text-white shadow-sm' 
            : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
         }`}
      >
         {/* Connector Dot */}
         <div className={`absolute left-[11px] w-2 h-2 rounded-full border-2 z-20 transition-transform duration-300 ${
            isActive ? 'bg-white border-stone-900 scale-125' : `${dotColor} border-white`
         }`}></div>
         
         <div className="ml-5 flex flex-col">
            <span className={`text-[13px] leading-tight transition-colors ${isActive ? 'font-medium text-white' : ''}`}>{label}</span>
            <span className={`text-[9px] font-mono mt-0.5 leading-none tracking-tight ${isActive ? 'text-stone-400' : 'text-stone-300'}`}>{code}</span>
         </div>
      </div>
   );
};
