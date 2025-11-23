
import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Paperclip, 
} from 'lucide-react';
import { CLIENT_TASKS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export const ClientPortalView: React.FC = () => {
  const { t } = useLanguage();
  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-001');
  const selectedTask = CLIENT_TASKS.find(t => t.id === selectedTaskId);

  return (
    <div className="flex h-full bg-white">
      {/* LEFT: Task List */}
      <div className="w-[380px] border-r border-stone-200 flex flex-col bg-white">
        <div className="px-8 py-8 border-b border-stone-100">
           <h1 className="text-2xl font-serif text-stone-900 mb-1">{t('client.inbox_title')}</h1>
           <p className="text-xs text-stone-400 font-sans tracking-wide">{t('client.inbox_subtitle')}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
           {CLIENT_TASKS.map(task => (
             <div 
               key={task.id}
               onClick={() => setSelectedTaskId(task.id)}
               className={`px-8 py-6 border-b border-stone-50 cursor-pointer transition-colors group ${selectedTaskId === task.id ? 'bg-stone-50' : 'hover:bg-white'}`}
             >
                <div className="flex justify-between items-start mb-2">
                   <span className={`text-[10px] tracking-wide px-2 py-0.5 border ${
                     task.status === 'Pending' ? 'border-amber-200 text-amber-700 bg-amber-50' :
                     task.status === 'Completed' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' :
                     'border-stone-200 text-stone-500'
                   }`}>
                      {task.status}
                   </span>
                   <span className="text-[10px] text-stone-400 font-sans">{t('client.due')} {task.dueDate}</span>
                </div>
                <h3 className={`font-serif text-sm mb-1 ${selectedTaskId === task.id ? 'text-stone-900' : 'text-stone-600 group-hover:text-stone-900'}`}>
                  {task.title}
                </h3>
                <p className="text-xs text-stone-400 font-sans">{task.area}</p>
             </div>
           ))}
        </div>
      </div>

      {/* RIGHT: Detail */}
      <div className="flex-1 flex flex-col bg-white animate-fade-in">
         {selectedTask ? (
           <>
             {/* Header */}
             <div className="px-12 py-10 border-b border-stone-100">
                <div className="flex items-center gap-3 mb-4">
                   <span className="text-xs font-sans text-stone-400 tracking-wide">{t('client.req_id')}: {selectedTask.id}</span>
                   <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                   <span className="text-xs font-sans text-stone-400 tracking-wide">{t('client.from')}: {selectedTask.requestedBy}</span>
                </div>
                <h2 className="text-3xl font-serif text-stone-900 leading-tight mb-6 max-w-2xl">
                   {selectedTask.title}
                </h2>
                <div className="bg-stone-50 p-6 border border-stone-100 max-w-3xl">
                   <p className="text-sm text-stone-600 font-light leading-relaxed">
                      {selectedTask.description}
                   </p>
                </div>
             </div>

             {/* Action Area */}
             <div className="flex-1 px-12 py-10 overflow-y-auto">
                <div className="grid grid-cols-2 gap-12 max-w-4xl">
                   
                   {/* Upload Section */}
                   <div>
                      <h3 className="font-serif text-lg text-stone-900 mb-4">{t('client.upload_title')}</h3>
                      <div className="border border-dashed border-stone-300 bg-stone-50 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-100 transition-colors group">
                         <UploadCloud className="w-8 h-8 text-stone-300 group-hover:text-stone-500 mb-3 transition-colors" />
                         <span className="text-sm font-medium text-stone-600">{t('client.drag_drop')}</span>
                         <span className="text-xs text-stone-400 mt-2">{t('client.file_types')}</span>
                      </div>
                      
                      <div className="mt-6 space-y-3">
                         <div className="flex items-center justify-between p-3 border border-stone-100">
                            <div className="flex items-center gap-3">
                               <FileText className="w-4 h-4 text-stone-400" />
                               <span className="text-xs text-stone-600">invoice_logistica_norte_jan25.pdf</span>
                            </div>
                            <span className="text-[10px] text-stone-400">{t('client.uploaded')} 2m ago</span>
                         </div>
                      </div>

                      <button className="mt-6 px-6 py-3 bg-stone-900 text-white text-xs font-medium tracking-wide hover:bg-black w-full flex items-center justify-center gap-2">
                         <CheckCircle2 className="w-4 h-4" />
                         {t('client.btn_mark_complete')}
                      </button>
                   </div>

                   {/* Communication Section */}
                   <div>
                      <h3 className="font-serif text-lg text-stone-900 mb-4">{t('client.discussion')}</h3>
                      <div className="space-y-6 mb-6">
                         <div className="flex gap-3">
                            <div className="w-6 h-6 bg-stone-200 flex items-center justify-center text-[10px] font-serif">AR</div>
                            <div>
                               <div className="text-xs font-semibold text-stone-900">Alejandro R. <span className="font-light text-stone-400 ml-2">Mar 15</span></div>
                               <p className="text-sm text-stone-600 font-light mt-1 bg-stone-50 p-3 border border-stone-100 inline-block">
                                  Hi Marta, this is a critical item for our cut-off testing. Thanks.
                               </p>
                            </div>
                         </div>
                      </div>
                      
                      <div className="relative">
                         <textarea 
                            className="w-full h-24 p-3 text-sm border border-stone-200 resize-none focus:outline-none focus:border-stone-400 placeholder:text-stone-300"
                            placeholder={t('client.placeholder_msg')}
                         ></textarea>
                         <div className="absolute bottom-3 right-3 flex gap-2">
                            <Paperclip className="w-4 h-4 text-stone-400 cursor-pointer hover:text-stone-600" />
                         </div>
                      </div>
                   </div>

                </div>
             </div>
           </>
         ) : (
           <div className="flex-1 flex items-center justify-center text-stone-300 font-serif italic">
              {t('client.select_task')}
           </div>
         )}
      </div>
    </div>
  );
};
