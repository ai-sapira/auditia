
import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Clock, 
  Filter, 
  ArrowUpRight,
  MoreHorizontal,
  Calendar,
  Building2,
  Search,
  Plus,
  ChevronRight,
  MapPin,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { PipelineStage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

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

interface EnhancedPipelineItem {
  id: string;
  client: string;
  engagement: string;
  stage: PipelineStage;
  partner: string;
  manager: string;
  startDate: string;
  endDate: string;
  risk: 'low' | 'medium' | 'high';
  sector: string;
  daysInStage: number;
  teamInitials: string[];
  progress: number;
}

interface Client {
  id: string;
  name: string;
  sector: string;
  location: string;
  partner: string;
  activeEngagements: number;
  totalEngagements: number;
  lastActivity: string;
  riskLevel: 'low' | 'medium' | 'high';
  revenue: number;
  status: 'active' | 'inactive' | 'prospect';
}

interface PortfolioViewProps {
  onSelectClient?: (clientId: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ onSelectClient }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'engagements' | 'clients'>('engagements');
  const [selectedPartner, setSelectedPartner] = useState<string>('All');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Engagements data
  const engagements: EnhancedPipelineItem[] = [
    { id: '1', client: 'Industrias Beta', engagement: 'Auditoría 2025', stage: 'not_started', partner: 'Elena M.', manager: 'Sofia L.', startDate: '01/04', endDate: '15/05', risk: 'low', sector: 'Manufacturing', daysInStage: 12, teamInitials: ['SL', 'AR'], progress: 0 },
    { id: '6', client: 'Kappa Energy', engagement: 'Auditoría 2025', stage: 'not_started', partner: 'Javier P.', manager: 'Carlos D.', startDate: '10/04', endDate: '20/06', risk: 'medium', sector: 'Energy', daysInStage: 5, teamInitials: ['CD'], progress: 0 },
    { id: '2', client: 'Gamma Logistics', engagement: 'Auditoría 2025', stage: 'ingestion', partner: 'Javier P.', manager: 'Carlos D.', startDate: '15/03', endDate: '30/04', risk: 'medium', sector: 'Logistics', daysInStage: 3, teamInitials: ['CD', 'MF'], progress: 25 },
    { id: '7', client: 'Epsilon Pharma', engagement: 'Auditoría 2025', stage: 'ingestion', partner: 'Elena M.', manager: 'Sofia L.', startDate: '18/03', endDate: '15/05', risk: 'low', sector: 'Healthcare', daysInStage: 1, teamInitials: ['SL'], progress: 20 },
    { id: '3', client: 'Grupo Alfa', engagement: 'Auditoría 2025', stage: 'testing', partner: 'Elena M.', manager: 'Carlos D.', startDate: '01/03', endDate: '30/03', risk: 'high', sector: 'Manufacturing', daysInStage: 15, teamInitials: ['CD', 'AR', 'JP'], progress: 65 },
    { id: '8', client: 'Zeta Bank', engagement: 'Auditoría 2025', stage: 'testing', partner: 'Javier P.', manager: 'Maria F.', startDate: '20/02', endDate: '10/04', risk: 'high', sector: 'Finance', daysInStage: 22, teamInitials: ['MF', 'SL'], progress: 48 },
    { id: '9', client: 'Theta Tech', engagement: 'Auditoría 2025', stage: 'testing', partner: 'Carlos D.', manager: 'Sofia L.', startDate: '05/03', endDate: '25/04', risk: 'medium', sector: 'Technology', daysInStage: 8, teamInitials: ['SL'], progress: 55 },
    { id: '4', client: 'Delta Finance', engagement: 'Auditoría 2025', stage: 'review', partner: 'Javier P.', manager: 'Maria F.', startDate: '15/02', endDate: '20/03', risk: 'medium', sector: 'Finance', daysInStage: 4, teamInitials: ['MF'], progress: 85 },
    { id: '10', client: 'Iota Construction', engagement: 'Auditoría 2025', stage: 'review', partner: 'Elena M.', manager: 'Carlos D.', startDate: '10/01', endDate: '15/03', risk: 'low', sector: 'Real Estate', daysInStage: 10, teamInitials: ['CD', 'AR'], progress: 90 },
    { id: '5', client: 'Omega Retail', engagement: 'Auditoría 2024', stage: 'closed', partner: 'Elena M.', manager: 'Sofia L.', startDate: '01/01', endDate: '28/02', risk: 'low', sector: 'Retail', daysInStage: 0, teamInitials: ['SL', 'AR'], progress: 100 },
    { id: '11', client: 'Lambda Foods', engagement: 'Auditoría 2024', stage: 'closed', partner: 'Javier P.', manager: 'Maria F.', startDate: '01/01', endDate: '15/02', risk: 'medium', sector: 'Retail', daysInStage: 0, teamInitials: ['MF'], progress: 100 },
    { id: '12', client: 'Mu Motors', engagement: 'Auditoría 2024', stage: 'closed', partner: 'Carlos D.', manager: 'Sofia L.', startDate: '15/12', endDate: '30/01', risk: 'low', sector: 'Manufacturing', daysInStage: 0, teamInitials: ['SL'], progress: 100 },
  ];

  // Clients data
  const clients: Client[] = [
    { id: '1', name: 'Grupo Alfa', sector: 'Manufacturing', location: 'Madrid', partner: 'Elena M.', activeEngagements: 1, totalEngagements: 5, lastActivity: 'Hoy', riskLevel: 'high', revenue: 85000, status: 'active' },
    { id: '2', name: 'Zeta Bank', sector: 'Finance', location: 'Barcelona', partner: 'Javier P.', activeEngagements: 1, totalEngagements: 3, lastActivity: 'Hoy', riskLevel: 'high', revenue: 120000, status: 'active' },
    { id: '3', name: 'Delta Finance', sector: 'Finance', location: 'Madrid', partner: 'Javier P.', activeEngagements: 1, totalEngagements: 4, lastActivity: 'Ayer', riskLevel: 'medium', revenue: 65000, status: 'active' },
    { id: '4', name: 'Theta Tech', sector: 'Technology', location: 'Valencia', partner: 'Carlos D.', activeEngagements: 1, totalEngagements: 2, lastActivity: 'Ayer', riskLevel: 'medium', revenue: 45000, status: 'active' },
    { id: '5', name: 'Gamma Logistics', sector: 'Logistics', location: 'Sevilla', partner: 'Javier P.', activeEngagements: 1, totalEngagements: 3, lastActivity: 'Hace 2 días', riskLevel: 'medium', revenue: 55000, status: 'active' },
    { id: '6', name: 'Epsilon Pharma', sector: 'Healthcare', location: 'Madrid', partner: 'Elena M.', activeEngagements: 1, totalEngagements: 2, lastActivity: 'Hace 3 días', riskLevel: 'low', revenue: 72000, status: 'active' },
    { id: '7', name: 'Industrias Beta', sector: 'Manufacturing', location: 'Bilbao', partner: 'Elena M.', activeEngagements: 1, totalEngagements: 6, lastActivity: 'Hace 1 semana', riskLevel: 'low', revenue: 95000, status: 'active' },
    { id: '8', name: 'Kappa Energy', sector: 'Energy', location: 'Madrid', partner: 'Javier P.', activeEngagements: 1, totalEngagements: 1, lastActivity: 'Hace 1 semana', riskLevel: 'medium', revenue: 35000, status: 'active' },
    { id: '9', name: 'Omega Retail', sector: 'Retail', location: 'Barcelona', partner: 'Elena M.', activeEngagements: 0, totalEngagements: 4, lastActivity: 'Hace 2 meses', riskLevel: 'low', revenue: 48000, status: 'active' },
    { id: '10', name: 'Lambda Foods', sector: 'Retail', location: 'Valencia', partner: 'Javier P.', activeEngagements: 0, totalEngagements: 3, lastActivity: 'Hace 2 meses', riskLevel: 'low', revenue: 42000, status: 'active' },
    { id: '11', name: 'Mu Motors', sector: 'Manufacturing', location: 'Zaragoza', partner: 'Carlos D.', activeEngagements: 0, totalEngagements: 2, lastActivity: 'Hace 3 meses', riskLevel: 'low', revenue: 38000, status: 'active' },
    { id: '12', name: 'Iota Construction', sector: 'Real Estate', location: 'Madrid', partner: 'Elena M.', activeEngagements: 1, totalEngagements: 3, lastActivity: 'Hace 4 días', riskLevel: 'low', revenue: 58000, status: 'active' },
  ];

  // Filter logic
  const filteredEngagements = engagements.filter(item => {
    const matchPartner = selectedPartner === 'All' || item.partner === selectedPartner;
    const matchSector = selectedSector === 'All' || item.sector === selectedSector;
    const matchSearch = searchQuery === '' || 
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.engagement.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPartner && matchSector && matchSearch;
  });

  const filteredClients = clients.filter(client => {
    const matchPartner = selectedPartner === 'All' || client.partner === selectedPartner;
    const matchSector = selectedSector === 'All' || client.sector === selectedSector;
    const matchSearch = searchQuery === '' || 
      client.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPartner && matchSector && matchSearch;
  });

  const stages: PipelineStage[] = ['not_started', 'ingestion', 'testing', 'review', 'closed'];
  const partners = ['All', 'Elena M.', 'Javier P.', 'Carlos D.'];
  const sectors = ['All', 'Manufacturing', 'Finance', 'Technology', 'Retail', 'Logistics', 'Energy', 'Healthcare', 'Real Estate'];

  const getStageLabel = (stage: PipelineStage) => {
    const labels: Record<PipelineStage, string> = {
      not_started: 'No iniciado',
      ingestion: 'En ingesta',
      testing: 'En pruebas',
      review: 'En revisión',
      closed: 'Cerrado'
    };
    return labels[stage];
  };

  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case 'high': return { bg: DS.error.bg, text: DS.error.text, border: DS.error.border, label: 'Alto' };
      case 'medium': return { bg: DS.warning.bg, text: DS.warning.text, border: DS.warning.border, label: 'Medio' };
      default: return { bg: DS.success.bg, text: DS.success.text, border: DS.success.border, label: 'Bajo' };
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-ES') + ' €';
  };

  // Summary stats
  const engagementStats = {
    total: engagements.length,
    active: engagements.filter(e => e.stage !== 'closed').length,
    testing: engagements.filter(e => e.stage === 'testing').length,
    review: engagements.filter(e => e.stage === 'review').length,
    highRisk: engagements.filter(e => e.risk === 'high').length,
  };

  const clientStats = {
    total: clients.length,
    active: clients.filter(c => c.activeEngagements > 0).length,
    highRisk: clients.filter(c => c.riskLevel === 'high').length,
    totalRevenue: clients.reduce((acc, c) => acc + c.revenue, 0),
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-12 pt-10 pb-6 border-b border-neutral-100">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-serif text-neutral-900 mb-1">{t('portfolio.header')}</h1>
              <p className="text-sm text-neutral-500 font-sans">{t('portfolio.subtitle')}</p>
            </div>
            <button className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded text-sm font-medium hover:bg-neutral-800 transition-colors">
              <Plus className="w-4 h-4" />
              Crear encargo
            </button>
          </div>
          
          {/* Tabs & Filters */}
          <div className="flex justify-between items-center">
            {/* Tabs */}
            <div className="flex gap-0 bg-neutral-100 rounded p-1">
              <button
                onClick={() => setActiveTab('engagements')}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded transition-all ${
                  activeTab === 'engagements' 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Encargos
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === 'engagements' ? 'bg-neutral-100 text-neutral-600' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {engagementStats.total}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded transition-all ${
                  activeTab === 'clients' 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Clientes
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === 'clients' ? 'bg-neutral-100 text-neutral-600' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {clientStats.total}
                </span>
              </button>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder={activeTab === 'engagements' ? 'Buscar encargo...' : 'Buscar cliente...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-neutral-200 rounded text-sm text-neutral-600 w-56 focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
              
              {/* Partner Filter */}
              <div className="relative">
                <select 
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 border border-neutral-200 rounded text-sm text-neutral-600 cursor-pointer hover:border-neutral-300 transition-colors bg-white focus:outline-none focus:border-neutral-900"
                >
                  {partners.map(p => <option key={p} value={p}>{p === 'All' ? 'Todos los socios' : p}</option>)}
                </select>
                <Filter className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              
              {/* Sector Filter */}
              <div className="relative">
                <select 
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 border border-neutral-200 rounded text-sm text-neutral-600 cursor-pointer hover:border-neutral-300 transition-colors bg-white focus:outline-none focus:border-neutral-900"
                >
                  {sectors.map(s => <option key={s} value={s}>{s === 'All' ? 'Todos los sectores' : s}</option>)}
                </select>
                <Filter className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-12 py-8 max-w-[1800px] mx-auto animate-fade-in">
        <AnimatePresence mode="wait">
          
          {/* ==================== ENGAGEMENTS TAB ==================== */}
          {activeTab === 'engagements' && (
            <motion.div
              key="engagements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-5 gap-4 mb-8">
                <div className="bg-neutral-50 border border-neutral-200 rounded p-5">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Total encargos</div>
                  <div className="text-3xl font-serif text-neutral-900 tabular-nums">{engagementStats.total}</div>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded p-5">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">En curso</div>
                  <div className="text-3xl font-serif text-neutral-900 tabular-nums">{engagementStats.active}</div>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded p-5">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">En pruebas</div>
                  <div className={`text-3xl font-serif tabular-nums ${DS.warning.text}`}>{engagementStats.testing}</div>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded p-5">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">En revisión</div>
                  <div className={`text-3xl font-serif tabular-nums ${DS.info.text}`}>{engagementStats.review}</div>
                </div>
                <div className={`${DS.error.bg} border ${DS.error.border} rounded p-5`}>
                  <div className={`text-[10px] ${DS.error.text} uppercase tracking-wider mb-2`}>Riesgo alto</div>
                  <div className={`text-3xl font-serif tabular-nums ${DS.error.text}`}>{engagementStats.highRisk}</div>
                </div>
              </div>

              {/* Kanban Pipeline */}
              <div className="grid grid-cols-5 gap-4 min-h-[500px]">
                {stages.map(stage => (
                  <div key={stage} className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-neutral-200">
                      <span className="text-xs font-medium text-neutral-600 tracking-wide">
                        {getStageLabel(stage)}
                      </span>
                      <span className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full tabular-nums">
                        {filteredEngagements.filter(p => p.stage === stage).length}
                      </span>
                    </div>
                    <div className="bg-neutral-50/50 flex-1 p-2 space-y-2 rounded border border-transparent hover:border-neutral-100 transition-colors">
                      {filteredEngagements.filter(p => p.stage === stage).map(item => {
                        const riskStyle = getRiskStyle(item.risk);
                        return (
                          <motion.div 
                            key={item.id} 
                            className="bg-white p-4 border border-neutral-200 rounded shadow-sm hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer group relative"
                            onClick={() => onSelectClient && onSelectClient(item.client)}
                            whileHover={{ y: -2 }}
                          >
                            {/* Risk Indicator */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l ${riskStyle.bg.replace('bg-', 'bg-').replace('[#', '').replace(']', '')}`} style={{ backgroundColor: DS[item.risk === 'high' ? 'error' : item.risk === 'medium' ? 'warning' : 'success'].solid }} />
                            
                            <div className="pl-2">
                              {/* Top Meta */}
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider">
                                  {item.daysInStage > 0 ? `${item.daysInStage} días` : 'Nuevo'}
                                </span>
                                <MoreHorizontal className="w-3.5 h-3.5 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>

                              {/* Title */}
                              <h4 className="text-sm font-serif text-neutral-900 font-medium mb-1 leading-tight">{item.client}</h4>
                              <div className="text-[10px] text-neutral-400 mb-2">{item.engagement}</div>
                              
                              {/* Sector Badge */}
                              <div className="inline-block px-1.5 py-0.5 bg-neutral-100 text-[9px] text-neutral-500 rounded mb-3">
                                {item.sector}
                              </div>

                              {/* Progress */}
                              {stage !== 'closed' && (
                                <div className="mb-3">
                                  <div className="flex justify-between text-[9px] text-neutral-400 mb-1">
                                    <span>Avance</span>
                                    <span className="tabular-nums">{item.progress}%</span>
                                  </div>
                                  <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${item.progress}%` }} />
                                  </div>
                                </div>
                              )}

                              {/* Bottom Meta */}
                              <div className="flex justify-between items-center border-t border-neutral-50 pt-3">
                                <div className="flex -space-x-1.5">
                                  {item.teamInitials.map((init, i) => (
                                    <div key={i} className="w-5 h-5 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-[8px] font-medium text-neutral-600">
                                      {init}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                                  <Calendar className="w-2.5 h-2.5" />
                                  <span className="tabular-nums">{item.endDate}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      {filteredEngagements.filter(p => p.stage === stage).length === 0 && (
                        <div className="h-24 flex items-center justify-center text-[10px] text-neutral-300 italic border-2 border-dashed border-neutral-100 rounded">
                          Sin encargos
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ==================== CLIENTS TAB ==================== */}
          {activeTab === 'clients' && (
            <motion.div
              key="clients"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-5 gap-4 mb-8">
                <div className="bg-neutral-50 border border-neutral-200 rounded p-5">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Total clientes</div>
                  <div className="text-3xl font-serif text-neutral-900 tabular-nums">{clientStats.total}</div>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded p-5">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Con encargo activo</div>
                  <div className={`text-3xl font-serif tabular-nums ${DS.success.text}`}>{clientStats.active}</div>
                </div>
                <div className={`${DS.error.bg} border ${DS.error.border} rounded p-5`}>
                  <div className={`text-[10px] ${DS.error.text} uppercase tracking-wider mb-2`}>Riesgo alto</div>
                  <div className={`text-3xl font-serif tabular-nums ${DS.error.text}`}>{clientStats.highRisk}</div>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded p-5 col-span-2">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Facturación anual estimada</div>
                  <div className="text-3xl font-serif text-neutral-900 tabular-nums">{formatCurrency(clientStats.totalRevenue)}</div>
                </div>
              </div>

              {/* Clients Table */}
              <div className="bg-white border border-neutral-200 rounded overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr className="text-[10px] text-neutral-500 uppercase tracking-wider">
                      <th className="text-left px-5 py-3 font-medium">Cliente</th>
                      <th className="text-left px-5 py-3 font-medium">Sector</th>
                      <th className="text-left px-5 py-3 font-medium">Ubicación</th>
                      <th className="text-left px-5 py-3 font-medium">Socio</th>
                      <th className="text-center px-5 py-3 font-medium">Encargos</th>
                      <th className="text-center px-5 py-3 font-medium">Riesgo</th>
                      <th className="text-right px-5 py-3 font-medium">Facturación</th>
                      <th className="text-right px-5 py-3 font-medium">Última actividad</th>
                      <th className="text-right px-5 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredClients.map((client) => {
                      const riskStyle = getRiskStyle(client.riskLevel);
                      return (
                        <motion.tr 
                          key={client.id} 
                          className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                          onClick={() => onSelectClient && onSelectClient(client.name)}
                          whileHover={{ backgroundColor: '#FAFAFA' }}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-neutral-100 rounded flex items-center justify-center">
                                <span className="text-xs font-serif font-medium text-neutral-600">
                                  {client.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-serif text-neutral-900 font-medium">{client.name}</span>
                                {client.activeEngagements > 0 && (
                                  <div className={`text-[10px] ${DS.success.text} flex items-center gap-1 mt-0.5`}>
                                    <div className="w-1 h-1 rounded-full bg-[#4A5D4A]" />
                                    Encargo activo
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded">{client.sector}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                              <MapPin className="w-3 h-3" />
                              {client.location}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs text-neutral-600">{client.partner}</span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-sm font-serif font-medium text-neutral-900 tabular-nums">{client.activeEngagements}</span>
                              <span className="text-xs text-neutral-400">/ {client.totalEngagements}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className={`text-[10px] font-medium px-2 py-1 rounded ${riskStyle.bg} ${riskStyle.text}`}>
                              {riskStyle.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className="text-sm font-mono text-neutral-900 tabular-nums">{formatCurrency(client.revenue)}</span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className="text-xs text-neutral-400">{client.lastActivity}</span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 transition-colors" />
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
