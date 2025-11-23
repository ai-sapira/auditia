
import React from 'react';
import { Briefcase, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingViewProps {
  onSelectMode: (mode: 'auditor' | 'client') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onSelectMode }) => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in">
      {/* Top Navigation */}
      <nav className="w-full px-12 h-24 flex items-center justify-between">
        <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
          Auditia<span className="text-stone-400 font-sans text-base font-light ml-1">OS</span>
        </span>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setLanguage('en')} 
             className={`text-xs font-sans font-medium transition-colors ${language === 'en' ? 'text-stone-900' : 'text-stone-300 hover:text-stone-500'}`}
           >
             EN
           </button>
           <div className="h-3 w-px bg-stone-200"></div>
           <button 
             onClick={() => setLanguage('es')} 
             className={`text-xs font-sans font-medium transition-colors ${language === 'es' ? 'text-stone-900' : 'text-stone-300 hover:text-stone-500'}`}
           >
             ES
           </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-16 max-w-2xl">
          <h1 className="text-5xl font-serif text-stone-900 mb-6 leading-tight">{t('landing.welcome')}</h1>
          <p className="text-stone-400 text-sm font-sans tracking-wide uppercase">{t('landing.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Auditor Card */}
          <div 
            onClick={() => onSelectMode('auditor')}
            className="group border border-stone-200 p-10 cursor-pointer hover:border-stone-900 transition-all duration-300 bg-white hover:shadow-xl"
          >
            <div className="w-12 h-12 bg-stone-50 flex items-center justify-center mb-8 group-hover:bg-stone-900 transition-colors duration-300">
               <Briefcase className="w-5 h-5 text-stone-900 group-hover:text-white" />
            </div>
            <h2 className="text-2xl font-serif text-stone-900 mb-4">{t('landing.auditor_role')}</h2>
            <p className="text-sm text-stone-500 font-sans leading-relaxed mb-8 h-12">
              {t('landing.auditor_desc')}
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              {t('landing.enter')} <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Client Card */}
          <div 
            onClick={() => onSelectMode('client')}
            className="group border border-stone-200 p-10 cursor-pointer hover:border-emerald-900 transition-all duration-300 bg-white hover:shadow-xl"
          >
            <div className="w-12 h-12 bg-stone-50 flex items-center justify-center mb-8 group-hover:bg-emerald-900 transition-colors duration-300">
               <Users className="w-5 h-5 text-stone-900 group-hover:text-white" />
            </div>
            <h2 className="text-2xl font-serif text-stone-900 mb-4">{t('landing.client_role')}</h2>
            <p className="text-sm text-stone-500 font-sans leading-relaxed mb-8 h-12">
              {t('landing.client_desc')}
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              {t('landing.enter')} <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-20 flex items-center justify-center border-t border-stone-50">
        <span className="text-[10px] text-stone-300 font-sans">{t('landing.rights')}</span>
      </footer>
    </div>
  );
};
