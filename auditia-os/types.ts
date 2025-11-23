
export enum EngagementStatus {
  PLANNING = 'Planificación',
  FIELDWORK = 'Trabajo de Campo',
  REVIEW = 'Revisión',
  CLOSED = 'Cerrado'
}

export type PipelineStage = 'not_started' | 'ingestion' | 'testing' | 'review' | 'closed';

export enum RiskLevel {
  LOW = 'Bajo',
  MEDIUM = 'Medio',
  HIGH = 'Alto',
  CRITICAL = 'Crítico'
}

export enum AgentStatus {
  IDLE = 'En espera',
  RUNNING = 'Ejecutando',
  COMPLETED = 'Completado',
  FAILED = 'Fallido',
  NEEDS_REVIEW = 'Revisión Manual'
}

// Navigation Levels
export type ViewLevel = 'firm' | 'client' | 'engagement';

export interface Client {
  id: string;
  name: string;
  sector: string;
  fiscalYear: string;
  risk: RiskLevel;
}

export interface Engagement {
  id: string;
  clientId: string;
  clientName: string;
  year: number;
  status: EngagementStatus;
  progress: number; // 0-100
  dueDate: string;
  team: {
    partner: string;
    manager: string;
    senior: string;
  };
}

export interface PipelineEngagement {
  id: string;
  client: string;
  stage: PipelineStage;
  partner: string;
  manager: string;
  startDate: string;
  endDate: string;
  risk: 'low' | 'medium' | 'high';
}

export interface Finding {
  id: string;
  code: string;
  area: string; // e.g., "Proveedores"
  description: string;
  amount: number;
  isMaterial: boolean;
  status: 'Abierto' | 'Cerrado' | 'Pendiente Cliente';
  detectedBy: string; // Agent name
}

export interface AgentRun {
  id: string;
  agentName: string;
  area: string;
  status: AgentStatus;
  lastRun: string;
  findingsCount: number;
  coverage: number; // % of population analyzed
}

export interface ClientTask {
  id: string;
  title: string;
  area: string;
  dueDate: string;
  status: 'Pending' | 'In Review' | 'Completed';
  linkedFindingId?: string;
  description?: string;
  requestDate: string;
  requestedBy: string;
}

export interface Alert {
  id: string;
  type: 'delay' | 'quality' | 'anomaly';
  message: string;
  entity: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
}

export interface TimelineEvent {
  id: string;
  type: 'agent' | 'override' | 'comment' | 'status';
  title: string;
  description: string;
  user?: string;
  timestamp: string;
}

export interface EngagementArea {
  id: string;
  code: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'review' | 'closed';
  isActive: boolean; // For demo purposes, only Suppliers is active
}
