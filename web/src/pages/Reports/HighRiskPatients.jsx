import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Download, Printer, Mail, User, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = {
  bgPink50: '#fdf2f8',
  bgPink100: '#fce7f3',
  bgPink200: '#fbcfe8',
  textPink600: '#db2777',
  textPink800: '#9d174d',
  textPink900: '#831843',
};

const HighRiskPatients = () => {
  const navigate = useNavigate();

  const highRiskPatients = [
    { id: 1, name: 'Sarah Johnson', age: 34, condition: 'Preeclampsia', risk: 'High', lastVisit: '2024-05-28' },
    { id: 2, name: 'Amali Fernando', age: 28, condition: 'Gestational Diabetes', risk: 'Medium', lastVisit: '2024-05-25' },
    { id: 3, name: 'Thashara Wijesinghe', age: 32, condition: 'Anemia', risk: 'High', lastVisit: '2024-05-20' },
    { id: 4, name: 'Nethmi Perera', age: 29, condition: 'Hypertension', risk: 'High', lastVisit: '2024-05-18' },
    { id: 5, name: 'Dilini Rathnayake', age: 31, condition: 'Multiple Pregnancy', risk: 'Medium', lastVisit: '2024-05-15' },
  ];

  const handleExport = () => {
    toast.success('High Risk Patients Report exported successfully!');
  };

  const getRiskBadge = (risk) => {
    switch(risk) {
      case 'High': return { color: '#EF4444', bg: '#FEE2E2' };
      case 'Medium': return { color: '#F59E0B', bg: '#FEF3C7' };
      case 'Low': return { color: '#10B981', bg: '#D1FAE5' };
      default: return { color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  return (
    <div style={{ padding: '24px', background: `linear-gradient(135deg, ${COLORS.bgPink50}, ${COLORS.bgPink100})`, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <button
          onClick={() => navigate('/reports')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'white',
            border: `1px solid ${COLORS.bgPink200}`,
            borderRadius: '10px',
            cursor: 'pointer',
            color: COLORS.textPink800,
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = COLORS.bgPink50;
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
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

      {/* Report Content */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: `1px solid ${COLORS.bgPink200}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <AlertTriangle size={28} color="#EF4444" />
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textPink900 }}>High Risk Patients</h1>
            <p style={{ color: COLORS.textPink800 }}>Patients requiring immediate attention</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.bgPink200}` }}>
                <th style={{ padding: '12px', textAlign: 'left', color: COLORS.textPink800 }}>#</th>
                <th style={{ padding: '12px', textAlign: 'left', color: COLORS.textPink800 }}>Patient Name</th>
                <th style={{ padding: '12px', textAlign: 'left', color: COLORS.textPink800 }}>Age</th>
                <th style={{ padding: '12px', textAlign: 'left', color: COLORS.textPink800 }}>Condition</th>
                <th style={{ padding: '12px', textAlign: 'left', color: COLORS.textPink800 }}>Risk Level</th>
                <th style={{ padding: '12px', textAlign: 'left', color: COLORS.textPink800 }}>Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {highRiskPatients.map((patient, index) => {
                const riskBadge = getRiskBadge(patient.risk);
                return (
                  <tr key={patient.id} style={{ borderBottom: `1px solid ${COLORS.bgPink100}` }}>
                    <td style={{ padding: '12px', color: COLORS.textPink800 }}>{index + 1}</td>
                    <td style={{ padding: '12px', fontWeight: '500', color: COLORS.textPink900 }}>{patient.name}</td>
                    <td style={{ padding: '12px', color: COLORS.textPink800 }}>{patient.age}</td>
                    <td style={{ padding: '12px', color: COLORS.textPink800 }}>{patient.condition}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 10px', background: riskBadge.bg, color: riskBadge.color, borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                        {patient.risk}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: COLORS.textPink800 }}>{patient.lastVisit}</td>
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

export default HighRiskPatients;