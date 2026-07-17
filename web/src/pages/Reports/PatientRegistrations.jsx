import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Download, Printer, UserPlus, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = {
  bgPink50: '#fdf2f8',
  bgPink100: '#fce7f3',
  bgPink200: '#fbcfe8',
  textPink600: '#db2777',
  textPink800: '#9d174d',
  textPink900: '#831843',
};

const PatientRegistrations = () => {
  const navigate = useNavigate();

  const registrations = [
    { month: 'Jan', registrations: 245, active: 220, inactive: 25 },
    { month: 'Feb', registrations: 262, active: 238, inactive: 24 },
    { month: 'Mar', registrations: 278, active: 255, inactive: 23 },
    { month: 'Apr', registrations: 295, active: 268, inactive: 27 },
    { month: 'May', registrations: 315, active: 290, inactive: 25 },
    { month: 'Jun', registrations: 342, active: 312, inactive: 30 },
  ];

  const handleExport = () => {
    toast.success('Patient Registrations Report exported successfully!');
  };

  const totalRegistrations = registrations.reduce((sum, r) => sum + r.registrations, 0);
  const totalActive = registrations.reduce((sum, r) => sum + r.active, 0);
  const avgMonthly = (totalRegistrations / registrations.length).toFixed(0);

  return (
    <div style={{ padding: '24px', background: `linear-gradient(135deg, ${COLORS.bgPink50}, ${COLORS.bgPink100})`, minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <button onClick={() => navigate('/reports')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: `1px solid ${COLORS.bgPink200}`, borderRadius: '10px', cursor: 'pointer', color: COLORS.textPink800 }}>
          <ArrowLeft size={18} /> Back to Reports
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: `1px solid ${COLORS.bgPink200}`, borderRadius: '8px', cursor: 'pointer' }}>
            <Download size={16} /> Export
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: `1px solid ${COLORS.bgPink200}`, borderRadius: '8px', cursor: 'pointer' }}>
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: `1px solid ${COLORS.bgPink200}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Activity size={28} color={COLORS.textPink600} />
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textPink900 }}>Patient Registrations Report</h1>
            <p style={{ color: COLORS.textPink800 }}>Monthly patient enrollment data</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: COLORS.bgPink50, padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textPink600 }}>{totalRegistrations}</div>
            <div style={{ color: COLORS.textPink800, fontSize: '13px' }}>Total Registrations</div>
          </div>
          <div style={{ background: COLORS.bgPink50, padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>{totalActive}</div>
            <div style={{ color: COLORS.textPink800, fontSize: '13px' }}>Active Patients</div>
          </div>
          <div style={{ background: COLORS.bgPink50, padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' }}>{avgMonthly}</div>
            <div style={{ color: COLORS.textPink800, fontSize: '13px' }}>Avg Monthly</div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.bgPink200}` }}>
                <th style={{ padding: '12px', textAlign: 'left', color: COLORS.textPink800 }}>Month</th>
                <th style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>Registrations</th>
                <th style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>Active</th>
                <th style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>Inactive</th>
                <th style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>Growth %</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((item, index) => {
                const growth = index > 0 
                  ? (((item.registrations - registrations[index - 1].registrations) / registrations[index - 1].registrations) * 100).toFixed(1)
                  : 0;
                return (
                  <tr key={index} style={{ borderBottom: `1px solid ${COLORS.bgPink100}` }}>
                    <td style={{ padding: '12px', fontWeight: '500', color: COLORS.textPink900 }}>{item.month}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>{item.registrations}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#10B981', fontWeight: '500' }}>{item.active}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#EF4444', fontWeight: '500' }}>{item.inactive}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {index > 0 ? (
                        <span style={{ 
                          padding: '2px 10px', 
                          background: growth > 0 ? '#D1FAE5' : '#FEE2E2',
                          color: growth > 0 ? '#065F46' : '#991B1B',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {growth > 0 ? '+' : ''}{growth}%
                        </span>
                      ) : (
                        <span style={{ color: COLORS.textPink200, fontSize: '12px' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistrations;