import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  Settings,
  Link2,
  Unlink,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Clock,
  Shield,
  Zap,
  Server,
  ArrowRight
} from 'lucide-react';

// ERP Logo Components
const SAPLogo = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 92 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0H91.5V46H0V0Z" fill="#0070C0"/>
    <path d="M13.5 35.5C10.5 35.5 8 34.8 6 33.5V29C8.3 30.7 11 31.5 14 31.5C17.5 31.5 19 30 19 28C19 25.5 16.5 24.5 13 23C8.5 21.2 5.5 19 5.5 14.5C5.5 9.5 9 6.5 15 6.5C17.8 6.5 20 7 22 8V12.5C19.8 11 17.5 10.5 15 10.5C12 10.5 10 11.5 10 14C10 16.5 12.5 17.5 16 19C21 21 23.5 23 23.5 27.5C23.5 33 19.5 35.5 13.5 35.5Z" fill="white"/>
    <path d="M42 35L39.5 28H29.5L27 35H22L32.5 7H36.5L47 35H42ZM34.5 12L31 24H38L34.5 12Z" fill="white"/>
    <path d="M49 35V7H59C66 7 70 10.5 70 17C70 23.5 66 27 59 27H54V35H49ZM54 23H58.5C62.5 23 65 21 65 17C65 13 62.5 11 58.5 11H54V23Z" fill="white"/>
    <path d="M83 35V7H87.5V35H83Z" fill="white"/>
  </svg>
);

const SageLogo = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="40" rx="4" fill="#00D639"/>
    <path d="M14 26C12.5 26 11.2 25.6 10 24.8V22.2C11.3 23.3 13 23.8 14.5 23.8C16.8 23.8 18 22.8 18 21.2C18 19.5 16 18.8 13.5 17.8C10 16.5 8 15 8 12C8 8.5 10.8 6.5 15 6.5C17 6.5 18.5 7 20 7.8V10.3C18.3 9.2 16.5 8.5 14.8 8.5C12.5 8.5 11 9.5 11 11.2C11 13 13 13.8 15.5 14.8C19.5 16.3 21 17.8 21 20.8C21 24.5 18 26 14 26Z" fill="white"/>
    <path d="M32 26C28 26 25 23 25 19C25 15 28 12 32 12C33.5 12 34.8 12.3 36 13V16C35 15 33.8 14.2 32.2 14.2C29.5 14.2 28 16.2 28 19C28 21.8 29.5 23.8 32.2 23.8C33.8 23.8 35 23 36 22V25C34.8 25.7 33.5 26 32 26ZM32 6C27.5 6 24.5 8 24.5 11V11.5H27.5V11C27.5 9.3 29 8 32 8C35 8 36.5 9.3 36.5 11V11.5H39.5V11C39.5 8 36.5 6 32 6Z" fill="white"/>
    <path d="M51.5 26C47 26 44 22.5 44 18C44 13.5 47 10 51.5 10C56 10 59 13.5 59 18C59 22.5 56 26 51.5 26ZM51.5 12.5C48.8 12.5 47 14.8 47 18C47 21.2 48.8 23.5 51.5 23.5C54.2 23.5 56 21.2 56 18C56 14.8 54.2 12.5 51.5 12.5Z" fill="white"/>
    <path d="M72 26C67.5 26 64 22.8 64 18C64 13.2 67.5 10 72 10C76 10 78.5 12.2 79 16H76C75.5 13.8 74 12.5 72 12.5C69 12.5 67 15 67 18C67 21 69 23.5 72 23.5C74.2 23.5 75.8 22 76.2 19.5H72V17H79.5V18C79.5 22.8 76.3 26 72 26Z" fill="white"/>
    <path d="M84 25.5V10.5H95V13H87V16H94V18.5H87V23H95V25.5H84Z" fill="white"/>
  </svg>
);

const A3Logo = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="40" rx="4" fill="#1E3A5F"/>
    <path d="M25 32L22 24H13L10 32H5L16 8H19L30 32H25ZM17.5 12L14.5 21H20.5L17.5 12Z" fill="white"/>
    <path d="M45 32C40 32 36 29.5 36 25H41C41 27 42.5 28.5 45.5 28.5C48 28.5 50 27 50 24.5C50 22 48 20.5 45 20.5H42V17H45C47.5 17 49.5 15.5 49.5 13.5C49.5 11.5 47.5 10 45 10C42.5 10 41 11.5 41 13.5H36C36 9.5 40 7 45 7C51 7 54.5 9.5 54.5 13C54.5 15.5 52.5 17.5 50 18.5C53 19.5 55 21.5 55 24.5C55 28.5 51 32 45 32Z" fill="white"/>
    <circle cx="65" cy="20" r="8" fill="#E94E1B"/>
    <path d="M62 23V17L65 14L68 17V23" stroke="white" strokeWidth="1.5" fill="none"/>
  </svg>
);

// Logo renderer component
const ERPLogoRenderer = ({ erpId, size = 'normal' }: { erpId: string; size?: 'normal' | 'small' }) => {
  const sizeClasses = size === 'small' ? 'w-8 h-8' : 'w-12 h-12';
  
  switch (erpId) {
    case 'sap':
      return (
        <div className={`${sizeClasses} rounded-lg overflow-hidden shadow-sm`}>
          <SAPLogo />
        </div>
      );
    case 'sage':
      return (
        <div className={`${sizeClasses} rounded-lg overflow-hidden shadow-sm`}>
          <SageLogo />
        </div>
      );
    case 'a3':
      return (
        <div className={`${sizeClasses} rounded-lg overflow-hidden shadow-sm`}>
          <A3Logo />
        </div>
      );
    default:
      return (
        <div className={`${sizeClasses} rounded-lg bg-neutral-200 flex items-center justify-center`}>
          <Database className="w-5 h-5 text-neutral-500" />
        </div>
      );
  }
};

// ERP Integration Types
interface ERPIntegration {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: 'connected' | 'disconnected' | 'pending';
  lastSync?: string;
  modules: string[];
  features: string[];
}

const erpIntegrations: ERPIntegration[] = [
  {
    id: 'sap',
    name: 'SAP S/4HANA',
    description: 'Integración completa con SAP para extracción automática de datos financieros',
    logo: 'SAP',
    status: 'connected',
    lastSync: '2025-01-15 09:32',
    modules: ['FI', 'CO', 'MM', 'SD'],
    features: ['Extracción automática de facturas', 'Balance de comprobación', 'Libro mayor en tiempo real', 'Confirmaciones de saldo']
  },
  {
    id: 'sage',
    name: 'Sage X3',
    description: 'Conexión con Sage para empresas medianas con acceso a contabilidad y finanzas',
    logo: 'SAGE',
    status: 'disconnected',
    modules: ['Contabilidad', 'Finanzas', 'Compras'],
    features: ['Balance de comprobación', 'Diario de movimientos', 'Extractos bancarios', 'Cuentas por pagar']
  },
  {
    id: 'a3',
    name: 'a3ERP / a3ASESOR',
    description: 'Integración con el ecosistema A3 para despachos profesionales y pymes',
    logo: 'A3',
    status: 'pending',
    modules: ['Contabilidad', 'Nóminas', 'Facturación'],
    features: ['Importación de asientos', 'Balance de sumas y saldos', 'Modelo 303/390', 'Cuentas anuales']
  }
];

const statusColors = {
  connected: { bg: 'bg-[#F7F9F7]', text: 'text-[#4A5D4A]', border: 'border-[#E0E5E0]200', icon: CheckCircle2 },
  disconnected: { bg: 'bg-neutral-50', text: 'text-neutral-500', border: 'border-neutral-200', icon: XCircle },
  pending: { bg: 'bg-[#FDFAF6]', text: 'text-[#8B7355]', border: 'border-[#EDE5D8]200', icon: Clock }
};


export const EngagementERPIntegrationsView: React.FC = () => {
  const [selectedERP, setSelectedERP] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [integrations, setIntegrations] = useState(erpIntegrations);

  const handleConnect = (erpId: string) => {
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIntegrations(prev => prev.map(erp => 
        erp.id === erpId 
          ? { ...erp, status: 'connected', lastSync: new Date().toLocaleString('es-ES') }
          : erp
      ));
      setIsConnecting(false);
    }, 2500);
  };

  const handleDisconnect = (erpId: string) => {
    setIntegrations(prev => prev.map(erp => 
      erp.id === erpId 
        ? { ...erp, status: 'disconnected', lastSync: undefined }
        : erp
    ));
  };

  const handleSync = (erpId: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      setIntegrations(prev => prev.map(erp => 
        erp.id === erpId 
          ? { ...erp, lastSync: new Date().toLocaleString('es-ES') }
          : erp
      ));
      setIsConnecting(false);
    }, 1500);
  };

  const selectedIntegration = integrations.find(erp => erp.id === selectedERP);

  return (
    <div className="flex-1 bg-neutral-50/50 p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-neutral-900">Integraciones ERP</h1>
              <p className="text-sm text-neutral-500">Conecta con los sistemas del cliente para extracción automática de datos</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-neutral-200 rounded-sm p-4">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Conectados</div>
            <div className="text-2xl font-serif text-[#4A5D4A]">
              {integrations.filter(i => i.status === 'connected').length}
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-sm p-4">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Pendientes</div>
            <div className="text-2xl font-serif text-[#8B7355]">
              {integrations.filter(i => i.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-sm p-4">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Disponibles</div>
            <div className="text-2xl font-serif text-neutral-600">
              {integrations.length}
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-sm p-4">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Última Sincronización</div>
            <div className="text-sm font-mono text-neutral-600">
              {integrations.find(i => i.lastSync)?.lastSync || '-'}
            </div>
          </div>
        </div>

        {/* Main Content: 2-column layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column: ERP List */}
          <div className="col-span-2 space-y-4">
            {integrations.map((erp) => {
              const statusConfig = statusColors[erp.status];
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.div
                  key={erp.id}
                  layoutId={erp.id}
                  onClick={() => setSelectedERP(erp.id)}
                  className={`bg-white border rounded-sm p-5 cursor-pointer transition-all hover:shadow-md ${
                    selectedERP === erp.id 
                      ? 'border-neutral-900 shadow-md ring-1 ring-neutral-900' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <ERPLogoRenderer erpId={erp.id} size="normal" />
                      
                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-serif text-neutral-900">{erp.name}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium inline-flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                            <StatusIcon className="w-3 h-3" />
                            {erp.status === 'connected' ? 'Conectado' : erp.status === 'pending' ? 'Pendiente' : 'Desconectado'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mb-3">{erp.description}</p>
                        
                        {/* Modules */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {erp.modules.map(mod => (
                            <span key={mod} className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded border border-neutral-200">
                              {mod}
                            </span>
                          ))}
                        </div>

                        {erp.lastSync && (
                          <div className="mt-3 text-[10px] text-neutral-400 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            Última sincronización: {erp.lastSync}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {erp.status === 'connected' ? (
                        <>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); handleSync(erp.id); }}
                            disabled={isConnecting}
                            className="px-3 py-1.5 text-xs font-medium bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5"
                          >
                            <RefreshCw className={`w-3 h-3 ${isConnecting ? 'animate-spin' : ''}`} />
                            Sincronizar
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); setShowConfigModal(true); setSelectedERP(erp.id); }}
                            className="px-3 py-1.5 text-xs font-medium bg-white border border-neutral-200 text-neutral-700 rounded hover:bg-neutral-50 transition-colors inline-flex items-center gap-1.5"
                          >
                            <Settings className="w-3 h-3" />
                            Configurar
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => { e.stopPropagation(); handleConnect(erp.id); }}
                          disabled={isConnecting}
                          className={`px-4 py-1.5 text-xs font-medium rounded transition-all inline-flex items-center gap-1.5 ${
                            isConnecting 
                              ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                              : 'bg-neutral-900 text-white hover:bg-black'
                          }`}
                        >
                          {isConnecting ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Conectando...
                            </>
                          ) : (
                            <>
                              <Link2 className="w-3 h-3" />
                              Conectar
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Detail Panel */}
          <div className="col-span-1">
            <AnimatePresence mode="wait">
              {selectedIntegration ? (
                <motion.div
                  key={selectedIntegration.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border border-neutral-200 rounded-sm sticky top-8"
                >
                  {/* Detail Header */}
                  <div className="px-5 py-4 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                      <ERPLogoRenderer erpId={selectedIntegration.id} size="small" />
                      <div>
                        <h3 className="text-sm font-serif text-neutral-900">{selectedIntegration.name}</h3>
                        <span className={`text-[10px] ${statusColors[selectedIntegration.status].text}`}>
                          {selectedIntegration.status === 'connected' ? 'Conectado' : selectedIntegration.status === 'pending' ? 'Configuración pendiente' : 'No conectado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-5">
                    <h4 className="text-[10px] text-neutral-400 uppercase tracking-wider mb-3">Funcionalidades disponibles</h4>
                    <div className="space-y-2">
                      {selectedIntegration.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${selectedIntegration.status === 'connected' ? 'text-[#4A5D4A]' : 'text-neutral-300'}`} />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="px-5 py-4 bg-neutral-50 border-t border-neutral-100">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-neutral-400 mt-0.5" />
                      <div>
                        <h4 className="text-[10px] font-medium text-neutral-700 mb-1">Conexión segura</h4>
                        <p className="text-[10px] text-neutral-500">
                          Todas las conexiones utilizan OAuth 2.0 y cifrado TLS 1.3. Los datos se transfieren de forma segura y no se almacenan localmente.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedIntegration.status === 'connected' && (
                    <div className="px-5 py-4 border-t border-neutral-100">
                      <button
                        onClick={() => handleDisconnect(selectedIntegration.id)}
                        className="w-full px-3 py-2 text-xs font-medium text-[#8B5A50] bg-[#FBF8F7] border border-[#E8E0DE]200 rounded hover:bg-[#F0E8E6] transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        <Unlink className="w-3 h-3" />
                        Desconectar integración
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-dashed border-neutral-200 rounded-sm p-8 text-center"
                >
                  <Server className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500 mb-1">Selecciona una integración</p>
                  <p className="text-xs text-neutral-400">Haz clic en un ERP para ver sus detalles y opciones de configuración</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Help Card */}
            <div className="mt-4 bg-neutral-50 border border-neutral-100 rounded-sm p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-neutral-600 mt-0.5" />
                <div>
                  <h4 className="text-xs font-medium text-neutral-800 mb-1">¿Necesitas otro ERP?</h4>
                  <p className="text-[10px] text-neutral-600 mb-2">
                    Podemos integrar prácticamente cualquier sistema. Contacta con soporte para solicitar una nueva integración.
                  </p>
                  <button className="text-[10px] font-medium text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-1">
                    Solicitar integración
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Config Modal */}
        <AnimatePresence>
          {showConfigModal && selectedIntegration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowConfigModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-sm shadow-2xl border border-neutral-200 max-w-lg w-full"
              >
                <div className="px-6 py-5 border-b border-neutral-100">
                  <h3 className="text-lg font-serif text-neutral-900">Configuración de {selectedIntegration.name}</h3>
                  <p className="text-xs text-neutral-500">Ajusta los parámetros de sincronización</p>
                </div>

                <div className="p-6 space-y-5">
                  {/* Sync Frequency */}
                  <div>
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 block">Frecuencia de sincronización</label>
                    <select className="w-full px-3 py-2 border border-neutral-200 rounded text-sm text-neutral-700 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900">
                      <option>Cada hora</option>
                      <option>Cada 6 horas</option>
                      <option>Diaria</option>
                      <option>Manual</option>
                    </select>
                  </div>

                  {/* Modules */}
                  <div>
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 block">Módulos a sincronizar</label>
                    <div className="space-y-2">
                      {selectedIntegration.modules.map((mod, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                          <span className="text-sm text-neutral-700">{mod}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* API Settings */}
                  <div>
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 block">Configuración de API</label>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="URL del servidor" 
                        defaultValue={selectedIntegration.id === 'sap' ? 'https://sap.grupocliente.com/api' : ''}
                        className="w-full px-3 py-2 border border-neutral-200 rounded text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 placeholder:text-neutral-300"
                      />
                      <input 
                        type="password" 
                        placeholder="API Key" 
                        defaultValue="••••••••••••••••"
                        className="w-full px-3 py-2 border border-neutral-200 rounded text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 placeholder:text-neutral-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 text-sm font-medium bg-neutral-900 text-white rounded hover:bg-black transition-colors"
                  >
                    Guardar cambios
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

