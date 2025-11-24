
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
        <div className="h-32 flex flex-col justify-center px-6 border-b border-stone-100 bg-white">
           <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Cliente activo</span>
           </div>
           <span className="font-serif text-xl font-bold text-stone-900 leading-tight tracking-tight">{selectedClient}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-8">
           
           {/* 1. Overview (Always Active in this view) */}
           <div className="py-1 mb-6">
             <div className="flex items-center gap-2 px-0 group cursor-pointer">
                <h3 className="text-[13px] font-sans text-stone-900 pl-1 font-medium">Overview del cliente</h3>
                <div className="w-4 h-4 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-stone-900 rounded-full"></div>
                </div>
             </div>
           </div>

           {/* 2. Encargos */}
           <div className="mb-6">
              <div className="flex items-center gap-2 px-0 mb-3">
                 <h3 className="text-[13px] font-sans text-stone-500 pl-1">Encargos</h3>
              </div>
              
              {/* Search Input */}
              <div className="relative mb-3 group">
                 <Search className="absolute left-0 top-2.5 w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Buscar encargo..." 
                   className="w-full bg-transparent border-b border-stone-200 py-2 pl-6 pr-2 text-[13px] text-stone-600 focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-300 font-sans"
                 />
              </div>

              <div className="space-y-1 pl-1">
                 {/* Active Engagement Card - High Fidelity */}
                 <div 
                    onClick={() => onSelectEngagement('eng-001')}
                    className="group relative pl-4 border-l-[1.5px] border-emerald-500 cursor-pointer py-2.5 transition-all hover:pl-5"
                 >
                    <div className="flex justify-between items-center mb-0.5">
                       <span className="text-[14px] font-serif font-medium text-stone-900 group-hover:text-emerald-900 transition-colors">Auditoría 2025</span>
                       <ArrowRight className="w-3.5 h-3.5 text-emerald-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <span className="text-[11px] text-stone-500 group-hover:text-stone-600 block">En curso</span>
                 </div>
                 
                 {/* Closed Engagement */}
                 <div 
                    onClick={() => onSelectEngagement('eng-002')}
                    className="group relative pl-4 border-l-[1.5px] border-stone-100 hover:border-stone-300 cursor-pointer py-2.5 transition-all hover:pl-5 opacity-80 hover:opacity-100"
                 >
                    <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[14px] font-serif text-stone-500 group-hover:text-stone-800 transition-colors">Auditoría 2024</span>
                    </div>
                    <span className="text-[11px] text-stone-400 group-hover:text-stone-500 block">Cerrado</span>
                 </div>

                 {/* Create New */}
                 <button className="flex items-center gap-2 text-[12px] font-medium text-stone-400 hover:text-stone-900 mt-5 transition-colors group w-full pl-1">
                    <div className="w-4 h-4 rounded border border-stone-300 flex items-center justify-center group-hover:border-stone-900 transition-all bg-white">
                        <Plus className="w-2.5 h-2.5 text-stone-500 group-hover:text-stone-900" /> 
                    </div>
                    Crear encargo
                 </button>
              </div>
           </div>

           {/* 3. Comentarios */}
           <div className="py-1">
             <div className="flex items-center gap-2 px-0 group cursor-pointer">
                <h3 className="text-[13px] font-sans text-stone-500 pl-1 cursor-pointer group-hover:text-stone-900 transition-colors">Comentarios con cliente</h3>
                <div className="w-4 h-4 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-stone-300 rounded-full group-hover:bg-stone-900 transition-colors"></div>
                </div>
             </div>
           </div>

           {/* 4. Otros */}
           <div className="py-1">
              <div 
                onClick={() => setIsOthersOpen(!isOthersOpen)}
                className="flex items-center justify-between cursor-pointer group select-none mb-2"
              >
                 <h3 className="text-[13px] font-sans text-stone-500 pl-1 group-hover:text-stone-900 transition-colors">Otros</h3>
                 <ChevronDown 
                    className={`w-3.5 h-3.5 text-stone-300 group-hover:text-stone-900 transition-transform duration-300 ${isOthersOpen ? 'rotate-180' : ''}`} 
                 />
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOthersOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                 <div className="space-y-1 pl-1 pt-2">
                    <IntelligenceItem icon={Users} label="Equipo del cliente" />
                    <IntelligenceItem icon={FolderOpen} label="Documentos" />
                    <IntelligenceItem icon={FileText} label="Facturas" />
                    <IntelligenceItem icon={Database} label="Información del cliente" />
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
      <div className="flex h-screen sticky top-0 shadow-2xl z-30 bg-white animate-sidebar-enter">
         
         {/* 4A. The Strip (Context - Collapsed Client Sidebar) */}
         <div className="w-[72px] bg-stone-50 border-r border-stone-200 flex flex-col items-center py-6 z-20 shadow-xl transition-all duration-300 group/strip animate-strip-enter">
            
            {/* Back Button - Interactive */}
            <div className="mb-8 relative w-full flex justify-center">
               <button 
                  onClick={onBackToClient}
                  className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-stone-300 hover:shadow-md transition-all duration-300"
                  title={t('sidebar.back_to_client')}
               >
                  <ArrowLeft className="w-4 h-4" />
               </button>
            </div>

            {/* Divider */}
            <div className="w-8 h-px bg-stone-200 mb-8"></div>

            {/* Vertical Text (Client Context) */}
            <div className="flex-1 flex items-center justify-center w-full py-4 overflow-hidden">
                <div className="transform -rotate-90 whitespace-nowrap text-base font-serif font-medium text-stone-300 tracking-tight select-none group-hover/strip:text-stone-500 transition-colors cursor-default">
                   {selectedClient || 'Cliente'}
                </div>
            </div>

            {/* Context Icons */}
            <div className="space-y-4 mb-8 flex flex-col items-center">
               <StripIcon icon={PieChart} tooltip="Overview" />
               <StripIcon icon={MessageSquare} tooltip="Comentarios" />
               
               {/* Divider for 'Otros' */}
               <div className="w-3 h-px bg-stone-200 my-1"></div>
               
               <StripIcon icon={Users} tooltip="Equipo" />
               <StripIcon icon={FolderOpen} tooltip="Documentos" />
               <StripIcon icon={FileText} tooltip="Facturas" />
               <StripIcon icon={Database} tooltip="Info" />
            </div>
            
            {/* User Avatar */}
            <div className="w-8 h-8 bg-white text-stone-500 rounded-full flex items-center justify-center text-[10px] font-bold font-serif border border-stone-200 shadow-sm cursor-pointer hover:border-stone-400 transition-colors">
               AR
            </div>
         </div>

         {/* 4B. The Sub-Sidebar (Engagement Work Area) */}
         <div className="w-72 bg-white border-r border-stone-200 flex flex-col relative z-10 animate-panel-enter">
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
               <div className="py-1 mb-6">
                 <div 
                    onClick={() => onSelectArea('summary')}
                    className="flex items-center gap-2 px-0 group cursor-pointer"
                 >
                    <h3 className={`text-[13px] font-sans pl-1 font-medium ${activeArea === 'summary' ? 'text-stone-900' : 'text-stone-500 group-hover:text-stone-900'} transition-colors`}>Resumen del encargo</h3>
                    <div className="w-4 h-4 flex items-center justify-center">
                       <div className={`w-1.5 h-1.5 rounded-full ${activeArea === 'summary' ? 'bg-stone-900' : 'bg-stone-300 group-hover:bg-stone-900'} transition-colors`}></div>
                    </div>
                 </div>
               </div>

               {/* Accounts Tree - High Structure */}
               <div className="mb-6">
                  <div className="flex items-center gap-2 px-0 mb-3">
                     <h3 className="text-[13px] font-sans text-stone-500 pl-1">Cuentas a auditar</h3>
                  </div>

                  <div className="space-y-1 pl-1">
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

               {/* Solicitudes al cliente */}
               <div className="py-1 mb-1">
                 <div 
                    onClick={() => onSelectArea('client-requests')}
                    className="flex items-center gap-2 px-0 group cursor-pointer"
                 >
                    <h3 className={`text-[13px] font-sans pl-1 font-medium ${activeArea === 'client-requests' ? 'text-stone-900' : 'text-stone-500 group-hover:text-stone-900'} transition-colors`}>{t('sidebar.requests') || 'Solicitudes al cliente'}</h3>
                    <div className="w-4 h-4 flex items-center justify-center">
                       <div className={`w-1.5 h-1.5 rounded-full ${activeArea === 'client-requests' ? 'bg-stone-900' : 'bg-transparent group-hover:bg-stone-300'} transition-colors`}></div>
                    </div>
                 </div>
               </div>

               {/* Mensajes */}
               <div className="py-1 mb-6">
                 <div 
                    onClick={() => onSelectArea('messages')}
                    className="flex items-center gap-2 px-0 group cursor-pointer"
                 >
                    <h3 className={`text-[13px] font-sans pl-1 font-medium ${activeArea === 'messages' ? 'text-stone-900' : 'text-stone-500 group-hover:text-stone-900'} transition-colors`}>{t('sidebar.messages') || 'Mensajes'}</h3>
                    <div className="w-4 h-4 flex items-center justify-center">
                       <div className={`w-1.5 h-1.5 rounded-full ${activeArea === 'messages' ? 'bg-stone-900' : 'bg-transparent group-hover:bg-stone-300'} transition-colors`}></div>
                    </div>
                 </div>
               </div>

               {/* Tools / Otros */}
               <div className="py-1">
                  <div 
                    onClick={() => setIsOthersOpen(!isOthersOpen)}
                    className="flex items-center justify-between cursor-pointer group select-none mb-2"
                  >
                     <h3 className="text-[13px] font-sans text-stone-500 pl-1 group-hover:text-stone-900 transition-colors">Otros</h3>
                     <ChevronDown 
                        className={`w-3.5 h-3.5 text-stone-300 group-hover:text-stone-900 transition-transform duration-300 ${isOthersOpen ? 'rotate-180' : ''}`} 
                     />
                  </div>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOthersOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                     <div className="space-y-1 pl-1 pt-2">
                        <IntelligenceItem icon={Files} label="Documentos del encargo" />
                        <IntelligenceItem icon={Users} label="Equipo auditor" />
                     </div>
                  </div>
               </div>

            </div>

             {/* Footer - Mi perfil y ajustes */}
             <div className="px-6 py-6 border-t border-stone-50">
                <div className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-8 h-8 bg-stone-50 text-stone-600 flex items-center justify-center text-[10px] font-bold font-serif rounded-full border border-stone-200 group-hover:border-stone-400 group-hover:bg-white transition-colors">
                    AR
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-stone-900 leading-none mb-1 group-hover:underline transition-all">{CURRENT_USER.name}</span>
                    <span className="text-[10px] text-stone-400 leading-none">Mi perfil y ajustes</span>
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
  <h3 className={`text-[13px] font-sans text-stone-500 mb-3 pl-1 ${className}`}>
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
   <div className="group relative pl-4 border-l-[1.5px] border-transparent hover:border-stone-300 cursor-pointer py-2 transition-all hover:pl-5">
      <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-stone-500 group-hover:text-stone-900 transition-colors">{label}</span>
      </div>
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
   return (
      <div 
         onClick={onClick}
         className={`group relative pl-4 border-l-[1.5px] ${isActive ? 'border-stone-900' : 'border-transparent hover:border-stone-300'} cursor-pointer py-2 transition-all hover:pl-5`}
      >
         <div className="flex flex-col">
            <div className="flex justify-between items-center mb-0.5">
               <span className={`text-[13px] font-medium transition-colors ${isActive ? 'text-stone-900 font-serif' : 'text-stone-500 group-hover:text-stone-900'}`}>{label}</span>
               {status === 'in_progress' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
               )}
               {status === 'review' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
               )}
            </div>
            <span className={`text-[10px] font-mono ${isActive ? 'text-stone-500' : 'text-stone-300 group-hover:text-stone-400'}`}>{code}</span>
         </div>
      </div>
   );
};
