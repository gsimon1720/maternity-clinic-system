import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Download, Printer, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = {
  bgPink50: '#fdf2f8',
  bgPink100: '#fce7f3',
  bgPink200: '#fbcfe8',
  textPink600: '#db2777',
  textPink800: '#9d174d',
  textPink900: '#831843',
};

const AppointmentTrends = () => {
  const navigate = useNavigate();

  const trends = [
    { month: 'Jan', booked: 145, attended: 132, cancelled: 13 },
    { month: 'Feb', booked: 168, attended: 151, cancelled: 17 },
    { month: 'Mar', booked: 175, attended: 162, cancelled: 13 },
    { month: 'Apr', booked: 182, attended: 168, cancelled: 14 },
    { month: 'May', booked: 195, attended: 178, cancelled: 17 },
    { month: 'Jun', booked: 210, attended: 195, cancelled: 15 },
  ];

  const handleExport = () => {
    toast.success('Appointment Trends Report exported successfully!');
  };

  const totalBooked = trends.reduce((sum, t) => sum + t.booked, 0);
  const totalAttended = trends.reduce((sum, t) => sum + t.attended, 0);
  const totalCancelled = trends.reduce((sum, t) => sum + t.cancelled, 0);
  const attendanceRate = ((totalAttended / totalBooked) * 100).toFixed(1);

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
          <TrendingUp size={28} color={COLORS.textPink600} />
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textPink900 }}>Appointment Trends</h1>
            <p style={{ color: COLORS.textPink800 }}>Booking and attendance patterns</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: COLORS.bgPink50, padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textPink600 }}>{totalBooked}</div>
            <div style={{ color: COLORS.textPink800, fontSize: '13px' }}>Total Booked</div>
          </div>
          <div style={{ background: COLORS.bgPink50, padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>{totalAttended}</div>
            <div style={{ color: COLORS.textPink800, fontSize: '13px' }}>Attended</div>
          </div>
          <div style={{ background: COLORS.bgPink50, padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444' }}>{totalCancelled}</div>
            <div style={{ color: COLORS.textPink800, fontSize: '13px' }}>Cancelled</div>
          </div>
          <div style={{ background: COLORS.bgPink50, padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' }}>{attendanceRate}%</div>
            <div style={{ color: COLORS.textPink800, fontSize: '13px' }}>Attendance Rate</div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.bgPink200}` }}>
                <th style={{ padding: '12px', textAlign: 'left', color: COLORS.textPink800 }}>Month</th>
                <th style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>Booked</th>
                <th style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>Attended</th>
                <th style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>Cancelled</th>
                <th style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend, index) => (
                <tr key={index} style={{ borderBottom: `1px solid ${COLORS.bgPink100}` }}>
                  <td style={{ padding: '12px', fontWeight: '500', color: COLORS.textPink900 }}>{trend.month}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink800 }}>{trend.booked}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#10B981', fontWeight: '500' }}>{trend.attended}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#EF4444', fontWeight: '500' }}>{trend.cancelled}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: COLORS.textPink600, fontWeight: '600' }}>
                    {((trend.attended / trend.booked) * 100).toFixed(1)}%
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

export default AppointmentTrends;