import { Engagement, EngagementStatus, RiskLevel, Finding, AgentRun, AgentStatus, ClientTask } from './types';

export const CURRENT_USER = {
  name: "Alejandro Ruiz",
  role: "Senior Auditor",
  firm: "Auditia Partners S.L."
};

export const CLIENT_USER = {
  name: "Marta Garcia",
  role: "CFO",
  company: "Grupo Alfa"
};

export const ENGAGEMENTS: Engagement[] = [
  {
    id: 'eng-001',
    clientId: 'cli-001',
    clientName: 'Grupo Alfa',
    year: 2025,
    status: EngagementStatus.FIELDWORK,
    progress: 68,
    dueDate: '2025-03-30',
    team: { partner: 'Elena M.', manager: 'Carlos D.', senior: 'Alejandro R.' }
  },
  {
    id: 'eng-002',
    clientId: 'cli-002',
    clientName: 'Industrias Beta S.A.',
    year: 2025,
    status: EngagementStatus.PLANNING,
    progress: 15,
    dueDate: '2025-04-15',
    team: { partner: 'Elena M.', manager: 'Sofia L.', senior: 'Alejandro R.' }
  },
  {
    id: 'eng-003',
    clientId: 'cli-003',
    clientName: 'Tech Solutions SL',
    year: 2024,
    status: EngagementStatus.REVIEW,
    progress: 92,
    dueDate: '2025-02-28',
    team: { partner: 'Javier P.', manager: 'Carlos D.', senior: 'Maria F.' }
  }
];

export const FINDINGS_ALFA: Finding[] = [
  {
    id: 'f-001',
    code: 'H-023',
    area: 'Proveedores',
    description: 'Posible corte de operaciones (cut-off) incorrecto. Facturas de Enero registradas en Diciembre.',
    amount: 27000,
    isMaterial: true,
    status: 'Pendiente Cliente',
    detectedBy: 'UnrecordedExpenseHunter'
  },
  {
    id: 'f-002',
    code: 'H-031',
    area: 'Proveedores',
    description: 'Pagos sin registro contable asociado en libro mayor.',
    amount: 18000,
    isMaterial: true,
    status: 'Abierto',
    detectedBy: 'PaymentTracer'
  },
  {
    id: 'f-003',
    code: 'H-040',
    area: 'Bancos',
    description: 'Diferencia de conciliación no explicada < materialidad.',
    amount: 2000,
    isMaterial: false,
    status: 'Cerrado',
    detectedBy: 'Reconciler'
  }
];

export const AGENTS_ALFA: AgentRun[] = [
  {
    id: 'ag-001',
    agentName: 'MaterialityChecker',
    area: 'Global',
    status: AgentStatus.COMPLETED,
    lastRun: '14/03 18:21',
    findingsCount: 0,
    coverage: 100
  },
  {
    id: 'ag-002',
    agentName: 'Reconciler',
    area: 'Proveedores',
    status: AgentStatus.NEEDS_REVIEW,
    lastRun: '15/03 09:00',
    findingsCount: 3,
    coverage: 100
  },
  {
    id: 'ag-003',
    agentName: 'Circularizer',
    area: 'Proveedores',
    status: AgentStatus.RUNNING,
    lastRun: 'En curso...',
    findingsCount: 0,
    coverage: 45
  },
  {
    id: 'ag-004',
    agentName: 'UnrecordedExpenseHunter',
    area: 'Gastos',
    status: AgentStatus.IDLE,
    lastRun: 'Pendiente',
    findingsCount: 0,
    coverage: 0
  }
];

export const CLIENT_TASKS: ClientTask[] = [
  {
    id: 'task-001',
    title: 'Clarify cut-off deviation (H-023)',
    area: 'Suppliers (AP)',
    dueDate: 'Mar 20',
    status: 'Pending',
    linkedFindingId: 'f-001',
    description: 'We identified invoices totaling €27,000 dated January 2025 that were recorded in December 2024. Please review and provide delivery notes for Logística Norte S.L. to confirm transfer of risk.',
    requestDate: 'Mar 15',
    requestedBy: 'Alejandro R.'
  },
  {
    id: 'task-002',
    title: 'Upload Bank Statements - Q1',
    area: 'Treasury',
    dueDate: 'Mar 22',
    status: 'Pending',
    requestDate: 'Mar 14',
    requestedBy: 'Sofia L.'
  },
  {
    id: 'task-003',
    title: 'Confirm Payroll Tax Payment',
    area: 'HR / Payroll',
    dueDate: 'Mar 18',
    status: 'Completed',
    requestDate: 'Mar 10',
    requestedBy: 'Carlos D.'
  }
];

export const CHAT_HISTORY_MOCK = [
  {
    id: 1,
    sender: 'user',
    text: 'Resúmeme los hallazgos críticos del área de Proveedores para Grupo Alfa.'
  },
  {
    id: 2,
    sender: 'ai',
    text: 'En el área de **Proveedores** de Grupo Alfa, he detectado **2 hallazgos materiales** pendientes de resolución:\n\n1. **H-023**: Posible error de cut-off por 27.000€. Se detectaron facturas de servicios de Enero 2025 contabilizadas en 2024.\n2. **H-031**: Pagos por 18.000€ sin factura asociada en el ERP.\n\n¿Quieres que redacte un correo al cliente solicitando evidencias?'
  }
];