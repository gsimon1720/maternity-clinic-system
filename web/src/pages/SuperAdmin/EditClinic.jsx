import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Building2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { getClinicById, updateClinic } from '../../services/clinicService';

const EditClinic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingClinic, setLoadingClinic] = useState(true);
  const [formData, setFormData] = useState({
    clinic_name: '',
    registration_no: '',
    address: '',
    city: '',
    district: '',
    province: '',
    phone: '',
    email: '',
    status: 'active',
  });

  useEffect(() => {
    getClinicById(id)
      .then((clinic) => {
        setFormData({
          clinic_name: clinic.clinic_name || '',
          registration_no: clinic.registration_no || '',
          address: clinic.address || '',
          city: clinic.city || '',
          district: clinic.district || '',
          province: clinic.province || '',
          phone: clinic.phone || '',
          email: clinic.email || '',
          status: clinic.status || 'active',
        });
      })
      .catch((error) => {
        toast.error(error.message || 'Failed to load clinic');
        navigate('/super-admin/clinics');
      })
      .finally(() => setLoadingClinic(false));
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateClinic(id, formData);
      toast.success('Clinic updated successfully');
      navigate('/super-admin/clinics');
    } catch (error) {
      toast.error(error.message || 'Failed to update clinic');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingClinic) {
    return <div style={{ padding: '24px' }}>Loading clinic...</div>;
  }

  return (
    <div style={{ padding: '0px', minHeight: '100vh' }}>
      <button
        onClick={() => navigate('/super-admin/clinics')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#831843', fontWeight: '500', transition: 'color 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#db2777'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#831843'}
      >
        <ArrowLeft size={18} /> Back to Clinics
      </button>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #fbcfe8', boxShadow: '0 20px 25px -5px rgba(131,24,67,0.05)' }}>
        <div style={{ background: 'linear-gradient(135deg, #db2777, #831843)', padding: '32px', color: 'white', textAlign: 'center' }}>
          <Building2 size={40} style={{ marginBottom: '16px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Edit Clinic</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Clinic Name</label>
              <input type="text" name="clinic_name" value={formData.clinic_name} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #fbcfe8', borderRadius: '10px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Registration Number</label>
              <input type="text" name="registration_no" value={formData.registration_no} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #fbcfe8', borderRadius: '10px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #fbcfe8', borderRadius: '10px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #fbcfe8', borderRadius: '10px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #fbcfe8', borderRadius: '10px', outline: 'none', background: 'white' }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#831843' }}>
            <MapPin size={18} color="#db2777" /> Location
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows="2" style={{ width: '100%', padding: '10px', border: '2px solid #fbcfe8', borderRadius: '10px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #fbcfe8', borderRadius: '10px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #fbcfe8', borderRadius: '10px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#9d174d' }}>Province</label>
              <input type="text" name="province" value={formData.province} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #fbcfe8', borderRadius: '10px', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button type="submit" disabled={isLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 24px', background: 'linear-gradient(135deg, #db2777, #831843)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(219, 39, 119, 0.2)' }}>
              <Save size={16} /> {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate('/super-admin/clinics')} style={{ padding: '14px 24px', background: '#fce7f3', border: '1px solid #fbcfe8', borderRadius: '12px', cursor: 'pointer', color: '#db2777', fontWeight: '600' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClinic;
