
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
  Database,
  AlertTriangle,
  Zap,
  FileCheck,
  ClipboardList
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
  const [isAccountsExpanded, setIsAccountsExpanded] = useState(false); // Accounts collapsible

  // --- 1. CLIENT PORTAL (External View) ---
  if (mode === 'client') {
    return (
      <div className="w-64 h-screen bg-white border-r border-neutral-200 flex flex-col sticky top-0 animate-slide-in">
        {/* Header */}
        <div className="h-24 flex flex-col justify-center px-6 border-b border-neutral-100">
          <span className="font-serif text-xl font-bold text-neutral-900 tracking-tight">Grupo Alfa</span>
          <span className="text-[10px] text-neutral-400 font-sans uppercase tracking-wider mt-1">Portal del Cliente</span>
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
        <div className="p-6 border-t border-neutral-100">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[10px] font-serif text-neutral-600">
                MG
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-medium text-neutral-900">{CLIENT_USER.name}</span>
                 <span className="text-[10px] text-neutral-400">{CLIENT_USER.role}</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- 2. FIRM LEVEL (Dashboard Global) ---
  if (viewLevel === 'firm') {
    return (
      <div className="w-72 h-screen bg-white border-r border-neutral-200 flex flex-col sticky top-0 animate-slide-in">
        {/* Firm Header */}
        <div className="h-32 flex flex-col justify-center px-6 border-b border-neutral-100 bg-white">
           <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-neutral-900 rounded flex items-center justify-center">
                 <span className="text-white font-serif text-sm font-bold">A</span>
              </div>
              <div>
                 <span className="font-serif text-lg text-neutral-900 block leading-tight">Auditia Partners</span>
                 <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Madrid HQ</span>
              </div>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-8">
           
           {/* Main Navigation */}
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
           </div>

           {/* Quick Stats */}
           <div className="py-4 border-t border-neutral-100">
              <h3 className="text-[10px] font-sans text-neutral-400 uppercase tracking-widest mb-4 px-1">Resumen rápido</h3>
              <div className="space-y-3 px-1">
                 <div className="flex justify-between items-center">
                    <span className="text-[12px] text-neutral-500">Clientes activos</span>
                    <span className="text-[13px] font-serif text-neutral-900 tabular-nums">142</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[12px] text-neutral-500">Encargos en curso</span>
                    <span className="text-[13px] font-serif text-neutral-900 tabular-nums">24</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[12px] text-neutral-500">Equipo</span>
                    <span className="text-[13px] font-serif text-neutral-900 tabular-nums">48</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[12px] text-neutral-500">Entregas en plazo</span>
                    <span className="text-[13px] font-serif text-[#4A5D4A] tabular-nums">92%</span>
                 </div>
              </div>
           </div>

           {/* Other Sections */}
           <div className="py-4 border-t border-neutral-100">
              <h3 className="text-[10px] font-sans text-neutral-400 uppercase tracking-widest mb-4 px-1">{t('sidebar.others')}</h3>
              <div className="space-y-1">
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
        </div>
        
        <UserProfile compact={false} />
      </div>
    );
  }

  // --- 3. CLIENT LEVEL (Sidebar de Cliente) ---
  if (viewLevel === 'client') {
    return (
      <div className="w-72 h-screen bg-white border-r border-neutral-200 flex flex-col sticky top-0 animate-slide-in z-40">
        {/* Client Header */}
        <div className="h-32 flex flex-col justify-center px-6 border-b border-neutral-100 bg-white">
           <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F7F9F7]0 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
              <span className="text-[10px] font-medium text-[#4A5D4A] bg-[#F7F9F7] px-2 py-0.5 rounded-full border border-[#E0E5E0]100">Cliente activo</span>
           </div>
           <span className="font-serif text-xl font-bold text-neutral-900 leading-tight tracking-tight">{selectedClient}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-8">
           
           {/* 1. Overview (Always Active in this view) */}
           <div className="py-1 mb-6">
             <div className="flex items-center gap-2 px-0 group cursor-pointer">
                <h3 className="text-[13px] font-sans text-neutral-900 pl-1 font-medium">Overview del cliente</h3>
                <div className="w-4 h-4 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full"></div>
                </div>
             </div>
           </div>

           {/* 2. Encargos */}
           <div className="mb-6">
              <div className="flex items-center gap-2 px-0 mb-3">
                 <h3 className="text-[13px] font-sans text-neutral-500 pl-1">Encargos</h3>
              </div>
              
              {/* Search Input */}
              <div className="relative mb-3 group">
                 <Search className="absolute left-0 top-2.5 w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Buscar encargo..." 
                   className="w-full bg-transparent border-b border-neutral-200 py-2 pl-6 pr-2 text-[13px] text-neutral-600 focus:outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300 font-sans"
                 />
              </div>

              <div className="space-y-1 pl-1">
                 {/* Active Engagement Card - High Fidelity */}
                 <div 
                    onClick={() => onSelectEngagement('eng-001')}
                    className="group relative pl-4 border-l-[1.5px] border-[#E0E5E0]500 cursor-pointer py-2.5 transition-all hover:pl-5"
                 >
                    <div className="flex justify-between items-center mb-0.5">
                       <span className="text-[14px] font-serif font-medium text-neutral-900 group-hover:text-neutral-900 transition-colors">Auditoría 2025</span>
                       <ArrowRight className="w-3.5 h-3.5 text-[#4A5D4A] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <span className="text-[11px] text-neutral-500 group-hover:text-neutral-600 block">En curso</span>
                 </div>
                 
                 {/* Closed Engagement */}
                 <div 
                    onClick={() => onSelectEngagement('eng-002')}
                    className="group relative pl-4 border-l-[1.5px] border-neutral-100 hover:border-neutral-300 cursor-pointer py-2.5 transition-all hover:pl-5 opacity-80 hover:opacity-100"
                 >
                    <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[14px] font-serif text-neutral-500 group-hover:text-neutral-800 transition-colors">Auditoría 2024</span>
                    </div>
                    <span className="text-[11px] text-neutral-400 group-hover:text-neutral-500 block">Cerrado</span>
                 </div>

                 {/* Create New */}
                 <button className="flex items-center gap-2 text-[12px] font-medium text-neutral-400 hover:text-neutral-900 mt-5 transition-colors group w-full pl-1">
                    <div className="w-4 h-4 rounded border border-neutral-300 flex items-center justify-center group-hover:border-neutral-900 transition-all bg-white">
                        <Plus className="w-2.5 h-2.5 text-neutral-500 group-hover:text-neutral-900" /> 
                    </div>
                    Crear encargo
                 </button>
              </div>
           </div>

           {/* 3. Tareas pendientes */}
           <div className="mb-6">
              <div className="flex items-center gap-2 px-0 mb-3">
                 <h3 className="text-[13px] font-sans text-neutral-500 pl-1">Tareas pendientes</h3>
                 <span className="text-[9px] px-1.5 py-0.5 bg-neutral-800 text-white rounded-full font-medium">5</span>
              </div>
              
              <div className="space-y-1.5 pl-1">
                 {/* Task items */}
                 <TaskSidebarItem 
                    icon={AlertTriangle}
                    title="Revisar respuesta cliente H-023"
                    engagement="Auditoría 2025"
                    priority="high"
                    dueDate="22/03"
                 />
                 <TaskSidebarItem 
                    icon={Zap}
                    title="Ejecutar test circularizaciones"
                    engagement="Auditoría 2025"
                    priority="high"
                    dueDate="23/03"
                 />
                 <TaskSidebarItem 
                    icon={MessageSquare}
                    title="Revisar documentación REQ-002"
                    engagement="Auditoría 2025"
                    priority="medium"
                    dueDate="24/03"
                 />
                 
                 {/* Ver todas las tareas */}
                 <button className="w-full mt-2 py-1.5 text-[11px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors flex items-center justify-center gap-1 hover:bg-neutral-50 rounded">
                    Ver todas las tareas <ArrowRight className="w-3 h-3" />
                 </button>
              </div>
           </div>

           {/* 4. Otros */}
           <div className="py-1">
              <div 
                onClick={() => setIsOthersOpen(!isOthersOpen)}
                className="flex items-center justify-between cursor-pointer group select-none mb-2"
              >
                 <h3 className="text-[13px] font-sans text-neutral-500 pl-1 group-hover:text-neutral-900 transition-colors">Otros</h3>
                 <ChevronDown 
                    className={`w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-900 transition-transform duration-300 ${isOthersOpen ? 'rotate-180' : ''}`} 
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
         <div className="w-[72px] bg-neutral-50 border-r border-neutral-200 flex flex-col items-center py-6 z-20 shadow-xl transition-all duration-300 group/strip animate-strip-enter">
            
            {/* Back Button - Interactive */}
            <div className="mb-8 relative w-full flex justify-center">
               <button 
                  onClick={onBackToClient}
                  className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:border-neutral-300 hover:shadow-md transition-all duration-300"
                  title={t('sidebar.back_to_client')}
               >
                  <ArrowLeft className="w-4 h-4" />
               </button>
            </div>

            {/* Divider */}
            <div className="w-8 h-px bg-neutral-200 mb-8"></div>

            {/* Vertical Text (Client Context) */}
            <div className="flex-1 flex items-center justify-center w-full py-4 overflow-hidden">
                <div className="transform -rotate-90 whitespace-nowrap text-base font-serif font-medium text-neutral-300 tracking-tight select-none group-hover/strip:text-neutral-500 transition-colors cursor-default">
                   {selectedClient || 'Cliente'}
                </div>
            </div>

            {/* Context Icons */}
            <div className="space-y-4 mb-8 flex flex-col items-center">
               <StripIcon icon={PieChart} tooltip="Overview" />
               <StripIcon icon={CheckSquare} tooltip="Tareas" />
               
               {/* Divider for 'Otros' */}
               <div className="w-3 h-px bg-neutral-200 my-1"></div>
               
               <StripIcon icon={Users} tooltip="Equipo" />
               <StripIcon icon={FolderOpen} tooltip="Documentos" />
               <StripIcon icon={FileText} tooltip="Facturas" />
               <StripIcon icon={Database} tooltip="Info" />
            </div>
            
            {/* User Avatar */}
            <div className="w-8 h-8 bg-white text-neutral-500 rounded-full flex items-center justify-center text-[10px] font-bold font-serif border border-neutral-200 shadow-sm cursor-pointer hover:border-neutral-400 transition-colors">
               AR
            </div>
         </div>

         {/* 4B. The Sub-Sidebar (Engagement Work Area) */}
         <div className="w-72 bg-white border-r border-neutral-200 flex flex-col relative z-10 animate-panel-enter">
            {/* Engagement Header */}
            <div className="px-8 pt-10 pb-8 border-b border-neutral-50 bg-white">
               <h2 className="font-serif text-xl font-bold text-neutral-900 leading-tight mb-2">Auditoría 2025</h2>
               <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#F7F9F7] text-[#4A5D4A] border border-[#E0E5E0]100 text-[9px] font-bold rounded uppercase tracking-wider">En curso</span>
                  <span className="text-[10px] text-neutral-400 font-sans">FY25 · Manufacturing</span>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
               
               {/* Summary Link */}
               <div className="py-1 mb-6">
                 <div 
                    onClick={() => onSelectArea('summary')}
                    className="flex items-center gap-2 px-0 group cursor-pointer"
                 >
                    <h3 className={`text-[13px] font-sans pl-1 font-medium ${activeArea === 'summary' ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-900'} transition-colors`}>Resumen del encargo</h3>
                    <div className="w-4 h-4 flex items-center justify-center">
                       <div className={`w-1.5 h-1.5 rounded-full ${activeArea === 'summary' ? 'bg-neutral-900' : 'bg-neutral-300 group-hover:bg-neutral-900'} transition-colors`}></div>
                    </div>
                 </div>
               </div>

               {/* Accounts Tree - Expandable */}
               <div className="mb-6">
                  <div className="flex items-center gap-2 px-0 mb-3">
                     <h3 className="text-[13px] font-sans text-neutral-500 pl-1">Cuentas a auditar</h3>
                  </div>

                  {/* Main accounts (always visible) */}
                  <div className="space-y-1 pl-1">
                     {/* Proveedores destacado al inicio */}
                     <TreeItem 
                        code="40" 
                        label="Proveedores (v1.0)" 
                        status="in_progress" 
                        isActive={activeArea === '40'}
                        onClick={() => onSelectArea('40')}
                     />
                     
                     {/* ACTIVO */}
                     <div className="text-[9px] uppercase tracking-wider text-neutral-400 pl-1 pt-3 pb-1 font-medium">Activo no corriente</div>
                     <TreeItem code="20" label="Inmovilizado intangible" status="completed" />
                     <TreeItem code="21" label="Inmovilizado material" status="in_progress" />
                     <TreeItem code="22" label="Inversiones inmobiliarias" status="completed" />
                     <TreeItem code="23" label="Inmovilizado en curso" status="not_started" />
                     <TreeItem code="24" label="Inversiones financieras L/P" status="not_started" />
                     <TreeItem code="25" label="Otras inversiones L/P" status="not_started" />
                     <TreeItem code="28" label="Amortización acumulada" status="completed" />
                     <TreeItem code="29" label="Deterioro de valor" status="not_started" />
                     
                     <div className="text-[9px] uppercase tracking-wider text-neutral-400 pl-1 pt-3 pb-1 font-medium">Activo corriente</div>
                     <TreeItem code="30" label="Existencias comerciales" status="in_progress" />
                     <TreeItem code="31" label="Materias primas" status="not_started" />
                     <TreeItem code="32" label="Otros aprovisionamientos" status="not_started" />
                     <TreeItem code="33" label="Productos en curso" status="not_started" />
                     <TreeItem code="35" label="Productos terminados" status="not_started" />
                     <TreeItem code="39" label="Deterioro existencias" status="not_started" />
                     <TreeItem code="41" label="Acreedores varios" status="not_started" />
                     <TreeItem code="43" label="Clientes" status="in_progress" />
                     <TreeItem code="44" label="Deudores varios" status="not_started" />
                     <TreeItem code="46" label="Personal" status="completed" />
                     <TreeItem code="47" label="Administraciones públicas" status="not_started" />
                  </div>

                  {/* More accounts (expandable) */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isAccountsExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                     <div className="space-y-1 pl-1 pt-1">
                        <TreeItem code="48" label="Ajustes por periodificación" status="not_started" />
                        <TreeItem code="49" label="Deterioro créditos" status="not_started" />
                        
                        <div className="text-[9px] uppercase tracking-wider text-neutral-400 pl-1 pt-3 pb-1 font-medium">Tesorería</div>
                        <TreeItem code="52" label="Deudas C/P entidades crédito" status="not_started" />
                        <TreeItem code="54" label="Inversiones financieras C/P" status="in_progress" />
                        <TreeItem code="55" label="Otras cuentas no bancarias" status="not_started" />
                        <TreeItem code="56" label="Fianzas y depósitos C/P" status="not_started" />
                        <TreeItem code="57" label="Tesorería (Bancos)" status="completed" />
                        
                        {/* PATRIMONIO NETO */}
                        <div className="text-[9px] uppercase tracking-wider text-neutral-400 pl-1 pt-3 pb-1 font-medium">Patrimonio neto</div>
                        <TreeItem code="10" label="Capital social" status="completed" />
                        <TreeItem code="11" label="Reservas" status="completed" />
                        <TreeItem code="12" label="Resultados pendientes aplicación" status="not_started" />
                        <TreeItem code="13" label="Subvenciones, donaciones" status="not_started" />
                        
                        {/* PASIVO */}
                        <div className="text-[9px] uppercase tracking-wider text-neutral-400 pl-1 pt-3 pb-1 font-medium">Pasivo no corriente</div>
                        <TreeItem code="14" label="Provisiones" status="in_progress" />
                        <TreeItem code="15" label="Deudas L/P partes vinculadas" status="not_started" />
                        <TreeItem code="16" label="Deudas L/P ent. crédito" status="not_started" />
                        <TreeItem code="17" label="Deudas L/P" status="not_started" />
                        <TreeItem code="18" label="Pasivos por fianzas L/P" status="not_started" />
                        
                        {/* CUENTA DE RESULTADOS */}
                        <div className="text-[9px] uppercase tracking-wider text-neutral-400 pl-1 pt-3 pb-1 font-medium">Compras y gastos</div>
                        <TreeItem code="60" label="Compras" status="not_started" />
                        <TreeItem code="61" label="Variación existencias" status="not_started" />
                        <TreeItem code="62" label="Servicios exteriores" status="not_started" />
                        <TreeItem code="63" label="Tributos" status="not_started" />
                        <TreeItem code="64" label="Gastos de personal" status="completed" />
                        <TreeItem code="65" label="Otros gastos de gestión" status="not_started" />
                        <TreeItem code="66" label="Gastos financieros" status="not_started" />
                        <TreeItem code="67" label="Pérdidas procedentes activos" status="not_started" />
                        <TreeItem code="68" label="Dotación amortizaciones" status="not_started" />
                        <TreeItem code="69" label="Pérdidas deterioro" status="not_started" />
                        
                        <div className="text-[9px] uppercase tracking-wider text-neutral-400 pl-1 pt-3 pb-1 font-medium">Ventas e ingresos</div>
                        <TreeItem code="70" label="Ventas de mercaderías" status="in_progress" />
                        <TreeItem code="71" label="Variación existencias" status="not_started" />
                        <TreeItem code="73" label="Trabajos realizados empresa" status="not_started" />
                        <TreeItem code="74" label="Subvenciones explotación" status="not_started" />
                        <TreeItem code="75" label="Otros ingresos de gestión" status="not_started" />
                        <TreeItem code="76" label="Ingresos financieros" status="not_started" />
                        <TreeItem code="77" label="Beneficios procedentes activos" status="not_started" />
                        <TreeItem code="79" label="Excesos y reversiones" status="not_started" />
                     </div>
                  </div>

                  {/* Ver más / Ver menos button */}
                  <button
                     onClick={() => setIsAccountsExpanded(!isAccountsExpanded)}
                     className="w-full mt-2 py-1.5 text-[11px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors flex items-center justify-center gap-1 hover:bg-neutral-50 rounded"
                  >
                     {isAccountsExpanded ? (
                        <>
                           <ChevronDown className="w-3 h-3 rotate-180" />
                           Ver menos
                        </>
                     ) : (
                        <>
                           <ChevronDown className="w-3 h-3" />
                           Ver más cuentas
                        </>
                     )}
                  </button>
               </div>

               {/* Solicitudes al cliente */}
               <div className="py-1 mb-1">
                 <div 
                    onClick={() => onSelectArea('client-requests')}
                    className="flex items-center gap-2 px-0 group cursor-pointer"
                 >
                    <h3 className={`text-[13px] font-sans pl-1 font-medium ${activeArea === 'client-requests' ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-900'} transition-colors`}>{t('sidebar.requests') || 'Solicitudes al cliente'}</h3>
                    <div className="w-4 h-4 flex items-center justify-center">
                       <div className={`w-1.5 h-1.5 rounded-full ${activeArea === 'client-requests' ? 'bg-neutral-900' : 'bg-transparent group-hover:bg-neutral-300'} transition-colors`}></div>
                    </div>
                 </div>
               </div>

               {/* Mensajes */}
               <div className="py-1 mb-6">
                 <div 
                    onClick={() => onSelectArea('messages')}
                    className="flex items-center gap-2 px-0 group cursor-pointer"
                 >
                    <h3 className={`text-[13px] font-sans pl-1 font-medium ${activeArea === 'messages' ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-900'} transition-colors`}>{t('sidebar.messages') || 'Mensajes'}</h3>
                    <div className="w-4 h-4 flex items-center justify-center">
                       <div className={`w-1.5 h-1.5 rounded-full ${activeArea === 'messages' ? 'bg-neutral-900' : 'bg-transparent group-hover:bg-neutral-300'} transition-colors`}></div>
                    </div>
                 </div>
               </div>

               {/* Tools / Otros */}
               <div className="py-1">
                  <div 
                    onClick={() => setIsOthersOpen(!isOthersOpen)}
                    className="flex items-center justify-between cursor-pointer group select-none mb-2"
                  >
                     <h3 className="text-[13px] font-sans text-neutral-500 pl-1 group-hover:text-neutral-900 transition-colors">Otros</h3>
                     <ChevronDown 
                        className={`w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-900 transition-transform duration-300 ${isOthersOpen ? 'rotate-180' : ''}`} 
                     />
                  </div>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOthersOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                     <div className="space-y-1 pl-1 pt-2">
                        <div 
                           onClick={() => onSelectArea('documents')}
                           className={`group relative pl-4 border-l-[1.5px] ${activeArea === 'documents' ? 'border-neutral-900' : 'border-transparent hover:border-neutral-300'} cursor-pointer py-2 transition-all hover:pl-5`}
                        >
                           <div className="flex items-center gap-3">
                              <span className={`text-[13px] font-medium transition-colors ${activeArea === 'documents' ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-900'}`}>Documentos del encargo</span>
                           </div>
                        </div>
                        <div 
                           onClick={() => onSelectArea('team')}
                           className={`group relative pl-4 border-l-[1.5px] ${activeArea === 'team' ? 'border-neutral-900' : 'border-transparent hover:border-neutral-300'} cursor-pointer py-2 transition-all hover:pl-5`}
                        >
                           <div className="flex items-center gap-3">
                              <span className={`text-[13px] font-medium transition-colors ${activeArea === 'team' ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-900'}`}>Equipo auditor</span>
                           </div>
                        </div>
                        <div 
                           onClick={() => onSelectArea('erp-integrations')}
                           className={`group relative pl-4 border-l-[1.5px] ${activeArea === 'erp-integrations' ? 'border-neutral-900' : 'border-transparent hover:border-neutral-300'} cursor-pointer py-2 transition-all hover:pl-5`}
                        >
                           <div className="flex items-center gap-3">
                              <span className={`text-[13px] font-medium transition-colors ${activeArea === 'erp-integrations' ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-900'}`}>Integraciones ERP</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

            </div>

             {/* Footer - Mi perfil y ajustes */}
             <div className="px-6 py-6 border-t border-neutral-50">
                <div className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-8 h-8 bg-neutral-50 text-neutral-600 flex items-center justify-center text-[10px] font-bold font-serif rounded-full border border-neutral-200 group-hover:border-neutral-400 group-hover:bg-white transition-colors">
                    AR
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-neutral-900 leading-none mb-1 group-hover:underline transition-all">{CURRENT_USER.name}</span>
                    <span className="text-[10px] text-neutral-400 leading-none">Mi perfil y ajustes</span>
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
  <h3 className={`text-[13px] font-sans text-neutral-500 mb-3 pl-1 ${className}`}>
    {label}
  </h3>
);

const NavItem = ({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-md cursor-pointer transition-all group ${
      isActive 
      ? 'bg-neutral-900 text-white shadow-sm' 
      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
    }`}
  >
    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-neutral-300' : 'text-neutral-400 group-hover:text-neutral-900'}`} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const IntelligenceItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
   <div className="group relative pl-4 border-l-[1.5px] border-transparent hover:border-neutral-300 cursor-pointer py-2 transition-all hover:pl-5">
      <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-neutral-500 group-hover:text-neutral-900 transition-colors">{label}</span>
      </div>
   </div>
);

const SubNavItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
   <div className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all group hover:bg-neutral-50 hover:pl-4">
      <Icon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 transition-colors" /> 
      <span className="text-[13px] text-neutral-500 group-hover:text-neutral-900 font-medium transition-colors">{label}</span>
   </div>
);

const StripIcon = ({ icon: Icon, tooltip }: { icon: any, tooltip: string }) => (
   <div className="p-2.5 rounded-lg cursor-pointer transition-all text-neutral-400 hover:text-neutral-900 hover:bg-white hover:shadow-sm border border-transparent hover:border-neutral-200 group relative">
      <Icon className="w-5 h-5" />
      {/* Tooltip */}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-neutral-900 text-white text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-[-5px] group-hover:translate-x-0 z-50">
         {tooltip}
         {/* Arrow */}
         <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-neutral-900 transform rotate-45"></div>
      </div>
   </div>
);

const UserProfile = ({ compact }: { compact: boolean }) => (
  <div className="p-6 border-t border-neutral-100 mt-auto bg-white">
    <div className="flex items-center gap-3 cursor-pointer group">
      <div className="w-8 h-8 bg-neutral-50 text-neutral-600 flex items-center justify-center text-[10px] font-bold font-serif rounded-full border border-neutral-200 group-hover:border-neutral-400 group-hover:bg-white transition-colors">
        AR
      </div>
      {!compact && (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-neutral-900 leading-none mb-1 group-hover:underline transition-all">{CURRENT_USER.name}</span>
          <span className="text-[10px] text-neutral-400 leading-none">{CURRENT_USER.role}</span>
        </div>
      )}
    </div>
  </div>
);

const TreeItem = ({ code, label, status, isActive, onClick }: { code: string, label: string, status: string, isActive?: boolean, onClick?: () => void }) => {
   // Status indicator colors (subtle/muted tones from design system)
   const getStatusColor = () => {
      switch (status) {
         case 'completed':
            // Green - Completed (subtle sage green)
            return 'bg-[#8BA08B]'; // Muted sage green
         case 'in_progress':
         case 'review':
            // Yellow/Amber - In progress (subtle ochre/sand)
            return 'bg-[#C4A574]'; // Muted golden ochre
         case 'not_started':
         default:
            // Red - Pending review (subtle terracotta/dusty rose)
            return 'bg-[#B89090]'; // Muted dusty rose
      }
   };

   return (
      <div 
         onClick={onClick}
         className={`group relative pl-4 border-l-[1.5px] ${isActive ? 'border-neutral-900' : 'border-transparent hover:border-neutral-300'} cursor-pointer py-2 transition-all hover:pl-5`}
      >
         <div className="flex items-start gap-3">
            {/* Status indicator (traffic light) - solid circle */}
            <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} mt-[5px] shrink-0 shadow-sm`}></div>
            
            <div className="flex flex-col flex-1 min-w-0">
               <div className="flex justify-between items-center mb-0.5">
                  <span className={`text-[13px] font-medium transition-colors truncate ${isActive ? 'text-neutral-900 font-serif' : 'text-neutral-500 group-hover:text-neutral-900'}`}>{label}</span>
               </div>
               <span className={`text-[10px] font-mono ${isActive ? 'text-neutral-500' : 'text-neutral-300 group-hover:text-neutral-400'}`}>{code}</span>
            </div>
         </div>
      </div>
   );
};

const TaskSidebarItem = ({ icon: Icon, title, engagement, priority, dueDate }: { icon: any, title: string, engagement: string, priority: string, dueDate: string }) => {
   const getPriorityColor = (priority: string) => {
      switch (priority) {
         case 'high': return 'bg-[#FBF8F7] text-[#8B5A50] border-[#E8E0DE]';
         case 'medium': return 'bg-[#FDFAF6] text-[#8B7355] border-[#EDE5D8]';
         default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
      }
   };
   
   return (
      <div className="group relative pl-4 border-l-[1.5px] border-transparent hover:border-neutral-300 cursor-pointer py-1.5 transition-all hover:pl-5">
         <div className="flex items-start gap-2">
            <div className={`p-1 rounded border ${getPriorityColor(priority)} shrink-0 mt-0.5`}>
               <Icon className="w-2.5 h-2.5" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="text-[12px] text-neutral-700 group-hover:text-neutral-900 truncate leading-tight mb-0.5 transition-colors">
                  {title}
               </div>
               <div className="flex items-center gap-1.5 text-[9px] text-neutral-400">
                  <span>{engagement}</span>
                  <span>•</span>
                  <span className={priority === 'high' ? 'text-[#8B5A50]' : ''}>{dueDate}</span>
               </div>
            </div>
         </div>
      </div>
   );
};
