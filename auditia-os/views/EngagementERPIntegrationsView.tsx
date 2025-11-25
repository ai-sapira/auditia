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
  connected: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
  disconnected: { bg: 'bg-stone-50', text: 'text-stone-500', border: 'border-stone-200', icon: XCircle },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock }
};

const logoColors: { [key: string]: string } = {
  SAP: 'bg-blue-600',
  SAGE: 'bg-green-600',
  A3: 'bg-violet-600'
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
    <div className="flex-1 bg-stone-50/50 p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-stone-900">Integraciones ERP</h1>
              <p className="text-sm text-stone-500">Conecta con los sistemas del cliente para extracción automática de datos</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-stone-200 rounded-sm p-4">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Conectados</div>
            <div className="text-2xl font-serif text-emerald-600">
              {integrations.filter(i => i.status === 'connected').length}
            </div>
          </div>
          <div className="bg-white border border-stone-200 rounded-sm p-4">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Pendientes</div>
            <div className="text-2xl font-serif text-amber-600">
              {integrations.filter(i => i.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white border border-stone-200 rounded-sm p-4">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Disponibles</div>
            <div className="text-2xl font-serif text-stone-600">
              {integrations.length}
            </div>
          </div>
          <div className="bg-white border border-stone-200 rounded-sm p-4">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Última Sincronización</div>
            <div className="text-sm font-mono text-stone-600">
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
                      ? 'border-stone-900 shadow-md ring-1 ring-stone-900' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className={`w-14 h-14 rounded-lg ${logoColors[erp.logo]} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                        {erp.logo}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-serif text-stone-900">{erp.name}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium inline-flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                            <StatusIcon className="w-3 h-3" />
                            {erp.status === 'connected' ? 'Conectado' : erp.status === 'pending' ? 'Pendiente' : 'Desconectado'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mb-3">{erp.description}</p>
                        
                        {/* Modules */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {erp.modules.map(mod => (
                            <span key={mod} className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-600 rounded border border-stone-200">
                              {mod}
                            </span>
                          ))}
                        </div>

                        {erp.lastSync && (
                          <div className="mt-3 text-[10px] text-stone-400 flex items-center gap-1">
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
                            className="px-3 py-1.5 text-xs font-medium bg-stone-100 text-stone-700 rounded hover:bg-stone-200 transition-colors inline-flex items-center gap-1.5"
                          >
                            <RefreshCw className={`w-3 h-3 ${isConnecting ? 'animate-spin' : ''}`} />
                            Sincronizar
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); setShowConfigModal(true); setSelectedERP(erp.id); }}
                            className="px-3 py-1.5 text-xs font-medium bg-white border border-stone-200 text-stone-700 rounded hover:bg-stone-50 transition-colors inline-flex items-center gap-1.5"
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
                              ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                              : 'bg-stone-900 text-white hover:bg-black'
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
                  className="bg-white border border-stone-200 rounded-sm sticky top-8"
                >
                  {/* Detail Header */}
                  <div className="px-5 py-4 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${logoColors[selectedIntegration.logo]} flex items-center justify-center text-white font-bold text-sm`}>
                        {selectedIntegration.logo}
                      </div>
                      <div>
                        <h3 className="text-sm font-serif text-stone-900">{selectedIntegration.name}</h3>
                        <span className={`text-[10px] ${statusColors[selectedIntegration.status].text}`}>
                          {selectedIntegration.status === 'connected' ? 'Conectado' : selectedIntegration.status === 'pending' ? 'Configuración pendiente' : 'No conectado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-5">
                    <h4 className="text-[10px] text-stone-400 uppercase tracking-wider mb-3">Funcionalidades disponibles</h4>
                    <div className="space-y-2">
                      {selectedIntegration.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-600">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${selectedIntegration.status === 'connected' ? 'text-emerald-500' : 'text-stone-300'}`} />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="px-5 py-4 bg-stone-50 border-t border-stone-100">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-stone-400 mt-0.5" />
                      <div>
                        <h4 className="text-[10px] font-medium text-stone-700 mb-1">Conexión segura</h4>
                        <p className="text-[10px] text-stone-500">
                          Todas las conexiones utilizan OAuth 2.0 y cifrado TLS 1.3. Los datos se transfieren de forma segura y no se almacenan localmente.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedIntegration.status === 'connected' && (
                    <div className="px-5 py-4 border-t border-stone-100">
                      <button
                        onClick={() => handleDisconnect(selectedIntegration.id)}
                        className="w-full px-3 py-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 transition-colors inline-flex items-center justify-center gap-1.5"
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
                  className="bg-white border border-dashed border-stone-200 rounded-sm p-8 text-center"
                >
                  <Server className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-sm text-stone-500 mb-1">Selecciona una integración</p>
                  <p className="text-xs text-stone-400">Haz clic en un ERP para ver sus detalles y opciones de configuración</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Help Card */}
            <div className="mt-4 bg-violet-50 border border-violet-100 rounded-sm p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-violet-600 mt-0.5" />
                <div>
                  <h4 className="text-xs font-medium text-violet-800 mb-1">¿Necesitas otro ERP?</h4>
                  <p className="text-[10px] text-violet-600 mb-2">
                    Podemos integrar prácticamente cualquier sistema. Contacta con soporte para solicitar una nueva integración.
                  </p>
                  <button className="text-[10px] font-medium text-violet-700 hover:text-violet-900 inline-flex items-center gap-1">
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
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowConfigModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-sm shadow-2xl border border-stone-200 max-w-lg w-full"
              >
                <div className="px-6 py-5 border-b border-stone-100">
                  <h3 className="text-lg font-serif text-stone-900">Configuración de {selectedIntegration.name}</h3>
                  <p className="text-xs text-stone-500">Ajusta los parámetros de sincronización</p>
                </div>

                <div className="p-6 space-y-5">
                  {/* Sync Frequency */}
                  <div>
                    <label className="text-[10px] text-stone-500 uppercase tracking-wider mb-2 block">Frecuencia de sincronización</label>
                    <select className="w-full px-3 py-2 border border-stone-200 rounded text-sm text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900">
                      <option>Cada hora</option>
                      <option>Cada 6 horas</option>
                      <option>Diaria</option>
                      <option>Manual</option>
                    </select>
                  </div>

                  {/* Modules */}
                  <div>
                    <label className="text-[10px] text-stone-500 uppercase tracking-wider mb-2 block">Módulos a sincronizar</label>
                    <div className="space-y-2">
                      {selectedIntegration.modules.map((mod, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded border-stone-300 text-stone-900 focus:ring-stone-900" />
                          <span className="text-sm text-stone-700">{mod}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* API Settings */}
                  <div>
                    <label className="text-[10px] text-stone-500 uppercase tracking-wider mb-2 block">Configuración de API</label>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="URL del servidor" 
                        defaultValue={selectedIntegration.id === 'sap' ? 'https://sap.grupocliente.com/api' : ''}
                        className="w-full px-3 py-2 border border-stone-200 rounded text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-900 placeholder:text-stone-300"
                      />
                      <input 
                        type="password" 
                        placeholder="API Key" 
                        defaultValue="••••••••••••••••"
                        className="w-full px-3 py-2 border border-stone-200 rounded text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-900 placeholder:text-stone-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 text-sm font-medium bg-stone-900 text-white rounded hover:bg-black transition-colors"
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

