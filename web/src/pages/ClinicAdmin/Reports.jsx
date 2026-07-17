import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  TrendingUp,
  Users,
  AlertTriangle,
  Calendar,
  Printer,
  Mail,
  Eye,
  ChevronDown,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = {
  bgPink50: '#fdf2f8',
  bgPink100: '#fce7f3',
  bgPink200: '#fbcfe8',
  textPink600: '#db2777',
  textPink800: '#9d174d',
  textPink900: '#831843',
};

const Reports = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState('monthly');

  // Report Cards Data with navigation paths
  const reportCards = [
    {
      id: 'monthly',
      title: 'Monthly Summary',
      description: 'Clinic-wide overview',
      icon: Calendar,
      color: 'pink',
      path: '/reports/monthly-summary',
      gradient: `linear-gradient(135deg, ${COLORS.textPink600}, ${COLORS.textPink800})`
    },
    {
      id: 'highRisk',
      title: 'High Risk Patients',
      description: 'Patients needing attention',
      icon: AlertTriangle,
      color: 'orange',
      path: '/reports/high-risk-patients',
      gradient: 'linear-gradient(135deg, #F97316, #ea580c)'
    },
    {
      id: 'staffActivity',
      title: 'Staff Activity',
      description: 'Per-staff action counts',
      icon: Users,
      color: 'plum',
      path: '/reports/staff-activity',
      gradient: `linear-gradient(135deg, ${COLORS.textPink800}, ${COLORS.textPink900})`
    },
    {
      id: 'appointmentTrends',
      title: 'Appointment Trends',
      description: 'Bookings & attendance',
      icon: TrendingUp,
      color: 'green',
      path: '/reports/appointment-trends',
      gradient: 'linear-gradient(135deg, #10B981, #059669)'
    },
    {
      id: 'patientRegistrations',
      title: 'Patient Registrations',
      description: 'Monthly enrollment data',
      icon: Activity,
      color: 'purple',
      path: '/reports/patient-registrations',
      gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)'
    }
  ];

  // Recent Reports Data
  const recentReports = [
    { name: 'Monthly Summary Report', type: 'PDF', date: '2024-05-01' },
    { name: 'Patient Registration Trends', type: 'Excel', date: '2024-04-28' },
    { name: 'Staff Performance Q1', type: 'PDF', date: '2024-04-15' },
    { name: 'High Risk Patients List', type: 'PDF', date: '2024-04-10' },
    { name: 'Appointment Analysis Report', type: 'Excel', date: '2024-04-05' },
    { name: 'Annual Delivery Statistics', type: 'PDF', date: '2024-03-28' },
  ];

  const handleReportClick = (path, title) => {
    toast.success(`Loading ${title}...`);
    navigate(path);
  };

  const handleViewAllReports = () => {
    navigate('/reports/all');
  };

  return (
    <div style={{ 
      padding: '24px', 
      background: `linear-gradient(135deg, ${COLORS.bgPink50}, ${COLORS.bgPink100})`, 
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textPink900, marginBottom: '8px' }}>
              Reports & Analytics
            </h1>
            <p style={{ color: COLORS.textPink800, fontSize: '14px' }}>
              Generate insights and export operational reports
            </p>
          </div>
          {/* Export buttons removed */}
        </div>
      </div>

      {/* Report Type Cards */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.textPink900, marginBottom: '16px' }}>
          Quick Reports
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {reportCards.map((report) => (
            <div
              key={report.id}
              onClick={() => handleReportClick(report.path, report.title)}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: selectedReport === report.id ? `2px solid ${COLORS.textPink600}` : `1px solid ${COLORS.bgPink200}`,
                boxShadow: selectedReport === report.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                e.currentTarget.style.borderColor = COLORS.textPink600;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                if (selectedReport !== report.id) {
                  e.currentTarget.style.borderColor = COLORS.bgPink200;
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: `${report.color === 'pink' ? COLORS.textPink600 : report.color === 'plum' ? COLORS.textPink800 : report.color === 'orange' ? '#F97316' : report.color === 'green' ? '#10B981' : '#8B5CF6'}15`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <report.icon size={20} color={report.color === 'pink' ? COLORS.textPink600 : report.color === 'plum' ? COLORS.textPink800 : report.color === 'orange' ? '#F97316' : report.color === 'green' ? '#10B981' : '#8B5CF6'} />
                </div>
                <ChevronDown size={16} color="#9ca3af" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.textPink900, marginBottom: '4px' }}>
                {report.title}
              </h3>
              <p style={{ fontSize: '13px', color: COLORS.textPink800, marginBottom: '12px' }}>{report.description}</p>
              <div style={{
                fontSize: '12px',
                color: COLORS.textPink600,
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                View Report →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports Table */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: `1px solid ${COLORS.bgPink200}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: COLORS.textPink900 }}>
              Recent Generated Reports
            </h2>
            <p style={{ fontSize: '13px', color: COLORS.textPink800, marginTop: '4px' }}>
              Previously exported reports
            </p>
          </div>
          <button
            onClick={handleViewAllReports}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'white',
              border: `1px solid ${COLORS.bgPink200}`,
              borderRadius: '8px',
              cursor: 'pointer',
              color: COLORS.textPink800,
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.bgPink50;
              e.currentTarget.style.borderColor = COLORS.textPink600;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = COLORS.bgPink200;
            }}
          >
            <Eye size={16} />
            View All
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.bgPink200}` }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textPink800 }}>Report Name</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textPink800 }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textPink800 }}>Date Generated</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.textPink800 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report, index) => (
                <tr key={index} style={{ borderBottom: index < recentReports.length - 1 ? `1px solid ${COLORS.bgPink100}` : 'none' }}>
                  <td style={{ padding: '12px', fontSize: '14px', color: COLORS.textPink900, fontWeight: '500' }}>
                    {report.name}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      background: report.type === 'PDF' ? '#FEE2E2' : '#D1FAE5', 
                      color: report.type === 'PDF' ? '#DC2626' : '#059669', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontWeight: '600' 
                    }}>
                      {report.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: COLORS.textPink800 }}>{report.date}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }} title="Download">
                        <Download size={16} />
                      </button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textPink800 }} title="Print">
                        <Printer size={16} />
                      </button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textPink800 }} title="Email">
                        <Mail size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;