import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit2, Trash2, Building2, MapPin, Phone, Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { getClinics, deleteClinic } from '../../services/clinicService';

const getClinicId = (clinic) => clinic?.clinic_id ?? clinic?.id;

const ClinicManagement = () => {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadClinics = async () => {
    try {
      setLoading(true);
      const data = await getClinics();
      setClinics(data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load clinics');
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClinics();
  }, []);

  const filteredClinics = clinics.filter(clinic =>
    clinic.clinic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return { color: '#10b981', bg: '#d1fae5', text: 'Active', icon: <CheckCircle size={12} /> };
      case 'inactive':
        return { color: '#ef4444', bg: '#fee2e2', text: 'Inactive', icon: <XCircle size={12} /> };
      case 'pending':
        return { color: '#f59e0b', bg: '#fed7aa', text: 'Pending', icon: <Clock size={12} /> };
      default:
        return { color: '#6b7280', bg: '#f3f4f6', text: 'Unknown', icon: null };
    }
  };

  const handleDeleteClinic = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will remove all associated data.`)) {
      deleteClinic(id)
        .then(() => {
          setClinics(clinics.filter(c => getClinicId(c) !== id));
          toast.success('Clinic deleted successfully');
        })
        .catch((error) => {
          toast.error(error.message || 'Unable to delete clinic');
        });
    }
  };

  return (
    <div style={{ padding: '0px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#831843' }}>Clinic Management</h1>
          <p style={{ color: '#db2777', marginTop: '4px', fontSize: '14px' }}>Manage all clinics across Sri Lanka</p>
        </div>
        <button
          onClick={() => navigate('/super-admin/clinics/add')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #db2777, #831843)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(219, 39, 119, 0.2)'
          }}
        >
          <Plus size={18} />
          Add New Clinic
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#db2777' }} />
          <input
            type="text"
            placeholder="Search by clinic name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', border: '2px solid #fbcfe8', borderRadius: '12px', outline: 'none', fontSize: '14px' }}
          />
        </div>
      </div>

      {/* Clinics Grid */}
      {loading ? (
        <p style={{ color: '#9d174d' }}>Loading clinics from database...</p>
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        {filteredClinics.map((clinic) => {
          const status = getStatusBadge(clinic.status);
          return (
            <div
              key={getClinicId(clinic)}
              onClick={() => navigate(`/super-admin/clinics/view/${getClinicId(clinic)}`)}
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(131,24,67,0.04)',
                border: '1px solid #fbcfe8',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -12px rgba(131,24,67,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(131,24,67,0.04)';
              }}
            >
              {/* Header with Color Bar */}
              <div style={{
                height: '6px',
                background: clinic.status === 'active' ? '#10b981' : clinic.status === 'pending' ? '#f59e0b' : '#ef4444'
              }} />
              
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: '#fdf2f8',
                      border: '1px solid #fbcfe8',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Building2 size={24} color="#db2777" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#831843' }}>{clinic.clinic_name}</h3>
                      <p style={{ fontSize: '12px', color: '#9d174d' }}>Reg: {clinic.registration_no}</p>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    background: status.bg,
                    borderRadius: '20px'
                  }}>
                    {status.icon}
                    <span style={{ fontSize: '11px', fontWeight: '600', color: status.color }}>{status.text}</span>
                  </div>
                </div>

                {/* Location Info */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <MapPin size={14} color="#db2777" />
                    <span style={{ fontSize: '13px', color: '#831843' }}>{clinic.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Phone size={14} color="#db2777" />
                    <span style={{ fontSize: '13px', color: '#831843' }}>{clinic.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} color="#db2777" />
                    <span style={{ fontSize: '13px', color: '#831843' }}>{clinic.email}</span>
                  </div>
                </div>

                {/* Stats Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '12px',
                  background: '#fdf2f8',
                  border: '1px solid #fbcfe8',
                  borderRadius: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#db2777' }}>{clinic.total_doctors || 0}</div>
                    <div style={{ fontSize: '10px', color: '#9d174d', fontWeight: '500' }}>Doctors</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#8B5CF6' }}>{clinic.total_midwives || 0}</div>
                    <div style={{ fontSize: '10px', color: '#9d174d', fontWeight: '500' }}>Midwives</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#3B82F6' }}>{clinic.total_nurses || 0}</div>
                    <div style={{ fontSize: '10px', color: '#9d174d', fontWeight: '500' }}>Nurses</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>{clinic.total_patients || 0}</div>
                    <div style={{ fontSize: '10px', color: '#9d174d', fontWeight: '500' }}>Patients</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/super-admin/clinics/view/${getClinicId(clinic)}`);
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px',
                      background: '#fce7f3',
                      border: '1px solid #fbcfe8',
                      borderRadius: '10px',
                      color: '#db2777',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/super-admin/clinics/edit/${getClinicId(clinic)}`);
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px',
                      background: '#fbcfe8',
                      border: '1px solid #fbcfe8',
                      borderRadius: '10px',
                      color: '#831843',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClinic(getClinicId(clinic), clinic.clinic_name);
                    }}
                    style={{
                      padding: '8px',
                      background: '#FEF2F2',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};

export default ClinicManagement;