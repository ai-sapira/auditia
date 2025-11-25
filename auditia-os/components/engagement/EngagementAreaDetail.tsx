import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  PanelRightClose, 
  AlertOctagon, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Download, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  MessageSquare, 
  FileText, 
  MoreHorizontal,
  Play,
  AlertTriangle,
  Scale,
  MapPin,
  Mail,
  ClipboardCheck,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  PenTool,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { FINDINGS_ALFA } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { EngagementReconciler } from './EngagementReconciler';
import { EngagementRiskMapper } from './EngagementRiskMapper';
import { EngagementCircularizer } from './EngagementCircularizer';
import { EngagementTester } from './EngagementTester';
import { EngagementFindings } from './EngagementFindings';
import { EngagementAnalyticalReview } from './EngagementAnalyticalReview';
import { EngagementConclusionsWriter } from './EngagementConclusionsWriter';

interface EngagementAreaDetailProps {
  showTimeline: boolean;
  setShowTimeline: (show: boolean) => void;
}

export const EngagementAreaDetail: React.FC<EngagementAreaDetailProps> = ({ showTimeline, setShowTimeline }) => {
  const { t } = useLanguage();
  
  // Tab State
  const [activeTab, setActiveTab] = useState('data');
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [isFindingsSidebarOpen, setIsFindingsSidebarOpen] = useState(false);
  const [selectedPapersTool, setSelectedPapersTool] = useState<'list' | 'analytical' | 'conclusions'>('list');
  
  // Test Selection State
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [testExecutionStates, setTestExecutionStates] = useState<{
    [key: string]: 'not_executed' | 'running' | 'completed' | 'completed_with_issues';
  }>({
    reconciler: 'not_executed',
    riskmapper: 'not_executed',
    circularizer: 'not_executed',
    tester: 'not_executed',
  });
  
  const [testLastRun, setTestLastRun] = useState<{
      [key: string]: string | null;
  }>({
      reconciler: null,
      riskmapper: null,
      circularizer: null,
      tester: null,
  });

  // Execution plan modal state
  const [showExecutionPlanModal, setShowExecutionPlanModal] = useState(false);
  const [pendingTestId, setPendingTestId] = useState<string | null>(null);

  // Test execution plans data
  const testPlans: { [key: string]: { title: string; description: string; steps: string[]; duration: string; requirements: string[] } } = {
    reconciler: {
      title: 'Cuadre básico de Proveedores',
      description: 'Esta prueba compara los totales de los tres ficheros cargados (submayor, libro mayor y balance de cierre) para identificar posibles descuadres.',
      steps: [
        'Calcular suma total de movimientos del submayor',
        'Obtener saldo del libro mayor para cuenta 400/410',
        'Comparar con el saldo de cierre declarado',
        'Identificar diferencias y generar informe de incidencias',
        'Clasificar discrepancias por materialidad'
      ],
      duration: '~30 segundos',
      requirements: ['Submayor cargado', 'Libro mayor cargado', 'Saldo de cierre cargado']
    },
    circularizer: {
      title: 'Circularizaciones proveedores',
      description: 'Selecciona automáticamente los proveedores más relevantes para enviar cartas de confirmación basándose en el riesgo y volumen de transacciones.',
      steps: [
        'Analizar proveedores por volumen de transacciones',
        'Evaluar factores de riesgo por proveedor',
        'Aplicar criterios de selección (materialidad, antigüedad)',
        'Generar lista de proveedores a circularizar',
        'Preparar borradores de cartas de confirmación'
      ],
      duration: '~45 segundos',
      requirements: ['Mapa de riesgos completado', 'Datos de proveedores actualizados']
    },
    tester: {
      title: 'Muestreo proveedores',
      description: 'Selecciona una muestra estadísticamente representativa de facturas de proveedores para revisión documental manual.',
      steps: [
        'Determinar tamaño de muestra según materialidad',
        'Aplicar método de muestreo (MUS o aleatorio estratificado)',
        'Seleccionar partidas específicas para revisión',
        'Generar lista de documentación a solicitar',
        'Crear checklist de validación por factura'
      ],
      duration: '~20 segundos',
      requirements: ['Listado de facturas disponible', 'Umbral de materialidad definido']
    }
  };

  // Handler to open execution plan modal
  const handleOpenExecutionPlan = (testId: string) => {
    setPendingTestId(testId);
    setShowExecutionPlanModal(true);
  };

  // Handler to confirm and run the test
  const handleConfirmExecution = () => {
    if (pendingTestId) {
      handleTestRun(pendingTestId);
      setShowExecutionPlanModal(false);
      setPendingTestId(null);
    }
  };

  // Data Tab States
  const [showMaterialityDetails, setShowMaterialityDetails] = useState(false);
  // Libro mayor y saldo de cierre ya subidos desde onboarding
  const [fileStates, setFileStates] = useState<{
    movements: 'pending' | 'uploading' | 'processing' | 'uploaded' | 'error';
    ledger: 'pending' | 'uploading' | 'processing' | 'uploaded' | 'error';
    closing: 'pending' | 'uploading' | 'processing' | 'uploaded' | 'error';
  }>({
    movements: 'pending',   // Submayor (GL Details) - pendiente de subir
    ledger: 'uploaded',     // Libro mayor - ya subido desde onboarding
    closing: 'uploaded'     // Saldo de cierre - ya subido desde onboarding
  });
  
  // File errors and preview states
  const [fileErrors, setFileErrors] = useState<{
    movements: string[];
    ledger: string[];
    closing: string[];
  }>({
    movements: [],
    ledger: [],
    closing: []
  });
  
  const [filePreviewData, setFilePreviewData] = useState<{
    movements: any[] | null;
    ledger: any[] | null;
    closing: any[] | null;
  }>({
    movements: null,
    ledger: null,
    closing: null
  });
  
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFileType, setPreviewFileType] = useState<'movements' | 'ledger' | 'closing' | null>(null);
  const [previewPage, setPreviewPage] = useState(1);
  const [previousFileState, setPreviousFileState] = useState<'pending' | 'uploading' | 'processing' | 'uploaded' | 'error' | null>(null);
  const ITEMS_PER_PAGE = 10;
  
  // Table search and pagination states
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [tablePage, setTablePage] = useState(1);
  const TABLE_ITEMS_PER_PAGE = 20;
  
  const [expandedErrors, setExpandedErrors] = useState<{
    movements: boolean;
    ledger: boolean;
    closing: boolean;
  }>({
    movements: false,
    ledger: false,
    closing: false
  });
  
  // Store generated data counts to ensure consistency
  // Pre-populated with data from onboarding (ledger + closing)
  const [fileDataCounts, setFileDataCounts] = useState<{
    movements: number;
    ledger: number;
    closing: number;
  }>({
    movements: 0,      // Submayor (GL Details) - pendiente de subir
    ledger: 847,       // Libro mayor cargado desde onboarding
    closing: 245       // Saldo de cierre cargado desde onboarding
  });
  
  // Store balance amounts for reconciliation check
  // Saldos de cada fichero para verificar cuadre
  const [fileBalances, setFileBalances] = useState<{
    movements: number;    // Suma total del submayor
    ledger: number;       // Saldo del libro mayor 400/410
    closing: number;      // Saldo del balance de cierre
  }>({
    movements: 0,         // Se calculará cuando se suba el fichero
    ledger: 18890000,     // 18.89 M€ - cargado desde onboarding
    closing: 18890000     // 18.89 M€ - cargado desde onboarding (cuadra con mayor)
  });
  
  const [isGlobalProcessing, setIsGlobalProcessing] = useState(false);
  const [globalProcessingStage, setGlobalProcessingStage] = useState<string | null>(null);
  
  // Progressive component loading states
  const [loadedComponents, setLoadedComponents] = useState<{
    materialityKPI: boolean;
    basicKPIs: boolean;
    previewTable: boolean;
    timeline: boolean;
  }>({
    materialityKPI: false,
    basicKPIs: false,
    previewTable: false,
    timeline: false,
  });

  // Constants
  const materialityThreshold = 900000;
  const papers = [
    { id: 'WP-AP-01', name: 'Lead Schedule - Accounts Payable', status: 'final', date: '15/03/2025' },
    { id: 'WP-AP-02', name: 'Search for Unrecorded Liabilities', status: 'review', date: '14/03/2025' },
  ];

  // Computed
  const allFilesUploaded = fileStates.movements === 'uploaded' && 
                          fileStates.ledger === 'uploaded' && 
                          fileStates.closing === 'uploaded';
                          
  const allComponentsLoaded = loadedComponents.previewTable;
                          
  const dataStatus = (allFilesUploaded && globalProcessingStage === 'completed' && allComponentsLoaded) ? 'loaded' : 'pending';
  
  // Calculate if balances match (only meaningful when all files are uploaded)
  const balancesMatch = allFilesUploaded && 
    fileBalances.movements === fileBalances.ledger && 
    fileBalances.ledger === fileBalances.closing;
  
  // Calculate differences for display
  const diffMovementsVsLedger = fileBalances.movements - fileBalances.ledger;
  const diffLedgerVsClosing = fileBalances.ledger - fileBalances.closing;

  // Handlers
  const handleFileUpload = (fileType: 'movements' | 'ledger' | 'closing', skipPreview = false) => {
    setFileStates(prev => ({ ...prev, [fileType]: 'uploading' }));
    
    setTimeout(() => {
        setFileStates(prev => ({ ...prev, [fileType]: 'processing' }));
        setTimeout(() => {
            // Simulate file validation - only show errors on first upload of movements file
            // After retry, it should pass validation
            const isFirstMovementsUpload = fileType === 'movements' && fileStates.movements === 'pending';
            const hasErrors = isFirstMovementsUpload && fileErrors.movements.length === 0;
            
            if (hasErrors) {
                // Generate sample errors for first upload
                const errors = [
                    'Falta columna: "Fecha"',
                    'Tipo incorrecto en "Importe" (esperado numérico)',
                    'Fila 15: Valor vacío en columna "Cuenta"'
                ];
                setFileErrors(prev => ({ ...prev, [fileType]: errors }));
                
                // Generate preview data even with errors
                const previewData = generatePreviewData(fileType);
                setFilePreviewData(prev => ({ ...prev, [fileType]: previewData }));
                setFileDataCounts(prev => ({ ...prev, [fileType]: previewData.length }));
                
                // Calculate and store balance for movements
                if (fileType === 'movements') {
                    const totalBalance = previewData.reduce((sum, row) => sum + (row.importe || 0), 0);
                    // Simulate a slight mismatch to show reconciliation issue
                    setFileBalances(prev => ({ ...prev, movements: 18875000 })); // ~15k difference
                }
                
                setFileStates(prev => ({ ...prev, [fileType]: 'error' }));
            } else {
                // Clear any previous errors
                setFileErrors(prev => ({ ...prev, [fileType]: [] }));
                
                // Generate preview data
                const previewData = generatePreviewData(fileType);
                setFilePreviewData(prev => ({ ...prev, [fileType]: previewData }));
                setFileDataCounts(prev => ({ ...prev, [fileType]: previewData.length }));
                
                // Calculate and store balance for movements
                if (fileType === 'movements') {
                    // Simulate the total balance matching ledger and closing
                    setFileBalances(prev => ({ ...prev, movements: 18890000 })); // Cuadra perfectamente
                }
                
                if (skipPreview) {
                setFileStates(prev => ({ ...prev, [fileType]: 'uploaded' }));
                } else {
                    // Save current state before showing preview
                    setPreviousFileState(fileStates[fileType]);
                    // Show preview modal before uploading
                    setPreviewFileType(fileType);
                    setShowPreviewModal(true);
                    setFileStates(prev => ({ ...prev, [fileType]: 'processing' }));
                }
            }
        }, 1500);
    }, 1000);
  };

  const generatePreviewData = (fileType: 'movements' | 'ledger' | 'closing'): any[] => {
    switch (fileType) {
      case 'movements':
        return Array.from({ length: 12405 }, (_, i) => ({
            fecha: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
            proveedor: ['Tech Solutions SL', 'Limpiezas Generales SA', 'Office Supplies Co', 'Seguridad Integral SL', 'Mantenimiento Técnico SA', 'Consulting Group', 'Transportes Rápidos SL', 'Equipamiento Industrial SA', 'Servicios Logísticos Global'][i % 9],
            factura: `F-2025-${String(i + 1).padStart(5, '0')}`,
            descripcion: ['Servicios cloud', 'Limpieza mensual', 'Material oficina', 'Seguridad', 'Mantenimiento', 'Consultoría', 'Transporte', 'Maquinaria', 'Logística'][i % 9],
            importe: Number((Math.random() * 5000 + 100).toFixed(2))
        }));
      case 'ledger':
        return Array.from({ length: 85 }, (_, i) => ({
            cuenta: i % 2 === 0 ? '400' : '410',
            descripcion: i % 2 === 0 ? 'Proveedores' : 'Proveedores efectos a pagar',
            saldoInicial: Number((Math.random() * 50000).toFixed(2)),
            debe: Number((Math.random() * 5000).toFixed(2)),
            haber: Number((Math.random() * 5000).toFixed(2)),
            saldoFinal: Number((Math.random() * 55000).toFixed(2))
        }));
      case 'closing':
        return Array.from({ length: 45 }, (_, i) => ({
            cuenta: String(400 + i),
            descripcion: `Cuenta ${400 + i} - Descripción genérica`,
            saldoDeudor: i % 2 === 0 ? Number((Math.random() * 10000).toFixed(2)) : 0,
            saldoAcreedor: i % 2 !== 0 ? Number((Math.random() * 10000).toFixed(2)) : 0
        }));
      default:
        return [];
    }
  };

  const handleRetry = (fileType: 'movements' | 'ledger' | 'closing') => {
    // Clear previous errors and reset state
    setFileErrors(prev => ({ ...prev, [fileType]: [] }));
    setFileStates(prev => ({ ...prev, [fileType]: 'pending' }));
    setExpandedErrors(prev => ({ ...prev, [fileType]: false }));
    // Trigger file upload which will show preview after validation
    handleFileUpload(fileType);
  };

  const handleConfirmUpload = () => {
    if (previewFileType) {
      setFileStates(prev => ({ ...prev, [previewFileType]: 'uploaded' }));
      setShowPreviewModal(false);
      setPreviewFileType(null);
      setPreviousFileState(null);
      setPreviewPage(1);
    }
  };

  const handleCancelPreview = () => {
    if (previewFileType && previousFileState) {
      // Restore previous state (could be 'error' or 'pending')
      setFileStates(prev => ({ ...prev, [previewFileType]: previousFileState }));
      setShowPreviewModal(false);
      setPreviewFileType(null);
      setPreviousFileState(null);
      setPreviewPage(1);
      // Don't clear preview data - keep it for next time
    } else if (previewFileType) {
      // Fallback: if no previous state, go back to pending
      setFileStates(prev => ({ ...prev, [previewFileType]: 'pending' }));
      setShowPreviewModal(false);
      setPreviewFileType(null);
      setPreviewPage(1);
    }
  };

  // Generate table data that matches fileDataCounts - memoized for performance
  const tableData = useMemo(() => {
    const vendors = ['Tech Solutions SL', 'Limpiezas Generales SA', 'Office Supplies Co', 'Seguridad Integral SL', 'Mantenimiento Técnico SA', 'Consulting Group LTD', 'Telecomunicaciones Global', 'Transportes Rápidos', 'Energía Renovable SA', 'Equipamiento Industrial SA', 'Marketing Digital Pro', 'Servicios Jurídicos Asociados', 'Servicios Logísticos Global', 'Construcciones Modernas SL', 'Software Solutions Enterprise', 'Gestión de Residuos SA', 'Seguros Corporativos SL', 'Catering Empresarial'];
    const descriptions = ['Servicios cloud mensual', 'Limpieza oficinas', 'Material de oficina', 'Servicios seguridad mensual', 'Mantenimiento preventivo', 'Asesoría fiscal', 'Servicios telecomunicaciones', 'Envíos nacionales', 'Suministro eléctrico mensual', 'Maquinaria producción', 'Campaña publicitaria', 'Asesoría legal corporativa', 'Contrato anual logística', 'Obras reforma oficinas', 'Licencias software anuales', 'Servicios recogida residuos', 'Póliza seguro anual', 'Servicio catering eventos'];
    
    const totalRecords = fileDataCounts.movements || 12405;
    const data = [];
    
    for (let i = 0; i < totalRecords; i++) {
      const day = (i % 30) + 1;
      const month = Math.floor(i / 30) % 12 + 1;
      const date = `2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const vendor = vendors[i % vendors.length];
      const inv = `F-2025-${String(i + 1).padStart(4, '0')}`;
      const desc = descriptions[i % descriptions.length];
      // Generate amounts with some material/relevant ones
      let amount;
      if (i % 100 === 0) {
        amount = materialityThreshold + Math.random() * 500000; // Material
      } else if (i % 50 === 0) {
        amount = materialityThreshold * 0.5 + Math.random() * 400000; // Relevant
      } else {
        amount = Math.random() * 50000 + 100; // Normal
      }
      
      data.push({
        date,
        vendor,
        inv,
        desc,
        amount: Number(amount.toFixed(2))
      });
    }
    
    // Sort: material first, then relevant, then normal
    return data.sort((a, b) => {
      const aMaterial = a.amount >= materialityThreshold;
      const bMaterial = b.amount >= materialityThreshold;
      const aRelevant = a.amount >= materialityThreshold * 0.5;
      const bRelevant = b.amount >= materialityThreshold * 0.5;
      
      if (aMaterial && !bMaterial) return -1;
      if (!aMaterial && bMaterial) return 1;
      if (aRelevant && !bRelevant && !aMaterial && !bMaterial) return -1;
      if (!aRelevant && bRelevant && !aMaterial && !bMaterial) return 1;
      return b.amount - a.amount; // Higher amounts first within same category
    });
  }, [fileDataCounts.movements, materialityThreshold]);
  
  // Filtered and paginated data
  const filteredTableData = useMemo(() => {
    if (!tableSearchQuery) return tableData;
    return tableData.filter(row => 
      row.vendor.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      row.inv.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      row.desc.toLowerCase().includes(tableSearchQuery.toLowerCase())
    );
  }, [tableData, tableSearchQuery]);
  
  const paginatedTableData = useMemo(() => {
    return filteredTableData.slice(
      (tablePage - 1) * TABLE_ITEMS_PER_PAGE,
      tablePage * TABLE_ITEMS_PER_PAGE
    );
  }, [filteredTableData, tablePage]);
  
  const totalTablePages = Math.ceil(filteredTableData.length / TABLE_ITEMS_PER_PAGE);

  const handleDownloadTemplate = (fileType: 'movements' | 'ledger' | 'closing') => {
    let csvContent = '';
    let filename = '';

    switch (fileType) {
      case 'movements':
        // Template for Movimientos de proveedores (GL Details)
        csvContent = 'Fecha,Proveedor,Nº Factura,Descripción,Importe\n';
        csvContent += '2025-01-12,Tech Solutions SL,F-2025-001,Servicios cloud mensual,1250.00\n';
        csvContent += '2025-01-14,Limpiezas Generales SA,F-9923,Limpieza oficinas Enero,850.50\n';
        csvContent += '2025-01-15,Office Supplies Co,INV-2023-88,Material de oficina,234.00\n';
        filename = 'plantilla_movimientos_proveedores.csv';
        break;
      
      case 'ledger':
        // Template for Libro mayor (400/410)
        csvContent = 'Cuenta,Descripción,Saldo Inicial,Debe,Haber,Saldo Final\n';
        csvContent += '400,Proveedores,50000.00,1250.00,0.00,51250.00\n';
        csvContent += '410,Proveedores efectos a pagar,25000.00,850.50,0.00,25850.50\n';
        csvContent += '400,Proveedores,51250.00,234.00,0.00,51484.00\n';
        filename = 'plantilla_libro_mayor.csv';
        break;
      
      case 'closing':
        // Template for Saldo de cierre (Balance de comprobación)
        csvContent = 'Cuenta,Descripción,Saldo Deudor,Saldo Acreedor\n';
        csvContent += '400,Proveedores,51484.00,0.00\n';
        csvContent += '410,Proveedores efectos a pagar,25850.50,0.00\n';
        csvContent += '700,Compras,5000000.00,0.00\n';
        filename = 'plantilla_saldo_cierre.csv';
        break;
    }

    // Create blob with UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }; 

  const handleTestRun = (testId: string) => {
    const now = new Date();
    const formattedTime = `${now.getDate()}/${now.getMonth() + 1} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setTestExecutionStates(prev => ({ ...prev, [testId]: 'running' }));
    
    setTimeout(() => {
      if (testId === 'reconciler') {
        setTestExecutionStates(prev => ({ ...prev, [testId]: 'completed_with_issues' }));
        setTestLastRun(prev => ({ ...prev, [testId]: formattedTime }));
        
        // Auto-trigger RiskMapper after Reconciler
        setTimeout(() => {
            setTestExecutionStates(prev => ({ ...prev, riskmapper: 'running' }));
            setTimeout(() => {
                setTestExecutionStates(prev => ({ ...prev, riskmapper: 'completed' }));
                setTestLastRun(prev => ({ ...prev, riskmapper: formattedTime })); // Same time roughly
            }, 2000);
        }, 1000);

      } else {
        setTestExecutionStates(prev => ({ ...prev, [testId]: 'completed' }));
        setTestLastRun(prev => ({ ...prev, [testId]: formattedTime }));
      }
    }, 2500);
  };

  // Effects
  // Reset table page when search changes or when filtered results are less than current page
  React.useEffect(() => {
      if (tablePage > totalTablePages && totalTablePages > 0) {
          setTablePage(totalTablePages);
      }
  }, [filteredTableData.length, totalTablePages]);

  React.useEffect(() => {
      if (allFilesUploaded && !isGlobalProcessing && globalProcessingStage !== 'completed') {
          setIsGlobalProcessing(true);
          setGlobalProcessingStage('reconciling');
          
          // Sequence: reconciling -> sanity_check -> completed -> progressive component loading
          setTimeout(() => {
              setGlobalProcessingStage('sanity_check');
              setTimeout(() => {
                  setGlobalProcessingStage('completed');
                  setIsGlobalProcessing(false);
                  
                  // Progressive component loading sequence - only preview table now
                          setTimeout(() => {
                              setLoadedComponents(prev => ({ ...prev, previewTable: true }));
                  }, 800);
              }, 2000);
          }, 2000);
      }
  }, [allFilesUploaded]);

  const selectedFinding = FINDINGS_ALFA.find(f => f.id === selectedFindingId);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const skeletonVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const shimmerVariants = {
    animate: {
      x: ['-100%', '100%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop' as const,
          duration: 1.5,
          ease: 'linear'
        }
      }
    }
  };

  // Render Helpers
  const renderTestDetail = () => {
      switch (selectedTestId) {
        case 'reconciler': return <EngagementReconciler onBack={() => setSelectedTestId(null)} />;
        case 'riskmapper': return <EngagementRiskMapper onBack={() => setSelectedTestId(null)} />;
        case 'circularizer': return <EngagementCircularizer onBack={() => setSelectedTestId(null)} />;
        case 'tester': return <EngagementTester onBack={() => setSelectedTestId(null)} />;
        default: return null;
      }
  };

  // Skeleton Loading Component
  const SkeletonLoader = ({ className = '' }: { className?: string }) => (
    <motion.div
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`bg-white border border-stone-200 p-5 flex items-center gap-3 ${className}`}
    >
      <Loader2 className="w-4 h-4 text-stone-400 animate-spin" />
      <div className="flex-1 space-y-2">
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          className="h-3 bg-stone-100 rounded overflow-hidden relative"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-200 to-transparent"
            variants={shimmerVariants}
            animate="animate"
          />
        </motion.div>
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          className="h-2 bg-stone-50 rounded w-3/4 overflow-hidden relative"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-200 to-transparent"
            variants={shimmerVariants}
            animate="animate"
          />
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden bg-stone-50/30 relative ${isFindingsSidebarOpen ? 'findings-sidebar-open' : ''}`} data-findings-sidebar-open={isFindingsSidebarOpen}>
         {/* Main container that adapts when findings sidebar is open */}
         <div className={`flex flex-col h-full transition-all duration-300 ${isFindingsSidebarOpen ? 'lg:mr-[600px]' : ''}`}>
           {/* Header */}
           <div className="px-10 pt-10 pb-0 bg-white border-b border-stone-200 shrink-0">
              <div className="flex justify-between items-start mb-6">
                 <div>
                     <div className="flex items-center gap-3 mb-2">
                         <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Área 40</span>
                         <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${
                            dataStatus === 'loaded' 
                               ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                               : 'bg-amber-50 text-amber-700 border border-amber-100'
                         }`}>
                             {dataStatus === 'loaded' ? 'Datos cargados' : 'Pendiente de datos'}
                         </span>
                     </div>
                     <h1 className="text-3xl font-serif text-stone-900">Área: Proveedores</h1>
                 </div>
                 <button 
                    onClick={() => setShowTimeline(!showTimeline)}
                    className={`p-2 rounded hover:bg-stone-100 transition-colors ${showTimeline ? 'text-stone-900 bg-stone-100' : 'text-stone-400'}`}
                 >
                    {showTimeline ? <PanelRightClose className="w-5 h-5" /> : <History className="w-5 h-5" />}
                 </button>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-8">
                 {['Data', 'Tests', 'Findings', 'Papers'].map((tab) => (
                    <button 
                       key={tab}
                       onClick={() => { setActiveTab(tab.toLowerCase()); setSelectedFindingId(null); setSelectedTestId(null); }}
                       className={`pb-4 text-xs font-medium tracking-wide uppercase transition-all border-b-2 ${
                          activeTab === tab.toLowerCase() 
                          ? 'text-stone-900 border-stone-900' 
                          : 'text-stone-400 border-transparent hover:text-stone-600'
                       }`}
                    >
                       {t(`engagement.tab_${tab.toLowerCase()}`)}
                    </button>
                 ))}
              </div>
           </div>

           {/* Content */}
           <div className={`flex-1 overflow-y-auto ${activeTab === 'findings' ? 'p-0' : 'p-10'}`}>
            
            {/* --- TAB 1: DATA --- */}
            {activeTab === 'data' && (
               <div className="animate-fade-in space-y-8 max-w-6xl mx-auto">
                  
                  {/* File Upload Blocks - Hide when all loaded */}
                  <AnimatePresence>
                      {(!allFilesUploaded || globalProcessingStage !== 'completed') && (
                          <motion.div
                              initial={{ opacity: 1 }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="grid grid-cols-3 gap-6"
                          >
                      {/* Block 1: Movimientos de proveedores */}
                      <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all h-56 relative overflow-hidden ${
                         fileStates.movements === 'uploaded' 
                            ? 'border-emerald-200 bg-emerald-50/30' 
                            : fileStates.movements === 'error'
                            ? 'border-rose-200 bg-rose-50/30'
                            : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                      }`}>
                          {/* Processing Overlay */}
                          {(fileStates.movements === 'uploading' || fileStates.movements === 'processing') && (
                              <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center">
                                  <Loader2 className="w-6 h-6 text-stone-900 animate-spin mb-3" />
                                  <span className="text-xs font-medium text-stone-900">
                                      {fileStates.movements === 'uploading' ? 'Subiendo...' : 'Validando estructura...'}
                                  </span>
                              </div>
                          )}

                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${
                             fileStates.movements === 'uploaded'
                                ? 'bg-emerald-100 text-emerald-600'
                                : fileStates.movements === 'error'
                                ? 'bg-rose-100 text-rose-600'
                                : 'bg-white border border-stone-200 text-stone-400'
                          }`}>
                              {fileStates.movements === 'uploaded' ? (
                                 <CheckCircle className="w-5 h-5" />
                              ) : fileStates.movements === 'error' ? (
                                 <AlertCircle className="w-5 h-5" />
                              ) : (
                                 <UploadCloud className="w-5 h-5" />
                              )}
                          </div>
                          <h3 className="text-sm font-serif text-stone-900 mb-1">Movimientos de proveedores</h3>
                          <p className="text-xs text-stone-400 mb-4 px-4">Fichero de submayor (GL Details)</p>
                          
                          {fileStates.movements === 'uploaded' ? (
                             <div className="w-full space-y-2">
                                <div className="flex items-center justify-center gap-1.5 mb-2">
                                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                   <span className="text-xs font-medium text-emerald-700">Cargado desde onboarding</span>
                                </div>
                                {fileDataCounts.movements > 0 && (
                                   <div className="text-[10px] text-stone-500 space-y-0.5 bg-white/50 rounded-sm p-2 border border-stone-100">
                                      <div className="flex justify-between">
                                         <span>Registros detectados:</span>
                                         <span className="font-mono font-medium text-stone-700">{fileDataCounts.movements.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                         <span>Columnas:</span>
                                         <span className="font-mono font-medium text-stone-700">5</span>
                                      </div>
                                      <div className="flex justify-between pt-1 border-t border-stone-100">
                                         <span>Origen:</span>
                                         <span className="text-blue-600 font-medium">SAP / ERP Cliente</span>
                                      </div>
                                   </div>
                                )}
                             </div>
                          ) : fileStates.movements === 'error' ? (
                             <div className="w-full space-y-2 animate-fade-in">
                                <div className="flex items-center justify-between mb-2">
                                   <div className="text-xs font-medium text-rose-700">
                                      Errores detectados ({fileErrors.movements.length})
                                   </div>
                                   <button
                                      onClick={() => setExpandedErrors(prev => ({ ...prev, movements: !prev.movements }))}
                                      className="text-[10px] text-rose-600 hover:text-rose-700 flex items-center gap-1"
                                   >
                                      {expandedErrors.movements ? (
                                         <>Ocultar <ChevronUp className="w-3 h-3" /></>
                                      ) : (
                                         <>Ver detalles <ChevronDown className="w-3 h-3" /></>
                                      )}
                                   </button>
                                </div>
                                <AnimatePresence>
                                   {expandedErrors.movements && (
                                      <motion.div
                                         initial={{ height: 0, opacity: 0 }}
                                         animate={{ height: 'auto', opacity: 1 }}
                                         exit={{ height: 0, opacity: 0 }}
                                         className="overflow-hidden"
                                      >
                                         <div className="text-[10px] text-rose-600 text-left space-y-1.5 bg-white/50 rounded p-2 border border-rose-100 mb-2">
                                            {fileErrors.movements.map((error, idx) => (
                                               <div key={idx} className="flex items-start gap-1.5">
                                      <XCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                                  <span>{error}</span>
                                   </div>
                                            ))}
                                </div>
                                      </motion.div>
                                   )}
                                </AnimatePresence>
                                {filePreviewData.movements && (
                                   <button
                                      onClick={() => {
                                         setPreviousFileState('error');
                                         setPreviewFileType('movements');
                                         setShowPreviewModal(true);
                                      }}
                                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded text-xs font-medium text-stone-700 hover:border-stone-300 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                                   >
                                      <Eye className="w-3 h-3" />
                                      Ver preview de datos ({fileDataCounts.movements > 0 ? fileDataCounts.movements : filePreviewData.movements.length} registros)
                                   </button>
                                )}
                                <button 
                                   onClick={() => handleRetry('movements')}
                                   className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded text-xs font-medium text-rose-700 hover:border-rose-300 transition-colors shadow-sm"
                                >
                                   Corregir y reintentar
                                </button>
                             </div>
                          ) : (
                             <div className="w-full space-y-2">
                             <button 
                                onClick={() => handleFileUpload('movements')}
                                disabled={fileStates.movements === 'uploading' || fileStates.movements === 'processing'}
                                className="px-3 py-1.5 bg-white border border-stone-200 rounded text-xs font-medium text-stone-600 hover:border-stone-400 transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                Subir archivo
                             </button>
                                <button
                                   onClick={() => handleDownloadTemplate('movements')}
                                   className="text-[10px] text-stone-400 hover:text-stone-600 font-medium underline decoration-stone-300 underline-offset-2 hover:decoration-stone-600 transition-colors flex items-center gap-1 mx-auto"
                                >
                                   <Download className="w-3 h-3" />
                                   Descargar plantilla
                                </button>
                             </div>
                          )}
                      </div>

                      {/* Block 2: Libro mayor */}
                      <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all h-56 relative overflow-hidden ${
                         fileStates.ledger === 'uploaded' 
                            ? 'border-emerald-200 bg-emerald-50/30' 
                            : fileStates.ledger === 'error'
                            ? 'border-rose-200 bg-rose-50/30'
                            : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                      }`}>
                          {/* Processing Overlay */}
                          {(fileStates.ledger === 'uploading' || fileStates.ledger === 'processing') && (
                              <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center">
                                  <Loader2 className="w-6 h-6 text-stone-900 animate-spin mb-3" />
                                  <span className="text-xs font-medium text-stone-900">
                                      {fileStates.ledger === 'uploading' ? 'Subiendo...' : 'Validando tipos de dato...'}
                                  </span>
                              </div>
                          )}

                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${
                             fileStates.ledger === 'uploaded'
                                ? 'bg-emerald-100 text-emerald-600'
                                : fileStates.ledger === 'error'
                                ? 'bg-rose-100 text-rose-600'
                                : 'bg-white border border-stone-200 text-stone-400'
                          }`}>
                              {fileStates.ledger === 'uploaded' ? (
                                 <CheckCircle className="w-5 h-5" />
                              ) : fileStates.ledger === 'error' ? (
                                 <AlertCircle className="w-5 h-5" />
                              ) : (
                                 <UploadCloud className="w-5 h-5" />
                              )}
                          </div>
                          <h3 className="text-sm font-serif text-stone-900 mb-1">Libro mayor (400/410)</h3>
                          <p className="text-xs text-stone-400 mb-4 px-4">Sumas y saldos / Mayores</p>
                          
                          {fileStates.ledger === 'uploaded' ? (
                             <div className="w-full space-y-2">
                                <div className="flex items-center justify-center gap-1.5 mb-2">
                                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                   <span className="text-xs font-medium text-emerald-700">Cargado desde onboarding</span>
                                </div>
                                {fileDataCounts.ledger > 0 && (
                                   <div className="text-[10px] text-stone-500 space-y-0.5 bg-white/50 rounded-sm p-2 border border-stone-100">
                                      <div className="flex justify-between">
                                         <span>Registros detectados:</span>
                                         <span className="font-mono font-medium text-stone-700">{fileDataCounts.ledger.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                         <span>Columnas:</span>
                                         <span className="font-mono font-medium text-stone-700">6</span>
                                      </div>
                                      <div className="flex justify-between pt-1 border-t border-stone-100">
                                         <span>Origen:</span>
                                         <span className="text-blue-600 font-medium">SAP / ERP Cliente</span>
                                      </div>
                                   </div>
                                )}
                             </div>
                          ) : fileStates.ledger === 'error' ? (
                             <div className="w-full space-y-2 animate-fade-in">
                                <div className="flex items-center justify-between mb-2">
                                   <div className="text-xs font-medium text-rose-700">
                                      Errores detectados ({fileErrors.ledger.length})
                                   </div>
                                   <button
                                      onClick={() => setExpandedErrors(prev => ({ ...prev, ledger: !prev.ledger }))}
                                      className="text-[10px] text-rose-600 hover:text-rose-700 flex items-center gap-1"
                                   >
                                      {expandedErrors.ledger ? (
                                         <>Ocultar <ChevronUp className="w-3 h-3" /></>
                                      ) : (
                                         <>Ver detalles <ChevronDown className="w-3 h-3" /></>
                                      )}
                                   </button>
                                </div>
                                <AnimatePresence>
                                   {expandedErrors.ledger && (
                                      <motion.div
                                         initial={{ height: 0, opacity: 0 }}
                                         animate={{ height: 'auto', opacity: 1 }}
                                         exit={{ height: 0, opacity: 0 }}
                                         className="overflow-hidden"
                                      >
                                         <div className="text-[10px] text-rose-600 text-left space-y-1.5 bg-white/50 rounded p-2 border border-rose-100 mb-2">
                                            {fileErrors.ledger.map((error, idx) => (
                                               <div key={idx} className="flex items-start gap-1.5">
                                      <XCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                                  <span>{error}</span>
                                   </div>
                                            ))}
                                </div>
                                      </motion.div>
                                   )}
                                </AnimatePresence>
                                {filePreviewData.ledger && (
                                   <button
                                      onClick={() => {
                                         setPreviousFileState('error');
                                         setPreviewFileType('ledger');
                                         setShowPreviewModal(true);
                                      }}
                                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded text-xs font-medium text-stone-700 hover:border-stone-300 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                                   >
                                      <Eye className="w-3 h-3" />
                                      Ver preview de datos ({fileDataCounts.ledger > 0 ? fileDataCounts.ledger : filePreviewData.ledger.length} registros)
                                   </button>
                                )}
                                <button 
                                   onClick={() => handleRetry('ledger')}
                                   className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded text-xs font-medium text-rose-700 hover:border-rose-300 transition-colors shadow-sm"
                                >
                                   Corregir y reintentar
                                </button>
                             </div>
                          ) : (
                             <div className="w-full space-y-2">
                             <button 
                                onClick={() => handleFileUpload('ledger')}
                                disabled={fileStates.ledger === 'uploading' || fileStates.ledger === 'processing'}
                                className="px-3 py-1.5 bg-white border border-stone-200 rounded text-xs font-medium text-stone-600 hover:border-stone-400 transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                Subir archivo
                             </button>
                                <button
                                   onClick={() => handleDownloadTemplate('ledger')}
                                   className="text-[10px] text-stone-400 hover:text-stone-600 font-medium underline decoration-stone-300 underline-offset-2 hover:decoration-stone-600 transition-colors flex items-center gap-1 mx-auto"
                                >
                                   <Download className="w-3 h-3" />
                                   Descargar plantilla
                                </button>
                             </div>
                          )}
                      </div>

                      {/* Block 3: Saldo de cierre */}
                      <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all h-56 relative overflow-hidden ${
                         fileStates.closing === 'uploaded' 
                            ? 'border-emerald-200 bg-emerald-50/30' 
                            : fileStates.closing === 'error'
                            ? 'border-rose-200 bg-rose-50/30'
                            : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                      }`}>
                          {/* Processing Overlay */}
                          {(fileStates.closing === 'uploading' || fileStates.closing === 'processing') && (
                              <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center">
                                  <Loader2 className="w-6 h-6 text-stone-900 animate-spin mb-3" />
                                  <span className="text-xs font-medium text-stone-900">
                                      {fileStates.closing === 'uploading' ? 'Subiendo...' : 'Verificando integridad...'}
                                  </span>
                              </div>
                          )}

                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${
                             fileStates.closing === 'uploaded'
                                ? 'bg-emerald-100 text-emerald-600'
                                : fileStates.closing === 'error'
                                ? 'bg-rose-100 text-rose-600'
                                : 'bg-white border border-stone-200 text-stone-400'
                          }`}>
                              {fileStates.closing === 'uploaded' ? (
                                 <CheckCircle className="w-5 h-5" />
                              ) : fileStates.closing === 'error' ? (
                                 <AlertCircle className="w-5 h-5" />
                              ) : (
                                 <UploadCloud className="w-5 h-5" />
                              )}
                          </div>
                          <h3 className="text-sm font-serif text-stone-900 mb-1">Saldo de cierre</h3>
                          <p className="text-xs text-stone-400 mb-4 px-4">Balance de comprobación</p>
                          
                          {fileStates.closing === 'uploaded' ? (
                             <div className="w-full space-y-2">
                                <div className="flex items-center justify-center gap-1.5 mb-2">
                                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                   <span className="text-xs font-medium text-emerald-700">Cargado desde onboarding</span>
                                </div>
                                {fileDataCounts.closing > 0 && (
                                   <div className="text-[10px] text-stone-500 space-y-0.5 bg-white/50 rounded-sm p-2 border border-stone-100">
                                      <div className="flex justify-between">
                                         <span>Registros detectados:</span>
                                         <span className="font-mono font-medium text-stone-700">{fileDataCounts.closing.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                         <span>Columnas:</span>
                                         <span className="font-mono font-medium text-stone-700">4</span>
                                      </div>
                                      <div className="flex justify-between pt-1 border-t border-stone-100">
                                         <span>Origen:</span>
                                         <span className="text-blue-600 font-medium">SAP / ERP Cliente</span>
                                      </div>
                                   </div>
                                )}
                             </div>
                          ) : fileStates.closing === 'error' ? (
                             <div className="w-full space-y-2 animate-fade-in">
                                <div className="flex items-center justify-between mb-2">
                                   <div className="text-xs font-medium text-rose-700">
                                      Errores detectados ({fileErrors.closing.length})
                                   </div>
                                   <button
                                      onClick={() => setExpandedErrors(prev => ({ ...prev, closing: !prev.closing }))}
                                      className="text-[10px] text-rose-600 hover:text-rose-700 flex items-center gap-1"
                                   >
                                      {expandedErrors.closing ? (
                                         <>Ocultar <ChevronUp className="w-3 h-3" /></>
                                      ) : (
                                         <>Ver detalles <ChevronDown className="w-3 h-3" /></>
                                      )}
                                   </button>
                                </div>
                                <AnimatePresence>
                                   {expandedErrors.closing && (
                                      <motion.div
                                         initial={{ height: 0, opacity: 0 }}
                                         animate={{ height: 'auto', opacity: 1 }}
                                         exit={{ height: 0, opacity: 0 }}
                                         className="overflow-hidden"
                                      >
                                         <div className="text-[10px] text-rose-600 text-left space-y-1.5 bg-white/50 rounded p-2 border border-rose-100 mb-2">
                                            {fileErrors.closing.map((error, idx) => (
                                               <div key={idx} className="flex items-start gap-1.5">
                                      <XCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                                  <span>{error}</span>
                                   </div>
                                            ))}
                                </div>
                                      </motion.div>
                                   )}
                                </AnimatePresence>
                                {filePreviewData.closing && (
                                   <button
                                      onClick={() => {
                                         setPreviousFileState('error');
                                         setPreviewFileType('closing');
                                         setShowPreviewModal(true);
                                      }}
                                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded text-xs font-medium text-stone-700 hover:border-stone-300 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                                   >
                                      <Eye className="w-3 h-3" />
                                      Ver preview de datos ({fileDataCounts.closing > 0 ? fileDataCounts.closing : filePreviewData.closing.length} registros)
                                   </button>
                                )}
                                <button 
                                   onClick={() => handleRetry('closing')}
                                   className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded text-xs font-medium text-rose-700 hover:border-rose-300 transition-colors shadow-sm"
                                >
                                   Corregir y reintentar
                                </button>
                             </div>
                          ) : (
                             <div className="w-full space-y-2">
                             <button 
                                onClick={() => handleFileUpload('closing')}
                                disabled={fileStates.closing === 'uploading' || fileStates.closing === 'processing'}
                                className="px-3 py-1.5 bg-white border border-stone-200 rounded text-xs font-medium text-stone-600 hover:border-stone-400 transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                Subir archivo
                             </button>
                                <button
                                   onClick={() => handleDownloadTemplate('closing')}
                                   className="text-[10px] text-stone-400 hover:text-stone-600 font-medium underline decoration-stone-300 underline-offset-2 hover:decoration-stone-600 transition-colors flex items-center gap-1 mx-auto"
                                >
                                   <Download className="w-3 h-3" />
                                   Descargar plantilla
                                </button>
                             </div>
                          )}
                      </div>
                          </motion.div>
                      )}
                  </AnimatePresence>

                  {/* Unified Summary & Metrics - Shows when all files are uploaded */}
                  <AnimatePresence mode="wait">
                      {allFilesUploaded && globalProcessingStage === 'completed' && (
                          <motion.div
                              key="unified-summary"
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              className="bg-white border border-stone-200 rounded-sm p-6"
                          >
                              <motion.h5 
                                  variants={itemVariants}
                                  className="text-lg font-serif text-stone-900 mb-6"
                              >
                                  Resumen de ingesta y validación
                              </motion.h5>
                              
                                      <motion.div
                                  className="relative pl-4 border-l border-stone-200 space-y-8"
                                  variants={containerVariants}
                                  initial="hidden"
                                  animate="visible"
                              >
                                  {/* Step 1: Upload */}
                                          <motion.div
                                      className="relative"
                                      variants={itemVariants}
                                  >
                                      <motion.div 
                                          className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                      />
                                      <div className="flex flex-col">
                                          <span className="text-xs font-medium text-stone-900">Carga de ficheros completada</span>
                                          <span className="text-[10px] text-stone-400 mt-0.5">3 archivos procesados correctamente</span>
                                          
                                          {/* File details with counts and balances */}
                                          <div className="mt-3 max-w-4xl">
                                              <div className="grid grid-cols-3 gap-px bg-stone-200 border border-stone-200 rounded-sm overflow-hidden">
                                                  <div className="bg-white p-5">
                                                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block">Submayor proveedores</span>
                                                      <div className="text-2xl font-serif text-stone-900 mt-1 tabular-nums">
                                                          {fileDataCounts.movements.toLocaleString()}
                                                      </div>
                                                      <div className="text-[10px] text-stone-400 mt-1">asientos</div>
                                                      <div className="mt-3 pt-3 border-t border-stone-100">
                                                          <span className="text-[10px] text-stone-400 uppercase tracking-wider">Saldo total</span>
                                                          <div className="text-lg font-serif text-stone-900 mt-0.5 tabular-nums">
                                                              {(fileBalances.movements / 1000000).toFixed(2)} M€
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="bg-white p-5">
                                                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block">Libro mayor (400/410)</span>
                                                      <div className="text-2xl font-serif text-stone-900 mt-1 tabular-nums">
                                                          {fileDataCounts.ledger.toLocaleString()}
                                                      </div>
                                                      <div className="text-[10px] text-stone-400 mt-1">registros</div>
                                                      <div className="mt-3 pt-3 border-t border-stone-100">
                                                          <span className="text-[10px] text-stone-400 uppercase tracking-wider">Saldo cuenta</span>
                                                          <div className="text-lg font-serif text-stone-900 mt-0.5 tabular-nums">
                                                              {(fileBalances.ledger / 1000000).toFixed(2)} M€
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="bg-white p-5">
                                                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block">Balance de cierre</span>
                                                      <div className="text-2xl font-serif text-stone-900 mt-1 tabular-nums">
                                                          {fileDataCounts.closing.toLocaleString()}
                                                      </div>
                                                      <div className="text-[10px] text-stone-400 mt-1">cuentas</div>
                                                      <div className="mt-3 pt-3 border-t border-stone-100">
                                                          <span className="text-[10px] text-stone-400 uppercase tracking-wider">Saldo declarado</span>
                                                          <div className="text-lg font-serif text-stone-900 mt-0.5 tabular-nums">
                                                              {(fileBalances.closing / 1000000).toFixed(2)} M€
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                              
                                              {/* Reconciliation Status */}
                                              <div className={`mt-4 p-4 rounded-sm border ${
                                                  balancesMatch 
                                                      ? 'bg-emerald-50 border-emerald-200' 
                                                      : 'bg-amber-50 border-amber-200'
                                              }`}>
                                                  <div className="flex items-center justify-between">
                                                      <div className="flex items-center gap-3">
                                                          {balancesMatch ? (
                                                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                              </div>
                                                          ) : (
                                                              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                                                  <AlertCircle className="w-5 h-5 text-amber-600" />
                                                              </div>
                                                          )}
                                                          <div>
                                                              <span className={`text-sm font-medium ${balancesMatch ? 'text-emerald-900' : 'text-amber-900'}`}>
                                                                  {balancesMatch ? 'Cuadre inicial correcto' : 'Diferencias detectadas en cuadre inicial'}
                                                              </span>
                                                              <p className={`text-xs mt-0.5 ${balancesMatch ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                                  {balancesMatch 
                                                                      ? 'Los tres saldos coinciden: submayor, libro mayor y balance de cierre'
                                                                      : `Diferencia submayor vs mayor: ${((diffMovementsVsLedger) / 1000).toFixed(0)}k€ · Mayor vs balance: ${((diffLedgerVsClosing) / 1000).toFixed(0)}k€`
                                                                  }
                                                              </p>
                                                          </div>
                                                      </div>
                                                      {!balancesMatch && (
                                                          <span className="text-[10px] font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded border border-amber-200">
                                                              Requiere revisión
                                                          </span>
                                                      )}
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </motion.div>
                      
                                  {/* Step 2: Processing */}
                          <motion.div
                                      className="relative"
                              variants={itemVariants}
                          >
                              <motion.div 
                                          className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                                      />
                                      <div className="flex flex-col">
                                          <span className="text-xs font-medium text-stone-900">Procesamiento y conciliación</span>
                                          <p className="text-[11px] text-stone-500 mt-1 max-w-2xl leading-relaxed">
                                              El sistema ha conciliado automáticamente el libro mayor con el submayor de proveedores. Se han procesado un total de <strong className="text-stone-900">{(fileDataCounts.movements + fileDataCounts.ledger + fileDataCounts.closing).toLocaleString()} registros</strong> distribuidos en los tres archivos. La validación de estructura y tipos de datos se ha completado sin errores.
                                          </p>
                                      </div>
                                  </motion.div>

                                  {/* Step 3: Key Metrics */}
                                      <motion.div 
                                      className="relative"
                                          variants={itemVariants}
                                  >
                                      <motion.div 
                                          className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-stone-900 border-2 border-white"
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                                      />
                                      <div className="flex flex-col">
                                          <span className="text-xs font-medium text-stone-900 mb-3">Métricas principales</span>
                                          
                                          {/* Unified Metrics Grid */}
                                          <div className="mt-2 space-y-4">
                                              {/* Materiality KPI */}
                                              <div className="bg-white border border-stone-200 rounded-sm p-4">
                                                  <div className="flex items-start justify-between mb-3">
                                                      <div className="flex items-center gap-2">
                                                          <AlertOctagon className="w-4 h-4 text-stone-400 shrink-0" />
                                          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans">
                                             Umbral de importancia (Materiality)
                                          </span>
                                                      </div>
                                                      <button
                                                          onClick={() => setShowMaterialityDetails(!showMaterialityDetails)}
                                                          className="text-[10px] text-stone-500 hover:text-stone-900 font-medium underline decoration-stone-300 underline-offset-2 hover:decoration-stone-900 transition-colors shrink-0"
                                                      >
                                                          {showMaterialityDetails ? 'Ocultar cálculo' : 'Ver cálculo'}
                                                      </button>
                                                  </div>
                                                  <div className="flex items-baseline gap-2 flex-wrap">
                                          <span className="text-2xl font-serif text-stone-900 tabular-nums">1,8%</span>
                                          <span className="text-sm text-stone-400 font-sans">de las compras</span>
                                          <span className="text-stone-300 mx-1">≈</span>
                                          <span className="text-2xl font-serif text-stone-900 tabular-nums">0,9 M€</span>
                     </div>
                              
                              {/* Materiality Details */}
                              <AnimatePresence>
                                  {showMaterialityDetails && (
                                      <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.3 }}
                                          className="overflow-hidden"
                                      >
                                          <div className="mt-4 pt-4 border-t border-stone-100">
                                                                  <div className="bg-stone-50 rounded-sm p-4 space-y-2">
                                                                      <div className="text-xs font-medium text-stone-900 mb-3">Cálculo del umbral:</div>
                                                                      <div className="space-y-2 text-xs text-stone-600">
                                                      <div className="flex justify-between">
                                                          <span>Base de cálculo:</span>
                                                          <span className="font-mono font-medium">Compras totales</span>
                           </div>
                                                      <div className="flex justify-between">
                                                          <span>Importe total compras:</span>
                                                          <span className="font-mono font-medium">50,0 M€</span>
                     </div>
                                                      <div className="flex justify-between border-t border-stone-200 pt-2">
                                                          <span className="font-medium">Porcentaje aplicado:</span>
                                                          <span className="font-mono font-medium">1,8%</span>
                     </div>
                                                      <div className="flex justify-between border-t border-stone-300 pt-2">
                                                          <span className="font-semibold text-stone-900">Umbral de materialidad:</span>
                                                          <span className="font-mono font-semibold text-stone-900">0,9 M€</span>
                     </div>
                                                                      </div>
                                                                  </div>
                                          </div>
                                      </motion.div>
                                  )}
                              </AnimatePresence>
                                              </div>

                                              {/* Basic KPIs Grid */}
                                              <div className="grid grid-cols-3 gap-px bg-stone-200 border border-stone-200 rounded-sm overflow-hidden">
                                                  <div className="bg-white p-5">
                                                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block">Nº Transacciones</span>
                                                      <div className="text-2xl font-serif text-stone-900 mt-1 tabular-nums">
                                                          {fileDataCounts.movements.toLocaleString()}
                                                      </div>
                                                      <div className="text-[10px] text-stone-400 mt-1.5">
                                                          <span className="text-rose-600 font-medium">2</span> superan umbral materialidad
                                                      </div>
                                                  </div>
                                                  <div className="bg-white p-5">
                                                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block">Importe Total</span>
                                                      <div className="text-2xl font-serif text-stone-900 mt-1 tabular-nums">
                                                          4.85 M€
                                                      </div>
                                                      <div className="text-[10px] text-stone-400 mt-1.5">
                                                          <span className="text-rose-600 font-medium">2.23 M€</span> en transacciones materiales
                                                      </div>
                                                  </div>
                                                  <div className="bg-white p-5">
                                                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block">Proveedores Distintos</span>
                                                      <div className="text-2xl font-serif text-stone-900 mt-1 tabular-nums">
                                                          230
                                                      </div>
                                                      <div className="text-[10px] text-stone-400 mt-1.5">
                                                          <span className="text-amber-600 font-medium">12</span> con importes relevantes
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                          </motion.div>

                                  {/* Step 4: Validation Findings */}
                          <motion.div
                                      className="relative"
                                      variants={itemVariants}
                                  >
                                      <motion.div
                                          className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-stone-900 border-2 border-white"
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                                      />
                                      <div className="flex flex-col">
                                          <span className="text-xs font-medium text-stone-900">Sanity check y hallazgos</span>
                                          
                                          <div className="mt-3 bg-white border border-stone-200 rounded-sm p-4 max-w-2xl shadow-sm">
                                              <div className="flex items-start gap-3 mb-3">
                                                  <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                                  <div>
                                                      <span className="text-xs font-medium text-stone-900 block">Transacciones materiales detectadas</span>
                                                      <span className="text-[11px] text-stone-500">Se han identificado <strong className="text-stone-900">2 transacciones</strong> que superan el umbral de materialidad (0,9 M€).</span>
                                                  </div>
                                              </div>
                                              <div className="flex items-start gap-3">
                                                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                                  <div>
                                                      <span className="text-xs font-medium text-stone-900 block">Proveedores relevantes</span>
                                                      <span className="text-[11px] text-stone-500">Existen <strong className="text-stone-900">12 proveedores</strong> con volumen de operaciones significativo que requieren revisión específica.</span>
                                                  </div>
                                              </div>
                                          </div>
                                          
                                          <div className="mt-4">
                                              <button 
                                                  onClick={() => setActiveTab('tests')}
                                                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded-sm hover:bg-black transition-colors shadow-sm"
                                              >
                                                  Proceder a pruebas automáticas <ArrowRight className="w-3 h-3" />
                                              </button>
                                          </div>
                                      </div>
                                  </motion.div>
                              </motion.div>
                          </motion.div>
                      )}
                  </AnimatePresence>

                  {/* Preview Table - Progressive Loading */}
                  <AnimatePresence mode="wait">
                      {!loadedComponents.previewTable && globalProcessingStage === 'completed' && (
                          <motion.div
                              key="table-skeleton"
                              variants={skeletonVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="border border-stone-200 rounded-sm overflow-hidden bg-white"
                          >
                              <div className="p-4 border-b border-stone-200">
                                  <motion.div
                                      variants={shimmerVariants}
                                      animate="animate"
                                      className="h-4 bg-stone-100 rounded w-48 mb-4 overflow-hidden relative"
                                  >
                                      <motion.div
                                          className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-200 to-transparent"
                                          variants={shimmerVariants}
                                          animate="animate"
                                      />
                                  </motion.div>
                     </div>
                              <div className="p-4 space-y-2">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                      <motion.div
                                          key={i}
                                          variants={shimmerVariants}
                                          animate="animate"
                                          className="h-10 bg-stone-50 rounded overflow-hidden relative"
                                      >
                                          <motion.div
                                              className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-200 to-transparent"
                                              variants={shimmerVariants}
                                              animate="animate"
                                          />
                                      </motion.div>
                                  ))}
                  </div>
                          </motion.div>
                      )}
                      
                      {loadedComponents.previewTable && (
                          <motion.div
                              key="table-content"
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                          >
                     <div className="mb-4 space-y-3">
                        <div className="flex justify-between items-end">
                        <div>
                           <h4 className="text-sm font-serif text-stone-900 mb-2">Vista previa de datos</h4>
                           {dataStatus === 'loaded' && (
                              <div className="flex items-center gap-4 text-[10px] text-stone-400">
                                 <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded border-l-2 border-rose-400 bg-rose-50/50"></div>
                                    <span>Material (≥ 0,9 M€)</span>
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded border-l-2 border-amber-300 bg-amber-50/30"></div>
                                    <span>Relevante (≥ 0,45 M€)</span>
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded bg-white border border-stone-200"></div>
                                    <span>Inmaterial</span>
                                 </div>
                              </div>
                           )}
                        </div>
                        <div className="flex gap-2">
                             <button className="p-1.5 text-stone-400 hover:text-stone-900 border border-transparent hover:border-stone-200 rounded"><Filter className="w-4 h-4" /></button>
                             <button className="p-1.5 text-stone-400 hover:text-stone-900 border border-transparent hover:border-stone-200 rounded"><Download className="w-4 h-4" /></button>
                           </div>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                           <input
                              type="text"
                              value={tableSearchQuery}
                              onChange={(e) => {
                                 setTableSearchQuery(e.target.value);
                                 setTablePage(1); // Reset to first page on search
                              }}
                              placeholder="Buscar por proveedor, factura, descripción..."
                              className="w-full pl-10 pr-4 py-2 text-xs border border-stone-200 rounded-sm bg-white focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200"
                           />
                        </div>
                     </div>
                     <div className="border border-stone-200 rounded-sm overflow-hidden bg-white shadow-sm">
                        <table className="w-full text-left">
                           <thead className="bg-stone-50 text-[10px] text-stone-500 font-sans uppercase tracking-wider border-b border-stone-200">
                              <tr>
                                 <th className="px-4 py-3 font-medium">Fecha</th>
                                 <th className="px-4 py-3 font-medium">Proveedor</th>
                                 <th className="px-4 py-3 font-medium">Nº Factura</th>
                                 <th className="px-4 py-3 font-medium">Descripción</th>
                                 <th className="px-4 py-3 font-medium text-right">Importe</th>
                              </tr>
                           </thead>
                           <motion.tbody 
                              className="divide-y divide-stone-100"
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                           >
                              {paginatedTableData.map((row, i) => {
                                  const isMaterial = row.amount >= materialityThreshold;
                                  const isNearMaterial = row.amount >= materialityThreshold * 0.5;
                                  return (
                                 <motion.tr 
                                    key={i} 
                                    variants={itemVariants}
                                    className={`text-xs text-stone-600 transition-colors ${
                                       isMaterial 
                                          ? 'bg-rose-50/50 hover:bg-rose-50 border-l-2 border-rose-400' 
                                          : isNearMaterial 
                                             ? 'bg-amber-50/30 hover:bg-amber-50/50 border-l-2 border-amber-300'
                                             : 'hover:bg-stone-50'
                                    }`}
                                 >
                                    <td className="px-4 py-2.5 font-mono text-stone-400">{row.date}</td>
                                    <td className="px-4 py-2.5 font-medium text-stone-900">{row.vendor}</td>
                                    <td className="px-4 py-2.5 font-mono">{row.inv}</td>
                                    <td className="px-4 py-2.5 text-stone-500">{row.desc}</td>
                                    <td className={`px-4 py-2.5 text-right font-mono tabular-nums ${
                                       isMaterial ? 'font-semibold text-rose-700' : isNearMaterial ? 'font-medium text-amber-700' : 'text-stone-900'
                                    }`}>
                                       {row.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                       {isMaterial && (
                                          <span className="ml-2 text-[10px] text-rose-600 font-normal">(Material)</span>
                                       )}
                                    </td>
                                 </motion.tr>
                              );
                              })}
                           </motion.tbody>
                        </table>
                        <div className="bg-stone-50 px-4 py-3 border-t border-stone-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <span className="text-[10px] text-stone-400">
                                  {(() => {
                                     const start = (tablePage - 1) * TABLE_ITEMS_PER_PAGE + 1;
                                     const end = Math.min(tablePage * TABLE_ITEMS_PER_PAGE, filteredTableData.length);
                                     return `Mostrando ${start.toLocaleString()} - ${end.toLocaleString()} de ${filteredTableData.length.toLocaleString()} registros`;
                                  })()}
                               </span>
                               {tableSearchQuery && (
                               <button 
                                     onClick={() => {
                                        setTableSearchQuery('');
                                        setTablePage(1);
                                     }}
                                     className="text-[10px] text-stone-500 hover:text-stone-900 font-medium underline decoration-stone-300 underline-offset-2 hover:decoration-stone-900 transition-colors"
                                  >
                                     Limpiar búsqueda
                                  </button>
                            )}
                        </div>
                            <div className="flex items-center gap-3">
                               <button
                                  onClick={() => setTablePage(p => Math.max(1, p - 1))}
                                  disabled={tablePage === 1}
                                  className="px-2 py-1 rounded-sm border border-stone-200 text-stone-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 hover:text-stone-900 transition-colors"
                               >
                                  <ChevronRight className="w-4 h-4 rotate-180" />
                               </button>
                               <span className="px-3 py-1 text-xs font-medium text-stone-600 bg-white border border-stone-200 rounded-sm">
                                  Página {tablePage} de {totalTablePages}
                               </span>
                               <button
                                  onClick={() => setTablePage(p => Math.min(totalTablePages, p + 1))}
                                  disabled={tablePage >= totalTablePages}
                                  className="px-2 py-1 rounded-sm border border-stone-200 text-stone-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 hover:text-stone-900 transition-colors"
                               >
                                  <ChevronRight className="w-4 h-4" />
                               </button>
                            {allComponentsLoaded && (
                                        <button 
                                            onClick={() => setActiveTab('tests')}
                                        className="ml-4 text-[10px] text-stone-600 hover:text-stone-900 font-medium underline decoration-stone-300 underline-offset-2 hover:decoration-stone-900 transition-colors"
                                        >
                                     Continuar a pruebas automáticas →
                                        </button>
                            )}
                            </div>
                                    </div>
                                </div>
                          </motion.div>
                      )}
                  </AnimatePresence>
               </div>
            )}

            {/* --- TAB 2: AUTO TESTS --- */}
            {activeTab === 'tests' && (
               <div className="animate-fade-in max-w-7xl mx-auto">
                  {selectedTestId ? (
                     /* DETAIL VIEW */
                     renderTestDetail()
                  ) : (
                     /* LIST VIEW */
                     <div className="space-y-6">
                        {/* Header */}
                        <div className="flex justify-between items-end pb-6 border-b border-stone-200">
                           <div>
                              <h2 className="text-2xl font-serif text-stone-900 mb-2">Pruebas automáticas</h2>
                              <p className="text-sm text-stone-500 font-sans">Ejecuta y revisa los resultados de los agentes de análisis</p>
                           </div>
                        </div>

                        {/* Tests Cards */}
                        <div className="space-y-4">
                                 {/* Test 1: Reconciler */}
                           <motion.div
                                    key="reconciler"
                              initial={{ opacity: 0 }}
                                    onClick={() => testExecutionStates.reconciler !== 'not_executed' && setSelectedTestId('reconciler')}
                              className={`w-full border border-stone-200 rounded-sm bg-white shadow-sm transition-all ${
                                 testExecutionStates.reconciler !== 'not_executed' ? 'cursor-pointer hover:shadow-md hover:border-stone-300' : 'cursor-default'
                              }`}
                                    animate={{ 
                                 opacity: testExecutionStates.reconciler === 'not_executed' ? 0.8 : 1,
                                 backgroundColor: testExecutionStates.reconciler === 'running' ? '#eff6ff' : '#ffffff'
                              }}
                              transition={{ duration: 0.2 }}
                              whileHover={testExecutionStates.reconciler !== 'not_executed' ? { 
                                 backgroundColor: '#fafaf9',
                                 borderColor: '#d6d3d1'
                              } : {}}
                           >
                              <div className="p-4">
                                 {/* Fila 1: Título, badge agente, estado y botón */}
                                 <div className="flex items-center justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                       <h3 className="text-lg font-serif text-stone-900">Cuadre básico de Proveedores</h3>
                                       <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 whitespace-nowrap">Reconciler</span>
                                       <motion.div
                                          key={testExecutionStates.reconciler}
                                          initial={{ scale: 0.8, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                       >
                                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium inline-flex items-center gap-1.5 whitespace-nowrap ${
                                              testExecutionStates.reconciler === 'completed_with_issues' 
                                                 ? 'bg-amber-50 text-amber-700 border-amber-100' 
                                                 : testExecutionStates.reconciler === 'completed'
                                                 ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                 : testExecutionStates.reconciler === 'running'
                                                 ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                 : 'bg-stone-50 text-stone-400 border-stone-200'
                                           }`}>
                                              {testExecutionStates.reconciler === 'running' && <Loader2 className="w-3 h-3 animate-spin" />}
                                              {testExecutionStates.reconciler === 'completed_with_issues' ? 'Con incidencias' :
                                               testExecutionStates.reconciler === 'completed' ? 'Completado' :
                                               testExecutionStates.reconciler === 'running' ? 'Ejecutando...' :
                                               'No iniciada'}
                                           </span>
                                       </motion.div>
                                    </div>
                                       <motion.button
                                          whileTap={{ scale: 0.95 }}
                                          onClick={(e) => { e.stopPropagation(); handleOpenExecutionPlan('reconciler'); }}
                                          disabled={testExecutionStates.reconciler === 'running' || testExecutionStates.reconciler === 'completed_with_issues'}
                                       className={`px-3 py-1.5 text-xs font-medium rounded transition-all inline-flex items-center gap-1.5 shadow-sm flex-shrink-0 ${
                                              testExecutionStates.reconciler === 'completed_with_issues' 
                                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-default' 
                                              : 'bg-stone-900 text-white hover:bg-black'
                                          } ${testExecutionStates.reconciler === 'running' ? 'opacity-70 cursor-not-allowed' : ''}`}
                                       >
                                          {testExecutionStates.reconciler === 'running' ? (
                                          <>
                                             <Loader2 className="w-3 h-3 animate-spin" />
                                             Ejecutando...
                                          </>
                                          ) : testExecutionStates.reconciler === 'completed_with_issues' ? (
                                              <>
                                             <CheckCircle className="w-3 h-3" />
                                             Hecho
                                              </>
                                          ) : (
                                             <>
                                             <Play className="w-3 h-3" />
                                             Ejecutar
                                             </>
                                          )}
                                       </motion.button>
                                 </div>
                                 
                                 {/* Fila 2: Descripción, última ejecución y resultados */}
                                 <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                       <p className="text-xs text-stone-500 truncate">Comprueba si los totales de los ficheros (submayor, mayor y balance) coinciden</p>
                                       <div className="text-xs text-stone-500 whitespace-nowrap flex-shrink-0">
                                          <span className="font-medium">Última ejecución:</span>{' '}
                                          <span className="font-mono text-stone-400">{testLastRun.reconciler || '-'}</span>
                                       </div>
                                       <AnimatePresence>
                                          {testExecutionStates.reconciler === 'completed_with_issues' && (
                                             <motion.span 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 text-[10px] inline-flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
                                             >
                                                <AlertCircle className="w-3 h-3" />
                                                3 incidencias
                                             </motion.span>
                                          )}
                                       </AnimatePresence>
                                    </div>
                                 </div>
                              </div>
                           </motion.div>

                                 {/* Test 2: RiskMapper */}
                           <motion.div
                                    key="riskmapper"
                              initial={{ opacity: 0 }}
                                    onClick={() => testExecutionStates.riskmapper !== 'not_executed' && setSelectedTestId('riskmapper')}
                              className={`w-full border border-stone-200 rounded-sm bg-white shadow-sm transition-all ${
                                 testExecutionStates.riskmapper !== 'not_executed' ? 'cursor-pointer hover:shadow-md hover:border-stone-300' : 'cursor-default'
                              }`}
                                    animate={{ 
                                 opacity: testExecutionStates.riskmapper === 'not_executed' ? 0.6 : 1,
                                 backgroundColor: testExecutionStates.riskmapper === 'running' ? '#eff6ff' : '#ffffff'
                              }}
                              transition={{ duration: 0.2 }}
                              whileHover={testExecutionStates.riskmapper !== 'not_executed' ? { 
                                 backgroundColor: '#fafaf9',
                                 borderColor: '#d6d3d1'
                              } : {}}
                           >
                              <div className="p-4">
                                 {/* Fila 1: Título, badge agente, estado y badge automático */}
                                 <div className="flex items-center justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                       <h3 className="text-lg font-serif text-stone-900">Mapa de riesgos de Proveedores</h3>
                                       <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 whitespace-nowrap">RiskMapper</span>
                                       <motion.div
                                          key={testExecutionStates.riskmapper}
                                          initial={{ scale: 0.8, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                       >
                                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium inline-flex items-center gap-1.5 whitespace-nowrap ${
                                              testExecutionStates.riskmapper === 'completed'
                                                 ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                 : testExecutionStates.riskmapper === 'running'
                                                 ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                 : 'bg-stone-50 text-stone-400 border-stone-200'
                                           }`}>
                                              {testExecutionStates.riskmapper === 'running' && <Loader2 className="w-3 h-3 animate-spin" />}
                                              {testExecutionStates.riskmapper === 'completed' ? 'Completado' :
                                               testExecutionStates.riskmapper === 'running' ? 'Procesando...' :
                                               'Pendiente'}
                                           </span>
                                       </motion.div>
                                    </div>
                                    <span className="text-xs text-stone-400 italic bg-stone-50 px-2.5 py-1 rounded border border-stone-200 whitespace-nowrap flex-shrink-0">Automático</span>
                                 </div>
                                 
                                 {/* Fila 2: Descripción, última ejecución y resultados */}
                                 <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                       <p className="text-xs text-stone-500 truncate">Etiqueta cada proveedor como riesgo bajo/medio/alto según importes y desajustes</p>
                                       <div className="text-xs text-stone-500 whitespace-nowrap flex-shrink-0">
                                          <span className="font-medium">Última ejecución:</span>{' '}
                                       <span className="font-mono text-stone-400">{testLastRun.riskmapper || '-'}</span>
                                       </div>
                                        <AnimatePresence>
                                        {testExecutionStates.riskmapper === 'completed' && (
                                            <motion.span 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
                                            >
                                                <CheckCircle className="w-3 h-3" />
                                                Mapa generado
                                            </motion.span>
                                        )}
                                        </AnimatePresence>
                                    </div>
                                 </div>
                              </div>
                           </motion.div>

                                 {/* Test 3: Circularizer */}
                           <motion.div
                                    key="circularizer"
                              initial={{ opacity: 0 }}
                                    onClick={() => testExecutionStates.circularizer !== 'not_executed' && setSelectedTestId('circularizer')}
                              className="w-full border border-stone-200 rounded-sm bg-white shadow-sm transition-all cursor-pointer hover:shadow-md hover:border-stone-300"
                                    animate={{ 
                                 opacity: 1,
                                 backgroundColor: testExecutionStates.circularizer === 'running' ? '#eff6ff' : '#ffffff'
                              }}
                              transition={{ duration: 0.2 }}
                              whileHover={{ 
                                 backgroundColor: '#fafaf9',
                                 borderColor: '#d6d3d1'
                              }}
                           >
                              <div className="p-4">
                                 {/* Fila 1: Título, badge agente, estado y botón */}
                                 <div className="flex items-center justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                       <h3 className="text-lg font-serif text-stone-900">Circularizaciones proveedores</h3>
                                       <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 whitespace-nowrap">Circularizer</span>
                                       <motion.div
                                          key={testExecutionStates.circularizer}
                                          initial={{ scale: 0.8, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                       >
                                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium inline-flex items-center gap-1.5 whitespace-nowrap ${
                                              testExecutionStates.circularizer === 'completed'
                                                 ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                 : testExecutionStates.circularizer === 'running'
                                                 ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                 : 'bg-stone-50 text-stone-400 border-stone-200'
                                           }`}>
                                              {testExecutionStates.circularizer === 'running' && <Loader2 className="w-3 h-3 animate-spin" />}
                                              {testExecutionStates.circularizer === 'completed' ? 'Completado' :
                                               testExecutionStates.circularizer === 'running' ? 'Ejecutando...' :
                                               'No iniciada'}
                                           </span>
                                       </motion.div>
                                    </div>
                                       <motion.button
                                          whileTap={{ scale: 0.95 }}
                                          onClick={(e) => { e.stopPropagation(); handleOpenExecutionPlan('circularizer'); }}
                                          disabled={testExecutionStates.circularizer === 'running'}
                                       className={`px-3 py-1.5 text-xs font-medium rounded transition-all inline-flex items-center gap-1.5 shadow-sm flex-shrink-0 ${
                                              testExecutionStates.circularizer === 'completed'
                                              ? 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                                              : 'bg-stone-900 text-white hover:bg-black'
                                       } ${testExecutionStates.circularizer === 'running' ? 'opacity-70 cursor-not-allowed' : ''}`}
                                       >
                                          {testExecutionStates.circularizer === 'running' ? (
                                          <>
                                             <Loader2 className="w-3 h-3 animate-spin" />
                                             Ejecutando...
                                          </>
                                          ) : testExecutionStates.circularizer === 'completed' ? (
                                              <>
                                             <Play className="w-3 h-3" />
                                             Re-ejecutar
                                              </>
                                          ) : (
                                             <>
                                             <Play className="w-3 h-3" />
                                             Ejecutar
                                             </>
                                          )}
                                       </motion.button>
                                 </div>
                                 
                                 {/* Fila 2: Descripción y última ejecución */}
                                 <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                       <p className="text-xs text-stone-500 truncate">Selecciona proveedores clave para enviar cartas de confirmación</p>
                                       <div className="text-xs text-stone-500 whitespace-nowrap flex-shrink-0">
                                          <span className="font-medium">Última ejecución:</span>{' '}
                                          <span className="font-mono text-stone-400">{testLastRun.circularizer || '-'}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </motion.div>

                                 {/* Test 4: Tester */}
                           <motion.div
                                    key="tester"
                              initial={{ opacity: 0 }}
                                    onClick={() => testExecutionStates.tester !== 'not_executed' && setSelectedTestId('tester')}
                              className="w-full border border-stone-200 rounded-sm bg-white shadow-sm transition-all cursor-pointer hover:shadow-md hover:border-stone-300"
                                    animate={{ 
                                 opacity: 1,
                                 backgroundColor: testExecutionStates.tester === 'running' ? '#eff6ff' : '#ffffff'
                              }}
                              transition={{ duration: 0.2 }}
                              whileHover={{ 
                                 backgroundColor: '#fafaf9',
                                 borderColor: '#d6d3d1'
                              }}
                           >
                              <div className="p-4">
                                 {/* Fila 1: Título, badge agente, estado y botón */}
                                 <div className="flex items-center justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                       <h3 className="text-lg font-serif text-stone-900">Muestreo proveedores</h3>
                                       <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200 whitespace-nowrap">Tester</span>
                                       <motion.div
                                          key={testExecutionStates.tester}
                                          initial={{ scale: 0.8, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                       >
                                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium inline-flex items-center gap-1.5 whitespace-nowrap ${
                                              testExecutionStates.tester === 'completed'
                                                 ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                 : testExecutionStates.tester === 'running'
                                                 ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                 : 'bg-stone-50 text-stone-400 border-stone-200'
                                           }`}>
                                              {testExecutionStates.tester === 'running' && <Loader2 className="w-3 h-3 animate-spin" />}
                                              {testExecutionStates.tester === 'completed' ? 'Completado' :
                                               testExecutionStates.tester === 'running' ? 'Ejecutando...' :
                                               'No iniciada'}
                                           </span>
                                       </motion.div>
                                    </div>
                                       <motion.button
                                          whileTap={{ scale: 0.95 }}
                                          onClick={(e) => { e.stopPropagation(); handleOpenExecutionPlan('tester'); }}
                                          disabled={testExecutionStates.tester === 'running'}
                                       className={`px-3 py-1.5 text-xs font-medium rounded transition-all inline-flex items-center gap-1.5 shadow-sm flex-shrink-0 ${
                                              testExecutionStates.tester === 'completed'
                                              ? 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                                              : 'bg-stone-900 text-white hover:bg-black'
                                       } ${testExecutionStates.tester === 'running' ? 'opacity-70 cursor-not-allowed' : ''}`}
                                       >
                                          {testExecutionStates.tester === 'running' ? (
                                          <>
                                             <Loader2 className="w-3 h-3 animate-spin" />
                                             Ejecutando...
                                          </>
                                          ) : testExecutionStates.tester === 'completed' ? (
                                              <>
                                             <Play className="w-3 h-3" />
                                             Re-ejecutar
                                              </>
                                          ) : (
                                             <>
                                             <Play className="w-3 h-3" />
                                             Ejecutar
                                             </>
                                          )}
                                       </motion.button>
                                 </div>
                                 
                                 {/* Fila 2: Descripción y última ejecución */}
                                 <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                       <p className="text-xs text-stone-500 truncate">Selecciona una muestra de facturas para revisión manual</p>
                                       <div className="text-xs text-stone-500 whitespace-nowrap flex-shrink-0">
                                          <span className="font-medium">Última ejecución:</span>{' '}
                                          <span className="font-mono text-stone-400">{testLastRun.tester || '-'}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                        </motion.div>
                        </div>
                     </div>
                  )}
               </div>
            )}

            {/* --- TAB 3: FINDINGS (Master-Detail) --- */}
            {activeTab === 'findings' && (
               <div className={`animate-fade-in h-full ${isFindingsSidebarOpen ? 'findings-sidebar-open' : ''}`}>
                  <EngagementFindings onSidebarToggle={setIsFindingsSidebarOpen} />
               </div>
            )}

            {/* --- TAB 4: PAPERS --- */}
            {activeTab === 'papers' && (
               <div className="animate-fade-in max-w-7xl mx-auto">
                  {/* Show selected tool or list */}
                  {selectedPapersTool === 'analytical' ? (
                     <EngagementAnalyticalReview onBack={() => setSelectedPapersTool('list')} />
                  ) : selectedPapersTool === 'conclusions' ? (
                     <EngagementConclusionsWriter onBack={() => setSelectedPapersTool('list')} />
                  ) : (
                     <div className="space-y-8">
                        {/* Header */}
                        <div className="flex justify-between items-end pb-6 border-b border-stone-200">
                           <div>
                              <h2 className="text-2xl font-serif text-stone-900 mb-2">Papeles de trabajo</h2>
                              <p className="text-sm text-stone-500 font-sans">Documentación y herramientas de auditoría con IA</p>
                           </div>
                        </div>

                        {/* AI Tools Section */}
                        <div className="mb-8">
                           <h3 className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5" />
                              Herramientas con Inteligencia Artificial
                           </h3>
                           <div className="grid grid-cols-2 gap-4">
                              {/* Analytical Review Card */}
                              <button
                                 onClick={() => setSelectedPapersTool('analytical')}
                                 className="bg-white border border-stone-200 rounded-sm p-5 cursor-pointer hover:border-stone-300 hover:bg-stone-50/50 transition-all text-left group"
                              >
                                 <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                       <h4 className="text-sm font-medium text-stone-900">Revisión Analítica</h4>
                                       <span className="text-[9px] px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded border border-stone-200 font-medium uppercase tracking-wider">IA</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
                                 </div>
                                 <p className="text-xs text-stone-500 leading-relaxed">
                                    Compara saldos con el ejercicio anterior y genera un informe de variaciones automáticamente.
                                 </p>
                              </button>

                              {/* Conclusions Writer Card */}
                              <button
                                 onClick={() => setSelectedPapersTool('conclusions')}
                                 className="bg-white border border-stone-200 rounded-sm p-5 cursor-pointer hover:border-stone-300 hover:bg-stone-50/50 transition-all text-left group"
                              >
                                 <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                       <h4 className="text-sm font-medium text-stone-900">Redactar Conclusiones</h4>
                                       <span className="text-[9px] px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded border border-stone-200 font-medium uppercase tracking-wider">IA</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
                                 </div>
                                 <p className="text-xs text-stone-500 leading-relaxed">
                                    Genera automáticamente el informe de conclusiones basado en todas las pruebas y hallazgos del área.
                                 </p>
                              </button>
                           </div>
                        </div>

                        {/* Generated Documents Section */}
                        <div>
                           <h3 className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-stone-400" />
                              Documentos del área
                           </h3>
                           <div className="bg-white border border-stone-200 shadow-sm divide-y divide-stone-100 rounded-sm">
                              {papers.map(paper => (
                                 <div key={paper.id} className="p-5 flex items-center justify-between hover:bg-stone-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 rounded-lg">
                                          <FileText className="w-5 h-5" />
                                       </div>
                                       <div>
                                          <h4 className="text-sm font-medium text-stone-900">{paper.name}</h4>
                                          <div className="flex items-center gap-2 mt-0.5">
                                             <span className="text-xs text-stone-400 font-mono">{paper.id}</span>
                                             <span className="text-[10px] text-stone-300">•</span>
                                             <span className="text-[10px] text-stone-400">Modified {paper.date}</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wide font-medium ${
                                          paper.status === 'final' ? 'bg-stone-900 text-white border-stone-900' :
                                          paper.status === 'review' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                          'bg-stone-100 text-stone-500 border-stone-200'
                                       }`}>
                                          {t(`engagement.paper_status_${paper.status}`)}
                                       </span>
                                       <button className="p-2 text-stone-300 hover:text-stone-900 hover:bg-stone-100 rounded transition-all">
                                          <Download className="w-4 h-4" />
                                       </button>
                                       <button className="p-2 text-stone-300 hover:text-stone-900 hover:bg-stone-100 rounded transition-all">
                                          <MoreHorizontal className="w-4 h-4" />
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            )}

           </div>
         </div>

         {/* Execution Plan Modal */}
         <AnimatePresence>
            {showExecutionPlanModal && pendingTestId && testPlans[pendingTestId] && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setShowExecutionPlanModal(false)}
               >
                  <motion.div
                     initial={{ scale: 0.95, opacity: 0, y: 20 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ scale: 0.95, opacity: 0, y: 20 }}
                     transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                     onClick={(e) => e.stopPropagation()}
                     className="bg-white rounded-lg shadow-2xl border border-stone-200 max-w-lg w-full overflow-hidden"
                  >
                     {/* Header */}
                     <div className="px-6 py-5 border-b border-stone-100 bg-gradient-to-r from-stone-50 to-white">
                        <div className="flex items-start justify-between">
                           <div>
                              <div className="flex items-center gap-2 mb-2">
                                 <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center">
                                    <Play className="w-4 h-4 text-white" />
                                 </div>
                                 <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 uppercase tracking-wider">
                                    Plan de Ejecución
                                 </span>
                              </div>
                              <h3 className="text-xl font-serif text-stone-900">
                                 {testPlans[pendingTestId].title}
                              </h3>
                           </div>
                           <button
                              onClick={() => setShowExecutionPlanModal(false)}
                              className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                           >
                              <X className="w-5 h-5" />
                           </button>
                        </div>
                     </div>

                     {/* Content */}
                     <div className="p-6">
                        {/* Description */}
                        <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                           {testPlans[pendingTestId].description}
                        </p>

                        {/* Steps */}
                        <div className="mb-6">
                           <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <ClipboardCheck className="w-4 h-4" />
                              Pasos a ejecutar
                           </h4>
                           <div className="space-y-2">
                              {testPlans[pendingTestId].steps.map((step, index) => (
                                 <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg border border-stone-100"
                                 >
                                    <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                       {index + 1}
                                    </span>
                                    <span className="text-sm text-stone-700 pt-0.5">{step}</span>
                                 </motion.div>
                              ))}
                           </div>
                        </div>

                        {/* Requirements */}
                        <div className="mb-6">
                           <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Requisitos
                           </h4>
                           <div className="flex flex-wrap gap-2">
                              {testPlans[pendingTestId].requirements.map((req, index) => (
                                 <span
                                    key={index}
                                    className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1.5"
                                 >
                                    <CheckCircle2 className="w-3 h-3" />
                                    {req}
                                 </span>
                              ))}
                           </div>
                        </div>

                        {/* Duration estimate */}
                        <div className="flex items-center gap-2 text-sm text-stone-500 bg-stone-50 px-4 py-3 rounded-lg border border-stone-100">
                           <Loader2 className="w-4 h-4 text-stone-400" />
                           <span>Tiempo estimado: <strong className="text-stone-700">{testPlans[pendingTestId].duration}</strong></span>
                        </div>
                     </div>

                     {/* Footer */}
                     <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex items-center justify-end gap-3">
                        <motion.button
                           whileTap={{ scale: 0.97 }}
                           onClick={() => setShowExecutionPlanModal(false)}
                           className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                           Cancelar
                        </motion.button>
                        <motion.button
                           whileTap={{ scale: 0.97 }}
                           whileHover={{ scale: 1.02 }}
                           onClick={handleConfirmExecution}
                           className="px-5 py-2 text-sm font-medium bg-stone-900 text-white rounded-lg hover:bg-black transition-colors inline-flex items-center gap-2 shadow-sm"
                        >
                           <Play className="w-4 h-4" />
                           Ejecutar ahora
                        </motion.button>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Preview Modal */}
         <AnimatePresence>
            {showPreviewModal && previewFileType && filePreviewData[previewFileType] && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={handleCancelPreview}
               >
                  <motion.div
                     initial={{ scale: 0.98, opacity: 0, y: 10 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ scale: 0.98, opacity: 0, y: 10 }}
                     transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                     onClick={(e) => e.stopPropagation()}
                     className="bg-white rounded-sm shadow-2xl border border-stone-200 max-w-5xl w-full max-h-[85vh] flex flex-col"
                  >
                     {/* Header */}
                     <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-white">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                               <span className="px-2 py-0.5 rounded-sm bg-stone-100 text-stone-500 text-[10px] font-medium uppercase tracking-wider border border-stone-200">
                                   Vista Previa
                               </span>
                               {fileErrors[previewFileType].length > 0 && (
                                   <span className="px-2 py-0.5 rounded-sm bg-rose-50 text-rose-600 text-[10px] font-medium uppercase tracking-wider border border-rose-100 flex items-center gap-1">
                                       <AlertTriangle className="w-3 h-3" />
                                       Con errores
                                   </span>
                               )}
                           </div>
                           <h3 className="text-xl font-serif text-stone-900">
                              {previewFileType === 'movements' && 'Movimientos de proveedores'}
                              {previewFileType === 'ledger' && 'Libro mayor (400/410)'}
                              {previewFileType === 'closing' && 'Saldo de cierre'}
                           </h3>
                        </div>
                        <button
                           onClick={handleCancelPreview}
                           className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-sm transition-colors"
                        >
                           <X className="w-5 h-5" />
                        </button>
                     </div>

                     {/* Content */}
                     <div className="flex-1 overflow-y-auto bg-stone-50/50 p-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                           <div className="bg-white border border-stone-200 rounded-sm p-4 shadow-sm">
                              <div className="text-[10px] text-stone-400 uppercase tracking-wider mb-1 font-medium">Total Registros</div>
                              <div className="text-2xl font-serif text-stone-900 tabular-nums">
                                 {(fileDataCounts[previewFileType] || filePreviewData[previewFileType]?.length || 0).toLocaleString()}
                              </div>
                           </div>
                           <div className="bg-white border border-stone-200 rounded-sm p-4 shadow-sm">
                              <div className="text-[10px] text-stone-400 uppercase tracking-wider mb-1 font-medium">Columnas Detectadas</div>
                              <div className="text-2xl font-serif text-stone-900 tabular-nums">
                                 {filePreviewData[previewFileType]?.[0] ? Object.keys(filePreviewData[previewFileType][0]).length : 0}
                              </div>
                           </div>
                           <div className={`border rounded-sm p-4 shadow-sm ${
                               fileErrors[previewFileType].length > 0 
                                ? 'bg-rose-50/50 border-rose-100' 
                                : 'bg-emerald-50/50 border-emerald-100'
                           }`}>
                              <div className={`text-[10px] uppercase tracking-wider mb-1 font-medium ${
                                  fileErrors[previewFileType].length > 0 ? 'text-rose-600' : 'text-emerald-600'
                              }`}>Estado Validación</div>
                              <div className={`text-sm font-medium flex items-center gap-2 ${
                                  fileErrors[previewFileType].length > 0 ? 'text-rose-700' : 'text-emerald-700'
                              }`}>
                                 {fileErrors[previewFileType].length > 0 ? (
                                     <><XCircle className="w-4 h-4" /> Requiere revisión</>
                                 ) : (
                                     <><CheckCircle2 className="w-4 h-4" /> Estructura correcta</>
                                 )}
                              </div>
                           </div>
                        </div>

                        {/* Error Alert in Modal */}
                        {fileErrors[previewFileType].length > 0 && (
                            <div className="mb-6 bg-rose-50 border border-rose-100 rounded-sm p-4">
                                <h4 className="text-xs font-medium text-rose-800 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Errores detectados que impiden la carga correcta:
                                </h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {fileErrors[previewFileType].map((err, idx) => (
                                        <li key={idx} className="text-xs text-rose-600">{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Preview Table */}
                        <div className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden">
                           <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                 <thead className="bg-stone-50 text-[10px] text-stone-500 font-sans uppercase tracking-wider border-b border-stone-200">
                                    <tr>
                                       <th className="px-4 py-3 font-medium w-12 text-center text-stone-400">#</th>
                                       {filePreviewData[previewFileType]?.[0] && Object.keys(filePreviewData[previewFileType][0]).map((key) => (
                                          <th key={key} className="px-4 py-3 font-medium">
                                             {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                          </th>
                                       ))}
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-stone-100">
                                    {filePreviewData[previewFileType]
                                        ?.slice((previewPage - 1) * ITEMS_PER_PAGE, previewPage * ITEMS_PER_PAGE)
                                        .map((row, idx) => (
                                       <tr key={idx} className="text-xs text-stone-600 hover:bg-stone-50 transition-colors">
                                          <td className="px-4 py-2.5 text-center font-mono text-[10px] text-stone-300 border-r border-stone-50">
                                              {((previewPage - 1) * ITEMS_PER_PAGE) + idx + 1}
                                          </td>
                                          {Object.values(row).map((value: any, colIdx) => (
                                             <td key={colIdx} className="px-4 py-2.5 whitespace-nowrap">
                                                {typeof value === 'number' 
                                                   ? <span className="font-mono text-stone-700">{value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                   : value
                                                }
                                             </td>
                                          ))}
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                           
                           {/* Pagination Controls */}
                           <div className="bg-white px-4 py-3 border-t border-stone-200 flex items-center justify-between">
                              <div className="text-[10px] text-stone-400">
                                 {(() => {
                                    const totalRecords = fileDataCounts[previewFileType] || filePreviewData[previewFileType]?.length || 0;
                                    const start = ((previewPage - 1) * ITEMS_PER_PAGE) + 1;
                                    const end = Math.min(previewPage * ITEMS_PER_PAGE, totalRecords);
                                    return `Mostrando ${start.toLocaleString()} - ${end.toLocaleString()} de ${totalRecords.toLocaleString()} registros`;
                                 })()}
                              </div>
                              <div className="flex gap-2">
                                  {(() => {
                                    const totalRecords = fileDataCounts[previewFileType] || filePreviewData[previewFileType]?.length || 0;
                                    const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);
                                    return (
                                       <>
                                          <button 
                                            onClick={() => setPreviewPage(p => Math.max(1, p - 1))}
                                            disabled={previewPage === 1}
                                            className="px-2 py-1 rounded-sm border border-stone-200 text-stone-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 hover:text-stone-900 transition-colors"
                                          >
                                              <ChevronRight className="w-4 h-4 rotate-180" />
                                          </button>
                                          <span className="px-3 py-1 text-xs font-medium text-stone-600 bg-stone-50 border border-stone-200 rounded-sm">
                                              Página {previewPage} de {totalPages}
                                          </span>
                                          <button 
                                            onClick={() => setPreviewPage(p => Math.min(totalPages, p + 1))}
                                            disabled={previewPage >= totalPages}
                                            className="px-2 py-1 rounded-sm border border-stone-200 text-stone-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 hover:text-stone-900 transition-colors"
                                          >
                                              <ChevronRight className="w-4 h-4" />
                                          </button>
                                       </>
                                    );
                                  })()}
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Footer */}
                     <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between bg-stone-50 rounded-b-sm">
                        <div className="text-xs text-stone-500">
                            {fileErrors[previewFileType].length > 0 ? (
                                <span className="text-rose-600 font-medium flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Corrige los errores antes de continuar
                                </span>
                            ) : (
                                <span>Todo parece correcto</span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                               onClick={handleCancelPreview}
                               className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-sm hover:border-stone-300 transition-colors shadow-sm"
                            >
                               Cancelar
                            </button>
                            <button
                               onClick={handleConfirmUpload}
                               disabled={fileErrors[previewFileType].length > 0}
                               className="px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded-sm hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                               <CheckCircle2 className="w-4 h-4" />
                               Confirmar y subir
                            </button>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Global Processing State - Outside all containers for full screen coverage */}
         <AnimatePresence>
            {isGlobalProcessing && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center"
               >
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: 0.1, duration: 0.3 }}
                     className="w-80 space-y-6 text-center"
                  >
                     <div className="flex flex-col items-center gap-4">
                        <motion.div
                           animate={{ rotate: 360 }}
                           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                           <Loader2 className="w-8 h-8 text-stone-900" />
                        </motion.div>
                        <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
                           <motion.div
                              className="h-full bg-stone-900 rounded-full"
                              initial={{ width: 0 }}
                              animate={{
                                 width: globalProcessingStage === 'reconciling' ? '33%' :
                                        globalProcessingStage === 'sanity_check' ? '66%' : '100%'
                              }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                           />
                        </div>
                     </div>
                     <motion.div
                        key={globalProcessingStage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                     >
                        <h3 className="text-base font-medium text-stone-900 mb-2">
                           {globalProcessingStage === 'reconciling' ? 'Conciliando ficheros...' : 
                            globalProcessingStage === 'sanity_check' ? 'Ejecutando sanity check...' : 'Finalizando procesamiento...'}
                        </h3>
                        <p className="text-xs text-stone-500">
                           {globalProcessingStage === 'reconciling' ? 'Verificando consistencia entre libro mayor y submayor' :
                            globalProcessingStage === 'sanity_check' ? 'Analizando 12,405 transacciones y calculando métricas' :
                            'Preparando visualización de resultados'}
                        </p>
                     </motion.div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
    </div>
  );
};

