import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Users, 
  Baby, 
  Calendar, 
  Activity, 
  Clock, 
  Stethoscope,
  Building2,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  PieChart,
  Download,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';
import StatCard from '../../components/DashboardCards/StatCard';
import toast from 'react-hot-toast';

const COLORS = {
  bgPink50: '#fdf2f8',
  bgPink100: '#fce7f3',
  bgPink200: '#fbcfe8',
  textPink600: '#db2777',
  textPink800: '#9d174d',
  textPink900: '#831843',
};

const ClinicAdminDashboard = () => {
  const { currentClinic, user } = useAuth();
  const [timeRange, setTimeRange] = useState('yearly');

  // Main Stats Cards - Only 3
  const stats = [
    { title: 'Total Patients', value: '1,234', icon: Users, color: 'pink', trend: 'up', trendValue: '+12%' },
    { title: 'Appointments Today', value: '28', icon: Calendar, color: 'success', trend: 'up', trendValue: '+5%' },
    { title: 'Monthly Deliveries', value: '45', icon: Activity, color: 'warning', trend: 'up', trendValue: '+15%' },
  ];

  // Patient Registration Data (Monthly)
  const patientData = [
    { month: 'Jul', patients: 45, color: '#8B5CF6' },
    { month: 'Aug', patients: 62, color: '#F97316' },
    { month: 'Sep', patients: 78, color: '#FBBF24' },
    { month: 'Oct', patients: 95, color: '#10B981' },
    { month: 'Nov', patients: 112, color: '#EF4444' },
    { month: 'Dec', patients: 148, color: '#F48FB1' },
    { month: 'Jan', patients: 165, color: '#9CA3AF' },
    { month: 'Feb', patients: 142, color: '#E5E7EB' },
    { month: 'Mar', patients: 158, color: '#4B5563' },
    { month: 'Apr', patients: 182, color: '#111827' },
    { month: 'May', patients: 196, color: '#FFFFFF' },
    { month: 'Jun', patients: 178, color: '#60A5FA' },
  ];

  // Patient Growth Data
  const patientGrowthData = [
    { month: 'Jan', patients: 1240, appointments: 156, deliveries: 42 },
    { month: 'Feb', patients: 1280, appointments: 168, deliveries: 38 },
    { month: 'Mar', patients: 1320, appointments: 175, deliveries: 45 },
    { month: 'Apr', patients: 1380, appointments: 182, deliveries: 52 },
    { month: 'May', patients: 1450, appointments: 195, deliveries: 48 },
    { month: 'Jun', patients: 1520, appointments: 210, deliveries: 56 },
    { month: 'Jul', patients: 1610, appointments: 228, deliveries: 62 },
    { month: 'Aug', patients: 1680, appointments: 245, deliveries: 58 },
    { month: 'Sep', patients: 1750, appointments: 262, deliveries: 68 },
    { month: 'Oct', patients: 1820, appointments: 278, deliveries: 72 },
    { month: 'Nov', patients: 1890, appointments: 295, deliveries: 78 },
    { month: 'Dec', patients: 1980, appointments: 315, deliveries: 85 },
  ];

  // Age Group Distribution
  const ageDistribution = [
    { age: '18-24', patients: 245, percentage: 12, color: '#F48FB1' },
    { age: '25-30', patients: 890, percentage: 45, color: '#4A3B53' },
    { age: '31-35', patients: 520, percentage: 26, color: '#10B981' },
    { age: '36-40', patients: 210, percentage: 11, color: '#F59E0B' },
    { age: '40+', patients: 115, percentage: 6, color: '#EF4444' },
  ];

  // C-Section vs Normal Delivery
  const deliveryMethods = [
    { name: 'Normal Delivery', value: 1240, color: '#F48FB1' },
    { name: 'C-Section', value: 680, color: '#4A3B53' },
    { name: 'Assisted Delivery', value: 180, color: '#10B981' },
  ];

  // Staff Distribution Data
  const staffDistribution = [
    { name: 'Doctors', value: 8, color: '#10B981' },
    { name: 'Midwives', value: 6, color: '#8B5CF6' },
    { name: 'Nurses', value: 10, color: '#3B82F6' },
    { name: 'Admin Staff', value: 4, color: '#F59E0B' },
  ];

  // Peak Hours Data
  const peakHours = [
    { hour: '8 AM', appointments: 45 },
    { hour: '10 AM', appointments: 78 },
    { hour: '12 PM', appointments: 62 },
    { hour: '2 PM', appointments: 85 },
    { hour: '4 PM', appointments: 58 },
    { hour: '6 PM', appointments: 32 },
  ];

  // Monthly Trends
  const monthlyTrends = [
    { month: 'Week 1', appointments: 78, deliveries: 12, highRisk: 8 },
    { month: 'Week 2', appointments: 85, deliveries: 15, highRisk: 10 },
    { month: 'Week 3', appointments: 92, deliveries: 18, highRisk: 12 },
    { month: 'Week 4', appointments: 88, deliveries: 14, highRisk: 9 },
  ];

  const handleRefresh = () => {
    toast.success('Dashboard refreshed!');
  };

  const handleExport = () => {
    toast.success('Exporting dashboard data...');
  };

  return (
    <div style={{ 
      padding: '24px', 
      background: `linear-gradient(135deg, ${COLORS.bgPink50}, ${COLORS.bgPink100})`, 
      minHeight: '100vh' 
    }}>
      {/* Clinic Header - Welcome Card */}
      <div style={{ 
        background: `linear-gradient(135deg, ${COLORS.textPink600}, ${COLORS.textPink900})`, 
        borderRadius: '24px', 
        padding: '28px', 
        marginBottom: '32px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%'
        }} />
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={28} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {currentClinic?.clinic_name || 'MaterniCare Clinic'}
              </h1>
              <p style={{ opacity: 0.9, fontSize: '14px' }}>
                Welcome back, {user?.name || 'Admin'}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', opacity: 0.8 }}>📍</span>
              <span style={{ fontSize: '13px' }}>
                {currentClinic?.city || 'Colombo'}, {currentClinic?.district || 'Colombo'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', opacity: 0.8 }}>📞</span>
              <span style={{ fontSize: '13px' }}>
                {currentClinic?.phone || '+94 11 234 5678'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', opacity: 0.8 }}>⏰</span>
              <span style={{ fontSize: '13px' }}>Open 24/7 for emergencies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid - Only 3 Cards */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Patient Registrations by Month Chart */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: `1px solid ${COLORS.bgPink200}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
              Patient Registrations by Month
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
              Monthly patient enrollment trends
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '8px 12px',
                border: `1px solid ${COLORS.bgPink200}`,
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                background: 'white'
              }}
            >
              <option value="last12months">Last 12 Months</option>
              <option value="last6months">Last 6 Months</option>
              <option value="thisyear">This Year</option>
            </select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={patientData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="patients" fill="#F48FB1" radius={[8, 8, 0, 0]}>
              {patientData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Patient Growth Chart */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: `1px solid ${COLORS.bgPink200}`
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            Patient Growth & Activity Trends
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            Monthly comparison of patients, appointments, and deliveries
          </p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={patientGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis yAxisId="left" stroke="#6b7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="patients" fill="#F48FB120" stroke="#F48FB1" strokeWidth={2} name="Total Patients" />
            <Line yAxisId="left" type="monotone" dataKey="appointments" stroke="#4A3B53" strokeWidth={2} name="Appointments" dot={{ fill: '#4A3B53' }} />
            <Bar yAxisId="right" dataKey="deliveries" fill="#10B981" name="Deliveries" radius={[4, 4, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout for Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Staff Distribution */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: `1px solid ${COLORS.bgPink200}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: `${COLORS.textPink600}15`,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PieChart size={20} color={COLORS.textPink600} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                Staff Distribution
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>
                By role and department
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <RePieChart>
              <Pie
                data={staffDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {staffDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px' }}>
            {staffDistribution.map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: item.color }}>{item.value}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Age Distribution */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: `1px solid ${COLORS.bgPink200}`
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
            Patient Age Distribution
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <RePieChart>
              <Pie
                data={ageDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="patients"
                label={({ age, percent }) => `${age} ${(percent * 100).toFixed(0)}%`}
              >
                {ageDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px' }}>
            {ageDistribution.map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: item.color }}>{item.patients}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.age}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout - More Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Delivery Methods */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: `1px solid ${COLORS.bgPink200}`
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
            Delivery Methods Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={deliveryMethods}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {deliveryMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: `1px solid ${COLORS.bgPink200}`
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
            Peak Appointment Hours
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="appointments" fill="#F48FB1" radius={[8, 8, 0, 0]}>
                {peakHours.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.appointments > 70 ? '#F48FB1' : '#4A3B53'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '12px', padding: '10px', background: '#F9FAFB', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
              Peak hours: 2 PM - 4 PM with {Math.max(...peakHours.map(h => h.appointments))} appointments
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Trends */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: `1px solid ${COLORS.bgPink200}`
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
          Weekly Performance Trends
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="appointments" stroke="#F48FB1" strokeWidth={3} name="Appointments" />
            <Line type="monotone" dataKey="deliveries" stroke="#4A3B53" strokeWidth={3} name="Deliveries" />
            <Line type="monotone" dataKey="highRisk" stroke="#EF4444" strokeWidth={3} name="High Risk Patients" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Insights - Only Patient Growth */}
      <div style={{
        marginTop: '8px',
        padding: '20px',
        background: `white`,
        borderRadius: '16px',
        border: `1px solid ${COLORS.bgPink200}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#10B98115',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={24} color="#10B981" />
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '2px' }}>Patient Growth This Year</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981' }}>+18.5%</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <span style={{ 
              fontSize: '12px', 
              color: '#10b981', 
              background: '#d1fae5', 
              padding: '4px 12px', 
              borderRadius: '20px'
            }}>
              ↑ 2.3% vs last month
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicAdminDashboard;