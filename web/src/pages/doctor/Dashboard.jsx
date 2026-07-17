import { motion } from 'framer-motion';
import { Users, Calendar, AlertTriangle, Baby, Stethoscope, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '../../components/common/Card';
import { patients } from '../../data/patients';
import { appointments } from '../../data/appointments';

const DoctorDashboard = () => {
  // Statistics
  const totalPatients = patients.length;
  const activePregnancies = patients.filter(p => p.pregnancy?.status?.includes('Active')).length;
  const highRiskPatients = patients.filter(p => p.pregnancy?.highRisk).length;
  const todayAppointments = appointments.filter(a => a.status === 'Upcoming').length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'Completed').length;

  // Get today's date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Get upcoming appointments (next 3)
  const upcomingAppointments = appointments
    .filter(a => a.status === 'Upcoming')
    .slice(0, 3);

  // Get recent patients (last 3)
  const recentPatients = patients.slice(0, 3);

  // Calculate percentages
  const highRiskPercentage = Math.round((highRiskPatients / totalPatients) * 100) || 0;
  const completionRate = Math.round((completedAppointments / totalAppointments) * 100) || 0;

  // Pie Chart Data - Appointment Status
  const appointmentData = [
    { name: 'Upcoming', value: todayAppointments, color: '#3B82F6' },
    { name: 'Completed', value: completedAppointments, color: '#10B981' }
  ];

  // Pie Chart Data - Risk Distribution
  const riskData = [
    { name: 'Normal', value: totalPatients - highRiskPatients, color: '#10B981' },
    { name: 'High Risk', value: highRiskPatients, color: '#EF4444' }
  ];

  const stats = [
    { 
      label: 'Total Patients', 
      value: totalPatients, 
      icon: Users, 
      color: 'blue',
      change: '+12%'
    },
    { 
      label: 'Active Pregnancies', 
      value: activePregnancies, 
      icon: Baby, 
      color: 'green',
      change: '+5%'
    },
    { 
      label: 'High Risk Patients', 
      value: highRiskPatients, 
      icon: AlertTriangle, 
      color: 'red',
      change: '-2%'
    },
    { 
      label: "Today's Appointments", 
      value: todayAppointments, 
      icon: Calendar, 
      color: 'purple',
      change: 'Today'
    },
  ];

  // Custom Tooltip for Pie Chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = appointmentData.reduce((sum, item) => sum + item.value, 0);
      const percentage = Math.round((payload[0].value / total) * 100);
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {payload[0].value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const RiskTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = riskData.reduce((sum, item) => sum + item.value, 0);
      const percentage = Math.round((payload[0].value / total) * 100);
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {payload[0].value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {percentage}% of patients
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-blue-600" />
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, Dr. Sarah Johnson
            </p>
          </div>
          <div className="mt-2 sm:mt-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {dateString}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
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
            <Calendar className="w-5 h-5 text-blue-600" />
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
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{todayAppointments}</p>
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
            <AlertTriangle className="w-5 h-5 text-red-600" />
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
                <Tooltip content={<RiskTooltip />} />
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Appointments & Patients */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Upcoming Appointments
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Next {upcomingAppointments.length} appointments
              </span>
            </div>
            <div className="space-y-3">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                          {appointment.patientName?.charAt(0) || 'P'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {appointment.patientName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {appointment.time} • {appointment.type}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                      Upcoming
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>No upcoming appointments</p>
                </div>
              )}
            </div>
          </Card>

          
          
        </div>

        {/* Right Section - Summary */}
        <div className="space-y-6">
          {/* Overview Card */}
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Appointments</span>
                <span className="font-semibold text-gray-900 dark:text-white">{totalAppointments}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{completedAppointments}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{completionRate}%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm text-gray-600 dark:text-gray-400">High Risk %</span>
                <span className="font-semibold text-red-600 dark:text-red-400">{highRiskPercentage}%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;