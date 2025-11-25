import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Clock,
  Calendar,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Star,
  Award,
  Briefcase,
  X,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: 'partner' | 'manager' | 'senior' | 'staff';
  title: string;
  email: string;
  phone?: string;
  hoursLogged: number;
  hoursAllocated: number;
  hourlyRate: number;
  tasksCompleted: number;
  tasksTotal: number;
  lastActivity: string;
  availability: 'available' | 'busy' | 'offline';
  specializations: string[];
  currentTasks: { id: string; name: string; area: string; status: string }[];
}

interface TimeEntry {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  hours: number;
  description: string;
  area: string;
  billable: boolean;
}

export const EngagementTeamView: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'team' | 'time'>('team');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      id: 'member-1',
      name: 'Elena Martínez',
      initials: 'EM',
      role: 'partner',
      title: 'Socia Responsable',
      email: 'elena.martinez@auditia.es',
      phone: '+34 612 345 678',
      hoursLogged: 12,
      hoursAllocated: 20,
      hourlyRate: 250,
      tasksCompleted: 8,
      tasksTotal: 10,
      lastActivity: 'Hace 2 horas',
      availability: 'available',
      specializations: ['Supervisión', 'Revisión final', 'Informe de auditoría'],
      currentTasks: [
        { id: 't1', name: 'Revisión informe preliminar', area: 'General', status: 'En curso' },
        { id: 't2', name: 'Reunión comité auditoría', area: 'General', status: 'Pendiente' }
      ]
    },
    {
      id: 'member-2',
      name: 'Carlos Domínguez',
      initials: 'CD',
      role: 'manager',
      title: 'Manager',
      email: 'carlos.dominguez@auditia.es',
      phone: '+34 623 456 789',
      hoursLogged: 45,
      hoursAllocated: 60,
      hourlyRate: 150,
      tasksCompleted: 22,
      tasksTotal: 28,
      lastActivity: 'Hace 30 min',
      availability: 'busy',
      specializations: ['Proveedores', 'Clientes', 'Supervisión staff'],
      currentTasks: [
        { id: 't3', name: 'Revisión hallazgos Proveedores', area: 'Proveedores', status: 'En curso' },
        { id: 't4', name: 'Circularizaciones', area: 'Proveedores', status: 'En curso' },
        { id: 't5', name: 'Supervisión muestreo', area: 'Proveedores', status: 'Pendiente' }
      ]
    },
    {
      id: 'member-3',
      name: 'Alejandro Ruiz',
      initials: 'AR',
      role: 'senior',
      title: 'Senior de Auditoría',
      email: 'alejandro.ruiz@auditia.es',
      hoursLogged: 78,
      hoursAllocated: 100,
      hourlyRate: 95,
      tasksCompleted: 35,
      tasksTotal: 42,
      lastActivity: 'Hace 15 min',
      availability: 'available',
      specializations: ['Proveedores', 'Cut-off', 'Muestreo'],
      currentTasks: [
        { id: 't6', name: 'Análisis cut-off facturas', area: 'Proveedores', status: 'En curso' },
        { id: 't7', name: 'Muestreo alternativo', area: 'Proveedores', status: 'En curso' },
        { id: 't8', name: 'Documentar hallazgo H-023', area: 'Proveedores', status: 'En curso' }
      ]
    },
    {
      id: 'member-4',
      name: 'María García',
      initials: 'MG',
      role: 'staff',
      title: 'Staff de Auditoría',
      email: 'maria.garcia@auditia.es',
      hoursLogged: 62,
      hoursAllocated: 80,
      hourlyRate: 65,
      tasksCompleted: 28,
      tasksTotal: 35,
      lastActivity: 'Hace 1 hora',
      availability: 'available',
      specializations: ['Tesorería', 'Conciliaciones', 'Soporte documental'],
      currentTasks: [
        { id: 't9', name: 'Conciliaciones bancarias', area: 'Tesorería', status: 'En curso' },
        { id: 't10', name: 'Subir documentos cliente', area: 'General', status: 'Completada' }
      ]
    },
    {
      id: 'member-5',
      name: 'Sofía López',
      initials: 'SL',
      role: 'staff',
      title: 'Staff de Auditoría',
      email: 'sofia.lopez@auditia.es',
      hoursLogged: 48,
      hoursAllocated: 60,
      hourlyRate: 65,
      tasksCompleted: 18,
      tasksTotal: 22,
      lastActivity: 'Ayer 18:30',
      availability: 'offline',
      specializations: ['Inmovilizado', 'Inventarios'],
      currentTasks: [
        { id: 't11', name: 'Revisión inmovilizado', area: 'Inmovilizado', status: 'Pendiente' }
      ]
    }
  ];

  const recentTimeEntries: TimeEntry[] = [
    { id: 'te1', memberId: 'member-3', memberName: 'Alejandro R.', date: '21/03/2025', hours: 4.5, description: 'Análisis de cut-off y revisión facturas diciembre', area: 'Proveedores', billable: true },
    { id: 'te2', memberId: 'member-3', memberName: 'Alejandro R.', date: '21/03/2025', hours: 2.0, description: 'Documentación hallazgo H-023', area: 'Proveedores', billable: true },
    { id: 'te3', memberId: 'member-2', memberName: 'Carlos D.', date: '21/03/2025', hours: 1.5, description: 'Revisión papeles de trabajo AR', area: 'Proveedores', billable: true },
    { id: 'te4', memberId: 'member-4', memberName: 'María G.', date: '21/03/2025', hours: 3.0, description: 'Conciliaciones bancarias Q4', area: 'Tesorería', billable: true },
    { id: 'te5', memberId: 'member-1', memberName: 'Elena M.', date: '20/03/2025', hours: 2.0, description: 'Reunión status con cliente', area: 'General', billable: false },
    { id: 'te6', memberId: 'member-5', memberName: 'Sofía L.', date: '20/03/2025', hours: 6.0, description: 'Revisión alta activos fijos', area: 'Inmovilizado', billable: true },
  ];

  const selectedMemberData = teamMembers.find(m => m.id === selectedMember);

  const getRoleBadge = (role: string) => {
    const styles: { [key: string]: string } = {
      partner: 'bg-neutral-900 text-white',
      manager: 'bg-neutral-700 text-white',
      senior: 'bg-neutral-200 text-neutral-700',
      staff: 'bg-neutral-100 text-neutral-600'
    };
    const labels: { [key: string]: string } = {
      partner: 'Partner',
      manager: 'Manager',
      senior: 'Senior',
      staff: 'Staff'
    };
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${styles[role]}`}>
        {labels[role]}
      </span>
    );
  };

  const getAvailabilityIndicator = (availability: string) => {
    const colors: { [key: string]: string } = {
      available: 'bg-[#4A5D4A]',
      busy: 'bg-[#8B7355]',
      offline: 'bg-neutral-300'
    };
    return <div className={`w-2 h-2 rounded-full ${colors[availability]}`} />;
  };

  // Stats
  const totalHoursLogged = teamMembers.reduce((sum, m) => sum + m.hoursLogged, 0);
  const totalHoursAllocated = teamMembers.reduce((sum, m) => sum + m.hoursAllocated, 0);
  const totalCost = teamMembers.reduce((sum, m) => sum + (m.hoursLogged * m.hourlyRate), 0);
  const utilizationRate = Math.round((totalHoursLogged / totalHoursAllocated) * 100);

  return (
    <div className="flex-1 flex h-full bg-white animate-fade-in overflow-hidden">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedMember ? 'mr-[480px]' : ''}`}>
        {/* Header */}
        <div className="px-10 pt-10 pb-6 border-b border-neutral-200 shrink-0">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-serif text-neutral-900">Equipo auditor</h1>
              <p className="text-neutral-400 font-sans text-sm mt-1">Gestión del equipo asignado al encargo</p>
            </div>
            <button 
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-800 transition-colors text-sm font-medium"
            >
              <UserPlus className="w-4 h-4" />
              Añadir miembro
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-px bg-neutral-200 rounded-lg overflow-hidden mb-6">
            <div className="bg-white p-4">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Miembros</span>
              <span className="text-2xl font-serif text-neutral-900">{teamMembers.length}</span>
            </div>
            <div className="bg-white p-4">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Horas Imputadas</span>
              <span className="text-2xl font-serif text-neutral-900">{totalHoursLogged}h</span>
            </div>
            <div className="bg-white p-4">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Presupuesto Horas</span>
              <span className="text-2xl font-serif text-neutral-900">{totalHoursAllocated}h</span>
            </div>
            <div className="bg-white p-4">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Utilización</span>
              <span className={`text-2xl font-serif ${utilizationRate > 90 ? 'text-[#8B5A50]' : utilizationRate > 70 ? 'text-[#8B7355]' : 'text-[#4A5D4A]'}`}>
                {utilizationRate}%
              </span>
            </div>
            <div className="bg-white p-4">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Coste Acumulado</span>
              <span className="text-2xl font-serif text-neutral-900">€{totalCost.toLocaleString()}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('team')}
              className={`text-xs font-medium px-4 py-2 rounded-full transition-colors border ${
                viewMode === 'team' 
                  ? 'bg-neutral-900 text-white border-neutral-900' 
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                Equipo
              </span>
            </button>
            <button 
              onClick={() => setViewMode('time')}
              className={`text-xs font-medium px-4 py-2 rounded-full transition-colors border ${
                viewMode === 'time' 
                  ? 'bg-neutral-900 text-white border-neutral-900' 
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Imputaciones
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10">
          {viewMode === 'team' ? (
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white border rounded-lg p-5 hover:shadow-sm transition-all cursor-pointer group ${
                    selectedMember === member.id ? 'border-neutral-900 shadow-sm' : 'border-neutral-200'
                  }`}
                  onClick={() => setSelectedMember(member.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-serif text-neutral-700">
                          {member.initials}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-white rounded-full">
                          {getAvailabilityIndicator(member.availability)}
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-neutral-900">{member.name}</h3>
                          {getRoleBadge(member.role)}
                        </div>
                        <p className="text-xs text-neutral-500 mb-2">{member.title}</p>
                        <div className="flex items-center gap-4 text-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {member.hoursLogged}h / {member.hoursAllocated}h
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {member.tasksCompleted}/{member.tasksTotal} tareas
                          </span>
                          <span>{member.lastActivity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="text-right">
                      <div className="text-xs text-neutral-400 mb-1">Utilización</div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              (member.hoursLogged / member.hoursAllocated) > 0.9 ? 'bg-[#8B5A50]' : 
                              (member.hoursLogged / member.hoursAllocated) > 0.7 ? 'bg-[#8B7355]' : 
                              'bg-[#4A5D4A]'
                            }`}
                            style={{ width: `${Math.min((member.hoursLogged / member.hoursAllocated) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-neutral-600">
                          {Math.round((member.hoursLogged / member.hoursAllocated) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr className="text-[10px] text-neutral-500 uppercase tracking-wider">
                    <th className="text-left px-4 py-3 font-medium">Miembro</th>
                    <th className="text-left px-4 py-3 font-medium">Fecha</th>
                    <th className="text-left px-4 py-3 font-medium">Descripción</th>
                    <th className="text-left px-4 py-3 font-medium">Área</th>
                    <th className="text-right px-4 py-3 font-medium">Horas</th>
                    <th className="text-center px-4 py-3 font-medium">Facturable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentTimeEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900">{entry.memberName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-neutral-500">{entry.date}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-neutral-700">{entry.description}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                          {entry.area}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-mono text-neutral-900">{entry.hours}h</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {entry.billable ? (
                          <CheckCircle2 className="w-4 h-4 text-[#4A5D4A] mx-auto" />
                        ) : (
                          <span className="text-[10px] text-neutral-400">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Sidebar */}
      <AnimatePresence>
        {selectedMember && selectedMemberData && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-[480px] bg-white border-l border-neutral-200 shadow-2xl z-40 flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-neutral-200 flex justify-between items-start shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-serif text-lg text-neutral-700">
                    {selectedMemberData.initials}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-white rounded-full">
                    {getAvailabilityIndicator(selectedMemberData.availability)}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-serif text-neutral-900">{selectedMemberData.name}</h2>
                    {getRoleBadge(selectedMemberData.role)}
                  </div>
                  <p className="text-xs text-neutral-500">{selectedMemberData.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Contact */}
              <div>
                <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Contacto</h3>
                <div className="space-y-2">
                  <a href={`mailto:${selectedMemberData.email}`} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm text-neutral-700">{selectedMemberData.email}</span>
                  </a>
                  {selectedMemberData.phone && (
                    <a href={`tel:${selectedMemberData.phone}`} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                      <Phone className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-700">{selectedMemberData.phone}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Métricas</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-neutral-400 uppercase">Horas</span>
                      <Clock className="w-3.5 h-3.5 text-neutral-300" />
                    </div>
                    <div className="text-xl font-serif text-neutral-900">{selectedMemberData.hoursLogged}h</div>
                    <div className="text-[10px] text-neutral-500">de {selectedMemberData.hoursAllocated}h asignadas</div>
                    <div className="mt-2 w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-neutral-900 rounded-full"
                        style={{ width: `${Math.min((selectedMemberData.hoursLogged / selectedMemberData.hoursAllocated) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-neutral-400 uppercase">Tareas</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-300" />
                    </div>
                    <div className="text-xl font-serif text-neutral-900">{selectedMemberData.tasksCompleted}</div>
                    <div className="text-[10px] text-neutral-500">de {selectedMemberData.tasksTotal} asignadas</div>
                    <div className="mt-2 w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#4A5D4A] rounded-full"
                        style={{ width: `${(selectedMemberData.tasksCompleted / selectedMemberData.tasksTotal) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-neutral-400 uppercase">Tarifa</span>
                      <BarChart3 className="w-3.5 h-3.5 text-neutral-300" />
                    </div>
                    <div className="text-xl font-serif text-neutral-900">€{selectedMemberData.hourlyRate}</div>
                    <div className="text-[10px] text-neutral-500">por hora</div>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-neutral-400 uppercase">Coste</span>
                      <TrendingUp className="w-3.5 h-3.5 text-neutral-300" />
                    </div>
                    <div className="text-xl font-serif text-neutral-900">€{(selectedMemberData.hoursLogged * selectedMemberData.hourlyRate).toLocaleString()}</div>
                    <div className="text-[10px] text-neutral-500">acumulado</div>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Especialización</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMemberData.specializations.map((spec, i) => (
                    <span key={i} className="text-xs px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full border border-neutral-200">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Tasks */}
              <div>
                <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Tareas Actuales</h3>
                <div className="space-y-2">
                  {selectedMemberData.currentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <div className="text-sm text-neutral-900">{task.name}</div>
                        <div className="text-[10px] text-neutral-400">{task.area}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${
                        task.status === 'Completada' ? 'bg-[#E8EDE8] text-[#4A5D4A]' :
                        task.status === 'En curso' ? 'bg-[#F7F9FA] text-[#4A5D6A]' :
                        'bg-neutral-100 text-neutral-600'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-neutral-200 shrink-0 bg-neutral-50">
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Enviar mensaje
                </button>
                <button className="px-4 py-2 border border-neutral-200 text-neutral-600 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

