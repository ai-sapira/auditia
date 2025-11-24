import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  Calendar, 
  User, 
  AlertOctagon, 
  ChevronRight,
  Filter,
  Plus,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { CLIENT_TASKS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export const EngagementRequestsView: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('All');

  return (
    <div className="flex-1 flex flex-col h-full bg-white animate-fade-in">
       {/* Header */}
       <div className="px-10 pt-10 pb-6 border-b border-stone-200">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h1 className="text-3xl font-serif text-stone-900">Solicitudes al cliente</h1>
                <p className="text-stone-400 font-sans text-sm mt-1">Gestiona y realiza seguimiento de las peticiones de información</p>
             </div>
             <button className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-md hover:bg-stone-800 transition-colors text-sm font-medium">
                <Plus className="w-4 h-4" />
                Nueva solicitud
             </button>
          </div>

          {/* Filters & Search */}
          <div className="flex justify-between items-center">
             <div className="flex gap-4">
                {['All', 'Pending', 'In Review', 'Completed'].map((status) => (
                   <button 
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors border ${
                         filter === status 
                         ? 'bg-stone-900 text-white border-stone-900' 
                         : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                      }`}
                   >
                      {status === 'All' ? 'Todos' : status}
                   </button>
                ))}
             </div>
             <div className="relative group w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar solicitud..." 
                  className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 pl-10 pr-4 text-xs text-stone-600 focus:outline-none focus:border-stone-400 transition-colors"
                />
             </div>
          </div>
       </div>

       {/* Task List */}
       <div className="flex-1 overflow-y-auto p-10">
          <div className="space-y-4 max-w-5xl">
             {CLIENT_TASKS.map((task) => (
                <div key={task.id} className="bg-white border border-stone-200 rounded-lg p-6 hover:shadow-sm transition-all group cursor-pointer">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                         <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center ${
                            task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-300'
                         }`}>
                            {task.status === 'Completed' && <CheckSquare className="w-3.5 h-3.5" />}
                         </div>
                         <div>
                            <h3 className={`text-base font-medium text-stone-900 mb-1 ${task.status === 'Completed' ? 'line-through text-stone-400' : ''}`}>
                               {task.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-stone-500">
                               <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">{task.id}</span>
                               <span>•</span>
                               <span>{task.area}</span>
                               {task.linkedFindingId && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                       <AlertOctagon className="w-3 h-3" />
                                       {task.linkedFindingId}
                                    </span>
                                  </>
                               )}
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className={`text-[10px] px-2.5 py-1 rounded-full border uppercase tracking-wider font-medium ${
                            task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            task.status === 'In Review' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            'bg-amber-50 text-amber-700 border-amber-100'
                         }`}>
                            {task.status}
                         </span>
                         <button className="p-2 hover:bg-stone-100 rounded text-stone-300 hover:text-stone-600">
                            <MoreHorizontal className="w-4 h-4" />
                         </button>
                      </div>
                   </div>

                   {task.description && (
                      <p className="text-sm text-stone-600 pl-9 mb-4 leading-relaxed max-w-3xl">
                         {task.description}
                      </p>
                   )}

                   <div className="flex items-center justify-between pl-9 pt-4 border-t border-stone-50">
                      <div className="flex items-center gap-6">
                         <div className="flex items-center gap-2 text-xs text-stone-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Due: {task.dueDate}</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs text-stone-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Req: {task.requestDate}</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs text-stone-400">
                            <User className="w-3.5 h-3.5" />
                            <span>{task.requestedBy}</span>
                         </div>
                      </div>
                      <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full bg-stone-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-stone-500">MG</div>
                         <div className="w-6 h-6 rounded-full bg-stone-900 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">AR</div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

