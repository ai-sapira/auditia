import React, { useState } from 'react';
import { 
  FolderOpen, 
  FileText, 
  Download, 
  Eye, 
  MoreHorizontal, 
  Search, 
  Filter, 
  Upload,
  ChevronRight,
  ChevronDown,
  File,
  Image,
  FileSpreadsheet,
  Database,
  Calendar,
  User,
  ArrowUpDown,
  Plus,
  FolderPlus,
  Grid,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'csv' | 'image' | 'other';
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  source: 'client' | 'auditor' | 'erp';
  area?: string;
  tags?: string[];
}

interface Folder {
  id: string;
  name: string;
  documents: Document[];
  subfolders?: Folder[];
  isOpen?: boolean;
}

export const EngagementDocumentsView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>('all');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['onboarding', 'proveedores']);

  const folders: Folder[] = [
    {
      id: 'onboarding',
      name: 'Onboarding Cliente',
      documents: [
        { id: 'd1', name: 'Balance_Comprobacion_2024.xlsx', type: 'xlsx', size: '2.4 MB', uploadedAt: '01/03/2025', uploadedBy: 'Sistema', source: 'erp', area: 'General', tags: ['Balance', 'SAP'] },
        { id: 'd2', name: 'Libro_Mayor_400_410.xlsx', type: 'xlsx', size: '8.7 MB', uploadedAt: '01/03/2025', uploadedBy: 'Sistema', source: 'erp', area: 'Proveedores', tags: ['Libro Mayor', 'SAP'] },
        { id: 'd3', name: 'Organigrama_GrupoAlfa.pdf', type: 'pdf', size: '456 KB', uploadedAt: '28/02/2025', uploadedBy: 'Marta García', source: 'client', area: 'General' },
        { id: 'd4', name: 'Estatutos_Sociales.pdf', type: 'pdf', size: '1.2 MB', uploadedAt: '28/02/2025', uploadedBy: 'Marta García', source: 'client', area: 'Legal' },
      ]
    },
    {
      id: 'proveedores',
      name: 'Proveedores (40)',
      documents: [
        { id: 'd5', name: 'Movimientos_Proveedores_2024.csv', type: 'csv', size: '12.3 MB', uploadedAt: '05/03/2025', uploadedBy: 'Sistema', source: 'erp', area: 'Proveedores', tags: ['Submayor', 'SAP'] },
        { id: 'd6', name: 'Facturas_Diciembre_LogisticaNorte.pdf', type: 'pdf', size: '3.4 MB', uploadedAt: '18/03/2025', uploadedBy: 'Laura Sánchez', source: 'client', area: 'Proveedores', tags: ['H-023'] },
        { id: 'd7', name: 'Albaranes_LogisticaNorte.pdf', type: 'pdf', size: '2.1 MB', uploadedAt: '19/03/2025', uploadedBy: 'Laura Sánchez', source: 'client', area: 'Proveedores', tags: ['H-023', 'REQ-001'] },
        { id: 'd8', name: 'Contrato_EquipamientoIndustrial.pdf', type: 'pdf', size: '890 KB', uploadedAt: '10/03/2025', uploadedBy: 'Marta García', source: 'client', area: 'Proveedores' },
      ]
    },
    {
      id: 'tesoreria',
      name: 'Tesorería (57)',
      documents: [
        { id: 'd9', name: 'Extracto_BBVA_Q1.pdf', type: 'pdf', size: '1.2 MB', uploadedAt: '18/03/2025', uploadedBy: 'Pedro López', source: 'client', area: 'Tesorería' },
        { id: 'd10', name: 'Extracto_Santander_Q1.pdf', type: 'pdf', size: '890 KB', uploadedAt: '18/03/2025', uploadedBy: 'Pedro López', source: 'client', area: 'Tesorería' },
        { id: 'd11', name: 'Extracto_CaixaBank_Q1.pdf', type: 'pdf', size: '2.1 MB', uploadedAt: '19/03/2025', uploadedBy: 'Pedro López', source: 'client', area: 'Tesorería' },
        { id: 'd12', name: 'Conciliaciones_Bancarias_Dic.xlsx', type: 'xlsx', size: '456 KB', uploadedAt: '15/03/2025', uploadedBy: 'Sistema', source: 'erp', area: 'Tesorería' },
      ]
    },
    {
      id: 'papelestrabajo',
      name: 'Papeles de trabajo',
      documents: [
        { id: 'd13', name: 'WP_AP_LeadSchedule.xlsx', type: 'xlsx', size: '234 KB', uploadedAt: '20/03/2025', uploadedBy: 'Alejandro R.', source: 'auditor', area: 'Proveedores' },
        { id: 'd14', name: 'WP_AP_Circularizaciones.xlsx', type: 'xlsx', size: '189 KB', uploadedAt: '21/03/2025', uploadedBy: 'Alejandro R.', source: 'auditor', area: 'Proveedores' },
        { id: 'd15', name: 'Analisis_CutOff_Proveedores.pdf', type: 'pdf', size: '567 KB', uploadedAt: '22/03/2025', uploadedBy: 'María G.', source: 'auditor', area: 'Proveedores' },
      ]
    }
  ];

  const allDocuments = folders.flatMap(f => f.documents);
  
  const filteredDocuments = selectedFolder === 'all' 
    ? allDocuments 
    : folders.find(f => f.id === selectedFolder)?.documents || [];

  const displayDocuments = searchQuery 
    ? filteredDocuments.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredDocuments;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-[#8B5A50]" />;
      case 'xlsx': return <FileSpreadsheet className="w-5 h-5 text-[#4A5D4A]" />;
      case 'csv': return <Database className="w-5 h-5 text-[#4A5D6A]" />;
      case 'image': return <Image className="w-5 h-5 text-neutral-500" />;
      default: return <File className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'client':
        return <span className="text-[10px] px-2 py-0.5 bg-[#F7F9FA] text-[#4A5D6A] rounded border border-[#E0E5E8]100">Cliente</span>;
      case 'auditor':
        return <span className="text-[10px] px-2 py-0.5 bg-neutral-50 text-neutral-600 rounded border border-neutral-100">Auditor</span>;
      case 'erp':
        return <span className="text-[10px] px-2 py-0.5 bg-[#F7F9F7] text-[#4A5D4A] rounded border border-[#E0E5E0]100">SAP/ERP</span>;
      default:
        return null;
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const stats = {
    total: allDocuments.length,
    fromClient: allDocuments.filter(d => d.source === 'client').length,
    fromERP: allDocuments.filter(d => d.source === 'erp').length,
    fromAuditor: allDocuments.filter(d => d.source === 'auditor').length,
  };

  return (
    <div className="flex-1 flex h-full bg-white animate-fade-in overflow-hidden">
      {/* Sidebar - Folder Tree */}
      <div className="w-72 border-r border-neutral-200 flex flex-col bg-neutral-50/30">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-lg font-serif font-bold text-neutral-900 mb-4">Documentos</h2>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors">
            <Upload className="w-4 h-4" />
            Subir documento
          </button>
        </div>

        {/* Stats */}
        <div className="px-4 py-3 border-b border-neutral-200 grid grid-cols-2 gap-2">
          <div className="bg-white rounded-lg p-2 border border-neutral-100">
            <span className="text-[10px] text-neutral-400 uppercase block">Total</span>
            <span className="text-lg font-serif text-neutral-900">{stats.total}</span>
          </div>
          <div className="bg-white rounded-lg p-2 border border-neutral-100">
            <span className="text-[10px] text-[#4A5D6A] uppercase block">Cliente</span>
            <span className="text-lg font-serif text-[#4A5D6A]">{stats.fromClient}</span>
          </div>
        </div>

        {/* Folder Tree */}
        <div className="flex-1 overflow-y-auto p-4">
          <button 
            onClick={() => setSelectedFolder('all')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-2 ${
              selectedFolder === 'all' ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Todos los documentos
          </button>

          <div className="space-y-1">
            {folders.map((folder) => (
              <div key={folder.id}>
                <button 
                  onClick={() => {
                    toggleFolder(folder.id);
                    setSelectedFolder(folder.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedFolder === folder.id ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {expandedFolders.includes(folder.id) ? (
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                    <FolderOpen className="w-4 h-4 text-[#8B7355]" />
                    <span>{folder.name}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                    {folder.documents.length}
                  </span>
                </button>
              </div>
            ))}
          </div>

          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-400 hover:text-neutral-600 mt-4 transition-colors">
            <FolderPlus className="w-4 h-4" />
            Nueva carpeta
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar documentos..." 
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neutral-400 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'list' ? (
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr className="text-[10px] text-neutral-500 uppercase tracking-wider">
                    <th className="text-left px-4 py-3 font-medium">Nombre</th>
                    <th className="text-left px-4 py-3 font-medium">Origen</th>
                    <th className="text-left px-4 py-3 font-medium">Área</th>
                    <th className="text-left px-4 py-3 font-medium">Subido por</th>
                    <th className="text-left px-4 py-3 font-medium">Fecha</th>
                    <th className="text-right px-4 py-3 font-medium">Tamaño</th>
                    <th className="text-right px-4 py-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {displayDocuments.map((doc) => (
                    <motion.tr 
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.type)}
                          <div>
                            <span className="text-sm text-neutral-900 block">{doc.name}</span>
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {doc.tags.map((tag, i) => (
                                  <span key={i} className="text-[9px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getSourceBadge(doc.source)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-neutral-600">{doc.area}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-neutral-600">{doc.uploadedBy}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-neutral-500">{doc.uploadedAt}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs font-mono text-neutral-500">{doc.size}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-neutral-400 hover:text-neutral-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-neutral-400 hover:text-neutral-600">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-neutral-400 hover:text-neutral-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {displayDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    {getFileIcon(doc.type)}
                    <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-neutral-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="text-sm font-medium text-neutral-900 mb-2 line-clamp-2">{doc.name}</h4>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span>{doc.size}</span>
                    <span>{doc.uploadedAt}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
                    {getSourceBadge(doc.source)}
                    <div className="flex gap-1">
                      <button className="p-1 text-neutral-400 hover:text-neutral-600">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 text-neutral-400 hover:text-neutral-600">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

