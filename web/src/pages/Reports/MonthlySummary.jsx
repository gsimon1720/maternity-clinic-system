import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Download, Printer, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = {
  bgPink50: '#fdf2f8',
  bgPink100: '#fce7f3',
  bgPink200: '#fbcfe8',
  textPink600: '#db2777',
  textPink800: '#9d174d',
  textPink900: '#831843',
};

const MonthlySummary = () => {
  const navigate = useNavigate();

  const handleExport = () => {
    toast.success('Monthly Summary Report exported successfully!');
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
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: `1px solid ${COLORS.bgPink200}`, borderRadius: '8px', cursor: 'pointer' }}>
            <Mail size={16} /> Email
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: `1px solid ${COLORS.bgPink200}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Calendar size={28} color={COLORS.textPink600} />
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textPink900 }}>Monthly Summary Report</h1>
            <p style={{ color: COLORS.textPink800 }}>May 2024 • Generated on June 1, 2024</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: COLORS.bgPink50, padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textPink600 }}>1,234</div>
            <div style={{ color: COLORS.textPink800 }}>Total Patients</div>
          </div>
          <div style={{ background: COLORS.bgPink50, padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10B981' }}>156</div>
            <div style={{ color: COLORS.textPink800 }}>New Patients</div>
          </div>
          <div style={{ background: COLORS.bgPink50, padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#F59E0B' }}>45</div>
            <div style={{ color: COLORS.textPink800 }}>Deliveries</div>
          </div>
          <div style={{ background: COLORS.bgPink50, padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3B82F6' }}>92%</div>
            <div style={{ color: COLORS.textPink800 }}>Satisfaction Rate</div>
          </div>
        </div>

        <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px', marginBottom: '16px' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '8px', color: COLORS.textPink900 }}>Summary</h3>
          <p style={{ color: COLORS.textPink800, lineHeight: '1.6' }}>
            This month has seen a {''}
            <span style={{ color: '#10B981', fontWeight: '600' }}>12% increase</span> in patient registrations compared to last month. 
            Delivery rates remain steady with {''}
            <span style={{ color: '#F59E0B', fontWeight: '600' }}>45 successful deliveries</span>. 
            Patient satisfaction scores have improved by {''}
            <span style={{ color: '#3B82F6', fontWeight: '600' }}>3%</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;