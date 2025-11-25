import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNavigation } from './components/TopNavigation';
import { Dashboard } from './views/Dashboard';
import { PortfolioView } from './views/PortfolioView';
import { EngagementView } from './views/EngagementView';
import { ClientPortalView } from './views/ClientPortalView';
import { LandingView } from './views/LandingView';
import { ClientOverviewView } from './views/ClientOverviewView';
import { AIAssistant } from './components/AIAssistant';

import { LogOut } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ViewLevel } from './types';

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'app'>('landing');
  
  // State for Navigation Flow
  const [userMode, setUserMode] = useState<'auditor' | 'client'>('auditor');
  const [viewLevel, setViewLevel] = useState<ViewLevel>('firm');
  
  // Selection States
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedEngagement, setSelectedEngagement] = useState<string | null>(null);
  const [activeArea, setActiveArea] = useState<string | null>('summary'); // 'summary' or '40' (Proveedores)

  // Controls specific view within a level (e.g., Dashboard vs Portfolio in Firm Level)
  const [currentModule, setCurrentModule] = useState('dashboard'); 

  const handleModeSelect = (mode: 'auditor' | 'client') => {
    setUserMode(mode);
    if (mode === 'auditor') {
      setViewLevel('firm');
      setCurrentModule('dashboard');
    } else {
      // Client mode defaults to a specific client view
      setSelectedClient('Grupo Alfa');
      setViewLevel('client');
    }
    setCurrentScreen('app');
  };

  // Logic to handle "Client Selection" from TopNav or Dashboard
  const handleClientSelect = (clientName: string) => {
    setSelectedClient(clientName);
    setViewLevel('client'); // Transition to Level 1
    // Reset downstream
    setSelectedEngagement(null);
    setActiveArea('summary');
  };

  // Logic to handle "Engagement Selection" from Client Sidebar or Dashboard
  const handleEngagementSelect = (engagementId: string) => {
    setSelectedEngagement(engagementId);
    setViewLevel('engagement'); // Transition to Level 2
    setActiveArea('summary');
  };

  const handleAreaSelect = (areaId: string) => {
    setActiveArea(areaId);
  };

  const handleBackToClient = () => {
    setViewLevel('client');
    setSelectedEngagement(null);
  };

  const handleLogout = () => {
    setCurrentScreen('landing');
    setViewLevel('firm');
    setSelectedClient(null);
    setSelectedEngagement(null);
  };

  // Render Logic based on ViewLevel
  const renderView = () => {
    if (userMode === 'client') {
      return <ClientPortalView />;
    }

    // AUDITOR MODE
    if (viewLevel === 'firm') {
      switch (currentModule) {
        case 'dashboard': return <Dashboard onNavigate={setCurrentModule} onSelectClient={handleClientSelect} />;
        case 'portfolio': return <PortfolioView onSelectClient={handleClientSelect} />;
        default: return <Dashboard onNavigate={setCurrentModule} onSelectClient={handleClientSelect} />;
      }
    }

    if (viewLevel === 'client') {
      return (
        <ClientOverviewView 
          clientName={selectedClient || 'Client'} 
          onNavigateToEngagement={handleEngagementSelect} 
        />
      );
    }

    if (viewLevel === 'engagement') {
      return <EngagementView activeArea={activeArea} onSelectArea={handleAreaSelect} />;
    }
  };

  if (currentScreen === 'landing') {
    return <LandingView onSelectMode={handleModeSelect} />;
  }

  return (
    <div className="flex h-screen w-full bg-white text-stone-900 font-sans overflow-hidden selection:bg-stone-100 selection:text-stone-900 animate-fade-in">
      {/* Sidebar - Dynamic based on ViewLevel */}
      <div className="shrink-0 relative z-20">
        <Sidebar 
          mode={userMode} 
          viewLevel={viewLevel}
          selectedClient={selectedClient}
          selectedEngagement={selectedEngagement}
          activeArea={activeArea}
          onNavigate={setCurrentModule} 
          onBackToClient={handleBackToClient}
          onSelectEngagement={handleEngagementSelect}
          onSelectArea={handleAreaSelect}
        />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative border-l border-stone-100">
        
        {/* Top Navigation - Acts as Global Selector */}
        {userMode === 'auditor' && (
          <TopNavigation 
            viewLevel={viewLevel} 
            selectedClient={selectedClient}
            onClientSelect={handleClientSelect}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth bg-white">
          {renderView()}
        </main>

        {/* Floating Actions */}
        <div className="absolute bottom-6 right-8 flex flex-col items-end gap-3 z-40">
           <button 
             onClick={handleLogout}
             className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-stone-200 shadow-sm text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-colors"
             title="Logout"
           >
             <LogOut className="w-3.5 h-3.5" />
           </button>
        </div>
      </div>

      <AIAssistant isOpen={false} onClose={() => {}} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;