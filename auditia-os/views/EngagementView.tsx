import React, { useState } from 'react';
import { TimelineEvent } from '../types';
import { EngagementRequestsView } from './EngagementRequestsView';
import { EngagementMessagesView } from './EngagementMessagesView';
import { EngagementDocumentsView } from './EngagementDocumentsView';
import { EngagementERPIntegrationsView } from './EngagementERPIntegrationsView';
import { EngagementOverview } from '../components/engagement/EngagementOverview';
import { EngagementAreaDetail } from '../components/engagement/EngagementAreaDetail';

interface EngagementViewProps {
  activeArea: string | null; // 'summary' or '40' (Proveedores)
  onSelectArea?: (areaId: string) => void;
}

export const EngagementView: React.FC<EngagementViewProps> = ({ activeArea, onSelectArea }) => {
  const [showTimeline, setShowTimeline] = useState(false); 

  const progressData = [
    { name: 'Completed', value: 68, color: '#1c1917' }, 
    { name: 'Remaining', value: 32, color: '#e5e5e5' }, 
  ];

  const timeline: TimelineEvent[] = [
     { id: 'tl-1', type: 'agent', title: 'Reconciler executed', timestamp: '2h ago', description: 'Detected 3 material discrepancies in Suppliers.', user: 'System' },
     { id: 'tl-2', type: 'override', title: 'Manual Override', timestamp: '4h ago', description: 'Marked H-004 as immaterial based on supporting docs.', user: 'Alejandro R.' },
  ];

  // --- ROUTING TO NEW VIEWS ---
  if (activeArea === 'client-requests') {
    return <EngagementRequestsView />;
  }

  if (activeArea === 'messages') {
    return <EngagementMessagesView />;
  }

  if (activeArea === 'documents') {
    return <EngagementDocumentsView />;
  }

  if (activeArea === 'erp-integrations') {
    return <EngagementERPIntegrationsView />;
  }

  // --- RENDER: OVERVIEW (Section 1) ---
  if (activeArea === 'summary') {
    return (
      <EngagementOverview 
        showTimeline={showTimeline} 
        setShowTimeline={setShowTimeline} 
        progressData={progressData}
        timeline={timeline}
        onSelectArea={onSelectArea}
      />
    );
  }

  // --- RENDER: AREA DETAIL (Default / Section 3) ---
  return (
    <EngagementAreaDetail 
      showTimeline={showTimeline} 
      setShowTimeline={setShowTimeline} 
    />
  );
};
