import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, X, Save, 
  FileText, User, Calendar, Weight, 
  Droplet, Heart, Activity, Baby,
  Stethoscope, ClipboardList, AlertCircle,
  CheckCircle, Printer, Search, Filter,
  ChevronDown, ChevronUp, Download,
  Mail, Phone, MapPin, Clock, Eye,
  History, ChevronRight, Pill, Syringe,
  Leaf, FileSignature, TrendingUp
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { patients } from '../../data/patients';

const ClinicalRecords = () => {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [activeTab, setActiveTab] = useState('antenatal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientRecords, setShowPatientRecords] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);

  // Sample records with 10 patients
  const [records, setRecords] = useState([
    // Patient 1: Maria Garcia
    {
      id: 1,
      patientId: 1,
      patientName: 'Maria Garcia',
      antenatal: {
        clinicDate: '2026-06-15',
        gestationalAge: '28',
        gestationalWeeks: '28',
        age: '33',
        weight: '68.5',
        urineSugar: 'Negative',
        urineAlbumin: 'Negative',
        anaemia: 'Normal',
        bloodPressure: '120/80',
        fundalHeight: '28',
        fetalLie: 'Longitudinal',
        fetalMovement: 'Active',
        fetalHeartRate: '140',
        pedalOedema: 'Absent',
        fetalMovements: 'Active',
        dangerSigns: 'None',
        counselling: 'Routine antenatal care, diet advice',
        nextClinicDate: '2026-07-13',
        officerSignature: 'Dr. S. Johnson',
        mentalStatus: '4',
        // New fields
        vitaminC: 'Given',
        calcium: 'Given',
        malariaTreatment: 'Not Required',
        thriposha: 'Given',
        examinedBy: 'Dr. S. Johnson',
        foetalMovementChartDate: '2026-06-15',
        dewormingTreatment: 'Given',
        medicineBatchNumber: 'BATCH-2026-001'
      },
      postnatal: null
    },
    // Patient 2: Jessica Williams
    {
      id: 2,
      patientId: 2,
      patientName: 'Jessica Williams',
      antenatal: {
        clinicDate: '2026-06-14',
        gestationalAge: '32',
        gestationalWeeks: '32',
        age: '35',
        weight: '75.2',
        urineSugar: 'Positive',
        urineAlbumin: 'Trace',
        anaemia: 'Mild',
        bloodPressure: '145/95',
        fundalHeight: '32',
        fetalLie: 'Transverse',
        fetalMovement: 'Reduced',
        fetalHeartRate: '135',
        pedalOedema: 'Mild',
        fetalMovements: 'Reduced',
        dangerSigns: 'Headache, Visual disturbances',
        counselling: 'Advised bed rest, referred to specialist',
        nextClinicDate: '2026-06-21',
        officerSignature: 'Dr. S. Johnson',
        mentalStatus: '3',
        // New fields
        vitaminC: 'Given',
        calcium: 'Given',
        malariaTreatment: 'Given',
        thriposha: 'Given',
        examinedBy: 'Dr. S. Johnson',
        foetalMovementChartDate: '2026-06-14',
        dewormingTreatment: 'Given',
        medicineBatchNumber: 'BATCH-2026-002'
      },
      postnatal: null
    },
    // Patient 3: Sarah Johnson
    {
      id: 3,
      patientId: 3,
      patientName: 'Sarah Johnson',
      antenatal: {
        clinicDate: '2026-06-13',
        gestationalAge: '24',
        gestationalWeeks: '24',
        age: '31',
        weight: '62.5',
        urineSugar: 'Negative',
        urineAlbumin: 'Negative',
        anaemia: 'Normal',
        bloodPressure: '115/75',
        fundalHeight: '24',
        fetalLie: 'Longitudinal',
        fetalMovement: 'Active',
        fetalHeartRate: '142',
        pedalOedema: 'Absent',
        fetalMovements: 'Active',
        dangerSigns: 'None',
        counselling: 'First antenatal visit, routine care',
        nextClinicDate: '2026-07-11',
        officerSignature: 'Dr. S. Johnson',
        mentalStatus: '5',
        // New fields
        vitaminC: 'Given',
        calcium: 'Given',
        malariaTreatment: 'Not Required',
        thriposha: 'Given',
        examinedBy: 'Dr. S. Johnson',
        foetalMovementChartDate: '2026-06-13',
        dewormingTreatment: 'Not Given',
        medicineBatchNumber: 'BATCH-2026-003'
      },
      postnatal: null
    },
    // Patient 4: Emily Brown
    {
      id: 4,
      patientId: 4,
      patientName: 'Emily Brown',
      antenatal: {
        clinicDate: '2026-06-12',
        gestationalAge: '20',
        gestationalWeeks: '20',
        age: '28',
        weight: '58.5',
        urineSugar: 'Negative',
        urineAlbumin: 'Negative',
        anaemia: 'Normal',
        bloodPressure: '110/70',
        fundalHeight: '20',
        fetalLie: 'Longitudinal',
        fetalMovement: 'Active',
        fetalHeartRate: '138',
        pedalOedema: 'Absent',
        fetalMovements: 'Active',
        dangerSigns: 'None',
        counselling: 'Anomaly scan done, normal',
        nextClinicDate: '2026-07-10',
        officerSignature: 'Dr. S. Johnson',
        mentalStatus: '4',
        // New fields
        vitaminC: 'Given',
        calcium: 'Given',
        malariaTreatment: 'Not Required',
        thriposha: 'Given',
        examinedBy: 'Dr. S. Johnson',
        foetalMovementChartDate: '2026-06-12',
        dewormingTreatment: 'Given',
        medicineBatchNumber: 'BATCH-2026-004'
      },
      postnatal: null
    },
    // Patient 5: Amanda Jones
    {
      id: 5,
      patientId: 5,
      patientName: 'Amanda Jones',
      antenatal: {
        clinicDate: '2026-06-11',
        gestationalAge: '36',
        gestationalWeeks: '36',
        age: '38',
        weight: '82.0',
        urineSugar: 'Trace',
        urineAlbumin: 'Positive',
        anaemia: 'Moderate',
        bloodPressure: '150/100',
        fundalHeight: '36',
        fetalLie: 'Longitudinal',
        fetalMovement: 'Active',
        fetalHeartRate: '145',
        pedalOedema: 'Severe',
        fetalMovements: 'Active',
        dangerSigns: 'Severe headache, visual disturbances',
        counselling: 'Admitted for pre-eclampsia management',
        nextClinicDate: '2026-06-18',
        officerSignature: 'Dr. S. Johnson',
        mentalStatus: '2',
        // New fields
        vitaminC: 'Given',
        calcium: 'Given',
        malariaTreatment: 'Given',
        thriposha: 'Given',
        examinedBy: 'Dr. S. Johnson',
        foetalMovementChartDate: '2026-06-11',
        dewormingTreatment: 'Given',
        medicineBatchNumber: 'BATCH-2026-005'
      },
      postnatal: null
    },
    // Patient 6: Lisa Taylor
    {
      id: 6,
      patientId: 6,
      patientName: 'Lisa Taylor',
      antenatal: {
        clinicDate: '2026-06-10',
        gestationalAge: '30',
        gestationalWeeks: '30',
        age: '32',
        weight: '70.0',
        urineSugar: 'Negative',
        urineAlbumin: 'Negative',
        anaemia: 'Normal',
        bloodPressure: '125/82',
        fundalHeight: '30',
        fetalLie: 'Longitudinal',
        fetalMovement: 'Active',
        fetalHeartRate: '140',
        pedalOedema: 'Absent',
        fetalMovements: 'Active',
        dangerSigns: 'None',
        counselling: 'Routine checkup, advised on nutrition',
        nextClinicDate: '2026-07-08',
        officerSignature: 'Dr. S. Johnson',
        mentalStatus: '4',
        // New fields
        vitaminC: 'Given',
        calcium: 'Given',
        malariaTreatment: 'Not Required',
        thriposha: 'Given',
        examinedBy: 'Dr. S. Johnson',
        foetalMovementChartDate: '2026-06-10',
        dewormingTreatment: 'Not Given',
        medicineBatchNumber: 'BATCH-2026-006'
      },
      postnatal: null
    },
    // Patient 7: Michelle Davis
    {
      id: 7,
      patientId: 7,
      patientName: 'Michelle Davis',
      antenatal: {
        clinicDate: '2026-06-09',
        gestationalAge: '16',
        gestationalWeeks: '16',
        age: '25',
        weight: '55.0',
        urineSugar: 'Negative',
        urineAlbumin: 'Negative',
        anaemia: 'Normal',
        bloodPressure: '108/68',
        fundalHeight: '16',
        fetalLie: 'Longitudinal',
        fetalMovement: 'Active',
        fetalHeartRate: '150',
        pedalOedema: 'Absent',
        fetalMovements: 'Active',
        dangerSigns: 'None',
        counselling: 'Routine antenatal care, folic acid supplements',
        nextClinicDate: '2026-07-07',
        officerSignature: 'Dr. S. Johnson',
        mentalStatus: '5',
        // New fields
        vitaminC: 'Given',
        calcium: 'Given',
        malariaTreatment: 'Not Required',
        thriposha: 'Given',
        examinedBy: 'Dr. S. Johnson',
        foetalMovementChartDate: '2026-06-09',
        dewormingTreatment: 'Given',
        medicineBatchNumber: 'BATCH-2026-007'
      },
      postnatal: null
    },
    // Patient 8: Rachel Wilson
    {
      id: 8,
      patientId: 8,
      patientName: 'Rachel Wilson',
      antenatal: {
        clinicDate: '2026-06-08',
        gestationalAge: '34',
        gestationalWeeks: '34',
        age: '36',
        weight: '78.5',
        urineSugar: 'Positive',
        urineAlbumin: 'Trace',
        anaemia: 'Mild',
        bloodPressure: '140/90',
        fundalHeight: '34',
        fetalLie: 'Transverse',
        fetalMovement: 'Active',
        fetalHeartRate: '142',
        pedalOedema: 'Moderate',
        fetalMovements: 'Active',
        dangerSigns: 'Swelling, high BP',
        counselling: 'Gestational diabetes diet plan, BP monitoring',
        nextClinicDate: '2026-06-22',
        officerSignature: 'Dr. S. Johnson',
        mentalStatus: '3',
        // New fields
        vitaminC: 'Given',
        calcium: 'Given',
        malariaTreatment: 'Given',
        thriposha: 'Given',
        examinedBy: 'Dr. S. Johnson',
        foetalMovementChartDate: '2026-06-08',
        dewormingTreatment: 'Given',
        medicineBatchNumber: 'BATCH-2026-008'
      },
      postnatal: null
    },
    // Patient 9: Christina Martinez
    {
      id: 9,
      patientId: 9,
      patientName: 'Christina Martinez',
      antenatal: {
        clinicDate: '2026-06-07',
        gestationalAge: '26',
        gestationalWeeks: '26',
        age: '30',
        weight: '65.0',
        urineSugar: 'Negative',
        urineAlbumin: 'Negative',
        anaemia: 'Normal',
        bloodPressure: '118/78',
        fundalHeight: '26',
        fetalLie: 'Longitudinal',
        fetalMovement: 'Active',
        fetalHeartRate: '136',
        pedalOedema: 'Absent',
        fetalMovements: 'Active',
        dangerSigns: 'None',
        counselling: 'Routine care, iron supplements',
        nextClinicDate: '2026-07-05',
        officerSignature: 'Dr. S. Johnson',
        mentalStatus: '4',
        // New fields
        vitaminC: 'Given',
        calcium: 'Given',
        malariaTreatment: 'Not Required',
        thriposha: 'Given',
        examinedBy: 'Dr. S. Johnson',
        foetalMovementChartDate: '2026-06-07',
        dewormingTreatment: 'Not Given',
        medicineBatchNumber: 'BATCH-2026-009'
      },
      postnatal: null
    },
    // Patient 10: Laura Anderson
    {
      id: 10,
      patientId: 10,
      patientName: 'Laura Anderson',
      antenatal: {
        clinicDate: '2026-06-06',
        gestationalAge: '40',
        gestationalWeeks: '40',
        age: '40',
        weight: '85.0',
        urineSugar: 'Trace',
        urineAlbumin: 'Positive',
        anaemia: 'Moderate',
        bloodPressure: '155/105',
        fundalHeight: '40',
        fetalLie: 'Longitudinal',
        fetalMovement: 'Active',
        fetalHeartRate: '148',
        pedalOedema: 'Severe',
        fetalMovements: 'Active',
        dangerSigns: 'Severe pre-eclampsia, induction planned',
        counselling: 'Admitted for induction of labor',
        nextClinicDate: '2026-06-13',
        officerSignature: 'Dr. S. Johnson',
        mentalStatus: '2',
        // New fields
        vitaminC: 'Given',
        calcium: 'Given',
        malariaTreatment: 'Given',
        thriposha: 'Given',
        examinedBy: 'Dr. S. Johnson',
        foetalMovementChartDate: '2026-06-06',
        dewormingTreatment: 'Given',
        medicineBatchNumber: 'BATCH-2026-010'
      },
      postnatal: null
    }
  ]);

  // Form Data State
  const [formData, setFormData] = useState({
    patientId: '',
    clinicDate: new Date().toISOString().split('T')[0],
    gestationalAge: '',
    gestationalWeeks: '',
    age: '',
    weight: '',
    urineSugar: 'Negative',
    urineAlbumin: 'Negative',
    anaemia: 'Normal',
    bloodPressure: '',
    fundalHeight: '',
    fetalLie: 'Longitudinal',
    fetalMovement: 'Active',
    fetalHeartRate: '',
    pedalOedema: 'Absent',
    fetalMovements: 'Active',
    dangerSigns: '',
    counselling: '',
    nextClinicDate: '',
    officerSignature: '',
    mentalStatus: '3',
    // New fields
    vitaminC: 'Not Given',
    calcium: 'Not Given',
    malariaTreatment: 'Not Required',
    thriposha: 'Not Given',
    examinedBy: '',
    foetalMovementChartDate: new Date().toISOString().split('T')[0],
    dewormingTreatment: 'Not Given',
    medicineBatchNumber: ''
  });

  // Postnatal Form Data
  const [postnatalData, setPostnatalData] = useState({
    breastProblems: 'None',
    abnormalVaginalDischarge: 'None',
    excessiveVaginalBleeding: 'None',
    pallor: 'Normal',
    icterus: 'Normal',
    oedema: 'Absent',
    bloodPressure: '',
    cardiovascularSystem: 'Normal',
    respiratorySystem: 'Normal',
    abdominalExamination: 'Normal',
    vaginalExamination: 'Not Done',
    epdsScreening: '0',
    mentalStatus: 'Normal',
    other: '',
    identifiedProblems: '',
    actionsTaken: '',
    familyPlanningMethod: 'None',
    familyPlanningChosen: '',
    familyPlanningReason: '',
    familyPlanningPlace: '',
    familyPlanningDate: '',
    familyPlanningTime: '',
    specialNotes: '',
    officerSignature: ''
  });

  // Options
  const mentalStatusOptions = [
    { value: '1', label: '1 - Very Poor' },
    { value: '2', label: '2 - Poor' },
    { value: '3', label: '3 - Fair' },
    { value: '4', label: '4 - Good' },
    { value: '5', label: '5 - Excellent' },
    { value: 'NE', label: 'NE - Not Examined' }
  ];

  const urineOptions = ['Negative', 'Trace', 'Positive'];
  const fetalLieOptions = ['Longitudinal', 'Transverse', 'Oblique'];
  const fetalGrowthOptions = ['Normal', 'Restricted', 'Excessive'];
  const oedemaOptions = ['Absent', 'Mild', 'Moderate', 'Severe'];
  const fetalMovementOptions = ['Active', 'Normal', 'Reduced', 'Absent'];
  const anaemiaOptions = ['Normal', 'Mild', 'Moderate', 'Severe'];
  const yesNoOptions = ['Given', 'Not Given'];
  const malariaOptions = ['Given', 'Not Required', 'Not Given'];
  const postnatalStatusOptions = ['Normal', 'Anxious', 'Depressed', 'Postpartum Depression', 'Psychosis'];
  const familyPlanningMethods = [
    { value: 'None', label: 'None' },
    { value: 'T', label: 'T - Tubal Ligation' },
    { value: 'L', label: 'L - Laparoscopy' },
    { value: 'IP', label: 'IP - Implanon' },
    { value: 'N', label: 'N - Natural' },
    { value: 'V', label: 'V - Vasectomy' },
    { value: 'C', label: 'C - Condom' }
  ];

  const getPatientName = (id) => {
    const patient = patients.find(p => p.id === parseInt(id));
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  };

  const getPatientDetails = (id) => {
    return patients.find(p => p.id === parseInt(id));
  };

  const getPatientRecords = (patientId) => {
    return records.filter(r => r.patientId === parseInt(patientId));
  };

  // Get complete patient history
  const getPatientCompleteHistory = (patientId) => {
    const patient = getPatientDetails(patientId);
    const patientRecords = getPatientRecords(patientId);
    
    return {
      patient: patient,
      records: patientRecords,
      summary: {
        totalVisits: patientRecords.length,
        highRisk: patient?.pregnancy?.highRisk || false,
        complications: patient?.pregnancy?.complications || [],
        lastVisit: patientRecords.length > 0 ? patientRecords[patientRecords.length - 1].antenatal.clinicDate : 'N/A'
      }
    };
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const search = searchTerm.trim().toLowerCase();
    
    const foundPatient = patients.find(p => 
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(search) ||
      p.id.toString().includes(search)
    );

    if (foundPatient) {
      setSelectedPatient(foundPatient);
      setSelectedPatientId(foundPatient.id.toString());
      setShowPatientRecords(true);
      // Load complete history
      const history = getPatientCompleteHistory(foundPatient.id);
      setSelectedPatientHistory(history);
    } else {
      setSelectedPatient(null);
      setSelectedPatientId('');
      setShowPatientRecords(false);
      setSelectedPatientHistory(null);
      alert('No patient found with that name.');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedPatient(null);
    setSelectedPatientId('');
    setShowPatientRecords(false);
    setSelectedPatientHistory(null);
    setShowFullHistory(false);
  };

  const handleViewFullHistory = () => {
    setShowFullHistory(!showFullHistory);
  };

  const handleOpenModal = (record = null) => {
    if (record) {
      setEditingRecord(record);
      const ant = record.antenatal;
      setFormData({
        patientId: record.patientId.toString(),
        clinicDate: ant.clinicDate,
        gestationalAge: ant.gestationalAge,
        gestationalWeeks: ant.gestationalWeeks || ant.gestationalAge,
        age: ant.age,
        weight: ant.weight,
        urineSugar: ant.urineSugar,
        urineAlbumin: ant.urineAlbumin,
        anaemia: ant.anaemia || 'Normal',
        bloodPressure: ant.bloodPressure,
        fundalHeight: ant.fundalHeight,
        fetalLie: ant.fetalLie,
        fetalMovement: ant.fetalMovement || ant.fetalMovements || 'Active',
        fetalHeartRate: ant.fetalHeartRate,
        pedalOedema: ant.pedalOedema,
        fetalMovements: ant.fetalMovements || ant.fetalMovement || 'Active',
        dangerSigns: ant.dangerSigns,
        counselling: ant.counselling,
        nextClinicDate: ant.nextClinicDate,
        officerSignature: ant.officerSignature,
        mentalStatus: ant.mentalStatus || '3',
        // New fields
        vitaminC: ant.vitaminC || 'Not Given',
        calcium: ant.calcium || 'Not Given',
        malariaTreatment: ant.malariaTreatment || 'Not Required',
        thriposha: ant.thriposha || 'Not Given',
        examinedBy: ant.examinedBy || '',
        foetalMovementChartDate: ant.foetalMovementChartDate || new Date().toISOString().split('T')[0],
        dewormingTreatment: ant.dewormingTreatment || 'Not Given',
        medicineBatchNumber: ant.medicineBatchNumber || ''
      });
      if (record.postnatal) {
        setPostnatalData(record.postnatal);
      }
    } else {
      setEditingRecord(null);
      setFormData({
        patientId: selectedPatientId || '',
        clinicDate: new Date().toISOString().split('T')[0],
        gestationalAge: '',
        gestationalWeeks: '',
        age: '',
        weight: '',
        urineSugar: 'Negative',
        urineAlbumin: 'Negative',
        anaemia: 'Normal',
        bloodPressure: '',
        fundalHeight: '',
        fetalLie: 'Longitudinal',
        fetalMovement: 'Active',
        fetalHeartRate: '',
        pedalOedema: 'Absent',
        fetalMovements: 'Active',
        dangerSigns: '',
        counselling: '',
        nextClinicDate: '',
        officerSignature: '',
        mentalStatus: '3',
        // New fields
        vitaminC: 'Not Given',
        calcium: 'Not Given',
        malariaTreatment: 'Not Required',
        thriposha: 'Not Given',
        examinedBy: '',
        foetalMovementChartDate: new Date().toISOString().split('T')[0],
        dewormingTreatment: 'Not Given',
        medicineBatchNumber: ''
      });
      setPostnatalData({
        breastProblems: 'None',
        abnormalVaginalDischarge: 'None',
        excessiveVaginalBleeding: 'None',
        pallor: 'Normal',
        icterus: 'Normal',
        oedema: 'Absent',
        bloodPressure: '',
        cardiovascularSystem: 'Normal',
        respiratorySystem: 'Normal',
        abdominalExamination: 'Normal',
        vaginalExamination: 'Not Done',
        epdsScreening: '0',
        mentalStatus: 'Normal',
        other: '',
        identifiedProblems: '',
        actionsTaken: '',
        familyPlanningMethod: 'None',
        familyPlanningChosen: '',
        familyPlanningReason: '',
        familyPlanningPlace: '',
        familyPlanningDate: '',
        familyPlanningTime: '',
        specialNotes: '',
        officerSignature: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const patient = getPatientDetails(formData.patientId);
    const antenatalData = {
      clinicDate: formData.clinicDate,
      gestationalAge: formData.gestationalAge,
      gestationalWeeks: formData.gestationalWeeks || formData.gestationalAge,
      age: formData.age,
      weight: formData.weight,
      urineSugar: formData.urineSugar,
      urineAlbumin: formData.urineAlbumin,
      anaemia: formData.anaemia,
      bloodPressure: formData.bloodPressure,
      fundalHeight: formData.fundalHeight,
      fetalLie: formData.fetalLie,
      fetalMovement: formData.fetalMovement,
      fetalHeartRate: formData.fetalHeartRate,
      pedalOedema: formData.pedalOedema,
      fetalMovements: formData.fetalMovements,
      dangerSigns: formData.dangerSigns,
      counselling: formData.counselling,
      nextClinicDate: formData.nextClinicDate,
      officerSignature: formData.officerSignature,
      mentalStatus: formData.mentalStatus,
      // New fields
      vitaminC: formData.vitaminC,
      calcium: formData.calcium,
      malariaTreatment: formData.malariaTreatment,
      thriposha: formData.thriposha,
      examinedBy: formData.examinedBy,
      foetalMovementChartDate: formData.foetalMovementChartDate,
      dewormingTreatment: formData.dewormingTreatment,
      medicineBatchNumber: formData.medicineBatchNumber
    };

    if (editingRecord) {
      setRecords(records.map(r => 
        r.id === editingRecord.id ? { 
          ...r, 
          patientId: parseInt(formData.patientId),
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown',
          antenatal: antenatalData
        } : r
      ));
    } else {
      setRecords([...records, {
        id: Date.now(),
        patientId: parseInt(formData.patientId),
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown',
        antenatal: antenatalData,
        postnatal: null
      }]);
    }
    setIsModalOpen(false);
    if (selectedPatientId) {
      setShowPatientRecords(true);
      const history = getPatientCompleteHistory(parseInt(selectedPatientId));
      setSelectedPatientHistory(history);
    }
  };

  const handlePostnatalSubmit = (e) => {
    e.preventDefault();
    setRecords(records.map(r => 
      r.id === editingRecord?.id ? { ...r, postnatal: postnatalData } : r
    ));
    alert('Postnatal record saved successfully!');
    setIsModalOpen(false);
    if (selectedPatientId) {
      const history = getPatientCompleteHistory(parseInt(selectedPatientId));
      setSelectedPatientHistory(history);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setRecords(records.filter(r => r.id !== id));
      if (selectedPatientId) {
        setShowPatientRecords(true);
        const history = getPatientCompleteHistory(parseInt(selectedPatientId));
        setSelectedPatientHistory(history);
      }
    }
  };

  const getDisplayRecords = () => {
    if (showPatientRecords && selectedPatientId) {
      return records.filter(r => r.patientId === parseInt(selectedPatientId));
    }
    return records;
  };

  const displayRecords = getDisplayRecords();
  const totalRecords = records.length;
  const completedPostnatal = records.filter(r => r.postnatal !== null).length;
  const pendingPostnatal = totalRecords - completedPostnatal;
  const highRiskPatients = records.filter(r => r.antenatal.dangerSigns && r.antenatal.dangerSigns !== 'None').length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-pink-500" />
            Clinical Records
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage antenatal and postnatal clinical records</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
              {completedPostnatal} Completed
            </span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs">
              {pendingPostnatal} Pending
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs">
              {highRiskPatients} High Risk
            </span>
          </div>
          <Button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white" onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            New Record
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Records</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalRecords}</p>
            </div>
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <FileText className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Postnatal Completed</p>
              <p className="text-xl font-bold text-green-600">{completedPostnatal}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending Postnatal</p>
              <p className="text-xl font-bold text-yellow-600">{pendingPostnatal}</p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">High Risk Patients</p>
              <p className="text-xl font-bold text-red-600">{highRiskPatients}</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <Card className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              {showPatientRecords && (
                <Button variant="outline" onClick={handleClearSearch}>
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </form>

          {/* Selected Patient Info with Full History Button */}
          {showPatientRecords && selectedPatient && (
            <div className="mt-4 p-4 bg-pink-50 dark:bg-pink-900/10 rounded-lg border border-pink-200 dark:border-pink-800">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-pink-200 dark:bg-pink-800 flex items-center justify-center">
                    <span className="text-pink-700 dark:text-pink-300 font-bold text-lg">
                      {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>ID: #{selectedPatient.id}</span>
                      <span>•</span>
                      <span>{selectedPatient.age} years</span>
                      <span>•</span>
                      <span>{selectedPatient.bloodGroup}</span>
                      {selectedPatient.pregnancy?.highRisk && (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                          ⚠️ High Risk
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleViewFullHistory}
                    className="border-pink-300 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                  >
                    <History className="w-4 h-4 mr-1" />
                    {showFullHistory ? 'Hide History' : 'View Full History'}
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={() => handleOpenModal()}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Record
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Showing {displayRecords.length} records for this patient
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Full Patient History Section */}
      {showFullHistory && selectedPatientHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-pink-500" />
              Complete Medical History - {selectedPatientHistory.patient?.firstName} {selectedPatientHistory.patient?.lastName}
            </h3>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Visits</p>
                <p className="text-lg font-bold text-blue-600">{selectedPatientHistory.summary.totalVisits}</p>
              </div>
              <div className={`${selectedPatientHistory.summary.highRisk ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'} p-3 rounded-lg`}>
                <p className="text-xs text-gray-600 dark:text-gray-400">Risk Status</p>
                <p className={`text-lg font-bold ${selectedPatientHistory.summary.highRisk ? 'text-red-600' : 'text-green-600'}`}>
                  {selectedPatientHistory.summary.highRisk ? 'High Risk' : 'Normal'}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">Complications</p>
                <p className="text-lg font-bold text-purple-600">
                  {selectedPatientHistory.summary.complications?.length || 0}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">Last Visit</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {selectedPatientHistory.summary.lastVisit}
                </p>
              </div>
            </div>

            {/* All Records */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">All Clinical Records</h4>
              {selectedPatientHistory.records.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No clinical records found for this patient.
                </p>
              ) : (
                selectedPatientHistory.records.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Visit #{index + 1} - {record.antenatal.clinicDate}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          GA: {record.antenatal.gestationalWeeks || record.antenatal.gestationalAge} weeks • BP: {record.antenatal.bloodPressure} • FHR: {record.antenatal.fetalHeartRate}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        record.antenatal.dangerSigns && record.antenatal.dangerSigns !== 'None'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {record.antenatal.dangerSigns && record.antenatal.dangerSigns !== 'None' ? '⚠️ High Risk' : '✅ Normal'}
                      </span>
                    </div>
                    
                    {/* Record Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Weight:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.weight} kg</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Fundal Height:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.fundalHeight} cm</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Fetal Lie:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.fetalLie}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Anaemia:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.anaemia || 'Normal'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Urine Sugar:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.urineSugar}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Urine Albumin:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.urineAlbumin}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Pedal Oedema:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.pedalOedema}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Mental Status:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">
                          {mentalStatusOptions.find(o => o.value === record.antenatal.mentalStatus)?.label || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* New Fields Display */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Vitamin C:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.vitaminC || 'Not Given'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Calcium:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.calcium || 'Not Given'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Malaria Treatment:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.malariaTreatment || 'Not Required'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Thriposha:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.thriposha || 'Not Given'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Deworming:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.dewormingTreatment || 'Not Given'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Examined By:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.examinedBy || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Batch #:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.medicineBatchNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Fetal Movement Chart:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{record.antenatal.foetalMovementChartDate || 'N/A'}</span>
                      </div>
                    </div>

                    {record.antenatal.dangerSigns && record.antenatal.dangerSigns !== 'None' && (
                      <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        <p className="text-sm text-red-700 dark:text-red-400">
                          <strong>Danger Signs:</strong> {record.antenatal.dangerSigns}
                        </p>
                      </div>
                    )}

                    {record.antenatal.counselling && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          <strong>Counselling:</strong> {record.antenatal.counselling}
                        </p>
                      </div>
                    )}

                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Next Visit: {record.antenatal.nextClinicDate || 'Not scheduled'}</span>
                      <span>•</span>
                      <span>Officer: {record.antenatal.officerSignature || 'Not signed'}</span>
                      {record.postnatal && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 dark:text-green-400">✅ Postnatal Completed</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Records Table */}
      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">#</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Patient</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Clinic Date</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">GA</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">BP</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">FHR</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Risk</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Postnatal</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayRecords.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    {showPatientRecords ? (
                      'No records found for this patient. Click "Add Record" to add one.'
                    ) : (
                      'No records found. Search for a patient to view their records.'
                    )}
                  </td>
                </tr>
              ) : (
                displayRecords.map((record, index) => {
                  const isHighRisk = record.antenatal.dangerSigns && record.antenatal.dangerSigns !== 'None';
                  return (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-3 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{record.patientName}</p>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">{record.antenatal.clinicDate}</td>
                      <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">{record.antenatal.gestationalWeeks || record.antenatal.gestationalAge}</td>
                      <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">{record.antenatal.bloodPressure}</td>
                      <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">{record.antenatal.fetalHeartRate}</td>
                      <td className="py-3 px-3">
                        {isHighRisk ? (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                            High
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {record.postnatal ? (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Done
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleOpenModal(record)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                            title="Edit Record"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                            title="Print Record"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-pink-500" />
                    {editingRecord ? 'Edit Clinical Record' : 'New Clinical Record'}
                  </h2>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Patient Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Select Patient
                  </label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => {
                      setFormData({ ...formData, patientId: e.target.value });
                      setSelectedPatientId(e.target.value);
                      const patient = getPatientDetails(e.target.value);
                      setSelectedPatient(patient);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Search and select patient...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} - {p.age} years - ID: #{p.id}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Patient Info Card */}
                {selectedPatient && (
                  <div className="bg-pink-50 dark:bg-pink-900/10 rounded-lg p-4 mb-6 border border-pink-200 dark:border-pink-800">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-pink-200 dark:bg-pink-800 flex items-center justify-center">
                        <span className="text-pink-700 dark:text-pink-300 font-bold text-lg">
                          {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {selectedPatient.age} years</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedPatient.phone}</span>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedPatient.email}</span>
                          <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {selectedPatient.bloodGroup}</span>
                          {selectedPatient.pregnancy?.highRisk && (
                            <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                              High Risk
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                  <button
                    onClick={() => setActiveTab('antenatal')}
                    className={`px-4 py-2 font-medium transition-all relative ${
                      activeTab === 'antenatal'
                        ? 'text-pink-600 dark:text-pink-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Baby className="w-4 h-4 inline mr-2" />
                    Antenatal Care
                    {activeTab === 'antenatal' && (
                      <motion.div
                        layoutId="tabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('postnatal')}
                    className={`px-4 py-2 font-medium transition-all relative ${
                      activeTab === 'postnatal'
                        ? 'text-pink-600 dark:text-pink-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4 inline mr-2" />
                    Postnatal Care
                    {activeTab === 'postnatal' && (
                      <motion.div
                        layoutId="tabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
                      />
                    )}
                  </button>
                </div>

                {/* Antenatal Form */}
                {activeTab === 'antenatal' && (
                  <motion.form
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Baby className="w-4 h-4 inline mr-1" />
                          Gestational Weeks
                        </label>
                        <input
                          type="number"
                          value={formData.gestationalWeeks}
                          onChange={(e) => setFormData({ ...formData, gestationalWeeks: e.target.value, gestationalAge: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          placeholder="e.g., 28"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <User className="w-4 h-4 inline mr-1" />
                          Mother's Age
                        </label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          placeholder="e.g., 33"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Weight className="w-4 h-4 inline mr-1" />
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          placeholder="e.g., 68.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Heart className="w-4 h-4 inline mr-1" />
                          Blood Pressure
                        </label>
                        <input
                          type="text"
                          value={formData.bloodPressure}
                          onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          placeholder="e.g., 120/80"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fundal Height (cm)
                        </label>
                        <input
                          type="number"
                          value={formData.fundalHeight}
                          onChange={(e) => setFormData({ ...formData, fundalHeight: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          placeholder="e.g., 28"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Droplet className="w-4 h-4 inline mr-1" />
                          Urine Sugar
                        </label>
                        <select
                          value={formData.urineSugar}
                          onChange={(e) => setFormData({ ...formData, urineSugar: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          {urineOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Droplet className="w-4 h-4 inline mr-1" />
                          Urine Albumin
                        </label>
                        <select
                          value={formData.urineAlbumin}
                          onChange={(e) => setFormData({ ...formData, urineAlbumin: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          {urineOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Activity className="w-4 h-4 inline mr-1" />
                          Anaemia
                        </label>
                        <select
                          value={formData.anaemia}
                          onChange={(e) => setFormData({ ...formData, anaemia: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          {anaemiaOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Activity className="w-4 h-4 inline mr-1" />
                          Oedema
                        </label>
                        <select
                          value={formData.pedalOedema}
                          onChange={(e) => setFormData({ ...formData, pedalOedema: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          {oedemaOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fetal Presentation
                        </label>
                        <select
                          value={formData.fetalLie}
                          onChange={(e) => setFormData({ ...formData, fetalLie: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          {fetalLieOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <TrendingUp className="w-4 h-4 inline mr-1" />
                          Fetal Movement
                        </label>
                        <select
                          value={formData.fetalMovement}
                          onChange={(e) => setFormData({ ...formData, fetalMovement: e.target.value, fetalMovements: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          {fetalMovementOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Heart className="w-4 h-4 inline mr-1" />
                          Fetal Heart Rate (bpm)
                        </label>
                        <input
                          type="number"
                          value={formData.fetalHeartRate}
                          onChange={(e) => setFormData({ ...formData, fetalHeartRate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          placeholder="e.g., 140"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Pill className="w-4 h-4 inline mr-1" />
                          Vitamin C
                        </label>
                        <select
                          value={formData.vitaminC}
                          onChange={(e) => setFormData({ ...formData, vitaminC: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          {yesNoOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Pill className="w-4 h-4 inline mr-1" />
                          Calcium
                        </label>
                        <select
                          value={formData.calcium}
                          onChange={(e) => setFormData({ ...formData, calcium: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          {yesNoOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Syringe className="w-4 h-4 inline mr-1" />
                          Malaria Treatment
                        </label>
                        <select
                          value={formData.malariaTreatment}
                          onChange={(e) => setFormData({ ...formData, malariaTreatment: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          {malariaOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Leaf className="w-4 h-4 inline mr-1" />
                          Thriposha
                        </label>
                        <select
                          value={formData.thriposha}
                          onChange={(e) => setFormData({ ...formData, thriposha: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          {yesNoOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Pill className="w-4 h-4 inline mr-1" />
                          Deworming Treatment
                        </label>
                        <select
                          value={formData.dewormingTreatment}
                          onChange={(e) => setFormData({ ...formData, dewormingTreatment: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          {yesNoOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Fetal Movement Chart Date
                        </label>
                        <input
                          type="date"
                          value={formData.foetalMovementChartDate}
                          onChange={(e) => setFormData({ ...formData, foetalMovementChartDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <FileSignature className="w-4 h-4 inline mr-1" />
                          Medicine Batch Number
                        </label>
                        <input
                          type="text"
                          value={formData.medicineBatchNumber}
                          onChange={(e) => setFormData({ ...formData, medicineBatchNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          placeholder="BATCH-2026-001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        Danger Signs
                      </label>
                      <textarea
                        value={formData.dangerSigns}
                        onChange={(e) => setFormData({ ...formData, dangerSigns: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        placeholder="Any danger signs observed..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Stethoscope className="w-4 h-4 inline mr-1" />
                        Counselling Provided
                      </label>
                      <textarea
                        value={formData.counselling}
                        onChange={(e) => setFormData({ ...formData, counselling: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        placeholder="Counselling provided to patient..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <FileSignature className="w-4 h-4 inline mr-1" />
                          Examined By
                        </label>
                        <input
                          type="text"
                          value={formData.examinedBy}
                          onChange={(e) => setFormData({ ...formData, examinedBy: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          placeholder="Dr. Name"
                        />
                      </div>
                      
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mental Status
                      </label>
                      <select
                        value={formData.mentalStatus}
                        onChange={(e) => setFormData({ ...formData, mentalStatus: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                      >
                        {mentalStatusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                        <Save className="w-4 h-4 mr-2" />
                        {editingRecord ? 'Update Record' : 'Save Record'}
                      </Button>
                      <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </motion.form>
                )}

                {/* Postnatal Form */}
                {activeTab === 'postnatal' && (
                  <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handlePostnatalSubmit}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Breast Problems
                        </label>
                        <select
                          value={postnatalData.breastProblems}
                          onChange={(e) => setPostnatalData({ ...postnatalData, breastProblems: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          <option value="None">None</option>
                          <option value="Engorgement">Engorgement</option>
                          <option value="Mastitis">Mastitis</option>
                          <option value="Cracked Nipples">Cracked Nipples</option>
                          <option value="Abscess">Abscess</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Abnormal Vaginal Discharge
                        </label>
                        <select
                          value={postnatalData.abnormalVaginalDischarge}
                          onChange={(e) => setPostnatalData({ ...postnatalData, abnormalVaginalDischarge: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          <option value="None">None</option>
                          <option value="Foul Smelling">Foul Smelling</option>
                          <option value="Purulent">Purulent</option>
                          <option value="Bloody">Bloody</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Excessive Vaginal Bleeding
                        </label>
                        <select
                          value={postnatalData.excessiveVaginalBleeding}
                          onChange={(e) => setPostnatalData({ ...postnatalData, excessiveVaginalBleeding: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          <option value="None">None</option>
                          <option value="Mild">Mild</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Severe">Severe</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Pallor
                        </label>
                        <select
                          value={postnatalData.pallor}
                          onChange={(e) => setPostnatalData({ ...postnatalData, pallor: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Mild">Mild</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Severe">Severe</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Icterus
                        </label>
                        <select
                          value={postnatalData.icterus}
                          onChange={(e) => setPostnatalData({ ...postnatalData, icterus: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Mild">Mild</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Severe">Severe</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Oedema
                        </label>
                        <select
                          value={postnatalData.oedema}
                          onChange={(e) => setPostnatalData({ ...postnatalData, oedema: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          <option value="Absent">Absent</option>
                          <option value="Ankle">Ankle</option>
                          <option value="Facial">Facial</option>
                          <option value="Generalized">Generalized</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <Heart className="w-4 h-4 inline mr-1" />
                          BP
                        </label>
                        <input
                          type="text"
                          value={postnatalData.bloodPressure}
                          onChange={(e) => setPostnatalData({ ...postnatalData, bloodPressure: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          placeholder="e.g., 120/80"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Cardiovascular System
                        </label>
                        <select
                          value={postnatalData.cardiovascularSystem}
                          onChange={(e) => setPostnatalData({ ...postnatalData, cardiovascularSystem: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Murmur">Murmur</option>
                          <option value="Tachycardia">Tachycardia</option>
                          <option value="Bradycardia">Bradycardia</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Respiratory System
                        </label>
                        <select
                          value={postnatalData.respiratorySystem}
                          onChange={(e) => setPostnatalData({ ...postnatalData, respiratorySystem: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Wheezing">Wheezing</option>
                          <option value="Crackles">Crackles</option>
                          <option value="Dyspnea">Dyspnea</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Abdominal Examination
                        </label>
                        <select
                          value={postnatalData.abdominalExamination}
                          onChange={(e) => setPostnatalData({ ...postnatalData, abdominalExamination: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Tender">Tender</option>
                          <option value="Distended">Distended</option>
                          <option value="Scar">Scar</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Vaginal Examination
                        </label>
                        <select
                          value={postnatalData.vaginalExamination}
                          onChange={(e) => setPostnatalData({ ...postnatalData, vaginalExamination: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          <option value="Not Done">Not Done</option>
                          <option value="Normal">Normal</option>
                          <option value="Episiotomy Intact">Episiotomy Intact</option>
                          <option value="Infection">Infection</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          EPDS Screening Score
                        </label>
                        <select
                          value={postnatalData.epdsScreening}
                          onChange={(e) => setPostnatalData({ ...postnatalData, epdsScreening: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        >
                          <option value="0">0 - Normal</option>
                          <option value="1-5">1-5 - Low Risk</option>
                          <option value="6-9">6-9 - Moderate Risk</option>
                          <option value="10+">10+ - High Risk</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mental Status
                      </label>
                      <select
                        value={postnatalData.mentalStatus}
                        onChange={(e) => setPostnatalData({ ...postnatalData, mentalStatus: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                      >
                        {postnatalStatusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Other Findings
                      </label>
                      <textarea
                        value={postnatalData.other}
                        onChange={(e) => setPostnatalData({ ...postnatalData, other: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        placeholder="Any other findings..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Identified Problems
                        </label>
                        <textarea
                          value={postnatalData.identifiedProblems}
                          onChange={(e) => setPostnatalData({ ...postnatalData, identifiedProblems: e.target.value })}
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          placeholder="Problems identified..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Actions Taken
                        </label>
                        <textarea
                          value={postnatalData.actionsTaken}
                          onChange={(e) => setPostnatalData({ ...postnatalData, actionsTaken: e.target.value })}
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          placeholder="Actions taken..."
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Family Planning</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Method
                          </label>
                          <select
                            value={postnatalData.familyPlanningMethod}
                            onChange={(e) => setPostnatalData({ ...postnatalData, familyPlanningMethod: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          >
                            {familyPlanningMethods.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Reason if Not
                          </label>
                          <input
                            type="text"
                            value={postnatalData.familyPlanningReason}
                            onChange={(e) => setPostnatalData({ ...postnatalData, familyPlanningReason: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                            placeholder="Reason if not chosen"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Place
                          </label>
                          <input
                            type="text"
                            value={postnatalData.familyPlanningPlace}
                            onChange={(e) => setPostnatalData({ ...postnatalData, familyPlanningPlace: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                            placeholder="Place"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={postnatalData.familyPlanningDate}
                            onChange={(e) => setPostnatalData({ ...postnatalData, familyPlanningDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Time
                          </label>
                          <input
                            type="time"
                            value={postnatalData.familyPlanningTime}
                            onChange={(e) => setPostnatalData({ ...postnatalData, familyPlanningTime: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Special Notes
                      </label>
                      <textarea
                        value={postnatalData.specialNotes}
                        onChange={(e) => setPostnatalData({ ...postnatalData, specialNotes: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        placeholder="Special notes..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <User className="w-4 h-4 inline mr-1" />
                        Signature of Officer Examined
                      </label>
                      <input
                        type="text"
                        value={postnatalData.officerSignature}
                        onChange={(e) => setPostnatalData({ ...postnatalData, officerSignature: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900 dark:text-white"
                        placeholder="Dr. Name"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <Save className="w-4 h-4 mr-2" />
                        Save Postnatal Record
                      </Button>
                      <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </motion.form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClinicalRecords;