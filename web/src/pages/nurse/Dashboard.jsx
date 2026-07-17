import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Activity, Syringe, TestTube, 
  Calendar, RefreshCw, Heart, Droplet,
  Baby, ClipboardList, FileText, Stethoscope,
  ChevronRight, Clock, AlertCircle, CheckCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { patients } from '../../data/patients';
import { appointments } from '../../data/appointments';

const NurseDashboard = () => {
  const navigate = useNavigate();

  // Statistics
  const todayPatients = patients.length;
  const pendingObservations = patients.filter(p => p.vitalSigns.length < 2).length;
  const vaccinationsGiven = patients.reduce((acc, p) => acc + p.vaccinations.length, 0);
  const investigationSamples = patients.reduce((acc, p) => acc + p.investigations.length, 0);
  const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming').length;
  const followUpPatients = patients.filter(p => p.pregnancy?.highRisk).length;
  
  // Additional stats
  const highRiskPatients = patients.filter(p => p.pregnancy?.highRisk).length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'Completed').length;
  const totalPatients = patients.length;
  const activePregnancies = patients.filter(p => p.pregnancy?.status?.includes('Active')).length;

  // Pie Chart Data
  const appointmentData = [
    { name: 'Upcoming', value: upcomingAppointments, color: '#3B82F6' },
    { name: 'Completed', value: completedAppointments, color: '#10B981' }
  ];

  // Risk Distribution Data
  const riskData = [
    { name: 'Normal', value: totalPatients - highRiskPatients, color: '#10B981' },
    { name: 'High Risk', value: highRiskPatients, color: '#EF4444' }
  ];

  const stats = [
    { label: "Today's Patients", value: todayPatients, icon: Users, color: 'blue' },
    { label: 'Pending Observations', value: pendingObservations, icon: Activity, color: 'yellow' },
    { label: 'Vaccinations Given', value: vaccinationsGiven, icon: Syringe, color: 'green' },
    { label: 'Investigation Samples', value: investigationSamples, icon: TestTube, color: 'purple' },
    { label: 'Upcoming Appointments', value: upcomingAppointments, icon: Calendar, color: 'pink' },
    { label: 'High Risk Patients', value: highRiskPatients, icon: AlertCircle, color: 'red' },
  ];

  // Recent patients (last 3)
  const recentPatients = patients.slice(0, 3);

  // Today's date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Custom Tooltip for Pie Chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {payload[0].value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round((payload[0].value / totalAppointments) * 100)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Navigate to patients page
  const handleViewAllPatients = () => {
    navigate('/nurse/patients');
  };

  // Navigate to patient details
  const handlePatientClick = (patientId) => {
    navigate(`/nurse/patients/${patientId}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nurse Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back, Nurse Emily Davis</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
            <Calendar className="w-4 h-4 text-pink-500" />
            <span>{dateString}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 hover:shadow-hover transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Appointment Status Pie Chart */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-pink-500" />
            Appointment Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {appointmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-gray-700 dark:text-gray-300 text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Upcoming</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{upcomingAppointments}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{completedAppointments}</p>
            </div>
          </div>
        </Card>

        {/* Risk Distribution Pie Chart */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Risk Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-gray-700 dark:text-gray-300 text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Normal</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{totalPatients - highRiskPatients}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">High Risk</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{highRiskPatients}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                Recent Patients
              </h3>
              <button 
                onClick={handleViewAllPatients}
                className="text-sm text-pink-500 hover:text-pink-600 transition flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <div 
                  key={patient.id}
                  onClick={() => handlePatientClick(patient.id)}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                      <span className="text-pink-600 dark:text-pink-400 font-bold text-sm">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>ID: #{patient.id}</span>
                        <span>•</span>
                        <span>{patient.age} years</span>
                        <span>•</span>
                        <span>{patient.pregnancy?.weeks || 'N/A'} weeks</span>
                      </div>
                    </div>
                  </div>
                  {patient.pregnancy?.highRisk && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      High Risk
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-pink-500" />
              Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Total Patients</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{totalPatients}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Total Appointments</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{totalAppointments}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Completed Appointments</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{completedAppointments}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">High Risk Patients</span>
                </div>
                <span className="font-bold text-red-600">{highRiskPatients}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;