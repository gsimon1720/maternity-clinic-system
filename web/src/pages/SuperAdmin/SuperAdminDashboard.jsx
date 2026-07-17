import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Stethoscope, Baby, 
  TrendingUp, MapPin, Activity, Calendar,
  ArrowUp, ArrowDown, CheckCircle, XCircle, Clock
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClinics: 0,
    activeClinics: 0,
    totalDoctors: 0,
    totalNurses: 0,
    totalPatients: 0,
    totalAppointments: 0,
    monthlyGrowth: 0
  });

  const [clinicsByProvince, setClinicsByProvince] = useState([]);
  const [recentClinics, setRecentClinics] = useState([]);

  useEffect(() => {
    // Mock data - In production, fetch from API/localStorage
    setStats({
      totalClinics: 24,
      activeClinics: 18,
      totalDoctors: 245,
      totalNurses: 512,
      totalPatients: 18450,
      totalAppointments: 3450,
      monthlyGrowth: 12.5
    });

    setClinicsByProvince([
      { province: 'Western', clinics: 8, percentage: 33 },
      { province: 'Central', clinics: 4, percentage: 17 },
      { province: 'Southern', clinics: 3, percentage: 13 },
      { province: 'Northern', clinics: 2, percentage: 8 },
      { province: 'Eastern', clinics: 2, percentage: 8 },
      { province: 'North Western', clinics: 2, percentage: 8 },
      { province: 'Others', clinics: 3, percentage: 13 }
    ]);

    setRecentClinics([
      { id: 1, name: 'MaterniCare - Galle', city: 'Galle', status: 'active', registered: '2024-01-15', admin: 'Dr. Sanath Perera' },
      { id: 2, name: 'MaterniCare - Jaffna', city: 'Jaffna', status: 'active', registered: '2024-01-10', admin: 'Dr. Kamala Ravi' },
      { id: 3, name: 'MaterniCare - Kurunegala', city: 'Kurunegala', status: 'pending', registered: '2024-01-05', admin: 'Dr. Anura Bandara' },
      { id: 4, name: 'MaterniCare - Badulla', city: 'Badulla', status: 'active', registered: '2023-12-28', admin: 'Dr. Priyani Weerasinghe' }
    ]);
  }, []);

  return (
    <div style={{ padding: '0px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#831843' }}>
          Country Dashboard
        </h1>
        <p style={{ color: '#db2777', marginTop: '4px', fontSize: '14px' }}>
          Overview of all MaterniCare clinics across Sri Lanka
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #fbcfe8', boxShadow: '0 4px 12px rgba(131,24,67,0.04)' }}>
          <div>
            <p style={{ color: '#9d174d', fontSize: '13px', fontWeight: '500' }}>Total Clinics</p>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#831843', marginTop: '4px' }}>{stats.totalClinics}</h2>
            <p style={{ color: '#db2777', fontSize: '12px', marginTop: '4px', fontWeight: '500' }}>+{stats.monthlyGrowth}% this month</p>
          </div>
          <div style={{ width: '50px', height: '50px', background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} color="#db2777" />
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #fbcfe8', boxShadow: '0 4px 12px rgba(131,24,67,0.04)' }}>
          <div>
            <p style={{ color: '#9d174d', fontSize: '13px', fontWeight: '500' }}>Total Doctors</p>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#831843', marginTop: '4px' }}>{stats.totalDoctors}</h2>
            <p style={{ color: '#10b981', fontSize: '12px', marginTop: '4px', fontWeight: '500' }}>Across all clinics</p>
          </div>
          <div style={{ width: '50px', height: '50px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stethoscope size={24} color="#10b981" />
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #fbcfe8', boxShadow: '0 4px 12px rgba(131,24,67,0.04)' }}>
          <div>
            <p style={{ color: '#9d174d', fontSize: '13px', fontWeight: '500' }}>Total Patients</p>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#831843', marginTop: '4px' }}>{stats.totalPatients.toLocaleString()}</h2>
            <p style={{ color: '#db2777', fontSize: '12px', marginTop: '4px', fontWeight: '500' }}>Nationwide</p>
          </div>
          <div style={{ width: '50px', height: '50px', background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Baby size={24} color="#db2777" />
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #fbcfe8', boxShadow: '0 4px 12px rgba(131,24,67,0.04)' }}>
          <div>
            <p style={{ color: '#9d174d', fontSize: '13px', fontWeight: '500' }}>This Month</p>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#831843', marginTop: '4px' }}>{stats.totalAppointments.toLocaleString()}</h2>
            <p style={{ color: '#8b5cf6', fontSize: '12px', marginTop: '4px', fontWeight: '500' }}>Appointments</p>
          </div>
          <div style={{ width: '50px', height: '50px', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} color="#8b5cf6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Clinics by Province */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fbcfe8', boxShadow: '0 4px 12px rgba(131,24,67,0.04)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#831843' }}>
            <MapPin size={18} color="#db2777" />
            Clinics by Province
          </h3>
          <div>
            {clinicsByProvince.map((province, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#9d174d', fontWeight: '500' }}>{province.province}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#db2777' }}>{province.clinics} clinics</span>
                </div>
                <div style={{ height: '8px', background: '#fce7f3', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${province.percentage}%`, height: '100%', background: '#db2777', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Clinics */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fbcfe8', boxShadow: '0 4px 12px rgba(131,24,67,0.04)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#831843' }}>
            <Calendar size={18} color="#db2777" />
            Recently Added Clinics
          </h3>
          <div>
            {recentClinics.map((clinic) => (
              <div key={clinic.id} style={{ padding: '12px 0', borderBottom: '1px solid #fbcfe8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#831843' }}>{clinic.name}</p>
                  <p style={{ fontSize: '12px', color: '#9d174d' }}>{clinic.city} • Admin: {clinic.admin}</p>
                </div>
                <div>
                  <span style={{
                    padding: '4px 10px',
                    background: clinic.status === 'active' ? '#d1fae5' : '#fef3c7',
                    color: clinic.status === 'active' ? '#065f46' : '#d97706',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {clinic.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fbcfe8', boxShadow: '0 4px 12px rgba(131,24,67,0.04)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#831843' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #db2777, #831843)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 12px rgba(219, 39, 119, 0.2)' }}>
            + Add New Clinic
          </button>
          <button style={{ padding: '12px 24px', background: '#831843', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 12px rgba(131, 24, 67, 0.2)' }}>
            Generate Country Report
          </button>
          <button style={{ padding: '12px 24px', background: '#fce7f3', color: '#db2777', border: '1px solid #fbcfe8', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
            View All Clinics
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;