import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Eye, History, User, Calendar, 
  Phone, Mail, Heart, Baby, ClipboardList,
  FileText, Activity, Droplet, Weight,
  AlertCircle, CheckCircle, X, ChevronRight,
  Clock, Stethoscope, MapPin, Printer, Download
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { patients } from '../../data/patients';

// Helper function to get patient history
const getPatientHistory = (patientId) => {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) return null;
  
  return {
    basicInfo: {
      name: `${patient.firstName} ${patient.lastName}`,
      age: patient.age,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies || [],
      emergencyContact: patient.emergencyContact
    },
    pregnancy: patient.pregnancy,
    medicalHistory: patient.medicalHistory,
    familyHistory: patient.familyHistory || {},
    socialHistory: patient.socialHistory || {},
    clinicalRecords: patient.clinicalRecords || [],
    vitalSigns: patient.vitalSigns || [],
    vaccinations: patient.vaccinations || [],
    investigations: patient.investigations || [],
    ultrasound: patient.ultrasound || [],
    antenatalVisits: patient.antenatalVisits || []
  };
};

// Mental Status Options
const mentalStatusOptions = [
  { value: '1', label: '1 - Very Poor' },
  { value: '2', label: '2 - Poor' },
  { value: '3', label: '3 - Fair' },
  { value: '4', label: '4 - Good' },
  { value: '5', label: '5 - Excellent' },
  { value: 'NE', label: 'NE - Not Examined' }
];

const NursePatients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientHistory, setShowPatientHistory] = useState(false);
  const [patientHistory, setPatientHistory] = useState(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState('overview');

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle View Profile
  const handleViewProfile = (patient) => {
    setSelectedPatient(patient);
    const history = getPatientHistory(patient.id);
    setPatientHistory(history);
    setShowPatientHistory(true);
  };

  // Handle View Full History (Navigate to history page)
  const handleViewFullHistory = (patientId) => {
    navigate(`/nurse/patients/${patientId}/history`);
  };

  // Close History Modal
  const handleCloseHistory = () => {
    setShowPatientHistory(false);
    setSelectedPatient(null);
    setPatientHistory(null);
    setActiveHistoryTab('overview');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patients</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPatients.map((patient, index) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 hover:shadow-hover transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                    <span className="text-pink-600 dark:text-pink-400 font-bold text-lg">
                      {patient.firstName?.[0] || 'P'}{patient.lastName?.[0] || ''}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{patient.age} years</span>
                      <span>•</span>
                      <span>{patient.pregnancy?.weeks || 'N/A'} weeks</span>
                      <span>•</span>
                      <span>{patient.bloodGroup}</span>
                      {patient.pregnancy?.highRisk && (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                          High Risk
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewProfile(patient)}
                    className="border-pink-300 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Patient History Modal - Same as Clinical Records */}
      <AnimatePresence>
        {showPatientHistory && patientHistory && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={handleCloseHistory}
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
                    <User className="w-5 h-5 text-pink-500" />
                    Patient Profile - {selectedPatient.firstName} {selectedPatient.lastName}
                  </h2>
                  <button 
                    onClick={handleCloseHistory} 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Visits</p>
                    <p className="text-lg font-bold text-blue-600">{patientHistory.antenatalVisits?.length || 0}</p>
                  </div>
                  <div className={`${patientHistory.pregnancy?.highRisk ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'} p-3 rounded-lg`}>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Risk Status</p>
                    <p className={`text-lg font-bold ${patientHistory.pregnancy?.highRisk ? 'text-red-600' : 'text-green-600'}`}>
                      {patientHistory.pregnancy?.highRisk ? 'High Risk' : 'Normal'}
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Complications</p>
                    <p className="text-lg font-bold text-purple-600">
                      {patientHistory.pregnancy?.complications?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Last Visit</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {patientHistory.antenatalVisits?.length > 0 ? 
                        patientHistory.antenatalVisits[patientHistory.antenatalVisits.length - 1].date : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-4">
                  {['overview', 'clinical', 'vitals', 'investigations', 'ultrasound'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveHistoryTab(tab)}
                      className={`px-4 py-2 text-sm font-medium transition-all relative capitalize ${
                        activeHistoryTab === tab
                          ? 'text-pink-600 dark:text-pink-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab === 'overview' && <User className="w-4 h-4 inline mr-1" />}
                      {tab === 'clinical' && <ClipboardList className="w-4 h-4 inline mr-1" />}
                      {tab === 'vitals' && <Activity className="w-4 h-4 inline mr-1" />}
                      {tab === 'investigations' && <FileText className="w-4 h-4 inline mr-1" />}
                      {tab === 'ultrasound' && <Baby className="w-4 h-4 inline mr-1" />}
                      {tab}
                      {activeHistoryTab === tab && (
                        <motion.div
                          layoutId="tabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {/* Overview Tab */}
                  {activeHistoryTab === 'overview' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      {/* Basic Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Age</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{patientHistory.basicInfo?.age} years</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Blood Group</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{patientHistory.basicInfo?.bloodGroup}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Pregnancy Weeks</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{patientHistory.pregnancy?.weeks || 'N/A'} weeks</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{patientHistory.pregnancy?.dueDate || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">{patientHistory.basicInfo?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">{patientHistory.basicInfo?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm md:col-span-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">Emergency: {patientHistory.basicInfo?.emergencyContact?.name} ({patientHistory.basicInfo?.emergencyContact?.relationship}) - {patientHistory.basicInfo?.emergencyContact?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm md:col-span-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">{patientHistory.basicInfo?.address}</span>
                        </div>
                      </div>

                      {/* Pregnancy Details */}
                      {patientHistory.pregnancy && (
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <Baby className="w-4 h-4 text-pink-500" />
                            Pregnancy Details
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Gravida</p>
                              <p className="text-sm font-medium">{patientHistory.pregnancy.gravida}</p>
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Para</p>
                              <p className="text-sm font-medium">{patientHistory.pregnancy.para}</p>
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Abortions</p>
                              <p className="text-sm font-medium">{patientHistory.pregnancy.abortions || 0}</p>
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                              <p className="text-sm font-medium">{patientHistory.pregnancy.status}</p>
                            </div>
                          </div>
                          {patientHistory.pregnancy.complications?.length > 0 && (
                            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                              <p className="text-xs text-red-600 dark:text-red-400">
                                <strong>Complications:</strong> {patientHistory.pregnancy.complications.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Medical History */}
                      {patientHistory.medicalHistory && (
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-blue-500" />
                            Medical History
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Diabetes</p>
                              <p className="text-sm font-medium">{patientHistory.medicalHistory.diabetes ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Hypertension</p>
                              <p className="text-sm font-medium">{patientHistory.medicalHistory.hypertension ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Previous Pregnancies</p>
                              <p className="text-sm font-medium">{patientHistory.medicalHistory.previousPregnancies}</p>
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Miscarriages</p>
                              <p className="text-sm font-medium">{patientHistory.medicalHistory.miscarriages}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Allergies */}
                      {patientHistory.basicInfo?.allergies?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            Allergies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {patientHistory.basicInfo.allergies.map((allergy, idx) => (
                              <span key={idx} className="px-2 py-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
                                {allergy}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Clinical Records Tab */}
                  {activeHistoryTab === 'clinical' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {patientHistory.clinicalRecords?.length > 0 ? (
                        <div className="space-y-3">
                          {patientHistory.clinicalRecords.map((record, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">{record.date}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{record.chiefComplaint}</p>
                                </div>
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                  Visit #{idx + 1}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{record.findings}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{record.assessment}</p>
                              {record.notes && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Notes: {record.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No clinical records found</p>
                      )}
                    </motion.div>
                  )}

                  {/* Vitals Tab */}
                  {activeHistoryTab === 'vitals' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {patientHistory.vitalSigns?.length > 0 ? (
                        <div className="space-y-3">
                          {patientHistory.vitalSigns.map((vital, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <p className="font-medium text-gray-900 dark:text-white">{vital.date}</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">BP</p>
                                  <p className="text-sm font-medium">{vital.bloodPressure}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                                  <p className="text-sm font-medium">{vital.weight} kg</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Pulse</p>
                                  <p className="text-sm font-medium">{vital.pulse} bpm</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Temp</p>
                                  <p className="text-sm font-medium">{vital.temperature}°C</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No vital signs found</p>
                      )}
                    </motion.div>
                  )}

                  {/* Investigations Tab */}
                  {activeHistoryTab === 'investigations' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {patientHistory.investigations?.length > 0 ? (
                        <div className="space-y-3">
                          {patientHistory.investigations.map((investigation, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-gray-900 dark:text-white">{investigation.date}</p>
                                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                                  {investigation.type}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                                {investigation.bloodSugar && (
                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Blood Sugar</p>
                                    <p className="text-sm font-medium">{investigation.bloodSugar} mg/dL</p>
                                  </div>
                                )}
                                {investigation.hemoglobin && (
                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Hemoglobin</p>
                                    <p className="text-sm font-medium">{investigation.hemoglobin} g/dL</p>
                                  </div>
                                )}
                                {investigation.bloodGroup && (
                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Blood Group</p>
                                    <p className="text-sm font-medium">{investigation.bloodGroup}</p>
                                  </div>
                                )}
                              </div>
                              {investigation.notes && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{investigation.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No investigations found</p>
                      )}
                    </motion.div>
                  )}

                  {/* Ultrasound Tab */}
                  {activeHistoryTab === 'ultrasound' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {patientHistory.ultrasound?.length > 0 ? (
                        <div className="space-y-3">
                          {patientHistory.ultrasound.map((scan, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-gray-900 dark:text-white">{scan.date}</p>
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                                  POA: {scan.poaAtScan} weeks
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">EDD</p>
                                  <p className="text-sm font-medium">{scan.edd}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Corrected EDD</p>
                                  <p className="text-sm font-medium">{scan.correctedEdd}</p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{scan.findings}</p>
                              {scan.doctorNotes && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Doctor: {scan.doctorNotes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No ultrasound records found</p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewFullHistory(selectedPatient.id)}
                    className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <History className="w-4 h-4 mr-2" />
                    View Full History
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-green-300 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleCloseHistory}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 text-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NursePatients;