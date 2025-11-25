
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Users, Settings, Sparkles, Briefcase } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ViewLevel } from '../types';

interface TopNavigationProps {
  viewLevel: ViewLevel;
  selectedClient: string | null;
  onClientSelect: (clientName: string) => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ viewLevel, selectedClient, onClientSelect }) => {
  const { t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  // Close dropdown on ESC key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isDropdownOpen]);

  const handleClientClick = (clientName: string) => {
    onClientSelect(clientName);
    setIsDropdownOpen(false);
  };

  const clients = [
    { name: 'Grupo Alfa', active: selectedClient === 'Grupo Alfa' },
    { name: 'Industrias Beta', active: selectedClient === 'Industrias Beta' },
  ];

  return (
    <div className="h-16 border-b border-stone-200 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Selectors */}
      <div className="flex items-center gap-4 h-full">
        
        {/* Logo / Firm Area (Always visible or conditional based on design preference) */}
        <div className="flex items-center gap-2 px-2">
           <div className="w-6 h-6 bg-stone-900 flex items-center justify-center text-white text-[10px] font-serif">AP</div>
           <span className="text-[13px] font-serif font-bold text-stone-900 tracking-tight">Auditia<span className="font-sans font-light text-stone-400">OS</span></span>
        </div>

        <div className="h-6 w-px bg-stone-100 mx-2"></div>

        {/* Client Selector (The "Remote Control") - Enhanced */}
        <div className="relative" ref={dropdownRef}>
           <button 
              ref={buttonRef}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`
                flex items-center gap-3 px-3 py-1.5 rounded transition-colors duration-200
                ${selectedClient ? 'bg-stone-50 border border-stone-200' : 'hover:bg-stone-50 border border-transparent'}
                focus:outline-none
              `}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
           >
              <Briefcase className="w-3.5 h-3.5 text-stone-400" />
              <div className="flex flex-col items-start min-w-[120px]">
                 {selectedClient ? (
                    <>
                       <span className="text-[11px] font-medium text-stone-900 leading-tight">{selectedClient}</span>
                       <span className="text-[9px] text-stone-400 font-sans">FY 2025</span>
                    </>
                 ) : (
                    <span className="text-[12px] text-stone-500">{t('top_nav.select_client_placeholder')}</span>
                 )}
              </div>
              <ChevronDown 
                 className={`w-3 h-3 text-stone-300 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
           </button>
           
           {/* Dropdown Menu */}
           {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-stone-200 shadow-lg rounded-sm z-50 animate-fade-in overflow-hidden">
                 <div className="p-1">
                    {clients.map((client) => (
                       <button
                          key={client.name}
                          onClick={() => handleClientClick(client.name)}
                          className={`
                            w-full px-3 py-2 text-left cursor-pointer flex items-center gap-2
                            transition-colors duration-150 rounded-sm
                            ${client.active ? 'bg-stone-50' : 'hover:bg-stone-50'}
                          `}
                       >
                          <span className={`w-1.5 h-1.5 rounded-full ${client.active ? 'bg-stone-900' : 'bg-stone-300'}`}></span>
                          <span className="text-xs text-stone-700">{client.name}</span>
                       </button>
                    ))}
                 </div>
              </div>
           )}
        </div>

        {/* Engagement Context (Only visible if in Engagement Level) */}
        {viewLevel === 'engagement' && (
           <>
             <span className="text-stone-300 text-xs">/</span>
             <div className="flex items-center gap-2 px-2">
                <span className="text-[12px] font-medium text-stone-900">Auditoría 2025</span>
                <span className="px-1.5 py-0.5 bg-[#F7F9F7] text-[#4A5D4A] border border-[#E0E5E0] text-[9px] rounded-full">En curso</span>
             </div>
           </>
        )}
      </div>

      {/* Right: Actions & Indicators */}
      <div className="flex items-center gap-6">
         
         {/* Quick Actions */}
         <div className="flex items-center gap-2">
            <button className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors" title={t('top_nav.btn_invite')}>
               <Users className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors" title={t('top_nav.btn_config')}>
               <Settings className="w-4 h-4" />
            </button>
         </div>

         <div className="h-6 w-px bg-stone-100"></div>

         {/* Indicators (Only relevant inside engagement) */}
         {viewLevel === 'engagement' && (
            <div className="flex items-center gap-4">
               <div className="flex flex-col items-end">
                  <span className="text-[10px] text-stone-400 font-sans uppercase tracking-wider">Progress</span>
                  <div className="flex items-center gap-1.5">
                     <span className="text-xs font-medium text-stone-900 tabular-nums">68%</span>
                     <span className="text-[9px] text-stone-400">{t('top_nav.status_areas_closed')}</span>
                  </div>
               </div>
            </div>
         )}

         {/* AI Entry */}
         <div className="ml-2">
            <div className="w-8 h-8 bg-stone-50 rounded-full flex items-center justify-center border border-stone-200 text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all cursor-pointer">
               <Sparkles className="w-3.5 h-3.5" />
            </div>
         </div>
      </div>
    </div>
  );
};
