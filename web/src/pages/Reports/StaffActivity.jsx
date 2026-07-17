import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Download, Printer, User, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = {
  bgPink50: '#fdf2f8',
  bgPink100: '#fce7f3',
  bgPink200: '#fbcfe8',
  textPink600: '#db2777',
  textPink800: '#9d174d',
  textPink900: '#831843',
};

const StaffActivity = () => {
  const navigate = useNavigate();

  const staffActivities = [
    { name: 'Dr. Nuwam Perera', role: 'Doctor', consultations: 248, appointments: 312, surgeries: 45, rating: 4.9 },
    { name: 'Midwife Kumari Bandara', role: 'Midwife', consultations: 215, appointments: 280, surgeries: 0, rating: 4.8 },
    { name: 'Dr. Sanduni Jayasinghe', role: 'Doctor', consultations: 192, appointments: 245, surgeries: 38, rating: 4.7 },
    { name: 'Nurse Hasini Rajapaksa', role: 'Nurse', consultations: 178, appointments: 220, surgeries: 0, rating: 4.6 },
  ];

  const handleExport = () => {
    toast.success('Staff Activity Report exported successfully!');
  };

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
          <Users size={28} color={COLORS.textPink600} />
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textPink900 }}>Staff Activity Report</h1>
            <p style={{ color: COLORS.textPink800 }}>Staff performance and activity metrics</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.bgPink200}` }}>
                <th style={{ padding: '12px', textAlign: 'left', color: COLORS.textPink800 }}>Staff Name</th>
                <th style={{ padding: '12px', textAlign: 'left', color: COLORS.textPink800 }}>Role</th>
                <th style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>Consultations</th>
                <th style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>Appointments</th>
                <th style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>Surgeries</th>
                <th style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {staffActivities.map((staff, index) => (
                <tr key={index} style={{ borderBottom: `1px solid ${COLORS.bgPink100}` }}>
                  <td style={{ padding: '12px', fontWeight: '500', color: COLORS.textPink900 }}>{staff.name}</td>
                  <td style={{ padding: '12px', color: COLORS.textPink800 }}>{staff.role}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>{staff.consultations}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>{staff.appointments}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>{staff.surgeries}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{ padding: '4px 10px', background: '#D1FAE5', color: '#065F46', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                      ★ {staff.rating}
                    </span>
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

export default StaffActivity;