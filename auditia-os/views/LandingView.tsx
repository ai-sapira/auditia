
import React from 'react';
import { Briefcase, Users, ArrowRight, Shield, Zap, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

interface LandingViewProps {
  onSelectMode: (mode: 'auditor' | 'client') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onSelectMode }) => {
  const { t, language, setLanguage } = useLanguage();

  // Key features for the platform
  const features = [
    { icon: Zap, label: 'Automatización IA', desc: 'Tests y análisis automáticos' },
    { icon: Shield, label: 'Calidad garantizada', desc: 'Cumplimiento normativo' },
    { icon: FileText, label: 'Papeles de trabajo', desc: 'Documentación integrada' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Navigation */}
      <nav className="w-full px-12 h-20 flex items-center justify-between border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-900 rounded flex items-center justify-center">
            <span className="text-white font-serif text-lg font-bold">A</span>
          </div>
          <div>
            <span className="font-serif text-xl font-medium tracking-tight text-neutral-900">
              Auditia
            </span>
            <span className="text-neutral-400 font-sans text-xs font-light ml-1 uppercase tracking-wider">OS</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage('en')} 
            className={`text-xs font-sans font-medium transition-colors px-2 py-1 rounded ${
              language === 'en' 
                ? 'text-neutral-900 bg-neutral-100' 
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('es')} 
            className={`text-xs font-sans font-medium transition-colors px-2 py-1 rounded ${
              language === 'es' 
                ? 'text-neutral-900 bg-neutral-100' 
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            ES
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <motion.div 
          className="text-center mb-16 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-serif text-neutral-900 mb-4 leading-tight tracking-tight">
            {t('landing.welcome')}
          </h1>
          <p className="text-neutral-500 text-base font-sans max-w-xl mx-auto leading-relaxed">
            La plataforma de auditoría inteligente que automatiza tus procedimientos, 
            gestiona tus encargos y potencia tu equipo con IA.
          </p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div 
          className="flex gap-4 mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {features.map((feature, i) => (
            <div 
              key={i}
              className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-full px-5 py-2.5"
            >
              <feature.icon className="w-4 h-4 text-neutral-600" />
              <div className="text-left">
                <span className="text-xs font-medium text-neutral-900 block">{feature.label}</span>
                <span className="text-[10px] text-neutral-400">{feature.desc}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Access Cards */}
        <motion.div 
          className="grid grid-cols-2 gap-6 max-w-4xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Auditor Card */}
          <motion.div 
            onClick={() => onSelectMode('auditor')}
            className="group border border-neutral-200 rounded-lg p-8 cursor-pointer hover:border-neutral-900 transition-all duration-300 bg-white hover:shadow-xl relative overflow-hidden"
            whileHover={{ y: -4 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-neutral-900 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-neutral-100 rounded-lg flex items-center justify-center group-hover:bg-neutral-900 transition-colors duration-300">
                <Briefcase className="w-6 h-6 text-neutral-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-900 transition-colors duration-300 transform translate-x-0 group-hover:translate-x-1" />
            </div>
            
            <h2 className="text-2xl font-serif text-neutral-900 mb-2">{t('landing.auditor_role')}</h2>
            <p className="text-sm text-neutral-500 font-sans leading-relaxed mb-6">
              {t('landing.auditor_desc')}
            </p>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Dashboard</span>
              <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Encargos</span>
              <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-1 rounded">IA Agents</span>
              <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Papeles</span>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100">
              <span className="text-xs font-medium text-neutral-900 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t('landing.enter')} 
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>

          {/* Client Card */}
          <motion.div 
            onClick={() => onSelectMode('client')}
            className="group border border-neutral-200 rounded-lg p-8 cursor-pointer hover:border-[#4A5D4A] transition-all duration-300 bg-white hover:shadow-xl relative overflow-hidden"
            whileHover={{ y: -4 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#4A5D4A] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-[#F7F9F7] rounded-lg flex items-center justify-center group-hover:bg-[#4A5D4A] transition-colors duration-300">
                <Users className="w-6 h-6 text-[#4A5D4A] group-hover:text-white transition-colors duration-300" />
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-[#4A5D4A] transition-colors duration-300 transform translate-x-0 group-hover:translate-x-1" />
            </div>
            
            <h2 className="text-2xl font-serif text-neutral-900 mb-2">{t('landing.client_role')}</h2>
            <p className="text-sm text-neutral-500 font-sans leading-relaxed mb-6">
              {t('landing.client_desc')}
            </p>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Solicitudes</span>
              <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Documentos</span>
              <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-1 rounded">Mensajes</span>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100">
              <span className="text-xs font-medium text-[#4A5D4A] flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t('landing.enter')} 
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div 
          className="mt-16 flex items-center gap-8 text-neutral-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">SOC 2 Compliant</span>
          </div>
          <div className="w-px h-4 bg-neutral-200" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">GDPR Ready</span>
          </div>
          <div className="w-px h-4 bg-neutral-200" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">ISO 27001</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="h-16 flex items-center justify-center border-t border-neutral-100">
        <span className="text-[11px] text-neutral-400 font-sans">{t('landing.rights')}</span>
      </footer>
    </div>
  );
};
