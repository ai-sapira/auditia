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
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>SAP</title>
    <path d="M0 6.064v11.872h12.13L24 6.064zm3.264 2.208h.005c.863.001 1.915.245 2.676.633l-.82 1.43c-.835-.404-1.255-.442-1.73-.467-.708-.038-1.064.215-1.069.488-.007.332.669.633 1.305.838.964.306 2.19.715 2.377 1.9L7.77 8.437h2.046l2.064 5.576-.007-5.575h2.37c2.257 0 3.318.764 3.318 2.519 0 1.575-1.09 2.514-2.936 2.514h-.763l-.01 2.094-3.588-.003-.25-.908c-.37.122-.787.189-1.23.189-.456 0-.885-.071-1.263-.2l-.358.919-2 .006.09-.462c-.029.025-.057.05-.087.074-.535.43-1.208.629-2.037.644l-.213.002a5.075 5.075 0 0 1-2.581-.675l.73-1.448c.79.467 1.286.572 1.956.558.347-.007.598-.07.761-.239a.557.557 0 0 0 .156-.369c.007-.376-.53-.553-1.185-.756-.531-.164-1.135-.389-1.606-.735-.559-.41-.825-.924-.812-1.65a1.99 1.99 0 0 1 .566-1.377c.519-.537 1.357-.863 2.363-.863zm10.597 1.67v1.904h.521c.694 0 1.247-.23 1.248-.964 0-.709-.554-.94-1.248-.94zm-5.087.767l-.748 2.362c.223.085.481.133.757.133.268 0 .52-.047.742-.126l-.736-2.37z" fill="#0FAAFF"/>
  </svg>
);

const SageLogo = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>Sage</title>
    <path d="M2.702 5.316C1.167 5.316 0 6.48 0 7.972c0 1.635 1.167 2.267 2.46 2.655 1.224.387 1.804.818 1.804 1.666 0 .86-.64 1.465-1.477 1.465-.84 0-1.566-.604-1.566-1.535 0-.516.242-.647.242-.934 0-.33-.227-.574-.599-.574-.423 0-.864.647-.864 1.566 0 1.48 1.266 2.57 2.787 2.57 1.535 0 2.701-1.163 2.701-2.656 0-1.623-1.166-2.267-2.472-2.655-1.209-.372-1.792-.818-1.792-1.666 0-.845.626-1.45 1.463-1.45.867 0 1.565.617 1.577 1.465.016.388.285.617.599.617a.592.592 0 0 0 .61-.647c-.027-1.48-1.263-2.543-2.771-2.543zm6.171 9.52c.683 0 1.21-.23 1.21-.69a.57.57 0 0 0-.557-.574c-.2 0-.341.085-.668.085-.882 0-1.577-.76-1.577-1.65 0-.962.71-1.725 1.608-1.725 1.009 0 1.65.775 1.65 1.895v2.054c0 .36.284.604.625.604.327 0 .61-.244.61-.604v-2.097c0-1.72-1.178-2.984-2.858-2.984-1.566 0-2.86 1.22-2.86 2.856 0 1.58 1.282 2.83 2.817 2.83zm6.257 3.848c1.535 0 2.701-1.163 2.701-2.656 0-1.635-1.166-2.267-2.472-2.655-1.209-.387-1.792-.818-1.792-1.666s.64-1.465 1.463-1.465c.84 0 1.577.604 1.577 1.535 0 .519-.241.647-.241.934 0 .33.226.574.583.574.441 0 .882-.647.882-1.566 0-1.48-1.278-2.57-2.801-2.57-1.535 0-2.687 1.163-2.687 2.656 0 1.623 1.152 2.267 2.46 2.655 1.224.372 1.804.818 1.804 1.666 0 .86-.64 1.45-1.462 1.45-.883 0-1.566-.601-1.578-1.465-.015-.388-.3-.604-.598-.604-.327 0-.626.216-.61.631.011 1.499 1.247 2.546 2.77 2.546zm6.171-3.849c.795 0 1.424-.229 1.862-.503.426-.272.595-.504.595-.76 0-.272-.2-.516-.568-.516-.441 0-.795.66-1.877.66-.952 0-1.707-.76-1.707-1.722 0-.95.725-1.724 1.635-1.724.982 0 1.508.647 1.508 1.062 0 .116-.085.174-.2.174h-1.194c-.326 0-.568.216-.568.503 0 .314.242.546.568.546h1.636c.625 0 1.009-.33 1.009-.89 0-1.408-1.194-2.512-2.774-2.512-1.566 0-2.83 1.263-2.83 2.84s1.312 2.842 2.905 2.842z" fill="#00D639"/>
  </svg>
);

const A3Logo = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="80" rx="8" fill="#E70000"/>
    <text x="150" y="52" fontFamily="Arial, sans-serif" fontSize="42" fontWeight="bold" textAnchor="middle" fill="white">a3ERP</text>
    <text x="150" y="72" fontFamily="Arial, sans-serif" fontSize="12" textAnchor="middle" fill="white" opacity="0.9">Wolters Kluwer</text>
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

